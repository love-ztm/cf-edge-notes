import { blogHomeHtml } from './homeHtml';
import {
	SESSION_MAX_AGE_SECONDS,
	cleanupOldLoginRateLimits,
	clearFailedLogins,
	createSessionToken,
	getAuthedVaultId,
	getConfiguredVaultCount,
	getLoginRateLimit,
	getSession,
	getVaultIdForPassword,
	isAuthConfigured,
	isAuthed,
	recordFailedLogin,
	tooManyLoginAttempts,
} from './auth';

type AppEnv = Env & {
	APP_PASSWORD?: string;
	APP_PASSWORDS?: string;
	COOKIE_SECRET?: string;
	IMAGES?: R2Bucket;
};

type Note = {
	id: string;
	title: string;
	content: string;
	created_at: number;
	updated_at: number;
	vault_id?: string;
	is_pinned?: number;
	deleted_at?: number | null;
};

type Tag = {
	id: string;
	vault_id: string;
	name: string;
	color: string;
	created_at: number;
};

type NoteShare = {
	token: string;
	note_id: string;
	vault_id: string;
	created_at: number;
	expires_at: number | null;
	is_active: number;
};

function json(data: unknown, status = 200, extraHeaders: Record<string, string> = {}) {
	return new Response(JSON.stringify(data, null, 2), {
		status,
		headers: {
			'content-type': 'application/json; charset=utf-8',
			'cache-control': 'no-store',
			...extraHeaders,
		},
	});
}

function html(content: string) {
	return new Response(content, {
		headers: {
			'content-type': 'text/html; charset=utf-8',
			'cache-control': 'no-store',
		},
	});
}

function unauthorized() {
	return json({ ok: false, error: 'unauthorized' }, 401);
}

function decodeHeaderValue(value: string) {
	try {
		return decodeURIComponent(value);
	} catch {
		return value;
	}
}

// ─── Notes CRUD ───────────────────────────────────────────

async function listNotes(env: AppEnv, vaultId: string, includeDeleted = false) {
	let whereClause = 'vault_id = ?';
	if (!includeDeleted) {
		whereClause += ' AND deleted_at IS NULL';
	}
	const result = await env.DB.prepare(
		`SELECT id, title, content, created_at, updated_at, is_pinned, deleted_at
		 FROM notes
		 WHERE ${whereClause}
		 ORDER BY is_pinned DESC, updated_at DESC
		 LIMIT 1000`
	)
		.bind(vaultId)
		.all<Note>();

	return result.results ?? [];
}

// Attach plaintext tag info ({id,name,color}) to each note for card rendering
async function attachNoteTags(env: AppEnv, vaultId: string, notes: Note[]) {
	if (!notes.length) return notes;
	const rels = await env.DB.prepare(
		`SELECT nt.note_id, t.id, t.name, t.color
		 FROM note_tags nt
		 JOIN tags t ON t.id = nt.tag_id
		 JOIN notes n ON n.id = nt.note_id
		 WHERE n.vault_id = ?`
	)
		.bind(vaultId)
		.all<{ note_id: string; id: string; name: string; color: string }>();
	const map = new Map<string, Array<{ id: string; name: string; color: string }>>();
	for (const r of rels.results ?? []) {
		if (!map.has(r.note_id)) map.set(r.note_id, []);
		map.get(r.note_id)!.push({ id: r.id, name: r.name, color: r.color });
	}
	return notes.map((n) => ({ ...n, tags: map.get(n.id) ?? [] }));
}

async function listTrashNotes(env: AppEnv, vaultId: string) {
	const result = await env.DB.prepare(
		`SELECT id, title, content, created_at, updated_at, is_pinned, deleted_at
		 FROM notes
		 WHERE vault_id = ? AND deleted_at IS NOT NULL
		 ORDER BY deleted_at DESC
		 LIMIT 500`
	)
		.bind(vaultId)
		.all<Note>();

	return result.results ?? [];
}

async function getNote(env: AppEnv, id: string, vaultId: string) {
	return env.DB.prepare(
		`SELECT id, title, content, created_at, updated_at, is_pinned, deleted_at
		 FROM notes
		 WHERE id = ? AND vault_id = ?
		 LIMIT 1`
	)
		.bind(id, vaultId)
		.first<Note>();
}

async function ensureAppMetaTable(env: AppEnv) {
	await env.DB.prepare(
		`CREATE TABLE IF NOT EXISTS app_meta (
			key TEXT PRIMARY KEY,
			value TEXT NOT NULL
		)`
	).run();
}

