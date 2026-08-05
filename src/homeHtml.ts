export const blogHomeHtml = `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Edge Notes</title>
    <meta name="theme-color" content="#6366f1" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content="我的笔记" />
    <meta name="description" content="一个部署在 Cloudflare Workers 上的简洁私人笔记。" />
    <link rel="manifest" href="/manifest.webmanifest" />
    <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Cpath d='M32 4L58 32L32 60L6 32Z' fill='%236366f1'/%3E%3Cpath d='M32 4L58 32L32 34Z' fill='%23818cf8'/%3E%3Cpath d='M32 4L6 32L32 34Z' fill='%234f46e5'/%3E%3C/svg%3E" />
    <style>
      :root, [data-theme="light"] {
        color-scheme: light;
        --bg: #f5f5f5;
        --panel: #ffffff;
        --panel-border: #e5e7eb;
        --border: #e5e7eb;
        --panel-bg: #ffffff;
        --primary: #6366f1;
        --text: #111827;
        --muted: #6b7280;
        --accent: #6366f1;
        --accent-2: #4f46e5;
        --danger: #ef4444;
        --shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
        --card-bg: rgba(255,255,255,0.05);
        --tag-bg: #eef2ff;
        --tag-text: #4338ca;
        --pin-bg: #fff3e0;
        --pin-border: #ffe0b2;
        --trash-bg: #ffebee;
        --input-bg: #fff;
        --highlight-bg: rgba(99,102,241,0.08);
      }
      [data-theme="dark"] {
        color-scheme: dark;
        --bg: #09111f;
        --panel: rgba(15, 23, 42, 0.78);
        --panel-border: rgba(148, 163, 184, 0.18);
        --border: rgba(148, 163, 184, 0.18);
        --panel-bg: rgba(15, 23, 42, 0.78);
        --primary: #7c93ff;
        --text: #e5eefb;
        --muted: #8aa0c2;
        --accent: #7c93ff;
        --accent-2: #a78bfa;
        --danger: #ef4444;
        --shadow: 0 28px 80px rgba(0, 0, 0, 0.35);
        --card-bg: rgba(255,255,255,0.05);
        --tag-bg: rgba(124,147,255,0.15);
        --tag-text: #a78bfa;
        --pin-bg: rgba(255,152,0,0.12);
        --pin-border: rgba(255,152,0,0.3);
        --trash-bg: rgba(239,68,68,0.1);
        --input-bg: rgba(9,17,31,0.76);
        --highlight-bg: rgba(124,147,255,0.2);
      }
      @media (prefers-color-scheme: dark) {
        :root:not([data-theme="light"]) {
          color-scheme: dark;
          --bg: #09111f;
          --panel: rgba(15, 23, 42, 0.78);
          --panel-border: rgba(148, 163, 184, 0.18);
          --border: rgba(148, 163, 184, 0.18);
          --panel-bg: rgba(15, 23, 42, 0.78);
          --primary: #7c93ff;
          --text: #e5eefb;
          --muted: #8aa0c2;
          --accent: #7c93ff;
          --accent-2: #a78bfa;
          --danger: #ef4444;
          --shadow: 0 28px 80px rgba(0, 0, 0, 0.35);
          --card-bg: rgba(255,255,255,0.05);
          --tag-bg: rgba(124,147,255,0.15);
          --tag-text: #a78bfa;
          --pin-bg: rgba(255,152,0,0.12);
          --pin-border: rgba(255,152,0,0.3);
          --trash-bg: rgba(239,68,68,0.1);
          --input-bg: rgba(9,17,31,0.76);
          --highlight-bg: rgba(124,147,255,0.2);
        }
      }
      * { box-sizing: border-box; }
      html { scroll-behavior: smooth; -webkit-tap-highlight-color: transparent; }
      body {
        margin: 0;
        color: var(--text);
        font: 14px/1.6 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: var(--bg);
        -webkit-font-smoothing: antialiased;
        overscroll-behavior-y: contain;
        transition: background 0.3s, color 0.3s;
      }
      button, input, textarea { font: inherit; }
      .hidden { display: none !important; }
      .app-shell { display: flex; height: 100vh; overflow: hidden; max-width: none; padding: 0; margin: 0; }

      /* ─── Sidebar ─────────────────────── */
      .sidebar {
        width: 220px; min-width: 220px; height: 100vh;
        display: flex; flex-direction: column;
        background: var(--panel);
        border-right: 1px solid var(--panel-border);
        overflow-y: auto;
      }
      .sidebar-brand {
        padding: 20px 18px 16px;
        display: flex; align-items: center; gap: 10px;
        font-size: 17px; font-weight: 800; letter-spacing: -0.5px;
        color: var(--text);
        border-bottom: 1px solid var(--panel-border);
      }
      .sidebar-brand svg { width: 24px; height: 24px; flex-shrink: 0; }
      .sidebar-nav { padding: 10px 8px; flex: 1; }
      .sidebar-section-title {
        font-size: 11px; font-weight: 700; color: var(--muted);
        text-transform: uppercase; letter-spacing: 0.8px;
        padding: 12px 10px 6px;
      }
      .sidebar-item {
        display: flex; align-items: center; gap: 10px;
        padding: 9px 12px; border-radius: 8px;
        color: var(--text); font-size: 13px; font-weight: 500;
        cursor: pointer; transition: all 0.15s;
        text-decoration: none; border: none; background: none; width: 100%;
        text-align: left;
      }
      .sidebar-item:hover { background: var(--highlight-bg); }
      .sidebar-item.active {
        background: var(--highlight-bg);
        color: var(--primary); font-weight: 600;
        box-shadow: inset 3px 0 0 var(--primary);
      }
      .sidebar-item .icon { width: 18px; text-align: center; font-size: 14px; }
      .sidebar-tags {
        padding: 0 8px 8px;
        border-top: 1px solid var(--panel-border);
      }
      .sidebar-tag-list { display: flex; flex-direction: column; gap: 2px; }
      .sidebar-tag-item {
        display: flex; align-items: center; gap: 8px;
        padding: 7px 12px; border-radius: 8px;
        font-size: 13px; cursor: pointer; transition: all 0.15s;
        color: var(--text);
      }
      .sidebar-tag-item:hover { background: var(--highlight-bg); }
      .sidebar-tag-item.active { background: var(--highlight-bg); color: var(--primary); font-weight: 600; }
      .sidebar-tag-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
      .tag-count {
        margin-left: auto; font-size: 11px; line-height: 1;
        color: var(--text-dim); background: var(--highlight-bg);
        border-radius: 8px; padding: 3px 6px; flex-shrink: 0;
      }
      .sidebar-footer {
        padding: 10px 8px;
        border-top: 1px solid var(--panel-border);
      }
      .sidebar-tag-add {
        display: flex; gap: 4px; padding: 4px 8px;
      }
      .sidebar-tag-add .input { flex: 1; padding: 5px 8px; font-size: 12px; border-radius: 6px; }
      .sidebar-tag-add .btn { padding: 5px 8px; font-size: 11px; border-radius: 6px; }

      /* ─── Main Content ────────────────── */
      .main-content {
        flex: 1; display: flex; flex-direction: column;
        height: 100vh; overflow: hidden;
        background: var(--bg);
        position: relative;
      }
      .content-header {
        display: flex; align-items: center; gap: 10px;
        padding: 14px 20px;
        border-bottom: 1px solid var(--panel-border);
        background: var(--bg);
        flex-shrink: 0;
      }
      .content-header .search-box { flex: 1; max-width: 360px; }
      .content-header .search-box .input { padding: 9px 14px; border-radius: 10px; }
      .content-body {
        flex: 1; overflow-y: auto; padding: 16px 20px;
      }
      .feed { padding: 0; }
      .section-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
      .section-title { margin: 0; font-size: 16px; font-weight: 700; }
      .section-desc { margin: 2px 0 0; color: var(--muted); font-size: 12px; }

      /* ─── Editor Panel ────────────────── */
      .editor-panel {
        position: absolute; top: 0; right: 0; bottom: 0;
        width: 480px; max-width: 100%;
        background: var(--panel);
        border-left: 1px solid var(--panel-border);
        display: flex; flex-direction: column;
        transform: translateX(100%);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 25;
        box-shadow: -8px 0 30px rgba(0,0,0,0.08);
      }
      .editor-panel.open { transform: translateX(0); }
      .editor-head {
        display: flex; justify-content: space-between; align-items: center;
        padding: 16px 20px;
        border-bottom: 1px solid var(--panel-border);
        flex-shrink: 0;
      }
      .editor-head h3 { margin: 0; font-size: 15px; font-weight: 700; }
      .editor-head .section-desc { margin: 2px 0 0; color: var(--muted); font-size: 12px; }
      .btn-icon {
        background: none; border: none; cursor: pointer;
        font-size: 18px; color: var(--muted); padding: 4px 8px;
        border-radius: 6px; transition: all 0.15s;
      }
      .btn-icon:hover { background: var(--highlight-bg); color: var(--text); }
      .editor-body { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 12px; }
      .editor-title-input {
        width: 100%; padding: 8px 0; border: none; border-bottom: 2px solid var(--panel-border);
        background: transparent; color: var(--text);
        font-size: 20px; font-weight: 700; outline: none;
        transition: border-color 0.2s;
      }
      .editor-title-input:focus { border-bottom-color: var(--primary); }
      .editor-title-input::placeholder { color: var(--muted); opacity: 0.5; }
      .editor-toolbar {
        display: flex; gap: 6px; flex-wrap: wrap; align-items: center;
      }
      .editor-textarea {
        flex: 1; min-height: 200px; width: 100%;
        padding: 12px 0; border: none; background: transparent;
        color: var(--text); font-size: 14px; line-height: 1.7;
        outline: none; resize: none;
      }
      .editor-textarea::placeholder { color: var(--muted); opacity: 0.5; }
      .editor-tags { display: flex; gap: 4px; flex-wrap: wrap; }
      .editor-actions {
        display: flex; gap: 8px; justify-content: flex-end;
        padding: 14px 20px;
        border-top: 1px solid var(--panel-border);
        flex-shrink: 0;
      }
      .card {
        background: var(--panel);
        border: 1px solid var(--panel-border);
        border-radius: 18px;
        box-shadow: var(--shadow);
        backdrop-filter: blur(18px);
        transition: background 0.3s, border-color 0.3s;
      }
      .login-wrap {
        position: fixed; inset: 0; z-index: 100;
        display: flex; flex-direction: column;
        min-height: 100vh;
        background: #0a0a0a;
        overflow: hidden;
      }
      .login-wrap::before {
        content: '';
        position: absolute; inset: 0;
        background:
          linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px);
        background-size: 60px 60px;
        pointer-events: none;
      }
      .login-wrap::after {
        content: '';
        position: absolute;
        top: -200px; left: 50%; transform: translateX(-50%);
        width: 800px; height: 500px;
        background: radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, transparent 70%);
        pointer-events: none;
        animation: loginGlow 6s ease-in-out infinite alternate;
      }
      @keyframes loginGlow {
        0% { opacity: 0.5; transform: translateX(-50%) scale(1); }
        100% { opacity: 1; transform: translateX(-50%) scale(1.1); }
      }
      .login-topbar {
        position: relative; z-index: 2;
        display: flex; align-items: center; justify-content: space-between;
        padding: 20px 40px;
      }
      .login-brand {
        display: flex; align-items: center; gap: 10px;
        color: #fff; font-weight: 700; font-size: 16px;
        letter-spacing: -0.3px;
      }
      .login-brand svg { width: 28px; height: 28px; }
      .login-console-btn {
        padding: 8px 20px; border-radius: 8px;
        border: 1px solid rgba(255,255,255,0.15);
        background: transparent; color: #fff;
        font-size: 13px; font-weight: 500;
        cursor: pointer; transition: all 0.2s;
      }
      .login-console-btn:hover {
        background: rgba(255,255,255,0.08);
        border-color: rgba(255,255,255,0.3);
      }
      .login-content {
        position: relative; z-index: 2;
        flex: 1; display: flex; flex-direction: column; justify-content: center;
        padding: 0 40px; max-width: 640px; width: 100%;
        align-self: center;
      }
      .login-badge {
        display: inline-flex; align-items: center; gap: 8px;
        padding: 6px 16px; border-radius: 999px;
        border: 1px solid rgba(99,102,241,0.3);
        background: rgba(99,102,241,0.08);
        color: #818cf8; font-size: 13px; font-weight: 500;
        margin-bottom: 28px; width: fit-content;
      }
      .login-badge-dot {
        width: 6px; height: 6px; border-radius: 50%;
        background: #6366f1;
        animation: badgePulse 2s ease-in-out infinite;
      }
      @keyframes badgePulse {
        0%, 100% { opacity: 0.5; } 50% { opacity: 1; }
      }
      .login-title {
        margin: 0 0 8px; font-size: 56px; font-weight: 800;
        color: #fff; letter-spacing: -1.5px; line-height: 1.1;
      }
      .login-subtitle {
        margin: 0 0 16px; font-size: 22px; font-weight: 600;
        color: rgba(255,255,255,0.9); letter-spacing: -0.3px;
      }
      .login-desc {
        margin: 0 0 36px; color: rgba(255,255,255,0.45);
        font-size: 15px; line-height: 1.7; max-width: 480px;
      }
      .login-form { display: flex; flex-direction: column; gap: 16px; max-width: 380px; }
      .login-input-wrap { position: relative; }
      .login-input-wrap .input {
        width: 100%; padding: 14px 18px; border-radius: 10px;
        border: 1px solid rgba(255,255,255,0.12);
        background: rgba(255,255,255,0.05);
        color: #fff; font-size: 15px;
        outline: none; transition: all 0.2s;
      }
      .login-input-wrap .input::placeholder { color: rgba(255,255,255,0.3); }
      .login-input-wrap .input:focus {
        border-color: rgba(99,102,241,0.5);
        box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
        background: rgba(255,255,255,0.07);
      }
      .login-input-icon {
        position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
        color: rgba(255,255,255,0.3); font-size: 16px; pointer-events: none;
      }
      .login-input-wrap .input { padding-left: 44px; }
      .login-btn {
        width: 100%; padding: 14px 24px; border-radius: 10px;
        border: 1px solid rgba(99,102,241,0.4);
        background: linear-gradient(135deg, rgba(99,102,241,0.15), rgba(79,70,229,0.15));
        color: #fff; font-size: 15px; font-weight: 600;
        cursor: pointer; transition: all 0.25s;
        position: relative; overflow: hidden;
      }
      .login-btn::before {
        content: ''; position: absolute; inset: 0;
        background: linear-gradient(135deg, rgba(99,102,241,0.3), rgba(79,70,229,0.3));
        opacity: 0; transition: opacity 0.25s;
      }
      .login-btn:hover::before { opacity: 1; }
      .login-btn:hover {
        border-color: rgba(99,102,241,0.6);
        box-shadow: 0 0 30px rgba(99,102,241,0.15);
        transform: translateY(-1px);
      }
      .login-btn:active { transform: scale(0.98); }
      .login-btn span { position: relative; z-index: 1; }
      .unlock-badge {
        display: inline-flex; align-items: center; gap: 6px;
        padding: 5px 12px; border-radius: 999px;
        background: rgba(99,102,241,0.1); color: #818cf8;
        font-size: 12px; font-weight: 600; margin-bottom: 12px;
        border: 1px solid rgba(99,102,241,0.2);
      }
      .app-dimmed { filter: blur(1px); pointer-events: none; user-select: none; }
      @media (max-width: 640px) {
        .login-topbar { padding: 16px 20px; }
        .login-content { padding: 0 20px; }
        .login-title { font-size: 36px; }
        .login-subtitle { font-size: 18px; }
        .login-desc { font-size: 14px; }
      }
      .field-stack { margin-bottom: 12px; }
      .field-label { display: block; font-size: 12px; font-weight: 600; color: var(--muted); margin-bottom: 4px; }
      .input {
        width: 100%; padding: 11px 14px; border-radius: 14px;
        border: 1px solid var(--panel-border); background: var(--input-bg);
        color: var(--text); outline: none; transition: border-color 0.2s, box-shadow 0.2s;
      }
      .input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--highlight-bg); }
      .textarea {
        width: 100%; min-height: 260px; padding: 12px 14px; border-radius: 14px;
        border: 1px solid var(--panel-border); background: var(--input-bg);
        color: var(--text); outline: none; resize: vertical; line-height: 1.6;
        transition: border-color 0.2s;
      }
      .textarea:focus { border-color: var(--accent); }
      .btn {
        display: inline-flex; align-items: center; justify-content: center; gap: 6px;
        padding: 9px 16px; border-radius: 12px; border: none; cursor: pointer;
        font-weight: 600; font-size: 13px; transition: all 0.2s;
        background: linear-gradient(135deg, var(--accent), var(--accent-2));
        color: #fff; box-shadow: 0 4px 12px rgba(99,102,241,0.2);
      }
      .btn:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(99,102,241,0.3); }
      .btn:active { transform: scale(0.97); }
      .btn.secondary { background: var(--card-bg); color: var(--text); box-shadow: none; border: 1px solid var(--panel-border); }
      .btn.secondary:hover { background: var(--highlight-bg); }
      .btn.danger { background: rgba(239,68,68,0.12); color: var(--danger); box-shadow: none; }
      .btn.danger:hover { background: rgba(239,68,68,0.2); }
      .btn.small { padding: 5px 10px; font-size: 12px; border-radius: 8px; }
      .btn.icon-btn { padding: 6px 8px; font-size: 16px; min-width: 32px; }
      .content-header .new-btn { flex-shrink: 0; }
      .search-box { position: relative; flex: 1; min-width: 160px; max-width: 320px; }
      .search-box .input { padding-right: 32px; }
      .clear-search {
        position: absolute; right: 8px; top: 50%; transform: translateY(-50%);
        background: none; border: none; color: var(--muted); cursor: pointer;
        font-size: 16px; padding: 2px 4px; opacity: 0; pointer-events: none; transition: opacity 0.2s;
      }
      .clear-search.show { opacity: 1; pointer-events: auto; }
      .status-line {
        position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
        padding: 8px 18px; border-radius: 999px;
        background: var(--panel); border: 1px solid var(--panel-border);
        box-shadow: var(--shadow); font-size: 13px; color: var(--muted);
        opacity: 0; pointer-events: none; transition: opacity 0.3s;
        z-index: 50; white-space: nowrap;
      }
      .status-line.show { opacity: 1; }
      .vault-panel { padding: 24px; margin-bottom: 16px; }
      .vault-panel-title { margin: 0 0 8px; font-size: 18px; }
      .vault-panel-desc { margin: 0 0 14px; color: var(--muted); font-size: 13px; }
      .vault-panel-actions { margin-top: 12px; }
      .layout { display: flex; flex-direction: column; gap: 16px; }
      .feed { padding: 18px; }
      .section-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
      .section-title { margin: 0; font-size: 18px; font-weight: 700; }
      .section-desc { margin: 4px 0 0; color: var(--muted); font-size: 12px; }
      .muted { color: var(--muted); font-size: 13px; }
      .note-list { display: flex; flex-direction: column; gap: 8px; }
      .group-block { margin-bottom: 8px; }
      .group-title {
        font-size: 12px; font-weight: 700; color: var(--muted);
        text-transform: uppercase; letter-spacing: 0.5px;
        padding: 8px 0 4px; border-bottom: 1px solid var(--panel-border);
        margin-bottom: 8px;
      }
      .note-card {
        padding: 14px; border-radius: 12px;
        border: 1px solid var(--panel-border); background: var(--panel);
        transition: all 0.15s; cursor: default;
        box-shadow: 0 1px 3px rgba(0,0,0,0.04);
      }
      .note-card:hover { border-color: var(--accent); box-shadow: 0 2px 8px rgba(99,102,241,0.08); }
      .note-card.is-pinned { border-color: var(--pin-border); background: var(--pin-bg); }
      .note-card-meta { display: flex; justify-content: space-between; font-size: 11px; color: var(--muted); margin-bottom: 6px; }
      .note-card-title { font-weight: 700; font-size: 15px; margin-bottom: 4px; }
      .note-card-text { font-size: 13px; color: var(--muted); line-height: 1.5; white-space: pre-wrap; word-break: break-word; }
      .note-card-text.is-empty { font-style: italic; }
      .note-card-text-wrap.collapsed { max-height: 120px; overflow: hidden; position: relative; }
      .note-card-text-wrap.collapsed::after {
        content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 40px;
        background: linear-gradient(transparent, var(--panel));
      }
      .note-expand { margin-top: 8px; }
      .note-actions { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 8px; }
      .note-tags { display: flex; gap: 4px; flex-wrap: wrap; margin-top: 6px; }
      .tag-pill {
        display: inline-flex; align-items: center; gap: 3px;
        padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 600;
        background: var(--tag-bg); color: var(--tag-text);
      }
      .tag-pill .tag-dot { width: 6px; height: 6px; border-radius: 50%; }
      .empty-feed { padding: 32px; text-align: center; color: var(--muted); border: 1px dashed var(--panel-border); border-radius: 14px; }
      .modal-backdrop {
        position: fixed; inset: 0; z-index: 30;
        background: rgba(0,0,0,0.4); backdrop-filter: blur(4px);
        display: grid; place-items: center; padding: 16px;
      }
      .modal-card { width: min(560px, 100%); max-height: 90vh; overflow-y: auto; padding: 24px; }
      .modal-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
      .modal-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 14px; }
      .search-highlight { background: var(--highlight-bg); border-radius: 2px; padding: 0 2px; }

      /* Tag management */
      .tag-manager { padding: 14px; margin-bottom: 12px; }
      .tag-manager-title { font-size: 14px; font-weight: 700; margin-bottom: 10px; }
      .tag-list { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px; }
      .tag-item {
        display: inline-flex; align-items: center; gap: 4px;
        padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 600;
        border: 1px solid var(--panel-border); background: var(--card-bg); cursor: pointer;
        transition: all 0.2s;
      }
      .tag-item:hover { border-color: var(--accent); }
      .tag-item.active { border-color: var(--accent); background: var(--highlight-bg); }
      .tag-item .tag-del { font-size: 14px; color: var(--danger); margin-left: 2px; cursor: pointer; }
      .tag-add-row { display: flex; gap: 6px; }
      .tag-add-row .input { flex: 1; padding: 6px 10px; font-size: 12px; }
      .tag-color-input { width: 32px; height: 32px; border: none; border-radius: 8px; cursor: pointer; padding: 0; }

      /* Settings panel */
      .settings-panel { padding: 20px; margin-bottom: 12px; }
      .settings-section { margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid var(--border); }
      .settings-section:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
      .settings-section-title { font-size: 14px; font-weight: 700; margin-bottom: 12px; }
      .settings-form { display: flex; flex-direction: column; gap: 10px; }
      .settings-field label { display: block; font-size: 12px; color: var(--muted); margin-bottom: 4px; font-weight: 500; }
      .settings-field .input { width: 100%; padding: 8px 12px; font-size: 13px; }
      .settings-field-row { display: flex; gap: 10px; }
      .settings-field-row .settings-field { flex: 1; }
      .settings-actions { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
      .settings-status { font-size: 12px; margin-left: 8px; }
      .settings-info { font-size: 12px; color: var(--muted); margin-top: 8px; }
      .import-dialog { padding: 24px; width: min(520px, 100%); }
      .import-preview { font-size: 13px; line-height: 1.8; }
      .import-preview .import-stat { display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid var(--border); }
      .import-preview .import-stat:last-child { border-bottom: none; }

      /* Toggle switch */
      .toggle { position: relative; display: inline-block; width: 48px; height: 26px; cursor: pointer; }
      .toggle input { opacity: 0; width: 0; height: 0; }
      .toggle-slider {
        position: absolute; top: 0; left: 0; right: 0; bottom: 0;
        background: #94a3b8; border-radius: 26px; transition: .3s;
      }
      .toggle-slider::before {
        content: ''; position: absolute; height: 20px; width: 20px;
        left: 3px; bottom: 3px; background: #fff; border-radius: 50%; transition: .3s;
        box-shadow: 0 1px 3px rgba(0,0,0,.2);
      }
      .toggle input:checked + .toggle-slider { background: #22c55e; }
      .toggle input:checked + .toggle-slider::before { transform: translateX(22px); }
      .toggle-lg { width: 52px; height: 28px; }
      .toggle-lg .toggle-slider::before { height: 22px; width: 22px; }
      .toggle-lg input:checked + .toggle-slider::before { transform: translateX(24px); }
      .toggle-row { display: flex; align-items: center; gap: 10px; margin-top: 4px; }
      .toggle-label { font-size: 13px; font-weight: 600; color: var(--muted); }
      .toggle-label.on { color: var(--primary); }
      /* Day-of-week chips */
      .day-row { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 4px; }
      .day-chip {
        display: inline-flex; align-items: center; justify-content: center;
        width: 36px; height: 32px; border-radius: 8px; cursor: pointer;
        border: 1.5px solid var(--border); background: var(--panel-bg);
        font-size: 13px; font-weight: 600; transition: .2s; user-select: none;
      }
      .day-chip input { display: none; }
      .day-chip.active {
        background: var(--primary); color: #fff; border-color: var(--primary);
      }

      /* Share dialog */
      .share-dialog { padding: 24px; width: min(480px, 100%); }
      .share-link-item {
        display: flex; align-items: center; gap: 8px; padding: 8px 0;
        border-bottom: 1px solid var(--panel-border); font-size: 13px;
      }
      .share-link-item:last-child { border-bottom: none; }
      .share-link-url { flex: 1; word-break: break-all; color: var(--accent); font-family: monospace; font-size: 12px; }
      .share-link-exp { color: var(--muted); font-size: 11px; }

      /* Image upload */
      .image-upload-area {
        border: 2px dashed var(--panel-border); border-radius: 12px;
        padding: 16px; text-align: center; color: var(--muted);
        cursor: pointer; transition: border-color 0.2s; margin-top: 8px;
      }
      .image-upload-area:hover { border-color: var(--accent); }
      .image-preview { max-width: 100%; border-radius: 8px; margin: 8px 0; }

      @media (max-width: 768px) {
        .sidebar { display: none; }
        .mobile-bottom-bar {
          display: flex !important;
          position: fixed; bottom: 0; left: 0; right: 0;
          background: var(--panel); border-top: 1px solid var(--panel-border);
          z-index: 30; padding: 6px 0 env(safe-area-inset-bottom, 6px);
          justify-content: space-around;
        }
        .mobile-bottom-bar .sidebar-item { flex-direction: column; gap: 2px; font-size: 10px; padding: 6px 12px; }
        .mobile-bottom-bar .sidebar-item .icon { font-size: 18px; }
        .editor-panel { width: 100%; }
        .content-header { padding: 12px 14px; }
        .content-body { padding: 12px 14px; }
      }
      .mobile-bottom-bar { display: none; }
      @media (max-width: 640px) {
        .note-actions { gap: 4px; }
        .note-actions .btn { padding: 6px 10px; font-size: 11px; }
        /* Login mobile */
        .login-content { padding: 0 20px; }
        .login-title { font-size: 36px !important; }
        .login-subtitle { font-size: 18px !important; }
        .login-form { max-width: 100%; }
      }
    </style>
  </head>
  <body>
    <div class="page">
      <section id="loginView" class="login-wrap hidden">
        <div class="login-topbar">
          <div class="login-brand">
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M32 4L58 32L32 60L6 32Z" fill="#6366f1"/>
              <path d="M32 4L58 32L32 34Z" fill="#818cf8"/>
              <path d="M32 4L6 32L32 34Z" fill="#4f46e5"/>
            </svg>
            Edge Notes
          </div>
          <div id="unlockBadge" class="unlock-badge hidden">🔒 已通过访问验证</div>
        </div>
        <div class="login-content">
          <!-- Static content (shown on first login) -->
          <div id="loginStaticContent">
            <div class="login-badge">
              <div class="login-badge-dot"></div>
              End-to-End Encrypted
            </div>
            <h1 class="login-title">Edge Notes</h1>
            <div class="login-subtitle">端到端加密私人笔记</div>
            <p class="login-desc">在浏览器本地加密后上传，服务端只存储密文。输入密码即可进入你的私密笔记空间。</p>
          </div>
          <!-- Checking state content (shown briefly on page load) -->
          <h1 id="loginTitle" class="login-title" style="display:none"></h1>
          <p id="loginDesc" class="login-desc" style="display:none"></p>
          <div class="login-form">
            <div class="login-input-wrap">
              <span class="login-input-icon">🔑</span>
              <input id="passwordInput" class="input" type="password" placeholder="输入访问密码" />
            </div>
            <button id="loginBtn" class="login-btn"><span>进入笔记</span></button>
            <div id="passwordHelp" style="color:rgba(255,255,255,0.3); font-size:12px; text-align:center;">同一个密码同时用于访问站点和本地解密</div>
            <div id="loginStatus" style="color:rgba(255,255,255,0.5); font-size:13px; text-align:center;"></div>
          </div>
        </div>
      </section>

      <section id="appView" class="hidden">
        <div class="app-shell">

          <!-- ─── Sidebar ───────────────────── -->
          <aside class="sidebar">
            <div class="sidebar-brand">
              <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M32 4L58 32L32 60L6 32Z" fill="#6366f1"/>
                <path d="M32 4L58 32L32 34Z" fill="#818cf8"/>
                <path d="M32 4L6 32L32 34Z" fill="#4f46e5"/>
              </svg>
              Edge Notes
            </div>

            <nav class="sidebar-nav">
              <div class="sidebar-item active" data-view="notes"><span class="icon">📝</span>全部笔记</div>
              <div class="sidebar-item" data-view="trash"><span class="icon">🗑️</span>回收站</div>
              <div class="sidebar-item" data-view="settings"><span class="icon">⚙️</span>设置与备份</div>
            </nav>

            <div class="sidebar-tags">
              <div class="sidebar-section-title">标签</div>
              <div id="sidebarTagList" class="sidebar-tag-list"></div>
              <div class="sidebar-tag-add">
                <input id="newTagInput" class="input" placeholder="新标签…" />
                <input id="newTagColor" type="color" class="tag-color-input" value="#6366f1" style="width:30px;height:30px;border-radius:6px;border:none;cursor:pointer;padding:0;flex-shrink:0;" />
                <button id="addTagBtn" class="btn small" style="flex-shrink:0;">＋</button>
              </div>
            </div>

            <div class="sidebar-footer">
              <div class="sidebar-item" id="themeToggleBtn"><span class="icon">🌙</span>切换主题</div>
              <div class="sidebar-item" id="logoutBtn"><span class="icon">🚪</span>退出登录</div>
            </div>
          </aside>

          <!-- ─── Main Content ──────────────── -->
          <div class="main-content">
            <div class="content-header">
              <div class="search-box">
                <input id="searchInput" class="input" placeholder="搜索标题或正文…" />
                <button id="clearSearchBtn" class="clear-search" type="button" aria-label="清空搜索">×</button>
              </div>
              <button id="newBtn" class="btn new-btn">＋ 新建笔记</button>
            </div>

            <div class="content-body" id="contentBody">
              <!-- Settings Panel -->
              <section id="settingsPanel" class="hidden">
                <div class="section-head">
                  <h2 class="section-title">⚙️ 设置与备份</h2>
                </div>

                <div class="settings-section">
                  <div class="settings-section-title">WebDAV 备份配置</div>
                  <div class="settings-form">
                    <div class="settings-field">
                      <label>服务器地址</label>
                      <input id="webdavUrl" class="input" placeholder="https://dav.example.com/dav/" />
                    </div>
                    <div class="settings-field-row">
                      <div class="settings-field">
                        <label>用户名</label>
                        <input id="webdavUser" class="input" placeholder="username" />
                      </div>
                      <div class="settings-field">
                        <label>密码</label>
                        <input id="webdavPass" class="input" type="password" placeholder="password" />
                      </div>
                    </div>
                    <div class="settings-actions">
                      <button id="webdavTestBtn" class="btn secondary small">测试连接</button>
                      <button id="webdavSaveBtn" class="btn secondary small">保存配置</button>
                      <span id="webdavStatus" class="settings-status"></span>
                    </div>
                  </div>
                </div>

                <div class="settings-section">
                  <div class="settings-section-title">备份与恢复</div>
                  <div class="settings-actions">
                    <button id="webdavBackupBtn" class="btn secondary">📤 备份到 WebDAV</button>
                    <button id="webdavRestoreBtn" class="btn secondary">📥 从 WebDAV 恢复</button>
                    <button id="fileImportBtn" class="btn secondary">📁 从文件导入</button>
                    <input id="importFileInput" type="file" accept=".json" style="display:none" />
                  </div>
                  <div id="backupInfo" class="settings-info"></div>
                </div>

                <div class="settings-section">
                  <div class="settings-section-title">导出</div>
                  <div class="settings-actions">
                    <button id="exportJsonBtn" class="btn secondary">📋 导出为 JSON</button>
                    <button id="exportMdBtn" class="btn secondary">📝 导出为 Markdown</button>
                  </div>
                </div>

                <div class="settings-section">
                  <div class="settings-section-title">定时备份</div>
                  <div class="settings-field">
                    <label>启用自动备份</label>
                    <div class="toggle-row">
                      <label class="toggle toggle-lg">
                        <input id="autoBackupToggle" type="checkbox" />
                        <span class="toggle-slider"></span>
                      </label>
                      <span id="autoBackupLabel" class="toggle-label">关</span>
                    </div>
                  </div>
                  <div class="settings-field">
                    <label>备份日期</label>
                    <div id="autoBackupDays" class="day-row">
                      <label class="day-chip"><input type="checkbox" value="1" checked /><span>一</span></label>
                      <label class="day-chip"><input type="checkbox" value="2" checked /><span>二</span></label>
                      <label class="day-chip"><input type="checkbox" value="3" checked /><span>三</span></label>
                      <label class="day-chip"><input type="checkbox" value="4" checked /><span>四</span></label>
                      <label class="day-chip"><input type="checkbox" value="5" checked /><span>五</span></label>
                      <label class="day-chip"><input type="checkbox" value="6" /><span>六</span></label>
                      <label class="day-chip"><input type="checkbox" value="0" /><span>日</span></label>
                    </div>
                  </div>
                  <div class="settings-field-row">
                    <div class="settings-field">
                      <label>备份时间</label>
                      <input id="autoBackupTime" class="input" type="time" value="03:00" />
                    </div>
                    <div class="settings-field">
                      <label>保留份数</label>
                      <input id="autoBackupKeep" class="input" type="number" min="1" max="99" value="7" />
                    </div>
                  </div>
                  <div id="autoBackupInfo" class="settings-info"></div>
                </div>
              </section>

              <!-- Trash View -->
              <section id="trashView" class="hidden">
                <div class="section-head">
                  <div>
                    <h2 class="section-title">🗑️ 回收站</h2>
                    <div class="section-desc">删除的笔记会在 30 天后自动清理。</div>
                  </div>
                </div>
                <div id="trashList" class="note-list"></div>
              </section>

              <!-- Main Note Feed -->
              <main id="mainFeed" class="feed">
                <div class="section-head">
                  <div>
                    <h2 class="section-title">全部笔记</h2>
                    <div class="section-desc" id="feedDesc">按更新时间排序，支持搜索和标签筛选。</div>
                  </div>
                  <div id="noteCount" class="muted">0 条</div>
                </div>
                <div id="noteList" class="note-list"></div>
              </main>
            </div>

            <!-- ─── Editor Panel ────────────── -->
            <div id="editorPanel" class="editor-panel">
              <div class="editor-head">
                <div>
                  <h3 id="modalTitle">新建笔记</h3>
                  <div class="section-desc">支持 Markdown，可插入图片。</div>
                </div>
                <button id="closeModalBtn" class="btn-icon" type="button" aria-label="关闭">✕</button>
              </div>
              <div class="editor-body">
                <input id="editorTitle" class="editor-title-input" placeholder="标题" />
                <div class="editor-toolbar">
                  <button id="insertImageBtn" class="btn secondary small" type="button">📷 图片</button>
                  <button id="editorPinBtn" class="btn secondary small" type="button">📌 置顶</button>
                  <button id="editorShareBtn" class="btn secondary small" type="button">🔗 分享</button>
                  <button id="editorExportBtn" class="btn secondary small" type="button">📤 导出</button>
                </div>
                <textarea id="editorContent" class="editor-textarea" placeholder="# 今天想到什么&#10;&#10;- 一条记录&#10;- 一个链接&#10;- 一个待办"></textarea>
                <div id="imageUploadArea" class="image-upload-area hidden">
                  📷 点击或拖拽图片到这里上传（最大 5MB）
                  <input id="imageFileInput" type="file" accept="image/*" style="display:none" />
                </div>
                <div id="editorTagSelect" class="editor-tags"></div>
              </div>
              <div class="editor-actions">
                <button id="cancelBtn" class="btn secondary">取消</button>
                <button id="saveBtn" class="btn">保存</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile bottom bar -->
        <div class="mobile-bottom-bar">
          <div class="sidebar-item active" data-view="notes"><span class="icon">📝</span>笔记</div>
          <div class="sidebar-item" data-view="trash"><span class="icon">🗑️</span>回收站</div>
          <div class="sidebar-item" data-view="settings"><span class="icon">⚙️</span>设置</div>
        </div>

        <div id="statusLine" class="status-line"></div>

        <!-- Import Preview Modal -->
        <div id="importModal" class="modal-backdrop hidden">
          <div class="card import-dialog">
            <div class="section-head">
              <h2 class="section-title">导入预览</h2>
              <button id="closeImportModalBtn" class="btn secondary small">取消</button>
            </div>
            <div id="importPreview" class="import-preview"></div>
            <div class="settings-actions" style="margin-top:16px;">
              <button id="confirmImportBtn" class="btn">确认导入</button>
            </div>
          </div>
        </div>

        <!-- Share Dialog -->
        <div id="shareModal" class="modal-backdrop hidden">
          <div class="card share-dialog">
            <div class="modal-head">
              <h2 class="section-title">🔗 分享笔记</h2>
              <button id="closeShareBtn" class="btn secondary small">关闭</button>
            </div>
            <p class="muted" style="margin-bottom:12px;">创建公开链接，无需登录即可查看。</p>
            <div style="display:flex; gap:8px; margin-bottom:14px;">
              <select id="shareExpiry" class="input" style="max-width:160px;">
                <option value="">永不过期</option>
                <option value="3600000">1 小时</option>
                <option value="86400000">1 天</option>
                <option value="604800000">7 天</option>
                <option value="2592000000">30 天</option>
              </select>
              <button id="createShareBtn" class="btn">创建链接</button>
            </div>
            <div id="shareLinks"></div>
          </div>
        </div>
      </section>
    </div>

    <script>
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

      async function getCryptoConfig() {
        const data = await api('/api/crypto-config');
        state.vaultSalt = data.vaultSalt;
        return data;
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

      function wordCount(text) { return (text || '').replace(/\\s+/g, '').length; }
      function previewOf(note) { return (note.content || '').replace(/\\s+/g, ' ').slice(0, 120) || '（空内容）'; }

      function escapeHtml(text) {
        return (text || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      }

      function escapeRegExp(text) { return text.replace(/[.*+?^$()|[\\]{}]/g, '\\$&'); }

      function highlightText(text, query) {
        const safe = escapeHtml(text || '');
        if (!query) return safe;
        const esc = escapeRegExp(query.trim());
        if (!esc) return safe;
        return safe.replace(new RegExp(esc, 'gi'), function (m) { return '<mark class="search-highlight">' + m + '</mark>'; });
      }

      function getDisplayContent(note) {
        const lines = (note.content || '').split('\\n');
        const expanded = state.expandedIds.has(note.id);
        return { text: expanded ? note.content : lines.slice(0, 30).join('\\n'), expanded, canExpand: lines.length > 30 };
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
          state.activeTagFilter = null;
          renderTagList(); refreshNotes();
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
            refreshNotes();
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
            await refreshTags();
            await refreshNotes();
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
          if (!/[\u4e00-\u9fff]/.test(n) && !/[a-zA-Z0-9]/.test(n)) return;
          if (seen.has(n)) return;
          seen.add(n);
          out.push(String(name).trim());
        }
        // Latin / tech terms (case preserved as typed)
        const latin = text.match(/[a-zA-Z][a-zA-Z0-9_.-]{1,19}/g) || [];
        latin.forEach(add);
        // CJK segments split on non-CJK delimiters
        const segs = text.split(/[^a-zA-Z0-9\u4e00-\u9fff]+/).filter(function (s) {
          return /[\u4e00-\u9fff]/.test(s) && s.length >= 2 && s.length <= 8 && !TAG_STOPWORDS.has(s.toLowerCase());
        });
        const segFreq = new Map();
        const gramFreq = new Map();
        segs.forEach(function (s) {
          segFreq.set(s, (segFreq.get(s) || 0) + 1);
          for (let i = 0; i <= s.length - 2; i++) {
            const g = s.slice(i, i + 2);
            if (/^[\u4e00-\u9fff]{2}$/.test(g) && !TAG_STOPWORDS.has(g)) {
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
        const raw = els.editorTitle.value + '\\n' + els.editorContent.value;
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
          els.noteList.innerHTML = '<div class="empty-feed">正文已加密。请先输入解锁密码。</div>';
          return;
        }

        if (!state.notes.length) {
          els.noteList.innerHTML = '<div class="empty-feed">没有笔记' + (state.activeTagFilter ? '匹配当前标签' : '') + '。点击"新建笔记"开始写吧。</div>';
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

            const meta = document.createElement('div');
            meta.className = 'note-card-meta';
            meta.innerHTML = '<span>' + (note.is_pinned ? '📌 ' : '') + formatDate(note.updated_at) + '</span><span>' + wordCount(note.content) + ' 字</span>';

            const title = document.createElement('div');
            title.className = 'note-card-title';
            title.innerHTML = highlightText(note.title || '无标题', els.searchInput.value.trim());

            const actions = document.createElement('div');
            actions.className = 'note-actions';

            const pinBtn = document.createElement('button');
            pinBtn.type = 'button';
            pinBtn.className = 'btn secondary small';
            pinBtn.textContent = note.is_pinned ? '取消置顶' : '📌 置顶';
            pinBtn.onclick = async function () {
              await api('/api/notes/' + encodeURIComponent(note.id) + '/pin', { method: 'PUT' });
              await refreshNotes();
              setStatus(note.is_pinned ? '已取消置顶' : '已置顶');
            };

            const copyBtn = document.createElement('button');
            copyBtn.type = 'button';
            copyBtn.className = 'btn secondary small';
            copyBtn.textContent = '复制';
            copyBtn.onclick = async function () {
              try { await navigator.clipboard.writeText(note.content || ''); setStatus('已复制：' + (note.title || '无标题')); }
              catch (e) { setStatus('复制失败'); }
            };

            const editBtn = document.createElement('button');
            editBtn.type = 'button';
            editBtn.className = 'btn secondary small';
            editBtn.textContent = '编辑';
            editBtn.onclick = function () { openComposer(note); };

            const shareBtn = document.createElement('button');
            shareBtn.type = 'button';
            shareBtn.className = 'btn secondary small';
            shareBtn.textContent = '🔗';
            shareBtn.title = '分享';
            shareBtn.onclick = function () { openShareDialog(note.id); };

            const exportBtn = document.createElement('button');
            exportBtn.type = 'button';
            exportBtn.className = 'btn secondary small';
            exportBtn.textContent = '📤';
            exportBtn.title = '导出 Markdown';
            exportBtn.onclick = function () { exportSingleNote(note); };

            const deleteBtn = document.createElement('button');
            deleteBtn.type = 'button';
            deleteBtn.className = 'btn danger small';
            deleteBtn.textContent = '删除';
            deleteBtn.onclick = function () { deleteNote(note.id).catch(function (e) { setStatus(e.message || '删除失败'); }); };

            actions.appendChild(pinBtn);
            actions.appendChild(copyBtn);
            actions.appendChild(editBtn);
            actions.appendChild(shareBtn);
            actions.appendChild(exportBtn);
            actions.appendChild(deleteBtn);

            const body = document.createElement('div');
            const dc = getDisplayContent(note);
            body.className = 'note-card-text' + (note.content ? '' : ' is-empty');
            body.textContent = note.content ? dc.text : '这条笔记还没有内容。';
            const bodyWrap = document.createElement('div');
            bodyWrap.className = 'note-card-text-wrap' + (dc.canExpand && !dc.expanded ? ' collapsed' : '');
            bodyWrap.appendChild(body);

            card.appendChild(meta);
            card.appendChild(actions);
            card.appendChild(title);

            if (note.tags && note.tags.length) {
              const tagsRow = document.createElement('div');
              tagsRow.className = 'note-tags';
              note.tags.forEach(function (t) {
                const pill = document.createElement('span');
                pill.className = 'tag-pill';
                pill.innerHTML = '<span class="tag-dot" style="background:' + escapeHtml(t.color) + '"></span>' + escapeHtml(t.name);
                tagsRow.appendChild(pill);
              });
              card.appendChild(tagsRow);
            }

            card.appendChild(bodyWrap);

            if (dc.canExpand) {
              const toggleBtn = document.createElement('button');
              toggleBtn.type = 'button';
              toggleBtn.className = 'btn secondary note-expand';
              toggleBtn.textContent = dc.expanded ? '收起' : '展开全文';
              toggleBtn.onclick = function () {
                if (state.expandedIds.has(note.id)) state.expandedIds.delete(note.id);
                else state.expandedIds.add(note.id);
                renderList();
              };
              card.appendChild(toggleBtn);
            }

            group.appendChild(card);
          });
          els.noteList.appendChild(group);
        });
      }

      function renderTrashList(notes) {
        els.trashList.innerHTML = '';
        if (!notes.length) {
          els.trashList.innerHTML = '<div class="empty-feed">回收站是空的。</div>';
          return;
        }
        notes.forEach(function (note) {
          const card = document.createElement('article');
          card.className = 'note-card';
          card.style.opacity = '0.7';
          const meta = document.createElement('div');
          meta.className = 'note-card-meta';
          meta.innerHTML = '<span>删除于 ' + formatDate(note.deleted_at) + '</span><span>' + wordCount(note.content) + ' 字</span>';
          const title = document.createElement('div');
          title.className = 'note-card-title';
          title.textContent = note.title || '无标题';
          const actions = document.createElement('div');
          actions.className = 'note-actions';
          const restoreBtn = document.createElement('button');
          restoreBtn.type = 'button';
          restoreBtn.className = 'btn secondary small';
          restoreBtn.textContent = '恢复';
          restoreBtn.onclick = async function () {
            await api('/api/notes/' + encodeURIComponent(note.id) + '/restore', { method: 'POST' });
            setStatus('已恢复');
            loadTrash();
            refreshNotes();
            refreshTags();
          };
          const permBtn = document.createElement('button');
          permBtn.type = 'button';
          permBtn.className = 'btn danger small';
          permBtn.textContent = '永久删除';
          permBtn.onclick = async function () {
            if (!confirm('永久删除此笔记？此操作不可恢复！')) return;
            await api('/api/notes/' + encodeURIComponent(note.id) + '/permanent', { method: 'DELETE' });
            setStatus('已永久删除');
            loadTrash();
          };
          actions.appendChild(restoreBtn);
          actions.appendChild(permBtn);
          card.appendChild(meta);
          card.appendChild(actions);
          card.appendChild(title);
          els.trashList.appendChild(card);
        });
      }

      // ─── Data Operations ──────────────────
      async function refreshNotes() {
        if (!state.vaultUnlocked) {
          state.notes = []; state.allNotes = [];
          await refreshMeta(); renderList(); return;
        }
        const q = els.searchInput.value.trim();
        const data = await api('/api/notes' + (state.activeTagFilter ? '?tag=' + encodeURIComponent(state.activeTagFilter) : ''));
        state.allNotes = await decryptNotes(data.notes || []);
        state.notes = filterNotes(state.allNotes, q);
        state.noteCountMeta = state.allNotes.length;
        updateVaultUi();
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
        // Load note tags
        if (note) {
          loadNoteTagsForEditor(note.id);
        } else {
          setEditorTagSelection([]);
        }
      }

      async function loadNoteTagsForEditor(noteId) {
        try {
          const noteTagData = await api('/api/notes/' + encodeURIComponent(noteId) + '/tags');
          setEditorTagSelection((noteTagData.tags || []).map(function (t) { return t.id; }));
        } catch (e) { setEditorTagSelection([]); }
      }

      async function closeComposer() {
        const orphanIds = state.autoCreatedTagIds.slice();
        state.autoCreatedTagIds = [];
        clearTimeout(autoTagTimer);
        els.editorPanel.classList.remove('open');
        state.editingId = null;
        updateModalUi();
        // If the note was never saved, remove auto-generated tags that have no note attached
        if (!state.composerSaved && orphanIds.length) {
          await Promise.all(orphanIds.map(function (id) {
            return api('/api/tags/' + encodeURIComponent(id), { method: 'DELETE' }).catch(function () {});
          }));
          refreshTags();
        }
        state.composerSaved = false;
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
        await refreshNotes();
        await refreshTags();
        setStatus('已保存');
      }

      async function deleteNote(id) {
        if (!id) { setStatus('没有可删除的笔记'); return; }
        if (!confirm('移入回收站？')) return;
        await api('/api/notes/' + encodeURIComponent(id), { method: 'DELETE' });
        await refreshNotes();
        await refreshTags();
        setStatus('已移入回收站');
      }

      async function unlockVault(passphrase) {
        if (!passphrase) throw new Error('请输入密码');
        const config = await getCryptoConfig();
        state.vaultKey = await deriveVaultKey(passphrase, config.vaultSalt);
        state.vaultUnlocked = true;
        state.unlockError = '';
        await refreshNotes();
        await refreshTags();
      }

      async function checkSession() {
        showChecking();
        const data = await api('/api/session');
        if (data.authenticated) {
          state.sessionAuthenticated = true;
          state.vaultUnlocked = false; state.vaultKey = null; state.unlockError = '';
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
        const md = '# ' + (note.title || '无标题') + '\\n\\n' + (note.content || '');
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
            let md = '# 我的笔记\\n\\n';
            notes.forEach(function (n) { md += '## ' + (n.title || '无标题') + '\\n\\n' + (n.content || '') + '\\n\\n---\\n\\n'; });
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
      function webdavAuth(user, pass) {
        return 'Basic ' + btoa(unescape(encodeURIComponent(user + ':' + pass)));
      }
      async function webdavRequest(path, method, body, contentType) {
        const cfg = getWebdavConfig();
        if (!cfg.url) throw new Error('请先配置 WebDAV 服务器地址');
        const baseUrl = cfg.url.replace(/\\/+$/, '');
        const url = baseUrl + '/' + path.replace(/^\\/+/, '');
        const headers = { 'Authorization': webdavAuth(cfg.user || '', cfg.pass || '') };
        if (contentType) headers['Content-Type'] = contentType;
        const opts = { method, headers };
        if (body !== undefined) opts.body = body;
        const res = await fetch(url, opts);
        if (!res.ok) {
          const text = await res.text().catch(function () { return ''; });
          throw new Error('WebDAV 请求失败 (' + res.status + '): ' + (text.slice(0, 100) || res.statusText));
        }
        return res;
      }
      async function webdavTestConnection() {
        const cfg = getWebdavConfig();
        if (!cfg.url) throw new Error('请填写服务器地址');
        // Try PROPFIND to test connection
        const baseUrl = cfg.url.replace(/\\/+$/, '');
        const res = await fetch(baseUrl, {
          method: 'PROPFIND',
          headers: {
            'Authorization': webdavAuth(cfg.user || '', cfg.pass || ''),
            'Depth': '0',
          },
        });
        if (!res.ok) throw new Error('连接失败 (' + res.status + '): ' + res.statusText);
        return true;
      }

      // Build backup data (encrypted ciphertext + tags)
      async function buildBackupData() {
        const notesData = await api('/api/notes');
        const tagsData = await api('/api/tags');
        const notes = notesData.notes || [];
        const tags = tagsData.tags || [];
        // Build tag id -> name map
        const tagMap = {};
        tags.forEach(function (t) { tagMap[t.id] = t.name; });
        // Fetch note-tag associations
        const notesWithTags = [];
        for (const note of notes) {
          let tagNames = [];
          try {
            const rels = await api('/api/notes/' + encodeURIComponent(note.id) + '/tags');
            if (rels.tags) {
              tagNames = rels.tags.map(function (t) { return t.name; });
            }
          } catch (e) { /* ignore */ }
          notesWithTags.push({
            id: note.id,
            title: note.title,
            content: note.content,
            created_at: note.created_at,
            updated_at: note.updated_at,
            is_pinned: note.is_pinned || 0,
            tag_names: tagNames,
          });
        }
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
          var res = await webdavRequest('edge-notes/', 'PROPFIND', undefined, undefined);
          var text = await res.text();
          // Parse PROPFIND XML to find backup files
          var files = [];
          var re = /<d:href>([^<]*backup-[^<]*\.json)<\\/d:href>/gi;
          var m;
          while ((m = re.exec(text)) !== null) {
            var name = m[1].split('/').pop();
            if (name.indexOf('backup-') === 0 && name.indexOf('.json') > 0) {
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
          ta.value = ta.value.slice(0, pos) + mdImage + '\\n' + ta.value.slice(pos);
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
        state.searchTimer = setTimeout(function () { refreshNotes().catch(function (e) { setStatus(e.message); }); }, 260);
      });

      els.clearSearchBtn.onclick = function () {
        els.searchInput.value = ''; updateSearchUi();
        refreshNotes().catch(function (e) { setStatus(e.message); });
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
    </script>
  </body>
</html>`;
