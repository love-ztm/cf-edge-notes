type AuthEnv = {
	DB: D1Database;
	APP_PASSWORD?: string;
	APP_PASSWORDS?: string;
	COOKIE_SECRET?: string;
};

export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
const LOGIN_MAX_FAILED_ATTEMPTS = 5;
const LOGIN_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_LOCKOUT_MS = 15 * 60 * 1000;
const DEFAULT_VAULT_ID = 'default';

type SessionData = {
	authenticated: boolean;
	vaultId: string;
};

function getCookie(request: Request, name: string) {
	const cookie = request.headers.get('cookie') || '';
	const parts = cookie.split(';').map((item) => item.trim());
	const prefix = name + '=';
	for (const part of parts) {
		if (part.startsWith(prefix)) return decodeURIComponent(part.slice(prefix.length));
	}
	return '';
}

function base64UrlEncode(input: string | Uint8Array) {
	const bytes = typeof input === 'string' ? new TextEncoder().encode(input) : input;
	let binary = '';
	const chunkSize = 0x8000;
	for (let i = 0; i < bytes.length; i += chunkSize) {
		binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
	}
	return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlDecode(input: string) {
	const padded = input.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (input.length % 4)) % 4);
	const binary = atob(padded);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
	return new TextDecoder().decode(bytes);
}

async function hmacSha256Base64Url(secret: string, data: string) {
	const key = await crypto.subtle.importKey(
		'raw',
		new TextEncoder().encode(secret),
		{ name: 'HMAC', hash: 'SHA-256' },
		false,
		['sign']
	);
	const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
	return base64UrlEncode(new Uint8Array(signature));
}

function safeEqual(a: string, b: string) {
	if (a.length !== b.length) return false;
	let diff = 0;
	for (let i = 0; i < a.length; i += 1) {
		diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
	}
	return diff === 0;
}

function normalizeVaultId(value: string) {
	const normalized = value.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-').replace(/-+/g, '-');
	return normalized.replace(/^-|-$/g, '') || DEFAULT_VAULT_ID;
}

function getVaultCredentials(env: AuthEnv) {
	const credentials: Array<{ vaultId: string; password: string }> = [];
	if (env.APP_PASSWORD) {
		credentials.push({ vaultId: DEFAULT_VAULT_ID, password: env.APP_PASSWORD });
	}

	const extra = env.APP_PASSWORDS || '';
	for (const item of extra.split(',')) {
		const trimmed = item.trim();
		if (!trimmed) continue;

		const separatorIndex = trimmed.indexOf('=');
		if (separatorIndex <= 0) continue;

		const vaultId = normalizeVaultId(trimmed.slice(0, separatorIndex));
		const password = trimmed.slice(separatorIndex + 1).trim();
		if (!password) continue;
		credentials.push({ vaultId, password });
	}

	return credentials;
}

export function isAuthConfigured(env: AuthEnv) {
	return Boolean(env.COOKIE_SECRET && getVaultCredentials(env).length > 0);
}

export function getConfiguredVaultCount(env: AuthEnv) {
	return getVaultCredentials(env).length;
}

export async function getVaultIdForPassword(env: AuthEnv, password: string) {
	for (const credential of getVaultCredentials(env)) {
		if (safeEqual(password, credential.password)) return credential.vaultId;
	}
	return null;
}

export async function createSessionToken(env: AuthEnv, vaultId = DEFAULT_VAULT_ID) {
	if (!env.COOKIE_SECRET) return '';
	const now = Math.floor(Date.now() / 1000);
	const payload = base64UrlEncode(
		JSON.stringify({
			v: 1,
			vaultId: normalizeVaultId(vaultId),
			iat: now,
			exp: now + SESSION_MAX_AGE_SECONDS,
		})
	);
	const signature = await hmacSha256Base64Url(env.COOKIE_SECRET, payload);
	return `${payload}.${signature}`;
}

async function verifySessionToken(env: AuthEnv, token: string) {
	if (!env.COOKIE_SECRET) return null;
	const [payload, signature] = token.split('.');
	if (!payload || !signature || token.split('.').length !== 2) return null;
	const expected = await hmacSha256Base64Url(env.COOKIE_SECRET, payload);
	if (!safeEqual(signature, expected)) return null;

	try {
		const data = JSON.parse(base64UrlDecode(payload)) as { exp?: number; v?: number; vaultId?: string };
		if (data.v !== 1 || typeof data.exp !== 'number' || data.exp <= Math.floor(Date.now() / 1000)) {
			return null;
		}
		return normalizeVaultId(data.vaultId || DEFAULT_VAULT_ID);
	} catch {
		return null;
	}
}