async function ensureNotesSchema(env: AppEnv) {
	await env.DB.prepare(
		`CREATE TABLE IF NOT EXISTS notes (
			id TEXT PRIMARY KEY,
			vault_id TEXT NOT NULL DEFAULT 'default',
			title TEXT NOT NULL,
			content TEXT NOT NULL,
			created_at INTEGER NOT NULL,
			updated_at INTEGER NOT NULL
		)`
	).run();

	const columns = await env.DB.prepare('PRAGMA table_info(notes)').all<{ name: string }>();
	const colNames = (columns.results ?? []).map((c) => c.name);

	if (!colNames.includes('vault_id')) {
		await env.DB.prepare(`ALTER TABLE notes ADD COLUMN vault_id TEXT NOT NULL DEFAULT 'default'`).run();
	}
	if (!colNames.includes('is_pinned')) {
		await env.DB.prepare(`ALTER TABLE notes ADD COLUMN is_pinned INTEGER NOT NULL DEFAULT 0`).run();
	}
	if (!colNames.includes('deleted_at')) {
		await env.DB.prepare(`ALTER TABLE notes ADD COLUMN deleted_at INTEGER DEFAULT NULL`).run();
	}

	await env.DB.prepare(`CREATE INDEX IF NOT EXISTS idx_notes_updated_at ON notes(updated_at DESC)`).run();
	await env.DB.prepare(`CREATE INDEX IF NOT EXISTS idx_notes_vault_updated_at ON notes(vault_id, updated_at DESC)`).run();
	await env.DB.prepare(`CREATE INDEX IF NOT EXISTS idx_notes_pinned ON notes(vault_id, is_pinned DESC, updated_at DESC)`).run();
	await env.DB.prepare(`CREATE INDEX IF NOT EXISTS idx_notes_trash ON notes(vault_id, deleted_at)`).run();

	await env.DB.prepare(
		`CREATE VIRTUAL TABLE IF NOT EXISTS notes_fts USING fts5(id UNINDEXED, title, content)`
	).run();

	await env.DB.prepare(`CREATE TRIGGER IF NOT EXISTS notes_ai AFTER INSERT ON notes BEGIN
		INSERT INTO notes_fts (id, title, content) VALUES (new.id, new.title, new.content);
	END`).run();
	await env.DB.prepare(`CREATE TRIGGER IF NOT EXISTS notes_au AFTER UPDATE ON notes BEGIN
		DELETE FROM notes_fts WHERE id = old.id;
		INSERT INTO notes_fts (id, title, content) VALUES (new.id, new.title, new.content);
	END`).run();
	await env.DB.prepare(`CREATE TRIGGER IF NOT EXISTS notes_ad AFTER DELETE ON notes BEGIN
		DELETE FROM notes_fts WHERE id = old.id;
	END`).run();

	await ensureAppMetaTable(env);

	// Ensure tags tables
	await env.DB.prepare(`CREATE TABLE IF NOT EXISTS tags (
		id TEXT PRIMARY KEY, vault_id TEXT NOT NULL DEFAULT 'default',
		name TEXT NOT NULL, color TEXT DEFAULT '#6366f1', created_at INTEGER NOT NULL
	)`).run();
	await env.DB.prepare(`CREATE INDEX IF NOT EXISTS idx_tags_vault ON tags(vault_id)`).run();
	await env.DB.prepare(`CREATE TABLE IF NOT EXISTS note_tags (
		note_id TEXT NOT NULL, tag_id TEXT NOT NULL, PRIMARY KEY (note_id, tag_id)
	)`).run();
	await env.DB.prepare(`CREATE INDEX IF NOT EXISTS idx_note_tags_tag ON note_tags(tag_id)`).run();

	// Ensure note_images table
	await env.DB.prepare(`CREATE TABLE IF NOT EXISTS note_images (
		id TEXT PRIMARY KEY, note_id TEXT NOT NULL DEFAULT '', vault_id TEXT NOT NULL DEFAULT 'default',
		filename TEXT NOT NULL, content_type TEXT NOT NULL, size INTEGER NOT NULL,
		r2_key TEXT NOT NULL, created_at INTEGER NOT NULL
	)`).run();
	await env.DB.prepare(`CREATE INDEX IF NOT EXISTS idx_note_images_vault ON note_images(vault_id)`).run();

	// Ensure note_shares table
	await env.DB.prepare(`CREATE TABLE IF NOT EXISTS note_shares (
		token TEXT PRIMARY KEY, note_id TEXT NOT NULL, vault_id TEXT NOT NULL,
		created_at INTEGER NOT NULL, expires_at INTEGER DEFAULT NULL, is_active INTEGER NOT NULL DEFAULT 1
	)`).run();
	await env.DB.prepare(`CREATE INDEX IF NOT EXISTS idx_note_shares_note ON note_shares(note_id)`).run();
}

