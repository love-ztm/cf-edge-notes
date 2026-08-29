
      const state = {
        notes: [],
        allNotes: [],
        editingId: null,
        expandedIds: new Set(),
        searchTimer: null,
        statusTimer: null,
        sessionAuthenticated: false,
        authMode: 'checking',
        vaultUnlocked: false,
        vaultKey: null,
        vaultSalt: '',
        noteCountMeta: 0,
        unlockError: '',
        tags: [],
        activeTagFilter: null,
        showingTrash: false,
        composerSaved: false,
        autoCreatedTagIds: [],
        theme: localStorage.getItem('theme') || 'auto'
      };

      const els = {
        loginView: document.getElementById('loginView'),
        appView: document.getElementById('appView'),
        unlockBadge: document.getElementById('unlockBadge'),
        loginTitle: document.getElementById('loginTitle'),
        loginDesc: document.getElementById('loginDesc'),
        loginStaticContent: document.getElementById('loginStaticContent'),
        passwordInput: document.getElementById('passwordInput'),
        passwordHelp: document.getElementById('passwordHelp'),
        loginBtn: document.getElementById('loginBtn'),
        loginStatus: document.getElementById('loginStatus'),
        searchInput: document.getElementById('searchInput'),
        clearSearchBtn: document.getElementById('clearSearchBtn'),
        newBtn: document.getElementById('newBtn'),
        logoutBtn: document.getElementById('logoutBtn'),
        statusLine: document.getElementById('statusLine'),
        noteCount: document.getElementById('noteCount'),
        noteList: document.getElementById('noteList'),
        editorPanel: document.getElementById('editorPanel'),
        modalTitle: document.getElementById('modalTitle'),
        editorTitle: document.getElementById('editorTitle'),
        editorContent: document.getElementById('editorContent'),
        closeModalBtn: document.getElementById('closeModalBtn'),
        cancelBtn: document.getElementById('cancelBtn'),
        saveBtn: document.getElementById('saveBtn'),
        sidebarTagList: document.getElementById('sidebarTagList'),
        newTagInput: document.getElementById('newTagInput'),
        newTagColor: document.getElementById('newTagColor'),
        addTagBtn: document.getElementById('addTagBtn'),
        sidebarItems: document.querySelectorAll('.sidebar-item[data-view]'),
        trashView: document.getElementById('trashView'),
        trashList: document.getElementById('trashList'),
        mainFeed: document.getElementById('mainFeed'),
        contentBody: document.getElementById('contentBody'),
        feedDesc: document.getElementById('feedDesc'),
        themeToggleBtn: document.getElementById('themeToggleBtn'),
        editorPinBtn: document.getElementById('editorPinBtn'),
        editorShareBtn: document.getElementById('editorShareBtn'),
        editorExportBtn: document.getElementById('editorExportBtn'),
        editorTagSelect: document.getElementById('editorTagSelect'),
        clearTagBtn: document.getElementById('clearTagBtn'),
        insertImageBtn: document.getElementById('insertImageBtn'),
        imageUploadArea: document.getElementById('imageUploadArea'),
        imageFileInput: document.getElementById('imageFileInput'),
        shareModal: document.getElementById('shareModal'),
        closeShareBtn: document.getElementById('closeShareBtn'),
        shareExpiry: document.getElementById('shareExpiry'),
        createShareBtn: document.getElementById('createShareBtn'),
        shareLinks: document.getElementById('shareLinks'),
        settingsPanel: document.getElementById('settingsPanel'),
        webdavUrl: document.getElementById('webdavUrl'),
        webdavUser: document.getElementById('webdavUser'),
        webdavPass: document.getElementById('webdavPass'),
        webdavTestBtn: document.getElementById('webdavTestBtn'),
        webdavSaveBtn: document.getElementById('webdavSaveBtn'),
        webdavStatus: document.getElementById('webdavStatus'),
        webdavBackupBtn: document.getElementById('webdavBackupBtn'),
        webdavRestoreBtn: document.getElementById('webdavRestoreBtn'),
        fileImportBtn: document.getElementById('fileImportBtn'),
        importFileInput: document.getElementById('importFileInput'),
        backupInfo: document.getElementById('backupInfo'),
        importModal: document.getElementById('importModal'),
        closeImportModalBtn: document.getElementById('closeImportModalBtn'),
        importPreview: document.getElementById('importPreview'),
        confirmImportBtn: document.getElementById('confirmImportBtn'),
        exportJsonBtn: document.getElementById('exportJsonBtn'),
        exportMdBtn: document.getElementById('exportMdBtn'),
        autoBackupToggle: document.getElementById('autoBackupToggle'),
        autoBackupDays: document.getElementById('autoBackupDays'),
        autoBackupTime: document.getElementById('autoBackupTime'),
        autoBackupKeep: document.getElementById('autoBackupKeep'),
        autoBackupInfo: document.getElementById('autoBackupInfo'),
        autoBackupLabel: document.getElementById('autoBackupLabel')
      };

      // ─── Theme ────────────────────────────
      function applyTheme() {
        const t = state.theme;
        if (t === 'dark' || t === 'light') {
          document.documentElement.setAttribute('data-theme', t);
        } else {
          document.documentElement.removeAttribute('data-theme');
        }
        const isDark = (t === 'dark') || (t === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        els.themeToggleBtn.textContent = isDark ? '☀️' : '🌙';
      }
      function toggleTheme() {
        const isDark = state.theme === 'dark' || (state.theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        state.theme = isDark ? 'light' : 'dark';
        localStorage.setItem('theme', state.theme);
        applyTheme();
      }
      applyTheme();
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function() { if (state.theme === 'auto') applyTheme(); });

      // ─── Helpers ──────────────────────────
      function setStatus(text) {
        clearTimeout(state.statusTimer);
        if (!text) { els.statusLine.textContent = ''; els.statusLine.classList.remove('show'); return; }
        els.statusLine.textContent = text;
        els.statusLine.classList.add('show');
        state.statusTimer = setTimeout(function () { els.statusLine.classList.remove('show'); }, 2200);
      }

      function updateSearchUi() {
        els.clearSearchBtn.classList.toggle('show', Boolean(els.searchInput.value.trim()));
      }

      function updateModalUi() {
        // Editor panel handled via .open class in open/closeComposer
      }

      function updateLoginMode() {
        const checking = state.authMode === 'checking';
        const unlockOnly = state.authMode === 'unlock' || (state.sessionAuthenticated && !state.vaultUnlocked);
        els.unlockBadge.classList.toggle('hidden', !unlockOnly);
        els.passwordInput.disabled = checking;
        els.loginBtn.disabled = checking;
        // Show static content (badge, title, subtitle, desc) in login and unlock states
        els.loginStaticContent.style.display = checking ? 'none' : '';
        // Show dynamic content only during checking state
        els.loginTitle.style.display = checking ? '' : 'none';
        els.loginDesc.style.display = checking ? '' : 'none';
        if (checking) {
          els.loginTitle.textContent = '正在打开我的笔记';
          els.loginDesc.textContent = '正在检查当前设备的访问状态…';
          els.passwordInput.placeholder = '请稍候…';
          els.loginBtn.querySelector('span').textContent = '请稍候…';
          return;
        }
        els.passwordInput.placeholder = unlockOnly ? '输入解锁密码' : '输入访问密码';
        els.loginBtn.querySelector('span').textContent = unlockOnly ? '解锁我的笔记' : '进入笔记';
      }

      function updateVaultUi() {
        els.searchInput.disabled = !state.vaultUnlocked;
        els.newBtn.disabled = !state.vaultUnlocked;
      }

      function bytesToBase64(bytes) {
        let binary = '';
        const chunkSize = 0x8000;
        for (let i = 0; i < bytes.length; i += chunkSize) {
          const chunk = bytes.subarray(i, i + chunkSize);
          binary += String.fromCharCode.apply(null, chunk);
        }
        return btoa(binary);
      }

      function base64ToBytes(base64) {
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
        return bytes;
      }

      function clearSensitiveInputs() {
        els.passwordInput.value = '';
      }

      // Cache the crypto config so unlock doesn't pay for a round-trip it can prefetch
      let cryptoConfigPromise = null;

      function getCryptoConfig() {
        if (!cryptoConfigPromise) {
          cryptoConfigPromise = api('/api/crypto-config').then(function (data) {
            state.vaultSalt = data.vaultSalt;
            return data;
          }).catch(function (e) { cryptoConfigPromise = null; throw e; });
        }
        return cryptoConfigPromise;
      }

      async function refreshMeta() {
        const data = await api('/api/health');
        state.noteCountMeta = data.noteCount || 0;
        updateVaultUi();
      }

      async function deriveVaultKey(passphrase, saltBase64) {
        const salt = base64ToBytes(saltBase64);
        const keyMaterial = await crypto.subtle.importKey('raw', new TextEncoder().encode(passphrase), 'PBKDF2', false, ['deriveKey']);
        return crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: 250000, hash: 'SHA-256' }, keyMaterial, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
      }

      function isEncryptedValue(value) { return typeof value === 'string' && value.startsWith('enc:v1:'); }

      async function encryptValue(value) {
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, state.vaultKey, new TextEncoder().encode(value || ''));
        return 'enc:v1:' + btoa(JSON.stringify({ iv: bytesToBase64(iv), data: bytesToBase64(new Uint8Array(cipher)) }));
      }

      async function decryptValue(value) {
        if (!isEncryptedValue(value)) return value || '';
        const payload = JSON.parse(atob(value.slice(7)));
        const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: base64ToBytes(payload.iv) }, state.vaultKey, base64ToBytes(payload.data));
        return new TextDecoder().decode(plain);
      }

      async function decryptNotes(rawNotes) {
        const decrypted = [];
        let encryptedCount = 0;
        for (const note of rawNotes) {
          try {
            if (isEncryptedValue(note.title) || isEncryptedValue(note.content)) encryptedCount += 1;
            decrypted.push({
              id: note.id, title: await decryptValue(note.title), content: await decryptValue(note.content),
              created_at: note.created_at, updated_at: note.updated_at,
              is_pinned: note.is_pinned, deleted_at: note.deleted_at, encrypted: true,
              tags: note.tags || []
            });
          } catch (e) { /* skip failed */ }
        }
        if (encryptedCount > 0 && decrypted.length === 0) throw new Error('本地解锁密钥不正确');
        return decrypted;
      }

      function filterNotes(notes, query) {
        const q = (query || '').trim().toLowerCase();
        if (!q) return notes;
        return notes.filter(function (n) {
          return (n.title || '').toLowerCase().includes(q) || (n.content || '').toLowerCase().includes(q);
        });
      }

      // ─── UI State ─────────────────────────
      function showLogin() {
        state.authMode = state.sessionAuthenticated ? 'unlock' : 'login';
        els.loginView.classList.remove('hidden');
        els.appView.classList.add('app-dimmed');
        updateLoginMode();
      }

      function showChecking() {
        state.authMode = 'checking';
        els.loginStatus.textContent = '';
        els.loginView.classList.remove('hidden');
        els.appView.classList.add('app-dimmed');
        updateLoginMode();
      }

      function showApp() {
        if (state.sessionAuthenticated && state.vaultUnlocked) {
          els.loginView.classList.add('hidden');
          els.appView.classList.remove('hidden');
          els.appView.classList.remove('app-dimmed');
        } else { showLogin(); }
        updateVaultUi();
      }

      function formatDate(ts) {
        if (!ts) return '-';
        return new Intl.DateTimeFormat('zh-CN', { year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit' }).format(new Date(ts));
      }

      function formatGroupLabel(ts) {
        const d = new Date(ts); const now = new Date();
        const startOf = function (v) { return new Date(v.getFullYear(), v.getMonth(), v.getDate()).getTime(); };
        const diff = Math.floor((startOf(now) - startOf(d)) / 86400000);
        if (diff === 0) return '今天';
        if (diff === 1) return '昨天';
        return new Intl.DateTimeFormat('zh-CN', { year:'numeric', month:'2-digit', day:'2-digit' }).format(d);
      }

      function wordCount(text) { return (text || '').replace(/\s+/g, '').length; }
      function previewOf(note) { return (note.content || '').replace(/\s+/g, ' ').slice(0, 120) || '（空内容）'; }

      function escapeHtml(text) {
        return (text || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      }

      function escapeRegExp(text) { return text.replace(/[.*+?^$()|[\]{}]/g, '\$&'); }

      function highlightText(text, query) {
        const safe = escapeHtml(text || '');
        if (!query) return safe;
        const esc = escapeRegExp(query.trim());
        if (!esc) return safe;
        return safe.replace(new RegExp(esc, 'gi'), function (m) { return '<mark class="search-highlight">' + m + '</mark>'; });
      }

      function getDisplayContent(note) {
        const lines = (note.content || '').split('\n');
        const expanded = state.expandedIds.has(note.id);
        return { text: expanded ? note.content : lines.slice(0, 30).join('\n'), expanded, canExpand: lines.length > 30 };
      }

      async function api(url, options) {
        const res = await fetch(url, Object.assign({ credentials: 'same-origin' }, options || {}));
        const data = await res.json().catch(function () { return {}; });
        if (res.status === 401) {
          state.sessionAuthenticated = false; state.vaultUnlocked = false; state.vaultKey = null;
          showLogin(); throw new Error('请先登录');
        }
        if (!res.ok) throw new Error(data.error || '请求失败');
        return data;
      }

      // ─── Tags ─────────────────────────────
      async function refreshTags() {
        try {
          const data = await api('/api/tags');
          state.tags = data.tags || [];
          renderTagList();
          renderEditorTagSelect();
        } catch (e) { /* silent */ }
      }

      function renderTagList() {
        els.sidebarTagList.innerHTML = '';
        // "全部笔记" pseudo-tag
        const allItem = document.createElement('div');
        allItem.className = 'sidebar-tag-item' + (!state.activeTagFilter ? ' active' : '');
        allItem.innerHTML = '<span class="sidebar-tag-dot" style="background:var(--primary)"></span>全部';
        if (state.vaultUnlocked) {
          const allCount = document.createElement('span');
          allCount.className = 'tag-count';
          allCount.textContent = String(state.allNotes.length);
          allItem.appendChild(allCount);
        }
        allItem.onclick = function () {
          if (!state.activeTagFilter) return;
          state.activeTagFilter = null;
          renderTagList(); applyFilters();
          setStatus('显示全部笔记');
        };
        els.sidebarTagList.appendChild(allItem);
        state.tags.forEach(function (tag) {
          const el = document.createElement('div');
          el.className = 'sidebar-tag-item' + (state.activeTagFilter === tag.id ? ' active' : '');
          el.innerHTML = '<span class="sidebar-tag-dot" style="background:' + escapeHtml(tag.color) + '"></span>' + escapeHtml(tag.name);
          const count = document.createElement('span');
          count.className = 'tag-count';
          count.textContent = String(tag.count || 0);
          el.appendChild(count);
          el.onclick = function () {
            state.activeTagFilter = state.activeTagFilter === tag.id ? null : tag.id;
            renderTagList();
            applyFilters();
          };
          const del = document.createElement('span');
          del.className = 'tag-del';
          del.textContent = '×';
          del.style.cssText = 'margin-left:6px;font-size:13px;color:var(--danger);cursor:pointer;opacity:0.5;';
          del.onclick = async function (e) {
            e.stopPropagation();
            if (!confirm('删除标签 "' + tag.name + '"？')) return;
            await api('/api/tags/' + encodeURIComponent(tag.id), { method: 'DELETE' });
            if (state.activeTagFilter === tag.id) state.activeTagFilter = null;
            await Promise.all([refreshTags(), refreshNotes()]);
            setStatus('标签已删除');
          };
          el.appendChild(del);
          els.sidebarTagList.appendChild(el);
        });
      }

      function renderEditorTagSelect() {
        els.editorTagSelect.innerHTML = '';
        state.tags.forEach(function (tag) {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'btn small secondary';
          btn.style.fontSize = '11px';
          btn.innerHTML = '<span class="tag-dot" style="background:' + escapeHtml(tag.color) + ';display:inline-block;width:6px;height:6px;border-radius:50%;"></span> ' + escapeHtml(tag.name);
          btn.dataset.tagId = tag.id;
          btn.onclick = function () { btn.classList.toggle('active'); };
          els.editorTagSelect.appendChild(btn);
        });
      }

      function getEditorSelectedTagIds() {
        const ids = [];
        els.editorTagSelect.querySelectorAll('.btn.active').forEach(function (b) { ids.push(b.dataset.tagId); });
        return ids;
      }

      function setEditorTagSelection(tagIds) {
        els.editorTagSelect.querySelectorAll('.btn').forEach(function (b) {
          b.classList.toggle('active', tagIds.includes(b.dataset.tagId));
        });
      }

      // ─── Auto Tag Matching ──────────────────
      let autoTagTimer = null;

      function scheduleAutoTag() {
        clearTimeout(autoTagTimer);
        autoTagTimer = setTimeout(runAutoTag, 900);
      }

      const TAG_PALETTE = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#84cc16'];
      const TAG_STOPWORDS = new Set([
        '我们','你们','他们','这个','那个','一个','一些','什么','因为','所以','但是','而且','如果','虽然','然后',
        '可以','没有','就是','还是','以及','不是','自己','现在','已经','真的','可能','时候','东西','地方','今天',
        '明天','昨天','需要','知道','觉得','希望','应该','这么','那样','非常','比较','开始','继续','最后','这样',
        '那些','这些','比如','其实','感觉','有点','很多','很少','一直','并且','或者','对于','关于','通过','为了',
        '不要','不会','不能','怎么','怎样','请问','大家','朋友','什么','每次','非常','真的','工作','生活','问题',
        'the','and','that','this','with','from','have','you','are','was','were','for','not','but','can','just','very'
      ]);

      // Extract keyword candidates from title+content (latin terms + CJK segments/bigrams)
      function extractTagCandidates(text, titleText) {
        const titleLower = String(titleText || '').toLowerCase();
        const out = [];
        const seen = new Set();
        function add(name) {
          const n = String(name).trim().toLowerCase();
          if (n.length < 2 || n.length > 12) return;
          if (TAG_STOPWORDS.has(n)) return;
          // drop candidates that start with a stopword ("今天用" starts with 今天)
          for (const sw of TAG_STOPWORDS) {
            if (n.length > sw.length && n.startsWith(sw)) return;
          }
          // require at least one CJK or alphanumeric char (pure punctuation/emoji rejected)
          if (!/[一-鿿]/.test(n) && !/[a-zA-Z0-9]/.test(n)) return;
          if (seen.has(n)) return;
          seen.add(n);
          out.push(String(name).trim());
        }
        // Latin / tech terms (case preserved as typed)
        const latin = text.match(/[a-zA-Z][a-zA-Z0-9_.-]{1,19}/g) || [];
        latin.forEach(add);
        // CJK segments split on non-CJK delimiters
        const segs = text.split(/[^a-zA-Z0-9一-鿿]+/).filter(function (s) {
          return /[一-鿿]/.test(s) && s.length >= 2 && s.length <= 8 && !TAG_STOPWORDS.has(s.toLowerCase());
        });
        const segFreq = new Map();
        const gramFreq = new Map();
        segs.forEach(function (s) {
          segFreq.set(s, (segFreq.get(s) || 0) + 1);
          for (let i = 0; i <= s.length - 2; i++) {
            const g = s.slice(i, i + 2);
            if (/^[一-鿿]{2}$/.test(g) && !TAG_STOPWORDS.has(g)) {
              gramFreq.set(g, (gramFreq.get(g) || 0) + 1);
            }
          }
        });
        const scored = [];
        segFreq.forEach(function (c, s) {
          // short segments qualify at any frequency; long sentence-like ones need repeats
          // (title segments qualify once even when longer)
          const inTitle = titleLower.includes(s.toLowerCase());
          if (c >= 2 || s.length <= 4 || (inTitle && s.length <= 8)) {
            scored.push({ name: s, score: c * 3 + s.length + (inTitle ? 2 : 0) });
          }
        });
        // bigrams need to repeat at least 3x to be meaningful ("记应" adjacent pairs are noise)
        gramFreq.forEach(function (c, g) { if (c >= 3) scored.push({ name: g, score: c * 2 }); });
        scored.sort(function (a, b) { return b.score - a.score; });
        scored.forEach(function (item) { add(item.name); });
        // drop candidates that are a substring of a longer one (keep "健身打卡" over 健身/身打/打卡)
        const kept = out.filter(function (c) {
          const lc = c.toLowerCase();
          return !out.some(function (other) {
            const lo = other.toLowerCase();
            return lo.length > lc.length && lo.includes(lc);
          });
        });
        return kept.slice(0, 10);
      }

      function unionTagIds(a, b) {
        const s = new Set(a);
        b.forEach(function (id) { s.add(id); });
        return Array.from(s);
      }

      // Auto-match existing tags whose name appears in the text, and
      // auto-create new tags from frequent keywords (tracked for cleanup)
      async function runAutoTag() {
        if (!els.editorPanel.classList.contains('open')) return;
        const raw = els.editorTitle.value + '\n' + els.editorContent.value;
        const text = raw.toLowerCase();
        if (text.trim().length < 6) return;

        const wanted = new Set(getEditorSelectedTagIds());
        // 1) Match existing tags by substring
        state.tags.forEach(function (t) {
          if (t.name && text.includes(t.name.toLowerCase())) wanted.add(t.id);
        });
        // 2) Auto-create new tags from frequent keywords
        const existingNames = state.tags.map(function (t) { return t.name.toLowerCase(); });
        const fresh = extractTagCandidates(raw, els.editorTitle.value).filter(function (name) {
          const n = name.toLowerCase();
          if (existingNames.includes(n)) return false;
          // drop candidates that contain an existing tag name (redundant: "部署很快" vs 部署)
          return !existingNames.some(function (en) { return en.length >= 2 && en.length < n.length && n.includes(en); });
        });
        const created = [];
        for (const name of fresh.slice(0, 5)) {
          try {
            const data = await api('/api/tags', {
              method: 'POST', headers: { 'content-type': 'application/json' },
              body: JSON.stringify({ name: name.length > 10 ? name.slice(0, 10) : name, color: TAG_PALETTE[Math.floor(Math.random() * TAG_PALETTE.length)] })
            });
            if (data.tag) {
              state.tags.push(data.tag);
              state.autoCreatedTagIds.push(data.tag.id);
              wanted.add(data.tag.id);
              created.push(data.tag.name);
            }
          } catch (e) { /* ignore per-tag failures */ }
        }
        if (created.length) {
          renderTagList();
          renderEditorTagSelect();
          setEditorTagSelection(Array.from(wanted));
          setStatus('✨ 自动生成标签: ' + created.join('、'));
        } else {
          setEditorTagSelection(Array.from(wanted));
        }
      }

      // ─── Note Tags for Card ───────────────
      async function fetchNoteTags(noteId) {
        try {
          const data = await api('/api/notes/' + encodeURIComponent(noteId) + '/shares');
          return [];
        } catch (e) { return []; }
      }

      function getTagById(id) { return state.tags.find(function (t) { return t.id === id; }); }

      function renderNoteTags(noteId) {
        return '';
      }

      // ─── Render ───────────────────────────
      function renderList() {
        els.noteList.innerHTML = '';
        els.noteCount.textContent = state.notes.length ? ('共 ' + state.notes.length + ' 条') : '0 条';

        if (!state.vaultUnlocked) {
          els.noteCount.textContent = state.noteCountMeta ? ('共 ' + state.noteCountMeta + ' 条（已加密）') : '0 条';
          els.noteList.innerHTML = '<div class="empty-feed"><span class="empty-icon">🔒</span><div class="empty-title">正文已加密</div><div class="empty-hint">请先输入解锁密码查看笔记内容</div></div>';
          return;
        }

        if (!state.notes.length) {
          els.noteList.innerHTML = '<div class="empty-feed"><span class="empty-icon">🗒️</span><div class="empty-title">没有笔记'
            + (state.activeTagFilter ? '匹配当前标签' : '')
            + '</div><div class="empty-hint">点击右上角"＋ 新建笔记"，写下第一笔</div></div>';
          return;
        }

        const groups = new Map();
        state.notes.forEach(function (note) {
          const key = formatGroupLabel(note.updated_at);
          if (!groups.has(key)) groups.set(key, []);
          groups.get(key).push(note);
        });

        groups.forEach(function (notes, groupLabel) {
          const group = document.createElement('section');
          group.className = 'group-block';
          const gt = document.createElement('div');
          gt.className = 'group-title';
          gt.textContent = groupLabel;
          group.appendChild(gt);

          notes.forEach(function (note) {
            const card = document.createElement('article');
            card.className = 'note-card' + (note.is_pinned ? ' is-pinned' : '');

            const head = document.createElement('div');
            head.className = 'note-card-head';

            const title = document.createElement('div');
            title.className = 'note-card-title';
            title.innerHTML = (note.is_pinned ? '<span title="置顶">📌</span> ' : '') + highlightText(note.title || '无标题', els.searchInput.value.trim());

            const actions = document.createElement('div');
            actions.className = 'note-actions';

            function iconBtn(icon, label, cls, onclick) {
              const b = document.createElement('button');
              b.type = 'button';
              b.className = 'icon-btn' + (cls ? ' ' + cls : '');
              b.textContent = icon;
              b.title = label;
              b.setAttribute('aria-label', label);
              b.onclick = onclick;
              return b;
            }

            const pinBtn = iconBtn('📌', note.is_pinned ? '取消置顶' : '置顶', '', async function () {
              await api('/api/notes/' + encodeURIComponent(note.id) + '/pin', { method: 'PUT' });
              await refreshNotes();
              setStatus(note.is_pinned ? '已取消置顶' : '已置顶');
            });

            const copyBtn = iconBtn('📋', '复制', '', async function () {
              try { await navigator.clipboard.writeText(note.content || ''); setStatus('已复制：' + (note.title || '无标题')); }
              catch (e) { setStatus('复制失败'); }
            });

            const editBtn = iconBtn('✏️', '编辑', '', function () { openComposer(note); });

            const shareBtn = iconBtn('🔗', '分享', '', function () { openShareDialog(note.id); });

            const exportBtn = iconBtn('📤', '导出 Markdown', '', function () { exportSingleNote(note); });

            const deleteBtn = iconBtn('🗑', '删除', 'danger', function () { deleteNote(note.id).catch(function (e) { setStatus(e.message || '删除失败'); }); });

            actions.appendChild(pinBtn);
            actions.appendChild(copyBtn);
            actions.appendChild(editBtn);
            actions.appendChild(shareBtn);
            actions.appendChild(exportBtn);
            actions.appendChild(deleteBtn);

            head.appendChild(title);
            head.appendChild(actions);
            card.appendChild(head);

            const body = document.createElement('div');
            const dc = getDisplayContent(note);
            body.className = 'note-card-text' + (note.content ? '' : ' is-empty');
            body.textContent = note.content ? dc.text : '这条笔记还没有内容。';
            const bodyWrap = document.createElement('div');
            bodyWrap.className = 'note-card-text-wrap' + (dc.canExpand && !dc.expanded ? ' collapsed' : '');
            bodyWrap.appendChild(body);
            card.appendChild(bodyWrap);

            if (dc.canExpand) {
              const toggleBtn = document.createElement('button');
              toggleBtn.type = 'button';
              toggleBtn.className = 'note-expand';
              toggleBtn.textContent = dc.expanded ? '收起' : '展开全文';
              toggleBtn.onclick = function () {
                if (state.expandedIds.has(note.id)) state.expandedIds.delete(note.id);
                else state.expandedIds.add(note.id);
                renderList();
              };
              card.appendChild(toggleBtn);
            }

            const foot = document.createElement('div');
            foot.className = 'note-card-foot';
            if (note.tags && note.tags.length) {
              const tagsRow = document.createElement('div');
              tagsRow.className = 'note-tags';
              note.tags.forEach(function (t) {
                const pill = document.createElement('span');
                pill.className = 'tag-pill';
                pill.innerHTML = '<span class="tag-dot" style="background:' + escapeHtml(t.color) + '"></span>' + escapeHtml(t.name);
                tagsRow.appendChild(pill);
              });
              foot.appendChild(tagsRow);
            }
            const metaText = document.createElement('span');
            metaText.className = 'note-card-meta-text';
            metaText.textContent = formatDate(note.updated_at) + ' · ' + wordCount(note.content) + ' 字';
            foot.appendChild(metaText);
            card.appendChild(foot);

            group.appendChild(card);
          });
          els.noteList.appendChild(group);
        });
      }

      function renderTrashList(notes) {
        els.trashList.innerHTML = '';
        if (!notes.length) {
          els.trashList.innerHTML = '<div class="empty-feed"><span class="empty-icon">🗑️</span><div class="empty-title">回收站是空的</div><div class="empty-hint">删除的笔记会在这里保留 30 天</div></div>';
          return;
        }
        notes.forEach(function (note) {
          const card = document.createElement('article');
          card.className = 'note-card';
          card.style.opacity = '0.75';
          const head = document.createElement('div');
          head.className = 'note-card-head';
          const title = document.createElement('div');
          title.className = 'note-card-title';
          title.textContent = note.title || '无标题';
          const actions = document.createElement('div');
          actions.className = 'note-actions';
          const restoreBtn = document.createElement('button');
          restoreBtn.type = 'button';
          restoreBtn.className = 'icon-btn';
          restoreBtn.textContent = '♻️';
          restoreBtn.title = '恢复';
          restoreBtn.setAttribute('aria-label', '恢复');
          restoreBtn.onclick = async function () {
            await api('/api/notes/' + encodeURIComponent(note.id) + '/restore', { method: 'POST' });
            setStatus('已恢复');
            loadTrash();
            refreshNotes();
            refreshTags();
          };
          const permBtn = document.createElement('button');
          permBtn.type = 'button';
          permBtn.className = 'icon-btn danger';
          permBtn.textContent = '🗑';
          permBtn.title = '永久删除';
          permBtn.setAttribute('aria-label', '永久删除');
          permBtn.onclick = async function () {
            if (!confirm('永久删除此笔记？此操作不可恢复！')) return;
            await api('/api/notes/' + encodeURIComponent(note.id) + '/permanent', { method: 'DELETE' });
            await cleanupZeroTags();
            setStatus('已永久删除');
            loadTrash();
            refreshTags();
          };
          actions.appendChild(restoreBtn);
          actions.appendChild(permBtn);
          head.appendChild(title);
          head.appendChild(actions);
          card.appendChild(head);
          const foot = document.createElement('div');
          foot.className = 'note-card-foot';
          const metaText = document.createElement('span');
          metaText.className = 'note-card-meta-text';
          metaText.textContent = '删除于 ' + formatDate(note.deleted_at) + ' · ' + wordCount(note.content) + ' 字';
          foot.appendChild(metaText);
          card.appendChild(foot);
          els.trashList.appendChild(card);
        });
      }

      // ─── Data Operations ──────────────────
      async function refreshNotes() {
        if (!state.vaultUnlocked) {
          state.notes = []; state.allNotes = [];
          await refreshMeta(); renderList(); return;
        }
        // Always fetch the full set; tag filtering happens locally so tag clicks are instant
        const data = await api('/api/notes');
        state.allNotes = await decryptNotes(data.notes || []);
        state.noteCountMeta = state.allNotes.length;
        updateVaultUi();
        applyFilters();
      }

      // Re-apply tag + search filters against the in-memory notes (no network, no re-decrypt)
      function applyFilters() {
        const q = els.searchInput.value.trim();
        let notes = state.allNotes;
        if (state.activeTagFilter) {
          notes = notes.filter(function (n) {
            return (n.tags || []).some(function (t) { return t.id === state.activeTagFilter; });
          });
        }
        state.notes = filterNotes(notes, q);
        state.expandedIds.forEach(function (id) {
          if (!state.notes.find(function (n) { return n.id === id; })) state.expandedIds.delete(id);
        });
        renderList();
      }

      async function loadTrash() {
        try {
          const data = await api('/api/notes/trash');
          const notes = await decryptNotes(data.notes || []);
          renderTrashList(notes);
        } catch (e) { setStatus(e.message || '加载回收站失败'); }
      }

      function openComposer(note) {
        state.editingId = note ? note.id : null;
        state.composerSaved = false;
        state.autoCreatedTagIds = [];
        els.modalTitle.textContent = note ? '编辑笔记' : '新建笔记';
        els.editorTitle.value = note ? note.title : '';
        els.editorContent.value = note ? note.content : '';
        els.editorPinBtn.textContent = (note && note.is_pinned) ? '取消置顶' : '📌 置顶';
        els.editorPanel.classList.add('open');
        updateModalUi();
        els.editorTitle.focus();
        // Tags already came down with the note list — no extra round-trip needed
        setEditorTagSelection(note ? (note.tags || []).map(function (t) { return t.id; }) : []);
      }

      async function closeComposer() {
        clearTimeout(autoTagTimer);
        els.editorPanel.classList.remove('open');
        state.editingId = null;
        updateModalUi();
        // If the note was never saved, drop tags auto-created this session that have no note attached
        if (!state.composerSaved && state.autoCreatedTagIds.length) {
          await cleanupZeroTags();
          refreshTags();
        }
        state.autoCreatedTagIds = [];
        state.composerSaved = false;
      }

      // Delete tags no longer referenced by any note (count-0 tags)
      async function cleanupZeroTags() {
        try { await api('/api/tags/cleanup', { method: 'POST' }); } catch (e) { /* silent */ }
      }

      async function saveComposer() {
        const title = els.editorTitle.value.trim() || '无标题';
        const content = els.editorContent.value.trim();
        if (!title && !content) { setStatus('标题和内容至少写一个'); return; }
        if (!state.vaultUnlocked || !state.vaultKey) { setStatus('请先输入解锁密钥'); return; }
        setStatus('保存中…');
        const encTitle = await encryptValue(title);
        const encContent = await encryptValue(content);
        let data;
        if (state.editingId) {
          data = await api('/api/notes/' + encodeURIComponent(state.editingId), {
            method: 'PUT', headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ title: encTitle, content: encContent })
          });
        } else {
          data = await api('/api/notes', {
            method: 'POST', headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ title: encTitle, content: encContent })
          });
        }
        // Save tag associations (PUT with empty array clears all tags)
        const tagIds = getEditorSelectedTagIds();
        if (data.note) {
          await api('/api/notes/' + encodeURIComponent(data.note.id) + '/tags', {
            method: 'PUT', headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ tagIds })
          });
        }
        state.composerSaved = true;
        closeComposer();
        await cleanupZeroTags();
        await Promise.all([refreshNotes(), refreshTags()]);
        setStatus('已保存');
      }

      async function deleteNote(id) {
        if (!id) { setStatus('没有可删除的笔记'); return; }
        if (!confirm('移入回收站？')) return;
        await api('/api/notes/' + encodeURIComponent(id), { method: 'DELETE' });
        await cleanupZeroTags();
        await Promise.all([refreshNotes(), refreshTags()]);
        setStatus('已移入回收站');
      }

      async function unlockVault(passphrase) {
        if (!passphrase) throw new Error('请输入密码');
        const config = await getCryptoConfig();
        state.vaultKey = await deriveVaultKey(passphrase, config.vaultSalt);
        state.vaultUnlocked = true;
        state.unlockError = '';
        await Promise.all([refreshNotes(), refreshTags()]);
      }

      async function checkSession() {
        showChecking();
        const data = await api('/api/session');
        if (data.authenticated) {
          state.sessionAuthenticated = true;
          state.vaultUnlocked = false; state.vaultKey = null; state.unlockError = '';
          // Warm the salt request while the user is still typing their password
          getCryptoConfig().catch(function () { /* retried on unlock */ });
          await refreshMeta();
          state.authMode = 'unlock';
          showLogin(); renderList();
        } else {
          state.sessionAuthenticated = false;
          state.vaultUnlocked = false; state.vaultKey = null; state.unlockError = '';
          showLogin(); renderList();
        }
      }

      // ─── Export ───────────────────────────
      function exportSingleNote(note) {
        const md = '# ' + (note.title || '无标题') + '\n\n' + (note.content || '');
        downloadFile((note.title || 'note') + '.md', md, 'text/markdown');
        setStatus('已导出 Markdown');
      }

      async function exportAllNotes(format) {
        try {
          if (format === 'json') {
            const data = await api('/api/notes');
            const notes = await decryptNotes(data.notes || []);
            downloadFile('notes.json', JSON.stringify(notes, null, 2), 'application/json');
          } else {
            const data = await api('/api/notes');
            const notes = await decryptNotes(data.notes || []);
            let md = '# 我的笔记\n\n';
            notes.forEach(function (n) { md += '## ' + (n.title || '无标题') + '\n\n' + (n.content || '') + '\n\n---\n\n'; });
            downloadFile('notes.md', md, 'text/markdown');
          }
          setStatus('已导出');
        } catch (e) { setStatus(e.message || '导出失败'); }
      }

      function downloadFile(name, content, type) {
        const blob = new Blob([content], { type: type + ';charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = name;
        document.body.appendChild(a); a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      // ─── WebDAV & Settings ────────────────
      function getWebdavConfig() {
        try { return JSON.parse(localStorage.getItem('webdav_config') || '{}'); } catch (e) { return {}; }
      }
      function saveWebdavConfig(config) {
        localStorage.setItem('webdav_config', JSON.stringify(config));
      }
      function loadWebdavConfigToUI() {
        const cfg = getWebdavConfig();
        els.webdavUrl.value = cfg.url || '';
        els.webdavUser.value = cfg.user || '';
        els.webdavPass.value = cfg.pass || '';
        updateBackupInfo();
      }
      function updateBackupInfo() {
        const cfg = getWebdavConfig();
        if (cfg.lastBackup) {
          els.backupInfo.textContent = '上次备份: ' + new Date(cfg.lastBackup).toLocaleString('zh-CN');
        } else {
          els.backupInfo.textContent = '尚未备份过';
        }
      }
      // Relay a WebDAV call through our Worker (browsers cannot call third-party
      // WebDAV directly: PROPFIND/PUT get no CORS headers from most providers)
      async function webdavProxy(method, url, body, opts) {
        opts = opts || {};
        const cfg = getWebdavConfig();
        const data = await api('/api/webdav/proxy', {
          method: 'POST', headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            url: url, method: method, body: body,
            contentType: opts.contentType, depth: opts.depth,
            user: cfg.user || '', pass: cfg.pass || ''
          })
        });
        return data;
      }

      function webdavBaseUrl() {
        const cfg = getWebdavConfig();
        if (!cfg.url) throw new Error('请先配置 WebDAV 服务器地址');
        return cfg.url.replace(/\/+$/, '');
      }

      // Response-like shim so callers can keep using res.ok / res.text() / res.json()
      function proxyResponse(data) {
        return {
          ok: !!data.ok, status: data.status, statusText: data.statusText,
          text: async function () { return data.body || ''; },
          json: async function () { return JSON.parse(data.body || 'null'); }
        };
      }

      async function webdavRequest(path, method, body, contentType) {
        const url = webdavBaseUrl() + '/' + path.replace(/^\/+/, '');
        const data = await webdavProxy(method, url, body, { contentType: contentType });
        if (!data.ok) {
          if (data.status === 0) throw new Error('无法连接 WebDAV 服务器，请检查地址与网络');
          throw new Error('WebDAV 请求失败 (' + data.status + '): ' + (data.body || '').slice(0, 100) || data.statusText);
        }
        return proxyResponse(data);
      }

      // Some WebDAV servers (wsgidav/Apache/nginx dav) return 409 when the parent
      // collection doesn't exist, so create it once before the first backup PUT
      let backupDirReady = false;
      async function ensureBackupDir() {
        if (backupDirReady) return;
        try {
          await webdavProxy('MKCOL', webdavBaseUrl() + '/edge-notes', undefined, {});
        } catch (e) { /* 405 = already exists, ignore */ }
        backupDirReady = true;
      }

      async function webdavTestConnection() {
        const cfg = getWebdavConfig();
        if (!cfg.url) throw new Error('请填写服务器地址');
        const data = await webdavProxy('PROPFIND', cfg.url.replace(/\/+$/, ''), undefined, { depth: '0' });
        if (data.status < 200 || data.status >= 300) {
          if (data.status === 0) throw new Error('无法连接服务器，请检查地址与网络');
          throw new Error('连接失败 (' + data.status + '): ' + data.statusText);
        }
        return true;
      }

      // Build backup data (encrypted ciphertext + tags; tag list already ships with each note)
      async function buildBackupData() {
        const notesData = await api('/api/notes');
        const tagsData = await api('/api/tags');
        const notes = notesData.notes || [];
        const tags = tagsData.tags || [];
        const notesWithTags = notes.map(function (note) {
          return {
            id: note.id,
            title: note.title,
            content: note.content,
            created_at: note.created_at,
            updated_at: note.updated_at,
            is_pinned: note.is_pinned || 0,
            tag_names: (note.tags || []).map(function (t) { return t.name; }),
          };
        });
        return {
          version: 1,
          app: 'edge-notes',
          exported_at: Date.now(),
          notes: notesWithTags,
          tags: tags.map(function (t) { return { name: t.name, color: t.color }; }),
        };
      }

      async function backupToWebdav() {
        els.webdavBackupBtn.disabled = true;
        els.webdavBackupBtn.textContent = '备份中…';
        try {
          const data = await buildBackupData();
          const json = JSON.stringify(data, null, 2);
          await ensureBackupDir();
          const now = new Date();
          const fname = 'edge-notes/backup-' + backupDateStr(now) + '-' + backupTimeStr(now) + '.json';
          await webdavRequest(fname, 'PUT', json, 'application/json');
          // Also update latest for easy restore
          await webdavRequest('edge-notes/backup-latest.json', 'PUT', json, 'application/json');
          const cfg = getWebdavConfig();
          cfg.lastBackup = Date.now();
          saveWebdavConfig(cfg);
          updateBackupInfo();
          setStatus('备份成功 (' + data.notes.length + ' 条笔记)');
        } catch (e) {
          setStatus('备份失败: ' + e.message);
        } finally {
          els.webdavBackupBtn.disabled = false;
          els.webdavBackupBtn.textContent = '📤 备份到 WebDAV';
        }
      }

      async function restoreFromWebdav() {
        if (!confirm('从 WebDAV 恢复将追加笔记到当前账户，不会覆盖现有笔记。确定继续？')) return;
        els.webdavRestoreBtn.disabled = true;
        els.webdavRestoreBtn.textContent = '恢复中…';
        try {
          const res = await webdavRequest('edge-notes/backup-latest.json', 'GET');
          const data = await res.json();
          showImportPreview(data);
        } catch (e) {
          setStatus('恢复失败: ' + e.message);
        } finally {
          els.webdavRestoreBtn.disabled = false;
          els.webdavRestoreBtn.textContent = '📥 从 WebDAV 恢复';
        }
      }

      function showImportPreview(data) {
        if (!data || !Array.isArray(data.notes)) {
          setStatus('无效的备份文件');
          return;
        }
        const noteCount = data.notes.length;
        const tagCount = (data.tags || []).length;
        const backupDate = data.exported_at ? new Date(data.exported_at).toLocaleString('zh-CN') : '未知';
        const app = data.app || 'unknown';
        els.importPreview.innerHTML =
          '<div class="import-stat"><span>来源应用</span><span>' + escapeHtml(app) + '</span></div>' +
          '<div class="import-stat"><span>备份时间</span><span>' + backupDate + '</span></div>' +
          '<div class="import-stat"><span>笔记数量</span><span>' + noteCount + ' 条</span></div>' +
          '<div class="import-stat"><span>标签数量</span><span>' + tagCount + ' 个</span></div>';
        els.importModal.classList.remove('hidden');
        els.importModal._importData = data;
      }

      async function confirmImport() {
        const data = els.importModal._importData;
        if (!data) return;
        els.confirmImportBtn.disabled = true;
        els.confirmImportBtn.textContent = '导入中…';
        try {
          const result = await api('/api/notes/import', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ notes: data.notes, tags: data.tags }),
          });
          els.importModal.classList.add('hidden');
          await refreshNotes();
          await refreshTags();
          const stats = result.imported;
          setStatus('导入完成: ' + stats.notes + ' 条笔记, ' + stats.tags + ' 个新标签');
        } catch (e) {
          setStatus('导入失败: ' + e.message);
        } finally {
          els.confirmImportBtn.disabled = false;
          els.confirmImportBtn.textContent = '确认导入';
        }
      }

      function triggerFileImport() {
        els.importFileInput.click();
      }

      function handleFileImport(file) {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function (e) {
          try {
            const data = JSON.parse(e.target.result);
            showImportPreview(data);
          } catch (err) {
            setStatus('文件解析失败: ' + err.message);
          }
        };
        reader.readAsText(file);
      }

      // ─── Auto Backup ──────────────────────
      const AUTO_BACKUP_KEY = 'auto_backup_config';
      let autoBackupTimer = null;

      function getAutoBackupConfig() {
        try { return JSON.parse(localStorage.getItem(AUTO_BACKUP_KEY)) || {}; }
        catch (e) { return {}; }
      }

      function saveAutoBackupConfig(cfg) {
        localStorage.setItem(AUTO_BACKUP_KEY, JSON.stringify(cfg));
      }

      function getSelectedDays() {
        var days = [];
        if (!els.autoBackupDays) return [1,2,3,4,5];
        var checks = els.autoBackupDays.querySelectorAll('input[type=checkbox]');
        checks.forEach(function (c) { if (c.checked) days.push(parseInt(c.value)); });
        return days;
      }

      function setSelectedDays(days) {
        if (!els.autoBackupDays) return;
        var chips = els.autoBackupDays.querySelectorAll('.day-chip');
        chips.forEach(function (chip) {
          var c = chip.querySelector('input');
          var active = days.indexOf(parseInt(c.value)) >= 0;
          c.checked = active;
          chip.classList.toggle('active', active);
        });
      }

      function backupDateStr(d) {
        var y = d.getFullYear(), m = String(d.getMonth()+1).padStart(2,'0'), dd = String(d.getDate()).padStart(2,'0');
        return y + '-' + m + '-' + dd;
      }

      function backupTimeStr(d) {
        return String(d.getHours()).padStart(2,'0') + String(d.getMinutes()).padStart(2,'0');
      }

      function updateAutoBackupInfo() {
        var cfg = getAutoBackupConfig();
        var el = document.getElementById('autoBackupInfo');
        if (!el) return;
        // Update on/off label
        if (els.autoBackupLabel) {
          els.autoBackupLabel.textContent = cfg.enabled ? '开' : '关';
          els.autoBackupLabel.className = 'toggle-label' + (cfg.enabled ? ' on' : '');
        }
        if (!cfg.enabled) { el.textContent = '定时备份已关闭'; return; }
        var dayNames = ['日','一','二','三','四','五','六'];
        var days = (cfg.days || [1,2,3,4,5]).map(function (d) { return '周' + dayNames[d]; }).join('、');
        var time = cfg.time || '03:00';
        var keep = cfg.keepCount || 7;
        var last = cfg.lastBackup;
        el.textContent = '每周 ' + days + ' ' + time + ' · 保留 ' + keep + ' 份' +
          (last ? ' · 上次: ' + new Date(last).toLocaleString('zh-CN') : '');
      }

      function shouldBackupNow(cfg) {
        if (!cfg.enabled) return false;
        var now = new Date();
        var dayOfWeek = now.getDay(); // 0=Sun, 1=Mon...
        var days = cfg.days || [1,2,3,4,5];
        if (days.indexOf(dayOfWeek) < 0) return false;
        var parts = (cfg.time || '03:00').split(':');
        var targetHour = parseInt(parts[0]) || 3;
        var targetMin = parseInt(parts[1]) || 0;
        // Check within 1-minute window
        if (now.getHours() !== targetHour || now.getMinutes() !== targetMin) return false;
        // Avoid double-backup: skip if lastBackup was within last 90 seconds
        var last = cfg.lastBackup || 0;
        if (Date.now() - last < 90000) return false;
        return true;
      }

      async function cleanupOldBackups(keepCount) {
        try {
          var res = await webdavProxy('PROPFIND', webdavBaseUrl() + '/edge-notes/', undefined, { depth: '1' });
          if (res.status < 200 || res.status >= 300) return;
          var text = res.body || '';
          // Find backup filenames anywhere in the PROPFIND XML (namespace-agnostic)
          var files = [];
          var seen = {};
          var re = /backup-[A-Za-z0-9._-]*\.json/gi;
          var m;
          while ((m = re.exec(text)) !== null) {
            var name = m[0];
            // never clean up the latest.json pointer
            if (name.indexOf('backup-') === 0 && name !== 'backup-latest.json' && !seen[name]) {
              seen[name] = 1;
              files.push(name);
            }
          }
          // Sort descending by name (date in filename sorts naturally)
          files.sort().reverse();
          // Delete files beyond keep count
          for (var i = keepCount; i < files.length; i++) {
            try { await webdavRequest('edge-notes/' + files[i], 'DELETE'); } catch (e) { /* ignore */ }
          }
        } catch (e) { /* ignore cleanup errors */ }
      }

      function startAutoBackupTimer() {
        stopAutoBackupTimer();
        var cfg = getAutoBackupConfig();
        if (!cfg.enabled || !getWebdavConfig().url) return;
        // Check every 30 seconds
        autoBackupTimer = setInterval(async function () {
          var c = getAutoBackupConfig();
          if (shouldBackupNow(c)) {
            try {
              var data = await buildBackupData();
              var json = JSON.stringify(data, null, 2);
              await ensureBackupDir();
              // Save with date-time filename
              var now = new Date();
              var fname = 'edge-notes/backup-' + backupDateStr(now) + '-' + backupTimeStr(now) + '.json';
              await webdavRequest(fname, 'PUT', json, 'application/json');
              // Also update backup-latest.json for easy restore
              await webdavRequest('edge-notes/backup-latest.json', 'PUT', json, 'application/json');
              // Cleanup old backups
              await cleanupOldBackups(c.keepCount || 7);
              c.lastBackup = Date.now();
              saveAutoBackupConfig(c);
              updateAutoBackupInfo();
            } catch (e) { /* silent fail for auto backup */ }
          }
        }, 30 * 1000);
      }

      function stopAutoBackupTimer() {
        if (autoBackupTimer) { clearInterval(autoBackupTimer); autoBackupTimer = null; }
      }

      // ─── Share ────────────────────────────
      let currentShareNoteId = null;

      function openShareDialog(noteId) {
        currentShareNoteId = noteId;
        els.shareModal.classList.remove('hidden');
        loadShareLinks(noteId);
      }

      function closeShareDialog() {
        els.shareModal.classList.add('hidden');
        currentShareNoteId = null;
      }

      async function loadShareLinks(noteId) {
        try {
          const data = await api('/api/notes/' + encodeURIComponent(noteId) + '/shares');
          const shares = data.shares || [];
          els.shareLinks.innerHTML = '';
          if (!shares.length) {
            els.shareLinks.innerHTML = '<div class="muted" style="text-align:center; padding:12px;">暂无分享链接</div>';
            return;
          }
          shares.forEach(function (s) {
            const item = document.createElement('div');
            item.className = 'share-link-item';
            const url = window.location.origin + '/s/' + s.token;
            item.innerHTML = '<span class="share-link-url">' + url + '</span>';
            if (s.expires_at) {
              item.innerHTML += '<span class="share-link-exp">过期: ' + formatDate(s.expires_at) + '</span>';
            }
            const copyBtn = document.createElement('button');
            copyBtn.className = 'btn secondary small';
            copyBtn.textContent = '复制';
            copyBtn.onclick = async function () {
              await navigator.clipboard.writeText(url);
              setStatus('链接已复制');
            };
            const revokeBtn = document.createElement('button');
            revokeBtn.className = 'btn danger small';
            revokeBtn.textContent = '撤销';
            revokeBtn.onclick = async function () {
              await api('/api/shares/' + encodeURIComponent(s.token), { method: 'DELETE' });
              setStatus('已撤销分享');
              loadShareLinks(noteId);
            };
            item.appendChild(copyBtn);
            item.appendChild(revokeBtn);
            els.shareLinks.appendChild(item);
          });
        } catch (e) { setStatus(e.message || '加载分享链接失败'); }
      }

      // ─── Image Upload ─────────────────────
      async function uploadImage(file) {
        if (!file || !file.type.startsWith('image/')) { setStatus('请选择图片文件'); return; }
        if (file.size > 5 * 1024 * 1024) { setStatus('图片最大 5MB'); return; }
        setStatus('上传中…');
        try {
          const res = await fetch('/api/images/upload' + (state.editingId ? '?noteId=' + encodeURIComponent(state.editingId) : ''), {
            method: 'POST', credentials: 'same-origin',
            headers: { 'Content-Type': file.type },
            body: await file.arrayBuffer()
          });
          const data = await res.json();
          if (!data.ok) throw new Error(data.error || '上传失败');
          const mdImage = '![' + file.name + '](' + data.url + ')';
          const ta = els.editorContent;
          const pos = ta.selectionStart;
          ta.value = ta.value.slice(0, pos) + mdImage + '\n' + ta.value.slice(pos);
          ta.selectionStart = ta.selectionEnd = pos + mdImage.length + 1;
          ta.focus();
          setStatus('图片已插入');
        } catch (e) { setStatus(e.message || '上传失败'); }
      }

      // ─── Event Bindings ───────────────────
      els.loginBtn.onclick = async function () {
        try {
          const unlockOnly = state.sessionAuthenticated && !state.vaultUnlocked;
          els.loginStatus.textContent = unlockOnly ? '解锁中…' : '登录中…';
          const password = els.passwordInput.value.trim();
          if (!password) throw new Error('请输入密码');
          if (!unlockOnly) {
            await api('/api/login', {
              method: 'POST', headers: { 'content-type': 'application/json' },
              body: JSON.stringify({ password })
            });
          }
          state.sessionAuthenticated = true;
          await unlockVault(password);
          clearSensitiveInputs();
          showApp();
          setStatus(unlockOnly ? '已解锁' : '已登录并解锁');
          els.loginStatus.textContent = '';
        } catch (error) {
          state.vaultUnlocked = false; state.vaultKey = null;
          if (state.sessionAuthenticated) {
            state.unlockError = '当前密码无法解锁现有加密笔记';
            await refreshMeta(); showLogin();
          } else { showLogin(); }
          els.loginStatus.textContent = error.message || '登录失败';
        }
      };

      els.passwordInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') els.loginBtn.click(); });

      els.searchInput.addEventListener('input', function () {
        updateSearchUi();
        clearTimeout(state.searchTimer);
        // Search runs against already-decrypted notes, so it can be near-instant
        state.searchTimer = setTimeout(applyFilters, 120);
      });

      els.clearSearchBtn.onclick = function () {
        els.searchInput.value = ''; updateSearchUi();
        applyFilters();
      };

      els.newBtn.onclick = function () { openComposer(null); };
      els.editorTitle.addEventListener('input', scheduleAutoTag);
      els.editorContent.addEventListener('input', scheduleAutoTag);

      // ─── Sidebar navigation ──────────────
      function switchView(view) {
        els.sidebarItems.forEach(function (item) {
          item.classList.toggle('active', item.dataset.view === view);
        });
        const isSettings = view === 'settings';
        const isTrash = view === 'trash';
        els.settingsPanel.classList.toggle('hidden', !isSettings);
        els.trashView.classList.toggle('hidden', !isTrash);
        els.mainFeed.classList.toggle('hidden', isSettings || isTrash);
        if (isSettings) {
          state.showingTrash = false;
          loadWebdavConfigToUI();
          var abCfg = getAutoBackupConfig();
          els.autoBackupToggle.checked = !!abCfg.enabled;
          setSelectedDays(abCfg.days || [1,2,3,4,5]);
          els.autoBackupTime.value = abCfg.time || '03:00';
          els.autoBackupKeep.value = String(abCfg.keepCount || 7);
          updateAutoBackupInfo();
        } else if (isTrash) {
          state.showingTrash = true;
          loadTrash();
        } else {
          state.showingTrash = false;
          if (state.activeTagFilter) {
            const tag = getTagById(state.activeTagFilter);
            els.feedDesc.textContent = tag ? ('标签: ' + tag.name) : '全部笔记';
          } else {
            els.feedDesc.textContent = '按更新时间排序，支持搜索和标签筛选。';
          }
        }
      }
      els.sidebarItems.forEach(function (item) {
        item.onclick = function () { switchView(item.dataset.view); };
      });

      els.logoutBtn.onclick = async function () {
        await api('/api/logout', { method: 'POST' });
        state.notes = []; state.allNotes = []; state.tags = [];
        state.sessionAuthenticated = false; state.vaultUnlocked = false; state.vaultKey = null;
        state.noteCountMeta = 0; state.activeTagFilter = null;
        closeComposer();
        switchView('notes');
        clearSensitiveInputs(); state.unlockError = '';
        showLogin(); setStatus('');
      };

      els.closeModalBtn.onclick = closeComposer;
      els.cancelBtn.onclick = closeComposer;
      els.saveBtn.onclick = function () { saveComposer().catch(function (e) { setStatus(e.message || '保存失败'); }); };

      // One-click clear of all selected tags in the editor
      els.clearTagBtn.onclick = function () {
        setEditorTagSelection([]);
        setStatus('已清除全部标签');
      };

      els.themeToggleBtn.onclick = toggleTheme;

      els.addTagBtn.onclick = async function () {
        const name = els.newTagInput.value.trim();
        if (!name) return;
        await api('/api/tags', {
          method: 'POST', headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ name, color: els.newTagColor.value })
        });
        els.newTagInput.value = '';
        await refreshTags();
        setStatus('标签已创建');
      };

      els.newTagInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') els.addTagBtn.click(); });

      els.editorPinBtn.onclick = async function () {
        if (!state.editingId) { setStatus('请先保存笔记后再置顶'); return; }
        await api('/api/notes/' + encodeURIComponent(state.editingId) + '/pin', { method: 'PUT' });
        await refreshNotes();
        setStatus('置顶状态已更新');
      };

      els.editorShareBtn.onclick = function () {
        if (!state.editingId) { setStatus('请先保存笔记后再分享'); return; }
        openShareDialog(state.editingId);
      };

      els.editorExportBtn.onclick = function () {
        if (!state.editingId) { setStatus('请先保存笔记后再导出'); return; }
        const note = state.allNotes.find(function (n) { return n.id === state.editingId; });
        if (note) exportSingleNote(note);
      };

      els.insertImageBtn.onclick = function () {
        els.imageUploadArea.classList.toggle('hidden');
      };

      els.imageUploadArea.onclick = function () { els.imageFileInput.click(); };
      els.imageFileInput.onchange = function () {
        if (els.imageFileInput.files.length) uploadImage(els.imageFileInput.files[0]);
        els.imageFileInput.value = '';
      };

      els.imageUploadArea.addEventListener('dragover', function (e) { e.preventDefault(); els.imageUploadArea.style.borderColor = 'var(--accent)'; });
      els.imageUploadArea.addEventListener('dragleave', function () { els.imageUploadArea.style.borderColor = ''; });
      els.imageUploadArea.addEventListener('drop', function (e) {
        e.preventDefault(); els.imageUploadArea.style.borderColor = '';
        if (e.dataTransfer.files.length) uploadImage(e.dataTransfer.files[0]);
      });

      els.closeShareBtn.onclick = closeShareDialog;
      els.createShareBtn.onclick = async function () {
        if (!currentShareNoteId) return;
        const expiry = els.shareExpiry.value;
        const body = expiry ? { expiresAt: Date.now() + parseInt(expiry) } : {};
        await api('/api/notes/' + encodeURIComponent(currentShareNoteId) + '/share', {
          method: 'POST', headers: { 'content-type': 'application/json' },
          body: JSON.stringify(body)
        });
        setStatus('分享链接已创建');
        loadShareLinks(currentShareNoteId);
      };

      // ─── Settings Event Listeners ─────────
      els.webdavSaveBtn.onclick = function () {
        saveWebdavConfig({
          url: els.webdavUrl.value.trim(),
          user: els.webdavUser.value.trim(),
          pass: els.webdavPass.value,
          lastBackup: getWebdavConfig().lastBackup || null,
        });
        els.webdavStatus.textContent = '✓ 配置已保存';
        els.webdavStatus.style.color = 'var(--accent)';
        setTimeout(function () { els.webdavStatus.textContent = ''; }, 2000);
        setStatus('WebDAV 配置已保存');
      };

      els.webdavTestBtn.onclick = async function () {
        // Save first, then test
        saveWebdavConfig({
          url: els.webdavUrl.value.trim(),
          user: els.webdavUser.value.trim(),
          pass: els.webdavPass.value,
          lastBackup: getWebdavConfig().lastBackup || null,
        });
        els.webdavTestBtn.disabled = true;
        els.webdavTestBtn.textContent = '测试中…';
        try {
          await webdavTestConnection();
          els.webdavStatus.textContent = '✓ 连接成功';
          els.webdavStatus.style.color = 'var(--accent)';
          setStatus('WebDAV 连接成功');
        } catch (e) {
          els.webdavStatus.textContent = '✗ ' + e.message;
          els.webdavStatus.style.color = 'var(--danger)';
          setStatus('连接失败: ' + e.message);
        } finally {
          els.webdavTestBtn.disabled = false;
          els.webdavTestBtn.textContent = '测试连接';
        }
      };

      els.webdavBackupBtn.onclick = function () { backupToWebdav(); };
      els.webdavRestoreBtn.onclick = function () { restoreFromWebdav(); };
      els.fileImportBtn.onclick = function () { triggerFileImport(); };
      els.importFileInput.onchange = function () {
        if (els.importFileInput.files.length) handleFileImport(els.importFileInput.files[0]);
        els.importFileInput.value = '';
      };
      els.closeImportModalBtn.onclick = function () { els.importModal.classList.add('hidden'); };
      els.confirmImportBtn.onclick = function () { confirmImport(); };

      // Export buttons in settings
      els.exportJsonBtn.onclick = function () { exportAllNotes('json'); };
      els.exportMdBtn.onclick = function () { exportAllNotes('markdown'); };

      // Auto backup controls
      function saveAbConfigFromUI() {
        var cfg = getAutoBackupConfig();
        cfg.enabled = els.autoBackupToggle.checked;
        cfg.days = getSelectedDays();
        cfg.time = els.autoBackupTime.value || '03:00';
        cfg.keepCount = parseInt(els.autoBackupKeep.value) || 7;
        saveAutoBackupConfig(cfg);
        if (cfg.enabled) startAutoBackupTimer(); else stopAutoBackupTimer();
        updateAutoBackupInfo();
      }
      els.autoBackupToggle.onchange = saveAbConfigFromUI;
      els.autoBackupTime.onchange = saveAbConfigFromUI;
      els.autoBackupKeep.onchange = saveAbConfigFromUI;
      // Delegate day chip clicks
      els.autoBackupDays.addEventListener('change', function (e) {
        if (e.target.tagName === 'INPUT') {
          e.target.closest('.day-chip').classList.toggle('active', e.target.checked);
        }
        saveAbConfigFromUI();
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          if (!els.importModal.classList.contains('hidden')) { els.importModal.classList.add('hidden'); return; }
          if (!els.shareModal.classList.contains('hidden')) { closeShareDialog(); return; }
          if (els.editorPanel.classList.contains('open')) { closeComposer(); return; }
          if (!els.settingsPanel.classList.contains('hidden')) { switchView('notes'); return; }
          if (!els.trashView.classList.contains('hidden')) { switchView('notes'); return; }
        }
        const isSave = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's';
        if (isSave && els.editorPanel.classList.contains('open')) {
          e.preventDefault();
          saveComposer().catch(function (err) { setStatus(err.message || '保存失败'); });
        }
      });

      // ─── Init ─────────────────────────────
      updateSearchUi(); updateModalUi();
      checkSession().catch(function () { showLogin(); });
      startAutoBackupTimer();
    