export async function getSession(request: Request, env: AuthEnv): Promise<SessionData> {
	if (!isAuthConfigured(env)) {
		return { authenticated: true, vaultId: DEFAULT_VAULT_ID };
	}

	const session = getCookie(request, 'session');
	if (!session) return { authenticated: false, vaultId: DEFAULT_VAULT_ID };
	const vaultId = await verifySessionToken(env, session);
	return vaultId
		? { authenticated: true, vaultId }
		: { authenticated: false, vaultId: DEFAULT_VAULT_ID };
}

export async function isAuthed(request: Request, env: AuthEnv) {
	return (await getSession(request, env)).authenticated;
}

export async function getAuthedVaultId(request: Request, env: AuthEnv) {
	return (await getSession(request, env)).vaultId;
}

function getClientIp(request: Request) {
	return (
		request.headers.get('cf-connecting-ip') ||
		request.headers.get('x-real-ip') ||
		request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
		'unknown'
	);
}

async function getLoginRateLimitKey(request: Request, env: AuthEnv) {
	const userAgent = (request.headers.get('user-agent') || 'unknown').slice(0, 160);
	return hmacSha256Base64Url(env.COOKIE_SECRET || 'missing-secret', `login:${getClientIp(request)}:${userAgent}`);
}

export async function getLoginRateLimit(request: Request, env: AuthEnv) {
	const key = await getLoginRateLimitKey(request, env);
	const now = Date.now();
	const row = await env.DB.prepare(
		`SELECT attempts, first_attempt_at, locked_until
		 FROM auth_rate_limits
		 WHERE key = ?
		 LIMIT 1`
	)
		.bind(key)
		.first<{ attempts: number; first_attempt_at: number; locked_until: number }>();

	if (row?.locked_until && row.locked_until > now) {
		return {
			key,
			limited: true,
			retryAfterSeconds: Math.ceil((row.locked_until - now) / 1000),
		};
	}

	return {
		key,
		limited: false,
		retryAfterSeconds: 0,
	};
}

export async function recordFailedLogin(env: AuthEnv, key: string) {
	const now = Date.now();
	const row = await env.DB.prepare(
		`SELECT attempts, first_attempt_at
		 FROM auth_rate_limits
		 WHERE key = ?
		 LIMIT 1`
	)
		.bind(key)
		.first<{ attempts: number; first_attempt_at: number }>();

	const isFreshWindow = !row || now - row.first_attempt_at > LOGIN_RATE_LIMIT_WINDOW_MS;
	const attempts = isFreshWindow ? 1 : row.attempts + 1;
	const firstAttemptAt = isFreshWindow ? now : row.first_attempt_at;
	const lockedUntil = attempts >= LOGIN_MAX_FAILED_ATTEMPTS ? now + LOGIN_LOCKOUT_MS : 0;

	await env.DB.prepare(
		`INSERT INTO auth_rate_limits (key, attempts, first_attempt_at, locked_until, updated_at)
		 VALUES (?, ?, ?, ?, ?)
		 ON CONFLICT(key) DO UPDATE SET
			attempts = excluded.attempts,
			first_attempt_at = excluded.first_attempt_at,
			locked_until = excluded.locked_until,
			updated_at = excluded.updated_at`
	)
		.bind(key, attempts, firstAttemptAt, lockedUntil, now)
		.run();

	return {
		attempts,
		locked: lockedUntil > now,
		retryAfterSeconds: lockedUntil > now ? Math.ceil((lockedUntil - now) / 1000) : 0,
	};
}

export async function clearFailedLogins(env: AuthEnv, key: string) {
	await env.DB.prepare('DELETE FROM auth_rate_limits WHERE key = ?').bind(key).run();
}

export async function cleanupOldLoginRateLimits(env: AuthEnv) {
	const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
	await env.DB.prepare('DELETE FROM auth_rate_limits WHERE updated_at < ?').bind(cutoff).run();
}

export function tooManyLoginAttempts(retryAfterSeconds: number) {
	const minutes = Math.max(1, Math.ceil(retryAfterSeconds / 60));
	return new Response(
		JSON.stringify(
			{
				ok: false,
				error: `登录失败次数过多，请 ${minutes} 分钟后再试`,
				retryAfterSeconds,
			},
			null,
			2
		),
		{
			status: 429,
			headers: {
				'content-type': 'application/json; charset=utf-8',
				'cache-control': 'no-store',
				'retry-after': String(retryAfterSeconds),
			},
		}
	);
}