async function getMeta(env: AppEnv, key: string) {
	const row = await env.DB.prepare(`SELECT value FROM app_meta WHERE key = ? LIMIT 1`).bind(key).first<{ value: string }>();
	return row?.value ?? null;
}

async function setMeta(env: AppEnv, key: string, value: string) {
	await env.DB.prepare(`INSERT INTO app_meta (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value`).bind(key, value).run();
}

function bytesToBase64(bytes: Uint8Array) {
	let binary = '';
	const chunkSize = 0x8000;
	for (let i = 0; i < bytes.length; i += chunkSize) {
		const chunk = bytes.subarray(i, i + chunkSize);
		binary += String.fromCharCode(...chunk);
	}
	return btoa(binary);
}

async function getOrCreateVaultSalt(env: AppEnv, vaultId: string) {
	await ensureNotesSchema(env);
	const key = vaultId === 'default' ? 'vault_salt' : `vault_salt:${vaultId}`;
	const existing = await getMeta(env, key);
	if (existing) return existing;
	const salt = bytesToBase64(crypto.getRandomValues(new Uint8Array(16)));
	await setMeta(env, key, salt);
	return salt;
}

// ─── Static Assets ────────────────────────────────────────

const appIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <path d="M32 4L58 32L32 60L6 32Z" fill="#6366f1"/>
  <path d="M32 4L58 32L32 34Z" fill="#818cf8"/>
  <path d="M32 4L6 32L32 34Z" fill="#4f46e5"/>
</svg>`;

const manifestJson = JSON.stringify({
	name: '我的笔记',
	short_name: '笔记',
	description: '一个部署在 Cloudflare Workers 上的简洁私人笔记。',
	start_url: '/',
	scope: '/',
	display: 'standalone',
	background_color: '#f5f5f5',
	theme_color: '#6366f1',
	icons: [{ src: '/app-icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }],
});

const serviceWorkerJs = `const CACHE_NAME = 'private-notes-shell-v2';
const APP_SHELL = ['/', '/manifest.webmanifest', '/app-icon.svg'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(APP_SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.pathname.startsWith('/api/') || u.pathname.startsWith('/s/')) return;
  if (r.mode === 'navigate') { e.respondWith(fetch(r).catch(() => caches.match('/'))); return; }
  e.respondWith(caches.match(r).then(c => c || fetch(r).then(res => { if (res && res.status === 200) { const cl = res.clone(); caches.open(CACHE_NAME).then(cache => cache.put(r, cl)); } return res; })));
});`;

// ─── Share Page HTML ──────────────────────────────────────

function sharePageHtml(title: string, content: string, createdAt: number, updatedAt: number) {
	const safeTitle = title.replace(/</g, '&lt;').replace(/>/g, '&gt;');
	const safeContent = content.replace(/</g, '&lt;').replace(/>/g, '&gt;');
	return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>${safeTitle} - Edge Notes</title>
<meta name="theme-color" content="#6366f1"/>
<style>
:root { color-scheme: light; --bg:#f5f5f5; --panel:#fff; --border:#e5e7eb; --text:#111827; --muted:#6b7280; --accent:#6366f1; --shadow:0 8px 24px rgba(15,23,42,.06); }
*{box-sizing:border-box}
body{margin:0;color:var(--text);font:15px/1.7 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:var(--bg);-webkit-font-smoothing:antialiased}
.page{max-width:720px;margin:0 auto;padding:24px 16px}
.card{background:var(--panel);border:1px solid var(--border);border-radius:18px;box-shadow:var(--shadow);padding:28px}
.brand{display:flex;align-items:center;gap:10px;margin-bottom:20px;color:var(--muted);font-size:13px}
.brand-icon{width:28px;height:28px;border-radius:8px;background:linear-gradient(135deg,var(--accent),#4f46e5);display:flex;align-items:center;justify-content:center;color:#fff;font-size:14px}
h1{margin:0 0 8px;font-size:26px;line-height:1.2}
.meta{display:flex;gap:16px;color:var(--muted);font-size:13px;margin-bottom:20px;flex-wrap:wrap}
.content{line-height:1.8;white-space:pre-wrap;word-break:break-word}
.content h1,.content h2,.content h3{margin:16px 0 8px}
.content code{background:#f3f4f6;padding:2px 6px;border-radius:4px;font-size:13px}
.content img{max-width:100%;border-radius:8px;margin:8px 0}
.footer{text-align:center;color:var(--muted);font-size:12px;margin-top:24px}
</style>
</head>
<body>
<div class="page">
<div class="brand"><div class="brand-icon">💎</div>Edge Notes</div>
<div class="card">
<h1>${safeTitle}</h1>
<div class="meta">
<span>创建: ${new Date(createdAt).toLocaleDateString('zh-CN')}</span>
<span>更新: ${new Date(updatedAt).toLocaleDateString('zh-CN')}</span>
</div>
<div class="content">${safeContent}</div>
</div>
<div class="footer">Shared via Edge Notes · E2EE</div>
</div>
</body>
</html>`;
}

// ─── Main Handler ─────────────────────────────────────────

export default {
	async fetch(request: Request, env: AppEnv): Promise<Response> {
		const url = new URL(request.url);

		// Static assets
		if (url.pathname === '/manifest.webmanifest') {
			return new Response(manifestJson, { headers: { 'content-type': 'application/manifest+json; charset=utf-8', 'cache-control': 'public, max-age=3600' } });
		}
		if (url.pathname === '/sw.js') {
			return new Response(serviceWorkerJs, { headers: { 'content-type': 'application/javascript; charset=utf-8', 'cache-control': 'no-store' } });
		}
		if (url.pathname === '/app-icon.svg') {
			return new Response(appIconSvg, { headers: { 'content-type': 'image/svg+xml; charset=utf-8', 'cache-control': 'public, max-age=86400' } });
		}
		if (url.pathname === '/') {
			return html(blogHomeHtml);
		}

		// ─── Share page (public, no auth) ──────────────
		if (url.pathname.startsWith('/s/') && request.method === 'GET') {
			await ensureNotesSchema(env);
			const token = url.pathname.slice(3);
			if (!token) return html(sharePageHtml('404', '分享链接不存在', 0, 0));

			const share = await env.DB.prepare(
				`SELECT * FROM note_shares WHERE token = ? AND is_active = 1 LIMIT 1`
			).bind(token).first<NoteShare>();

			if (!share) return html(sharePageHtml('链接无效', '此分享链接不存在或已被撤销。', 0, 0));
			if (share.expires_at && share.expires_at < Date.now()) {
				return html(sharePageHtml('链接已过期', '此分享链接已过期。', 0, 0));
			}

			const note = await env.DB.prepare(
				`SELECT id, title, content, created_at, updated_at FROM notes WHERE id = ? AND vault_id = ? LIMIT 1`
			).bind(share.note_id, share.vault_id).first<Note>();

			if (!note) return html(sharePageHtml('笔记不存在', '此笔记可能已被删除。', 0, 0));
			return html(sharePageHtml(note.title, note.content, note.created_at, note.updated_at));
		}

		// ─── Public image serving ──────────────────────
		if (url.pathname.startsWith('/_/images/') && request.method === 'GET') {
			if (!env.IMAGES) return new Response('Image storage not configured', { status: 503 });
			const key = decodeURIComponent(url.pathname.slice(11));
			const object = await env.IMAGES.get(key);
			if (!object) return new Response('Not found', { status: 404 });
			const headers = new Headers();
			object.writeHttpMetadata(headers);
			headers.set('etag', object.httpEtag);
			headers.set('cache-control', 'public, max-age=31536000');
			return new Response(object.body, { headers });
		}

		// ─── Auth routes ───────────────────────────────
		if (url.pathname === '/api/health' && request.method === 'GET') {
			await ensureNotesSchema(env);
			const session = await getSession(request, env);
			if (isAuthConfigured(env) && !session.authenticated) return unauthorized();
			const result = await env.DB.prepare('SELECT COUNT(*) AS note_count FROM notes WHERE vault_id = ? AND deleted_at IS NULL').bind(session.vaultId).first<{ note_count: number }>();
			return json({ ok: true, noteCount: result?.note_count ?? 0, authEnabled: isAuthConfigured(env), vaultCount: getConfiguredVaultCount(env), now: Date.now() });
		}

		if (url.pathname === '/api/session' && request.method === 'GET') {
			const session = await getSession(request, env);
			return json({ ok: true, authenticated: session.authenticated, vaultId: session.vaultId });
		}

		if (url.pathname === '/api/login' && request.method === 'POST') {
			if (!isAuthConfigured(env)) return json({ ok: false, error: 'server auth not configured' }, 500);
			const rateLimit = await getLoginRateLimit(request, env);
			if (rateLimit.limited) return tooManyLoginAttempts(rateLimit.retryAfterSeconds);
			const body = (await request.json().catch(() => null)) as { password?: string } | null;
			const vaultId = body?.password ? await getVaultIdForPassword(env, body.password) : null;
			if (!vaultId) {
				const failure = await recordFailedLogin(env, rateLimit.key);
				if (failure.locked) return tooManyLoginAttempts(failure.retryAfterSeconds);
				return unauthorized();
			}
			await clearFailedLogins(env, rateLimit.key);
			await cleanupOldLoginRateLimits(env);
			return json({ ok: true }, 200, { 'set-cookie': `session=${await createSessionToken(env, vaultId)}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${SESSION_MAX_AGE_SECONDS}` });
		}

		if (url.pathname === '/api/logout' && request.method === 'POST') {
			return json({ ok: true }, 200, { 'set-cookie': 'session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0' });
		}

		// Auth guard for all /api/ routes below
		if (url.pathname.startsWith('/api/') && !(await isAuthed(request, env))) {
			return unauthorized();
		}

		// ─── Crypto config ─────────────────────────────
		if (url.pathname === '/api/crypto-config' && request.method === 'GET') {
			const vaultId = await getAuthedVaultId(request, env);
			return json({ ok: true, vaultSalt: await getOrCreateVaultSalt(env, vaultId), cipher: 'aes-gcm-256', kdf: 'pbkdf2-sha256', iterations: 250000, version: 1 });
		}

		// ─── Notes CRUD ────────────────────────────────
		if (url.pathname === '/api/notes' && request.method === 'GET') {
			await ensureNotesSchema(env);
			const vaultId = await getAuthedVaultId(request, env);
			const tagFilter = url.searchParams.get('tag');
			let notes = await attachNoteTags(env, vaultId, await listNotes(env, vaultId));

			if (tagFilter) {
				const taggedNoteIds = await env.DB.prepare(
					`SELECT note_id FROM note_tags WHERE tag_id = ?`
				).bind(tagFilter).all<{ note_id: string }>();
				const idSet = new Set((taggedNoteIds.results ?? []).map((r) => r.note_id));
				notes = notes.filter((n) => idSet.has(n.id));
			}

			return json({ ok: true, notes });
		}

		if (url.pathname === '/api/notes' && request.method === 'POST') {
			await ensureNotesSchema(env);
			const vaultId = await getAuthedVaultId(request, env);
			const body = (await request.json().catch(() => null)) as { title?: string; content?: string } | null;
			const title = body?.title?.trim() || '无标题';
			const content = body?.content?.trim() || '';
			if (!title && !content) return json({ ok: false, error: 'title/content required' }, 400);
			const now = Date.now();
			const note: Note = { id: crypto.randomUUID(), vault_id: vaultId, title, content, created_at: now, updated_at: now };
			await env.DB.prepare(`INSERT INTO notes (id, vault_id, title, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)`).bind(note.id, vaultId, note.title, note.content, note.created_at, note.updated_at).run();
			return json({ ok: true, note }, 201);
		}

		// ─── Notes by ID ───────────────────────────────
		if (url.pathname.startsWith('/api/notes/')) {
			await ensureNotesSchema(env);
			const vaultId = await getAuthedVaultId(request, env);
			const rest = decodeURIComponent(url.pathname.slice('/api/notes/'.length));

			// Check for sub-routes: trash, export, :id/pin, :id/tags, :id/share, :id/restore, :id/permanent
			if (rest === 'trash' && request.method === 'GET') {
				return json({ ok: true, notes: await attachNoteTags(env, vaultId, await listTrashNotes(env, vaultId)) });
			}

			if (rest === 'export' && request.method === 'GET') {
				const format = url.searchParams.get('format') || 'json';
				const notes = await listNotes(env, vaultId);
				if (format === 'markdown') {
					let md = '# 我的笔记\n\n';
					for (const n of notes) {
						md += `## ${n.title}\n\n${n.content}\n\n---\n\n`;
					}
					return new Response(md, { headers: { 'content-type': 'text/markdown; charset=utf-8', 'content-disposition': 'attachment; filename="notes.md"' } });
				}
				return new Response(JSON.stringify(notes, null, 2), { headers: { 'content-type': 'application/json; charset=utf-8', 'content-disposition': 'attachment; filename="notes.json"' } });
			}

			// ─── Notes Import ──────────────────────────────
			if (rest === 'import' && request.method === 'POST') {
				await ensureNotesSchema(env);
				const vaultId = await getAuthedVaultId(request, env);
				const body = (await request.json().catch(() => null)) as {
					notes?: Array<{ title: string; content: string; created_at?: number; updated_at?: number; is_pinned?: number; tag_names?: string[] }>;
					tags?: Array<{ name: string; color?: string }>;
				} | null;
				if (!body || !Array.isArray(body.notes)) return json({ ok: false, error: 'Invalid import data' }, 400);

				const now = Date.now();
				let notesImported = 0;
				let tagsCreated = 0;
				let tagRelsCreated = 0;

				// Step 1: Create or find tags by name
				const tagNameToId: Record<string, string> = {};
				if (Array.isArray(body.tags)) {
					for (const tag of body.tags) {
						const name = (tag.name || '').trim();
						if (!name) continue;
						// Check if tag with same name already exists
						const existing = await env.DB.prepare(
							`SELECT id FROM tags WHERE vault_id = ? AND name = ?`
						).bind(vaultId, name).first<{ id: string }>();
						if (existing) {
							tagNameToId[name] = existing.id;
						} else {
							const tagId = crypto.randomUUID();
							await env.DB.prepare(
								`INSERT INTO tags (id, vault_id, name, color, created_at) VALUES (?, ?, ?, ?, ?)`
							).bind(tagId, vaultId, name, tag.color || '#6366f1', now).run();
							tagNameToId[name] = tagId;
							tagsCreated++;
						}
					}
				}

				// Step 2: Import notes
				for (const item of body.notes) {
					const noteId = crypto.randomUUID();
					const title = (item.title || '').trim() || '无标题';
					const content = (item.content || '').trim();
					const createdAt = item.created_at || now;
					const updatedAt = item.updated_at || now;
					const isPinned = item.is_pinned ? 1 : 0;

					await env.DB.prepare(
						`INSERT INTO notes (id, vault_id, title, content, created_at, updated_at, is_pinned) VALUES (?, ?, ?, ?, ?, ?, ?)`
					).bind(noteId, vaultId, title, content, createdAt, updatedAt, isPinned).run();
					notesImported++;

					// Step 3: Link tags to note
					if (Array.isArray(item.tag_names)) {
						for (const tagName of item.tag_names) {
							const tagId = tagNameToId[tagName.trim()];
							if (tagId) {
								await env.DB.prepare(
									`INSERT OR IGNORE INTO note_tags (note_id, tag_id) VALUES (?, ?)`
								).bind(noteId, tagId).run();
								tagRelsCreated++;
							}
						}
					}
				}

				return json({
					ok: true,
					imported: { notes: notesImported, tags: tagsCreated, tag_relations: tagRelsCreated }
				});
			}

			// Sub-routes with :id prefix
			const idMatch = rest.match(/^([^/]+)(?:\/(.+))?$/);
			if (!idMatch) return json({ ok: false, error: 'invalid path' }, 400);
			const noteId = idMatch[1];
			const subRoute = idMatch[2] || '';

			// GET /api/notes/:id
			if (!subRoute && request.method === 'GET') {
				const note = await getNote(env, noteId, vaultId);
				if (!note) return json({ ok: false, error: 'not_found' }, 404);
				return json({ ok: true, note });
			}

			// PUT /api/notes/:id
			if (!subRoute && request.method === 'PUT') {
				const body = (await request.json().catch(() => null)) as { title?: string; content?: string } | null;
				const title = body?.title?.trim() || '无标题';
				const content = body?.content?.trim() || '';
				const existing = await getNote(env, noteId, vaultId);
				if (!existing) return json({ ok: false, error: 'not_found' }, 404);
				await env.DB.prepare(`UPDATE notes SET title = ?, content = ?, updated_at = ? WHERE id = ? AND vault_id = ?`).bind(title, content, Date.now(), noteId, vaultId).run();
				const note = await getNote(env, noteId, vaultId);
				return json({ ok: true, note });
			}

			// DELETE /api/notes/:id → soft delete (trash)
			if (!subRoute && request.method === 'DELETE') {
				await env.DB.prepare(`UPDATE notes SET deleted_at = ?, updated_at = ? WHERE id = ? AND vault_id = ?`).bind(Date.now(), Date.now(), noteId, vaultId).run();
				return json({ ok: true });
			}

			// PUT /api/notes/:id/pin → toggle pin
			if (subRoute === 'pin' && request.method === 'PUT') {
				const note = await getNote(env, noteId, vaultId);
				if (!note) return json({ ok: false, error: 'not_found' }, 404);
				const newPinned = note.is_pinned ? 0 : 1;
				await env.DB.prepare(`UPDATE notes SET is_pinned = ?, updated_at = ? WHERE id = ? AND vault_id = ?`).bind(newPinned, Date.now(), noteId, vaultId).run();
				return json({ ok: true, is_pinned: newPinned });
			}

			// PUT /api/notes/:id/tags → set tags
			if (subRoute === 'tags' && request.method === 'PUT') {
					const body = (await request.json().catch(() => null)) as { tagIds?: string[] } | null;
					const tagIds = body?.tagIds || [];
					await env.DB.prepare(`DELETE FROM note_tags WHERE note_id = ?`).bind(noteId).run();
					for (const tagId of tagIds) {
						await env.DB.prepare(`INSERT OR IGNORE INTO note_tags (note_id, tag_id) VALUES (?, ?)`).bind(noteId, tagId).run();
					}
					return json({ ok: true });
				}

				// GET /api/notes/:id/tags → get tags for a note
				if (subRoute === 'tags' && request.method === 'GET') {
					const tags = await env.DB.prepare(
						`SELECT t.* FROM tags t JOIN note_tags nt ON t.id = nt.tag_id WHERE nt.note_id = ?`
					).bind(noteId).all<Tag>();
					return json({ ok: true, tags: tags.results ?? [] });
				}

			// POST /api/notes/:id/restore → restore from trash
			if (subRoute === 'restore' && request.method === 'POST') {
				await env.DB.prepare(`UPDATE notes SET deleted_at = NULL, updated_at = ? WHERE id = ? AND vault_id = ?`).bind(Date.now(), noteId, vaultId).run();
				return json({ ok: true });
			}

			// DELETE /api/notes/:id/permanent → permanent delete
			if (subRoute === 'permanent' && request.method === 'DELETE') {
				await env.DB.prepare(`DELETE FROM notes WHERE id = ? AND vault_id = ?`).bind(noteId, vaultId).run();
				await env.DB.prepare(`DELETE FROM note_tags WHERE note_id = ?`).bind(noteId).run();
				await env.DB.prepare(`DELETE FROM note_shares WHERE note_id = ? AND vault_id = ?`).bind(noteId, vaultId).run();
				return json({ ok: true });
			}

			// POST /api/notes/:id/share → create share link
			if (subRoute === 'share' && request.method === 'POST') {
				const note = await getNote(env, noteId, vaultId);
				if (!note) return json({ ok: false, error: 'not_found' }, 404);
				const body = (await request.json().catch(() => null)) as { expiresAt?: number } | null;
				const token = crypto.randomUUID().replace(/-/g, '').slice(0, 16);
				const now = Date.now();
				const expiresAt = body?.expiresAt || null;
				await env.DB.prepare(`INSERT INTO note_shares (token, note_id, vault_id, created_at, expires_at) VALUES (?, ?, ?, ?, ?)`).bind(token, noteId, vaultId, now, expiresAt).run();
				return json({ ok: true, token, url: `${url.origin}/s/${token}`, expiresAt });
			}

			// GET /api/notes/:id/shares → list shares for a note
			if (subRoute === 'shares' && request.method === 'GET') {
				const shares = await env.DB.prepare(`SELECT * FROM note_shares WHERE note_id = ? AND vault_id = ? AND is_active = 1 ORDER BY created_at DESC`).bind(noteId, vaultId).all<NoteShare>();
				return json({ ok: true, shares: shares.results ?? [] });
			}

			return json({ ok: false, error: 'not_found' }, 404);
		}

		// ─── Tags CRUD ─────────────────────────────────
		if (url.pathname === '/api/tags' && request.method === 'GET') {
			await ensureNotesSchema(env);
			const vaultId = await getAuthedVaultId(request, env);
			const tags = await env.DB.prepare(
				`SELECT t.id, t.vault_id, t.name, t.color, t.created_at,
					(SELECT COUNT(*) FROM note_tags nt JOIN notes n ON n.id = nt.note_id
					 WHERE nt.tag_id = t.id AND n.vault_id = t.vault_id AND n.deleted_at IS NULL) AS count
				 FROM tags t WHERE t.vault_id = ? ORDER BY t.name`
			).bind(vaultId).all<Tag & { count: number }>();
			return json({ ok: true, tags: tags.results ?? [] });
		}

		if (url.pathname === '/api/tags' && request.method === 'POST') {
			await ensureNotesSchema(env);
			const vaultId = await getAuthedVaultId(request, env);
			const body = (await request.json().catch(() => null)) as { name?: string; color?: string } | null;
			const name = body?.name?.trim();
			if (!name) return json({ ok: false, error: 'name required' }, 400);
			const color = body?.color || '#6366f1';
			const id = crypto.randomUUID();
			await env.DB.prepare(`INSERT INTO tags (id, vault_id, name, color, created_at) VALUES (?, ?, ?, ?, ?)`).bind(id, vaultId, name, color, Date.now()).run();
			return json({ ok: true, tag: { id, vault_id: vaultId, name, color, created_at: Date.now() } }, 201);
		}

		if (url.pathname === '/api/tags/cleanup' && request.method === 'POST') {
			await ensureNotesSchema(env);
			const vaultId = await getAuthedVaultId(request, env);
			// Delete tags with zero active-note references (count-0 tags) so the sidebar stays tidy
			const result = await env.DB.prepare(
				`DELETE FROM tags
				 WHERE vault_id = ? AND id NOT IN (
				   SELECT nt.tag_id FROM note_tags nt
				   JOIN notes n ON n.id = nt.note_id
				   WHERE n.vault_id = ? AND n.deleted_at IS NULL
				 )`
			).bind(vaultId, vaultId).run();
			return json({ ok: true, deleted: result.meta.changes ?? 0 });
		}

		if (url.pathname.startsWith('/api/tags/')) {
			await ensureNotesSchema(env);
			const vaultId = await getAuthedVaultId(request, env);
			const tagId = decodeURIComponent(url.pathname.slice('/api/tags/'.length));
			if (request.method === 'DELETE') {
				await env.DB.prepare(`DELETE FROM tags WHERE id = ? AND vault_id = ?`).bind(tagId, vaultId).run();
				await env.DB.prepare(`DELETE FROM note_tags WHERE tag_id = ?`).bind(tagId).run();
				return json({ ok: true });
			}
			return json({ ok: false, error: 'not_found' }, 404);
		}

		// ─── Image Upload ──────────────────────────────
		if (url.pathname === '/api/images/upload' && request.method === 'POST') {
			await ensureNotesSchema(env);
			if (!env.IMAGES) return json({ ok: false, error: 'Image storage not configured' }, 503);
			const vaultId = await getAuthedVaultId(request, env);
			const contentType = request.headers.get('content-type') || '';
			if (!contentType.startsWith('image/')) return json({ ok: false, error: 'Only images allowed' }, 400);

			const body = await request.arrayBuffer();
			if (body.byteLength > 5 * 1024 * 1024) return json({ ok: false, error: 'Max 5MB' }, 400);

			const ext = contentType.split('/')[1]?.split(';')[0] || 'png';
			const id = crypto.randomUUID();
			const r2Key = `${vaultId}/${id}.${ext}`;

			await env.IMAGES.put(r2Key, body, { httpMetadata: { contentType } });

			const noteId = url.searchParams.get('noteId') || '';
			await env.DB.prepare(`INSERT INTO note_images (id, note_id, vault_id, filename, content_type, size, r2_key, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).bind(id, noteId, vaultId, `${id}.${ext}`, contentType, body.byteLength, r2Key, Date.now()).run();

			return json({ ok: true, url: `/_/images/${r2Key}`, id, r2Key });
		}

		// ─── Revoke share ──────────────────────────────
		if (url.pathname.startsWith('/api/shares/') && request.method === 'DELETE') {
			await ensureNotesSchema(env);
			const vaultId = await getAuthedVaultId(request, env);
			const token = decodeURIComponent(url.pathname.slice('/api/shares/'.length));
			await env.DB.prepare(`UPDATE note_shares SET is_active = 0 WHERE token = ? AND vault_id = ?`).bind(token, vaultId).run();
			return json({ ok: true });
		}

		return json({ ok: false, error: 'not_found' }, 404);
	},

	async scheduled(event: ScheduledController, env: AppEnv, ctx: ExecutionContext) {
		// Cleanup expired shares and old trash (>30 days)
		await ensureNotesSchema(env);
		const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
		await env.DB.prepare(`DELETE FROM note_shares WHERE expires_at IS NOT NULL AND expires_at < ?`).bind(Date.now()).run();
		await env.DB.prepare(`DELETE FROM notes WHERE deleted_at IS NOT NULL AND deleted_at < ?`).bind(thirtyDaysAgo).run();
	},
} satisfies ExportedHandler<Env>;
