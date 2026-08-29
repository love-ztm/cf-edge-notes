var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/homeHtml.ts
var blogHomeHtml = `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Edge Notes</title>
    <meta name="theme-color" content="#6366f1" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content="\u6211\u7684\u7B14\u8BB0" />
    <meta name="description" content="\u4E00\u4E2A\u90E8\u7F72\u5728 Cloudflare Workers \u4E0A\u7684\u7B80\u6D01\u79C1\u4EBA\u7B14\u8BB0\u3002" />
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

      /* \u2500\u2500\u2500 Sidebar \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
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

      /* \u2500\u2500\u2500 Main Content \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
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
      .feed { padding: 0; max-width: 880px; }
      @media (min-width: 1000px) { .feed { margin: 0 auto; } }
      .section-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
      .section-title { margin: 0; font-size: 16px; font-weight: 700; }
      .section-desc { margin: 2px 0 0; color: var(--muted); font-size: 12px; }

      /* \u2500\u2500\u2500 Editor Panel \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
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
      .editor-tags .btn { border: 1px solid var(--panel-border); }
      .editor-tags .btn.active {
        background: var(--primary); border-color: var(--primary); color: #fff; font-weight: 600;
        box-shadow: 0 2px 8px rgba(99, 102, 241, 0.35);
      }
      .editor-tags .btn.active .tag-dot { background: #fff !important; }
      .editor-tags .btn.active:hover {
        background: var(--primary); border-color: var(--primary); opacity: 0.88;
      }
      .editor-tags-head {
        display: flex; align-items: center; justify-content: space-between;
        margin: 12px 0 6px;
      }
      .editor-tags-head .label { font-size: 12px; color: var(--text-dim); font-weight: 600; }
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
        padding: 9px 20px; border-radius: 999px;
        background: color-mix(in srgb, var(--panel) 82%, transparent);
        backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
        border: 1px solid var(--panel-border);
        box-shadow: 0 8px 28px rgba(0,0,0,0.16); font-size: 13px; color: var(--muted);
        opacity: 0; pointer-events: none;
        transition: opacity 0.25s ease, transform 0.25s ease;
        transform: translateX(-50%) translateY(8px);
        z-index: 50; white-space: nowrap;
      }
      .status-line.show { opacity: 1; transform: translateX(-50%) translateY(0); }
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
      .group-block { margin-bottom: 10px; }
      .group-title {
        display: flex; align-items: center; gap: 10px;
        font-size: 11px; font-weight: 700; color: var(--muted);
        text-transform: uppercase; letter-spacing: 1px;
        padding: 10px 2px 8px; margin-bottom: 8px;
      }
      .group-title::after { content: ''; flex: 1; height: 1px; background: var(--panel-border); opacity: 0.7; }
      @keyframes cardIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: none; } }
      .note-card {
        padding: 14px 16px; border-radius: 14px;
        border: 1px solid var(--panel-border); background: var(--panel);
        transition: border-color 0.18s, box-shadow 0.18s, transform 0.18s;
        cursor: default;
        box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        animation: cardIn 0.28s ease both;
      }
      .note-card:hover {
        border-color: color-mix(in srgb, var(--primary) 45%, var(--panel-border));
        box-shadow: 0 6px 18px rgba(99,102,241,0.10);
        transform: translateY(-1px);
      }
      .note-card.is-pinned { box-shadow: inset 3px 0 0 var(--pin-border), 0 1px 3px rgba(0,0,0,0.04); }
      .note-card.is-pinned:hover { box-shadow: inset 3px 0 0 var(--pin-border), 0 6px 18px rgba(99,102,241,0.10); }
      .note-card-head { display: flex; align-items: flex-start; gap: 8px; }
      .note-card-head .note-card-title { flex: 1; min-width: 0; }
      .note-card-meta-text { font-size: 11px; color: var(--muted); white-space: nowrap; }
      .note-card-title { font-weight: 700; font-size: 15px; margin-bottom: 4px; line-height: 1.4; overflow-wrap: anywhere; }
      .note-card-text { font-size: 13px; color: var(--muted); line-height: 1.6; white-space: pre-wrap; word-break: break-word; }
      .note-card-text.is-empty { font-style: italic; opacity: 0.7; }
      .note-card-text-wrap.collapsed .note-card-text {
        display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
      }
      .note-expand {
        margin-top: 8px; background: none; border: none; color: var(--primary);
        font-size: 12px; font-weight: 600; cursor: pointer; padding: 2px 0;
      }
      .note-expand:hover { opacity: 0.8; }
      .note-card-foot { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-top: 10px; }
      .note-card-foot:empty { display: none; }
      .note-actions { display: flex; gap: 2px; flex-shrink: 0; opacity: 0; transition: opacity 0.15s; }
      .note-card:hover .note-actions, .note-card:focus-within .note-actions { opacity: 1; }
      @media (hover: none) { .note-actions { opacity: 1; } }
      .icon-btn {
        width: 27px; height: 27px; display: inline-flex; align-items: center; justify-content: center;
        border: none; border-radius: 8px; background: none; cursor: pointer;
        font-size: 13px; color: var(--muted); transition: background 0.12s, color 0.12s;
        text-decoration: none; line-height: 1; padding: 0;
      }
      .icon-btn:hover { background: var(--highlight-bg); color: var(--text); }
      .icon-btn.danger:hover { background: color-mix(in srgb, #ef4444 14%, transparent); color: #ef4444; }
      .note-tags { display: flex; gap: 4px; flex-wrap: wrap; min-width: 0; }
      .tag-pill {
        display: inline-flex; align-items: center; gap: 4px;
        padding: 2.5px 9px; border-radius: 999px; font-size: 11px; font-weight: 600;
        background: var(--tag-bg); color: var(--tag-text);
        border: 1px solid var(--panel-border);
      }
      .tag-pill .tag-dot { width: 6px; height: 6px; border-radius: 50%; }
      .empty-feed {
        padding: 52px 32px; text-align: center; color: var(--muted);
        border: 1px dashed var(--panel-border); border-radius: 16px;
      }
      .empty-feed .empty-icon { font-size: 38px; display: block; margin-bottom: 10px; opacity: 0.75; }
      .empty-feed .empty-title { font-size: 14px; font-weight: 700; color: var(--text); margin-bottom: 4px; }
      .empty-feed .empty-hint { font-size: 12.5px; }
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
        .note-actions { gap: 0; }
        .icon-btn { width: 32px; height: 32px; font-size: 14px; }
        /* Login mobile */
        .login-content { padding: 0 20px; }
        .login-title { font-size: 36px !important; }
        .login-subtitle { font-size: 18px !important; }
        .login-form { max-width: 100%; }
      }
      /* Thin, theme-aware scrollbars */
      ::-webkit-scrollbar { width: 9px; height: 9px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb {
        background: color-mix(in srgb, var(--muted) 28%, transparent);
        border-radius: 999px; border: 2px solid transparent; background-clip: padding-box;
      }
      ::-webkit-scrollbar-thumb:hover { background: color-mix(in srgb, var(--muted) 45%, transparent); border: 2px solid transparent; background-clip: padding-box; }
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
          <div id="unlockBadge" class="unlock-badge hidden">\u{1F512} \u5DF2\u901A\u8FC7\u8BBF\u95EE\u9A8C\u8BC1</div>
        </div>
        <div class="login-content">
          <!-- Static content (shown on first login) -->
          <div id="loginStaticContent">
            <div class="login-badge">
              <div class="login-badge-dot"></div>
              End-to-End Encrypted
            </div>
            <h1 class="login-title">Edge Notes</h1>
            <div class="login-subtitle">\u7AEF\u5230\u7AEF\u52A0\u5BC6\u79C1\u4EBA\u7B14\u8BB0</div>
            <p class="login-desc">\u5728\u6D4F\u89C8\u5668\u672C\u5730\u52A0\u5BC6\u540E\u4E0A\u4F20\uFF0C\u670D\u52A1\u7AEF\u53EA\u5B58\u50A8\u5BC6\u6587\u3002\u8F93\u5165\u5BC6\u7801\u5373\u53EF\u8FDB\u5165\u4F60\u7684\u79C1\u5BC6\u7B14\u8BB0\u7A7A\u95F4\u3002</p>
          </div>
          <!-- Checking state content (shown briefly on page load) -->
          <h1 id="loginTitle" class="login-title" style="display:none"></h1>
          <p id="loginDesc" class="login-desc" style="display:none"></p>
          <div class="login-form">
            <div class="login-input-wrap">
              <span class="login-input-icon">\u{1F511}</span>
              <input id="passwordInput" class="input" type="password" placeholder="\u8F93\u5165\u8BBF\u95EE\u5BC6\u7801" />
            </div>
            <button id="loginBtn" class="login-btn"><span>\u8FDB\u5165\u7B14\u8BB0</span></button>
            <div id="passwordHelp" style="color:rgba(255,255,255,0.3); font-size:12px; text-align:center;">\u540C\u4E00\u4E2A\u5BC6\u7801\u540C\u65F6\u7528\u4E8E\u8BBF\u95EE\u7AD9\u70B9\u548C\u672C\u5730\u89E3\u5BC6</div>
            <div id="loginStatus" style="color:rgba(255,255,255,0.5); font-size:13px; text-align:center;"></div>
          </div>
        </div>
      </section>

      <section id="appView" class="hidden">
        <div class="app-shell">

          <!-- \u2500\u2500\u2500 Sidebar \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->
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
              <div class="sidebar-item active" data-view="notes"><span class="icon">\u{1F4DD}</span>\u5168\u90E8\u7B14\u8BB0</div>
              <div class="sidebar-item" data-view="trash"><span class="icon">\u{1F5D1}\uFE0F</span>\u56DE\u6536\u7AD9</div>
              <div class="sidebar-item" data-view="settings"><span class="icon">\u2699\uFE0F</span>\u8BBE\u7F6E\u4E0E\u5907\u4EFD</div>
            </nav>

            <div class="sidebar-tags">
              <div class="sidebar-section-title">\u6807\u7B7E</div>
              <div id="sidebarTagList" class="sidebar-tag-list"></div>
              <div class="sidebar-tag-add">
                <input id="newTagInput" class="input" placeholder="\u65B0\u6807\u7B7E\u2026" />
                <input id="newTagColor" type="color" class="tag-color-input" value="#6366f1" style="width:30px;height:30px;border-radius:6px;border:none;cursor:pointer;padding:0;flex-shrink:0;" />
                <button id="addTagBtn" class="btn small" style="flex-shrink:0;">\uFF0B</button>
              </div>
            </div>

            <div class="sidebar-footer">
              <div class="sidebar-item" id="themeToggleBtn"><span class="icon">\u{1F319}</span>\u5207\u6362\u4E3B\u9898</div>
              <div class="sidebar-item" id="logoutBtn"><span class="icon">\u{1F6AA}</span>\u9000\u51FA\u767B\u5F55</div>
            </div>
          </aside>

          <!-- \u2500\u2500\u2500 Main Content \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->
          <div class="main-content">
            <div class="content-header">
              <div class="search-box">
                <input id="searchInput" class="input" placeholder="\u641C\u7D22\u6807\u9898\u6216\u6B63\u6587\u2026" />
                <button id="clearSearchBtn" class="clear-search" type="button" aria-label="\u6E05\u7A7A\u641C\u7D22">\xD7</button>
              </div>
              <button id="newBtn" class="btn new-btn">\uFF0B \u65B0\u5EFA\u7B14\u8BB0</button>
            </div>

            <div class="content-body" id="contentBody">
              <!-- Settings Panel -->
              <section id="settingsPanel" class="hidden">
                <div class="section-head">
                  <h2 class="section-title">\u2699\uFE0F \u8BBE\u7F6E\u4E0E\u5907\u4EFD</h2>
                </div>

                <div class="settings-section">
                  <div class="settings-section-title">WebDAV \u5907\u4EFD\u914D\u7F6E</div>
                  <div class="settings-form">
                    <div class="settings-field">
                      <label>\u670D\u52A1\u5668\u5730\u5740</label>
                      <input id="webdavUrl" class="input" placeholder="https://dav.example.com/dav/" />
                    </div>
                    <div class="settings-field-row">
                      <div class="settings-field">
                        <label>\u7528\u6237\u540D</label>
                        <input id="webdavUser" class="input" placeholder="username" />
                      </div>
                      <div class="settings-field">
                        <label>\u5BC6\u7801</label>
                        <input id="webdavPass" class="input" type="password" placeholder="password" />
                      </div>
                    </div>
                    <div class="settings-actions">
                      <button id="webdavTestBtn" class="btn secondary small">\u6D4B\u8BD5\u8FDE\u63A5</button>
                      <button id="webdavSaveBtn" class="btn secondary small">\u4FDD\u5B58\u914D\u7F6E</button>
                      <span id="webdavStatus" class="settings-status"></span>
                    </div>
                  </div>
                </div>

                <div class="settings-section">
                  <div class="settings-section-title">\u5907\u4EFD\u4E0E\u6062\u590D</div>
                  <div class="settings-actions">
                    <button id="webdavBackupBtn" class="btn secondary">\u{1F4E4} \u5907\u4EFD\u5230 WebDAV</button>
                    <button id="webdavRestoreBtn" class="btn secondary">\u{1F4E5} \u4ECE WebDAV \u6062\u590D</button>
                    <button id="fileImportBtn" class="btn secondary">\u{1F4C1} \u4ECE\u6587\u4EF6\u5BFC\u5165</button>
                    <input id="importFileInput" type="file" accept=".json" style="display:none" />
                  </div>
                  <div id="backupInfo" class="settings-info"></div>
                </div>

                <div class="settings-section">
                  <div class="settings-section-title">\u5BFC\u51FA</div>
                  <div class="settings-actions">
                    <button id="exportJsonBtn" class="btn secondary">\u{1F4CB} \u5BFC\u51FA\u4E3A JSON</button>
                    <button id="exportMdBtn" class="btn secondary">\u{1F4DD} \u5BFC\u51FA\u4E3A Markdown</button>
                  </div>
                </div>

                <div class="settings-section">
                  <div class="settings-section-title">\u5B9A\u65F6\u5907\u4EFD</div>
                  <div class="settings-field">
                    <label>\u542F\u7528\u81EA\u52A8\u5907\u4EFD</label>
                    <div class="toggle-row">
                      <label class="toggle toggle-lg">
                        <input id="autoBackupToggle" type="checkbox" />
                        <span class="toggle-slider"></span>
                      </label>
                      <span id="autoBackupLabel" class="toggle-label">\u5173</span>
                    </div>
                  </div>
                  <div class="settings-field">
                    <label>\u5907\u4EFD\u65E5\u671F</label>
                    <div id="autoBackupDays" class="day-row">
                      <label class="day-chip"><input type="checkbox" value="1" checked /><span>\u4E00</span></label>
                      <label class="day-chip"><input type="checkbox" value="2" checked /><span>\u4E8C</span></label>
                      <label class="day-chip"><input type="checkbox" value="3" checked /><span>\u4E09</span></label>
                      <label class="day-chip"><input type="checkbox" value="4" checked /><span>\u56DB</span></label>
                      <label class="day-chip"><input type="checkbox" value="5" checked /><span>\u4E94</span></label>
                      <label class="day-chip"><input type="checkbox" value="6" /><span>\u516D</span></label>
                      <label class="day-chip"><input type="checkbox" value="0" /><span>\u65E5</span></label>
                    </div>
                  </div>
                  <div class="settings-field-row">
                    <div class="settings-field">
                      <label>\u5907\u4EFD\u65F6\u95F4</label>
                      <input id="autoBackupTime" class="input" type="time" value="03:00" />
                    </div>
                    <div class="settings-field">
                      <label>\u4FDD\u7559\u4EFD\u6570</label>
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
                    <h2 class="section-title">\u{1F5D1}\uFE0F \u56DE\u6536\u7AD9</h2>
                    <div class="section-desc">\u5220\u9664\u7684\u7B14\u8BB0\u4F1A\u5728 30 \u5929\u540E\u81EA\u52A8\u6E05\u7406\u3002</div>
                  </div>
                </div>
                <div id="trashList" class="note-list"></div>
              </section>

              <!-- Main Note Feed -->
              <main id="mainFeed" class="feed">
                <div class="section-head">
                  <div>
                    <h2 class="section-title">\u5168\u90E8\u7B14\u8BB0</h2>
                    <div class="section-desc" id="feedDesc">\u6309\u66F4\u65B0\u65F6\u95F4\u6392\u5E8F\uFF0C\u652F\u6301\u641C\u7D22\u548C\u6807\u7B7E\u7B5B\u9009\u3002</div>
                  </div>
                  <div id="noteCount" class="muted">0 \u6761</div>
                </div>
                <div id="noteList" class="note-list"></div>
              </main>
            </div>

            <!-- \u2500\u2500\u2500 Editor Panel \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->
            <div id="editorPanel" class="editor-panel">
              <div class="editor-head">
                <div>
                  <h3 id="modalTitle">\u65B0\u5EFA\u7B14\u8BB0</h3>
                  <div class="section-desc">\u652F\u6301 Markdown\uFF0C\u53EF\u63D2\u5165\u56FE\u7247\u3002</div>
                </div>
                <button id="closeModalBtn" class="btn-icon" type="button" aria-label="\u5173\u95ED">\u2715</button>
              </div>
              <div class="editor-body">
                <input id="editorTitle" class="editor-title-input" placeholder="\u6807\u9898" />
                <div class="editor-toolbar">
                  <button id="insertImageBtn" class="btn secondary small" type="button">\u{1F4F7} \u56FE\u7247</button>
                  <button id="editorPinBtn" class="btn secondary small" type="button">\u{1F4CC} \u7F6E\u9876</button>
                  <button id="editorShareBtn" class="btn secondary small" type="button">\u{1F517} \u5206\u4EAB</button>
                  <button id="editorExportBtn" class="btn secondary small" type="button">\u{1F4E4} \u5BFC\u51FA</button>
                </div>
                <textarea id="editorContent" class="editor-textarea" placeholder="# \u4ECA\u5929\u60F3\u5230\u4EC0\u4E48&#10;&#10;- \u4E00\u6761\u8BB0\u5F55&#10;- \u4E00\u4E2A\u94FE\u63A5&#10;- \u4E00\u4E2A\u5F85\u529E"></textarea>
                <div id="imageUploadArea" class="image-upload-area hidden">
                  \u{1F4F7} \u70B9\u51FB\u6216\u62D6\u62FD\u56FE\u7247\u5230\u8FD9\u91CC\u4E0A\u4F20\uFF08\u6700\u5927 5MB\uFF09
                  <input id="imageFileInput" type="file" accept="image/*" style="display:none" />
                </div>
                <div class="editor-tags-head">
                  <span class="label">\u6807\u7B7E</span>
                  <button id="clearTagBtn" class="btn small secondary" type="button">\u6E05\u9664\u5DF2\u9009</button>
                </div>
                <div id="editorTagSelect" class="editor-tags"></div>
              </div>
              <div class="editor-actions">
                <button id="cancelBtn" class="btn secondary">\u53D6\u6D88</button>
                <button id="saveBtn" class="btn">\u4FDD\u5B58</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile bottom bar -->
        <div class="mobile-bottom-bar">
          <div class="sidebar-item active" data-view="notes"><span class="icon">\u{1F4DD}</span>\u7B14\u8BB0</div>
          <div class="sidebar-item" data-view="trash"><span class="icon">\u{1F5D1}\uFE0F</span>\u56DE\u6536\u7AD9</div>
          <div class="sidebar-item" data-view="settings"><span class="icon">\u2699\uFE0F</span>\u8BBE\u7F6E</div>
        </div>

        <div id="statusLine" class="status-line"></div>

        <!-- Import Preview Modal -->
        <div id="importModal" class="modal-backdrop hidden">
          <div class="card import-dialog">
            <div class="section-head">
              <h2 class="section-title">\u5BFC\u5165\u9884\u89C8</h2>
              <button id="closeImportModalBtn" class="btn secondary small">\u53D6\u6D88</button>
            </div>
            <div id="importPreview" class="import-preview"></div>
            <div class="settings-actions" style="margin-top:16px;">
              <button id="confirmImportBtn" class="btn">\u786E\u8BA4\u5BFC\u5165</button>
            </div>
          </div>
        </div>

        <!-- Share Dialog -->
        <div id="shareModal" class="modal-backdrop hidden">
          <div class="card share-dialog">
            <div class="modal-head">
              <h2 class="section-title">\u{1F517} \u5206\u4EAB\u7B14\u8BB0</h2>
              <button id="closeShareBtn" class="btn secondary small">\u5173\u95ED</button>
            </div>
            <p class="muted" style="margin-bottom:12px;">\u521B\u5EFA\u516C\u5F00\u94FE\u63A5\uFF0C\u65E0\u9700\u767B\u5F55\u5373\u53EF\u67E5\u770B\u3002</p>
            <div style="display:flex; gap:8px; margin-bottom:14px;">
              <select id="shareExpiry" class="input" style="max-width:160px;">
                <option value="">\u6C38\u4E0D\u8FC7\u671F</option>
                <option value="3600000">1 \u5C0F\u65F6</option>
                <option value="86400000">1 \u5929</option>
                <option value="604800000">7 \u5929</option>
                <option value="2592000000">30 \u5929</option>
              </select>
              <button id="createShareBtn" class="btn">\u521B\u5EFA\u94FE\u63A5</button>
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

      // \u2500\u2500\u2500 Theme \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
      function applyTheme() {
        const t = state.theme;
        if (t === 'dark' || t === 'light') {
          document.documentElement.setAttribute('data-theme', t);
        } else {
          document.documentElement.removeAttribute('data-theme');
        }
        const isDark = (t === 'dark') || (t === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        els.themeToggleBtn.textContent = isDark ? '\u2600\uFE0F' : '\u{1F319}';
      }
      function toggleTheme() {
        const isDark = state.theme === 'dark' || (state.theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        state.theme = isDark ? 'light' : 'dark';
        localStorage.setItem('theme', state.theme);
        applyTheme();
      }
      applyTheme();
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function() { if (state.theme === 'auto') applyTheme(); });

      // \u2500\u2500\u2500 Helpers \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
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
          els.loginTitle.textContent = '\u6B63\u5728\u6253\u5F00\u6211\u7684\u7B14\u8BB0';
          els.loginDesc.textContent = '\u6B63\u5728\u68C0\u67E5\u5F53\u524D\u8BBE\u5907\u7684\u8BBF\u95EE\u72B6\u6001\u2026';
          els.passwordInput.placeholder = '\u8BF7\u7A0D\u5019\u2026';
          els.loginBtn.querySelector('span').textContent = '\u8BF7\u7A0D\u5019\u2026';
          return;
        }
        els.passwordInput.placeholder = unlockOnly ? '\u8F93\u5165\u89E3\u9501\u5BC6\u7801' : '\u8F93\u5165\u8BBF\u95EE\u5BC6\u7801';
        els.loginBtn.querySelector('span').textContent = unlockOnly ? '\u89E3\u9501\u6211\u7684\u7B14\u8BB0' : '\u8FDB\u5165\u7B14\u8BB0';
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
        if (encryptedCount > 0 && decrypted.length === 0) throw new Error('\u672C\u5730\u89E3\u9501\u5BC6\u94A5\u4E0D\u6B63\u786E');
        return decrypted;
      }

      function filterNotes(notes, query) {
        const q = (query || '').trim().toLowerCase();
        if (!q) return notes;
        return notes.filter(function (n) {
          return (n.title || '').toLowerCase().includes(q) || (n.content || '').toLowerCase().includes(q);
        });
      }

      // \u2500\u2500\u2500 UI State \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
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
        if (diff === 0) return '\u4ECA\u5929';
        if (diff === 1) return '\u6628\u5929';
        return new Intl.DateTimeFormat('zh-CN', { year:'numeric', month:'2-digit', day:'2-digit' }).format(d);
      }

      function wordCount(text) { return (text || '').replace(/\\s+/g, '').length; }
      function previewOf(note) { return (note.content || '').replace(/\\s+/g, ' ').slice(0, 120) || '\uFF08\u7A7A\u5185\u5BB9\uFF09'; }

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
          showLogin(); throw new Error('\u8BF7\u5148\u767B\u5F55');
        }
        if (!res.ok) throw new Error(data.error || '\u8BF7\u6C42\u5931\u8D25');
        return data;
      }

      // \u2500\u2500\u2500 Tags \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
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
        // "\u5168\u90E8\u7B14\u8BB0" pseudo-tag
        const allItem = document.createElement('div');
        allItem.className = 'sidebar-tag-item' + (!state.activeTagFilter ? ' active' : '');
        allItem.innerHTML = '<span class="sidebar-tag-dot" style="background:var(--primary)"></span>\u5168\u90E8';
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
          setStatus('\u663E\u793A\u5168\u90E8\u7B14\u8BB0');
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
          del.textContent = '\xD7';
          del.style.cssText = 'margin-left:6px;font-size:13px;color:var(--danger);cursor:pointer;opacity:0.5;';
          del.onclick = async function (e) {
            e.stopPropagation();
            if (!confirm('\u5220\u9664\u6807\u7B7E "' + tag.name + '"\uFF1F')) return;
            await api('/api/tags/' + encodeURIComponent(tag.id), { method: 'DELETE' });
            if (state.activeTagFilter === tag.id) state.activeTagFilter = null;
            await Promise.all([refreshTags(), refreshNotes()]);
            setStatus('\u6807\u7B7E\u5DF2\u5220\u9664');
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

      // \u2500\u2500\u2500 Auto Tag Matching \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
      let autoTagTimer = null;

      function scheduleAutoTag() {
        clearTimeout(autoTagTimer);
        autoTagTimer = setTimeout(runAutoTag, 900);
      }

      const TAG_PALETTE = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#84cc16'];
      const TAG_STOPWORDS = new Set([
        '\u6211\u4EEC','\u4F60\u4EEC','\u4ED6\u4EEC','\u8FD9\u4E2A','\u90A3\u4E2A','\u4E00\u4E2A','\u4E00\u4E9B','\u4EC0\u4E48','\u56E0\u4E3A','\u6240\u4EE5','\u4F46\u662F','\u800C\u4E14','\u5982\u679C','\u867D\u7136','\u7136\u540E',
        '\u53EF\u4EE5','\u6CA1\u6709','\u5C31\u662F','\u8FD8\u662F','\u4EE5\u53CA','\u4E0D\u662F','\u81EA\u5DF1','\u73B0\u5728','\u5DF2\u7ECF','\u771F\u7684','\u53EF\u80FD','\u65F6\u5019','\u4E1C\u897F','\u5730\u65B9','\u4ECA\u5929',
        '\u660E\u5929','\u6628\u5929','\u9700\u8981','\u77E5\u9053','\u89C9\u5F97','\u5E0C\u671B','\u5E94\u8BE5','\u8FD9\u4E48','\u90A3\u6837','\u975E\u5E38','\u6BD4\u8F83','\u5F00\u59CB','\u7EE7\u7EED','\u6700\u540E','\u8FD9\u6837',
        '\u90A3\u4E9B','\u8FD9\u4E9B','\u6BD4\u5982','\u5176\u5B9E','\u611F\u89C9','\u6709\u70B9','\u5F88\u591A','\u5F88\u5C11','\u4E00\u76F4','\u5E76\u4E14','\u6216\u8005','\u5BF9\u4E8E','\u5173\u4E8E','\u901A\u8FC7','\u4E3A\u4E86',
        '\u4E0D\u8981','\u4E0D\u4F1A','\u4E0D\u80FD','\u600E\u4E48','\u600E\u6837','\u8BF7\u95EE','\u5927\u5BB6','\u670B\u53CB','\u4EC0\u4E48','\u6BCF\u6B21','\u975E\u5E38','\u771F\u7684','\u5DE5\u4F5C','\u751F\u6D3B','\u95EE\u9898',
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
          // drop candidates that start with a stopword ("\u4ECA\u5929\u7528" starts with \u4ECA\u5929)
          for (const sw of TAG_STOPWORDS) {
            if (n.length > sw.length && n.startsWith(sw)) return;
          }
          // require at least one CJK or alphanumeric char (pure punctuation/emoji rejected)
          if (!/[\u4E00-\u9FFF]/.test(n) && !/[a-zA-Z0-9]/.test(n)) return;
          if (seen.has(n)) return;
          seen.add(n);
          out.push(String(name).trim());
        }
        // Latin / tech terms (case preserved as typed)
        const latin = text.match(/[a-zA-Z][a-zA-Z0-9_.-]{1,19}/g) || [];
        latin.forEach(add);
        // CJK segments split on non-CJK delimiters
        const segs = text.split(/[^a-zA-Z0-9\u4E00-\u9FFF]+/).filter(function (s) {
          return /[\u4E00-\u9FFF]/.test(s) && s.length >= 2 && s.length <= 8 && !TAG_STOPWORDS.has(s.toLowerCase());
        });
        const segFreq = new Map();
        const gramFreq = new Map();
        segs.forEach(function (s) {
          segFreq.set(s, (segFreq.get(s) || 0) + 1);
          for (let i = 0; i <= s.length - 2; i++) {
            const g = s.slice(i, i + 2);
            if (/^[\u4E00-\u9FFF]{2}$/.test(g) && !TAG_STOPWORDS.has(g)) {
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
        // bigrams need to repeat at least 3x to be meaningful ("\u8BB0\u5E94" adjacent pairs are noise)
        gramFreq.forEach(function (c, g) { if (c >= 3) scored.push({ name: g, score: c * 2 }); });
        scored.sort(function (a, b) { return b.score - a.score; });
        scored.forEach(function (item) { add(item.name); });
        // drop candidates that are a substring of a longer one (keep "\u5065\u8EAB\u6253\u5361" over \u5065\u8EAB/\u8EAB\u6253/\u6253\u5361)
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
          // drop candidates that contain an existing tag name (redundant: "\u90E8\u7F72\u5F88\u5FEB" vs \u90E8\u7F72)
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
          setStatus('\u2728 \u81EA\u52A8\u751F\u6210\u6807\u7B7E: ' + created.join('\u3001'));
        } else {
          setEditorTagSelection(Array.from(wanted));
        }
      }

      // \u2500\u2500\u2500 Note Tags for Card \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
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

      // \u2500\u2500\u2500 Render \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
      function renderList() {
        els.noteList.innerHTML = '';
        els.noteCount.textContent = state.notes.length ? ('\u5171 ' + state.notes.length + ' \u6761') : '0 \u6761';

        if (!state.vaultUnlocked) {
          els.noteCount.textContent = state.noteCountMeta ? ('\u5171 ' + state.noteCountMeta + ' \u6761\uFF08\u5DF2\u52A0\u5BC6\uFF09') : '0 \u6761';
          els.noteList.innerHTML = '<div class="empty-feed"><span class="empty-icon">\u{1F512}</span><div class="empty-title">\u6B63\u6587\u5DF2\u52A0\u5BC6</div><div class="empty-hint">\u8BF7\u5148\u8F93\u5165\u89E3\u9501\u5BC6\u7801\u67E5\u770B\u7B14\u8BB0\u5185\u5BB9</div></div>';
          return;
        }

        if (!state.notes.length) {
          els.noteList.innerHTML = '<div class="empty-feed"><span class="empty-icon">\u{1F5D2}\uFE0F</span><div class="empty-title">\u6CA1\u6709\u7B14\u8BB0'
            + (state.activeTagFilter ? '\u5339\u914D\u5F53\u524D\u6807\u7B7E' : '')
            + '</div><div class="empty-hint">\u70B9\u51FB\u53F3\u4E0A\u89D2"\uFF0B \u65B0\u5EFA\u7B14\u8BB0"\uFF0C\u5199\u4E0B\u7B2C\u4E00\u7B14</div></div>';
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
            title.innerHTML = (note.is_pinned ? '<span title="\u7F6E\u9876">\u{1F4CC}</span> ' : '') + highlightText(note.title || '\u65E0\u6807\u9898', els.searchInput.value.trim());

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

            const pinBtn = iconBtn('\u{1F4CC}', note.is_pinned ? '\u53D6\u6D88\u7F6E\u9876' : '\u7F6E\u9876', '', async function () {
              await api('/api/notes/' + encodeURIComponent(note.id) + '/pin', { method: 'PUT' });
              await refreshNotes();
              setStatus(note.is_pinned ? '\u5DF2\u53D6\u6D88\u7F6E\u9876' : '\u5DF2\u7F6E\u9876');
            });

            const copyBtn = iconBtn('\u{1F4CB}', '\u590D\u5236', '', async function () {
              try { await navigator.clipboard.writeText(note.content || ''); setStatus('\u5DF2\u590D\u5236\uFF1A' + (note.title || '\u65E0\u6807\u9898')); }
              catch (e) { setStatus('\u590D\u5236\u5931\u8D25'); }
            });

            const editBtn = iconBtn('\u270F\uFE0F', '\u7F16\u8F91', '', function () { openComposer(note); });

            const shareBtn = iconBtn('\u{1F517}', '\u5206\u4EAB', '', function () { openShareDialog(note.id); });

            const exportBtn = iconBtn('\u{1F4E4}', '\u5BFC\u51FA Markdown', '', function () { exportSingleNote(note); });

            const deleteBtn = iconBtn('\u{1F5D1}', '\u5220\u9664', 'danger', function () { deleteNote(note.id).catch(function (e) { setStatus(e.message || '\u5220\u9664\u5931\u8D25'); }); });

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
            body.textContent = note.content ? dc.text : '\u8FD9\u6761\u7B14\u8BB0\u8FD8\u6CA1\u6709\u5185\u5BB9\u3002';
            const bodyWrap = document.createElement('div');
            bodyWrap.className = 'note-card-text-wrap' + (dc.canExpand && !dc.expanded ? ' collapsed' : '');
            bodyWrap.appendChild(body);
            card.appendChild(bodyWrap);

            if (dc.canExpand) {
              const toggleBtn = document.createElement('button');
              toggleBtn.type = 'button';
              toggleBtn.className = 'note-expand';
              toggleBtn.textContent = dc.expanded ? '\u6536\u8D77' : '\u5C55\u5F00\u5168\u6587';
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
            metaText.textContent = formatDate(note.updated_at) + ' \xB7 ' + wordCount(note.content) + ' \u5B57';
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
          els.trashList.innerHTML = '<div class="empty-feed"><span class="empty-icon">\u{1F5D1}\uFE0F</span><div class="empty-title">\u56DE\u6536\u7AD9\u662F\u7A7A\u7684</div><div class="empty-hint">\u5220\u9664\u7684\u7B14\u8BB0\u4F1A\u5728\u8FD9\u91CC\u4FDD\u7559 30 \u5929</div></div>';
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
          title.textContent = note.title || '\u65E0\u6807\u9898';
          const actions = document.createElement('div');
          actions.className = 'note-actions';
          const restoreBtn = document.createElement('button');
          restoreBtn.type = 'button';
          restoreBtn.className = 'icon-btn';
          restoreBtn.textContent = '\u267B\uFE0F';
          restoreBtn.title = '\u6062\u590D';
          restoreBtn.setAttribute('aria-label', '\u6062\u590D');
          restoreBtn.onclick = async function () {
            await api('/api/notes/' + encodeURIComponent(note.id) + '/restore', { method: 'POST' });
            setStatus('\u5DF2\u6062\u590D');
            loadTrash();
            refreshNotes();
            refreshTags();
          };
          const permBtn = document.createElement('button');
          permBtn.type = 'button';
          permBtn.className = 'icon-btn danger';
          permBtn.textContent = '\u{1F5D1}';
          permBtn.title = '\u6C38\u4E45\u5220\u9664';
          permBtn.setAttribute('aria-label', '\u6C38\u4E45\u5220\u9664');
          permBtn.onclick = async function () {
            if (!confirm('\u6C38\u4E45\u5220\u9664\u6B64\u7B14\u8BB0\uFF1F\u6B64\u64CD\u4F5C\u4E0D\u53EF\u6062\u590D\uFF01')) return;
            await api('/api/notes/' + encodeURIComponent(note.id) + '/permanent', { method: 'DELETE' });
            await cleanupZeroTags();
            setStatus('\u5DF2\u6C38\u4E45\u5220\u9664');
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
          metaText.textContent = '\u5220\u9664\u4E8E ' + formatDate(note.deleted_at) + ' \xB7 ' + wordCount(note.content) + ' \u5B57';
          foot.appendChild(metaText);
          card.appendChild(foot);
          els.trashList.appendChild(card);
        });
      }

      // \u2500\u2500\u2500 Data Operations \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
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
        } catch (e) { setStatus(e.message || '\u52A0\u8F7D\u56DE\u6536\u7AD9\u5931\u8D25'); }
      }

      function openComposer(note) {
        state.editingId = note ? note.id : null;
        state.composerSaved = false;
        state.autoCreatedTagIds = [];
        els.modalTitle.textContent = note ? '\u7F16\u8F91\u7B14\u8BB0' : '\u65B0\u5EFA\u7B14\u8BB0';
        els.editorTitle.value = note ? note.title : '';
        els.editorContent.value = note ? note.content : '';
        els.editorPinBtn.textContent = (note && note.is_pinned) ? '\u53D6\u6D88\u7F6E\u9876' : '\u{1F4CC} \u7F6E\u9876';
        els.editorPanel.classList.add('open');
        updateModalUi();
        els.editorTitle.focus();
        // Tags already came down with the note list \u2014 no extra round-trip needed
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
        const title = els.editorTitle.value.trim() || '\u65E0\u6807\u9898';
        const content = els.editorContent.value.trim();
        if (!title && !content) { setStatus('\u6807\u9898\u548C\u5185\u5BB9\u81F3\u5C11\u5199\u4E00\u4E2A'); return; }
        if (!state.vaultUnlocked || !state.vaultKey) { setStatus('\u8BF7\u5148\u8F93\u5165\u89E3\u9501\u5BC6\u94A5'); return; }
        setStatus('\u4FDD\u5B58\u4E2D\u2026');
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
        setStatus('\u5DF2\u4FDD\u5B58');
      }

      async function deleteNote(id) {
        if (!id) { setStatus('\u6CA1\u6709\u53EF\u5220\u9664\u7684\u7B14\u8BB0'); return; }
        if (!confirm('\u79FB\u5165\u56DE\u6536\u7AD9\uFF1F')) return;
        await api('/api/notes/' + encodeURIComponent(id), { method: 'DELETE' });
        await cleanupZeroTags();
        await Promise.all([refreshNotes(), refreshTags()]);
        setStatus('\u5DF2\u79FB\u5165\u56DE\u6536\u7AD9');
      }

      async function unlockVault(passphrase) {
        if (!passphrase) throw new Error('\u8BF7\u8F93\u5165\u5BC6\u7801');
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

      // \u2500\u2500\u2500 Export \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
      function exportSingleNote(note) {
        const md = '# ' + (note.title || '\u65E0\u6807\u9898') + '\\n\\n' + (note.content || '');
        downloadFile((note.title || 'note') + '.md', md, 'text/markdown');
        setStatus('\u5DF2\u5BFC\u51FA Markdown');
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
            let md = '# \u6211\u7684\u7B14\u8BB0\\n\\n';
            notes.forEach(function (n) { md += '## ' + (n.title || '\u65E0\u6807\u9898') + '\\n\\n' + (n.content || '') + '\\n\\n---\\n\\n'; });
            downloadFile('notes.md', md, 'text/markdown');
          }
          setStatus('\u5DF2\u5BFC\u51FA');
        } catch (e) { setStatus(e.message || '\u5BFC\u51FA\u5931\u8D25'); }
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

      // \u2500\u2500\u2500 WebDAV & Settings \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
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
          els.backupInfo.textContent = '\u4E0A\u6B21\u5907\u4EFD: ' + new Date(cfg.lastBackup).toLocaleString('zh-CN');
        } else {
          els.backupInfo.textContent = '\u5C1A\u672A\u5907\u4EFD\u8FC7';
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
        if (!cfg.url) throw new Error('\u8BF7\u5148\u914D\u7F6E WebDAV \u670D\u52A1\u5668\u5730\u5740');
        return cfg.url.replace(/\\/+$/, '');
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
        const url = webdavBaseUrl() + '/' + path.replace(/^\\/+/, '');
        const data = await webdavProxy(method, url, body, { contentType: contentType });
        if (!data.ok) {
          if (data.status === 0) throw new Error('\u65E0\u6CD5\u8FDE\u63A5 WebDAV \u670D\u52A1\u5668\uFF0C\u8BF7\u68C0\u67E5\u5730\u5740\u4E0E\u7F51\u7EDC');
          throw new Error('WebDAV \u8BF7\u6C42\u5931\u8D25 (' + data.status + '): ' + (data.body || '').slice(0, 100) || data.statusText);
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
        if (!cfg.url) throw new Error('\u8BF7\u586B\u5199\u670D\u52A1\u5668\u5730\u5740');
        const data = await webdavProxy('PROPFIND', cfg.url.replace(/\\/+$/, ''), undefined, { depth: '0' });
        if (data.status < 200 || data.status >= 300) {
          if (data.status === 0) throw new Error('\u65E0\u6CD5\u8FDE\u63A5\u670D\u52A1\u5668\uFF0C\u8BF7\u68C0\u67E5\u5730\u5740\u4E0E\u7F51\u7EDC');
          throw new Error('\u8FDE\u63A5\u5931\u8D25 (' + data.status + '): ' + data.statusText);
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
        els.webdavBackupBtn.textContent = '\u5907\u4EFD\u4E2D\u2026';
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
          setStatus('\u5907\u4EFD\u6210\u529F (' + data.notes.length + ' \u6761\u7B14\u8BB0)');
        } catch (e) {
          setStatus('\u5907\u4EFD\u5931\u8D25: ' + e.message);
        } finally {
          els.webdavBackupBtn.disabled = false;
          els.webdavBackupBtn.textContent = '\u{1F4E4} \u5907\u4EFD\u5230 WebDAV';
        }
      }

      async function restoreFromWebdav() {
        if (!confirm('\u4ECE WebDAV \u6062\u590D\u5C06\u8FFD\u52A0\u7B14\u8BB0\u5230\u5F53\u524D\u8D26\u6237\uFF0C\u4E0D\u4F1A\u8986\u76D6\u73B0\u6709\u7B14\u8BB0\u3002\u786E\u5B9A\u7EE7\u7EED\uFF1F')) return;
        els.webdavRestoreBtn.disabled = true;
        els.webdavRestoreBtn.textContent = '\u6062\u590D\u4E2D\u2026';
        try {
          const res = await webdavRequest('edge-notes/backup-latest.json', 'GET');
          const data = await res.json();
          showImportPreview(data);
        } catch (e) {
          setStatus('\u6062\u590D\u5931\u8D25: ' + e.message);
        } finally {
          els.webdavRestoreBtn.disabled = false;
          els.webdavRestoreBtn.textContent = '\u{1F4E5} \u4ECE WebDAV \u6062\u590D';
        }
      }

      function showImportPreview(data) {
        if (!data || !Array.isArray(data.notes)) {
          setStatus('\u65E0\u6548\u7684\u5907\u4EFD\u6587\u4EF6');
          return;
        }
        const noteCount = data.notes.length;
        const tagCount = (data.tags || []).length;
        const backupDate = data.exported_at ? new Date(data.exported_at).toLocaleString('zh-CN') : '\u672A\u77E5';
        const app = data.app || 'unknown';
        els.importPreview.innerHTML =
          '<div class="import-stat"><span>\u6765\u6E90\u5E94\u7528</span><span>' + escapeHtml(app) + '</span></div>' +
          '<div class="import-stat"><span>\u5907\u4EFD\u65F6\u95F4</span><span>' + backupDate + '</span></div>' +
          '<div class="import-stat"><span>\u7B14\u8BB0\u6570\u91CF</span><span>' + noteCount + ' \u6761</span></div>' +
          '<div class="import-stat"><span>\u6807\u7B7E\u6570\u91CF</span><span>' + tagCount + ' \u4E2A</span></div>';
        els.importModal.classList.remove('hidden');
        els.importModal._importData = data;
      }

      async function confirmImport() {
        const data = els.importModal._importData;
        if (!data) return;
        els.confirmImportBtn.disabled = true;
        els.confirmImportBtn.textContent = '\u5BFC\u5165\u4E2D\u2026';
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
          setStatus('\u5BFC\u5165\u5B8C\u6210: ' + stats.notes + ' \u6761\u7B14\u8BB0, ' + stats.tags + ' \u4E2A\u65B0\u6807\u7B7E');
        } catch (e) {
          setStatus('\u5BFC\u5165\u5931\u8D25: ' + e.message);
        } finally {
          els.confirmImportBtn.disabled = false;
          els.confirmImportBtn.textContent = '\u786E\u8BA4\u5BFC\u5165';
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
            setStatus('\u6587\u4EF6\u89E3\u6790\u5931\u8D25: ' + err.message);
          }
        };
        reader.readAsText(file);
      }

      // \u2500\u2500\u2500 Auto Backup \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
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
          els.autoBackupLabel.textContent = cfg.enabled ? '\u5F00' : '\u5173';
          els.autoBackupLabel.className = 'toggle-label' + (cfg.enabled ? ' on' : '');
        }
        if (!cfg.enabled) { el.textContent = '\u5B9A\u65F6\u5907\u4EFD\u5DF2\u5173\u95ED'; return; }
        var dayNames = ['\u65E5','\u4E00','\u4E8C','\u4E09','\u56DB','\u4E94','\u516D'];
        var days = (cfg.days || [1,2,3,4,5]).map(function (d) { return '\u5468' + dayNames[d]; }).join('\u3001');
        var time = cfg.time || '03:00';
        var keep = cfg.keepCount || 7;
        var last = cfg.lastBackup;
        el.textContent = '\u6BCF\u5468 ' + days + ' ' + time + ' \xB7 \u4FDD\u7559 ' + keep + ' \u4EFD' +
          (last ? ' \xB7 \u4E0A\u6B21: ' + new Date(last).toLocaleString('zh-CN') : '');
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
          var re = /backup-[A-Za-z0-9._-]*\\.json/gi;
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

      // \u2500\u2500\u2500 Share \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
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
            els.shareLinks.innerHTML = '<div class="muted" style="text-align:center; padding:12px;">\u6682\u65E0\u5206\u4EAB\u94FE\u63A5</div>';
            return;
          }
          shares.forEach(function (s) {
            const item = document.createElement('div');
            item.className = 'share-link-item';
            const url = window.location.origin + '/s/' + s.token;
            item.innerHTML = '<span class="share-link-url">' + url + '</span>';
            if (s.expires_at) {
              item.innerHTML += '<span class="share-link-exp">\u8FC7\u671F: ' + formatDate(s.expires_at) + '</span>';
            }
            const copyBtn = document.createElement('button');
            copyBtn.className = 'btn secondary small';
            copyBtn.textContent = '\u590D\u5236';
            copyBtn.onclick = async function () {
              await navigator.clipboard.writeText(url);
              setStatus('\u94FE\u63A5\u5DF2\u590D\u5236');
            };
            const revokeBtn = document.createElement('button');
            revokeBtn.className = 'btn danger small';
            revokeBtn.textContent = '\u64A4\u9500';
            revokeBtn.onclick = async function () {
              await api('/api/shares/' + encodeURIComponent(s.token), { method: 'DELETE' });
              setStatus('\u5DF2\u64A4\u9500\u5206\u4EAB');
              loadShareLinks(noteId);
            };
            item.appendChild(copyBtn);
            item.appendChild(revokeBtn);
            els.shareLinks.appendChild(item);
          });
        } catch (e) { setStatus(e.message || '\u52A0\u8F7D\u5206\u4EAB\u94FE\u63A5\u5931\u8D25'); }
      }

      // \u2500\u2500\u2500 Image Upload \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
      async function uploadImage(file) {
        if (!file || !file.type.startsWith('image/')) { setStatus('\u8BF7\u9009\u62E9\u56FE\u7247\u6587\u4EF6'); return; }
        if (file.size > 5 * 1024 * 1024) { setStatus('\u56FE\u7247\u6700\u5927 5MB'); return; }
        setStatus('\u4E0A\u4F20\u4E2D\u2026');
        try {
          const res = await fetch('/api/images/upload' + (state.editingId ? '?noteId=' + encodeURIComponent(state.editingId) : ''), {
            method: 'POST', credentials: 'same-origin',
            headers: { 'Content-Type': file.type },
            body: await file.arrayBuffer()
          });
          const data = await res.json();
          if (!data.ok) throw new Error(data.error || '\u4E0A\u4F20\u5931\u8D25');
          const mdImage = '![' + file.name + '](' + data.url + ')';
          const ta = els.editorContent;
          const pos = ta.selectionStart;
          ta.value = ta.value.slice(0, pos) + mdImage + '\\n' + ta.value.slice(pos);
          ta.selectionStart = ta.selectionEnd = pos + mdImage.length + 1;
          ta.focus();
          setStatus('\u56FE\u7247\u5DF2\u63D2\u5165');
        } catch (e) { setStatus(e.message || '\u4E0A\u4F20\u5931\u8D25'); }
      }

      // \u2500\u2500\u2500 Event Bindings \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
      els.loginBtn.onclick = async function () {
        try {
          const unlockOnly = state.sessionAuthenticated && !state.vaultUnlocked;
          els.loginStatus.textContent = unlockOnly ? '\u89E3\u9501\u4E2D\u2026' : '\u767B\u5F55\u4E2D\u2026';
          const password = els.passwordInput.value.trim();
          if (!password) throw new Error('\u8BF7\u8F93\u5165\u5BC6\u7801');
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
          setStatus(unlockOnly ? '\u5DF2\u89E3\u9501' : '\u5DF2\u767B\u5F55\u5E76\u89E3\u9501');
          els.loginStatus.textContent = '';
        } catch (error) {
          state.vaultUnlocked = false; state.vaultKey = null;
          if (state.sessionAuthenticated) {
            state.unlockError = '\u5F53\u524D\u5BC6\u7801\u65E0\u6CD5\u89E3\u9501\u73B0\u6709\u52A0\u5BC6\u7B14\u8BB0';
            await refreshMeta(); showLogin();
          } else { showLogin(); }
          els.loginStatus.textContent = error.message || '\u767B\u5F55\u5931\u8D25';
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

      // \u2500\u2500\u2500 Sidebar navigation \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
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
            els.feedDesc.textContent = tag ? ('\u6807\u7B7E: ' + tag.name) : '\u5168\u90E8\u7B14\u8BB0';
          } else {
            els.feedDesc.textContent = '\u6309\u66F4\u65B0\u65F6\u95F4\u6392\u5E8F\uFF0C\u652F\u6301\u641C\u7D22\u548C\u6807\u7B7E\u7B5B\u9009\u3002';
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
      els.saveBtn.onclick = function () { saveComposer().catch(function (e) { setStatus(e.message || '\u4FDD\u5B58\u5931\u8D25'); }); };

      // One-click clear of all selected tags in the editor
      els.clearTagBtn.onclick = function () {
        setEditorTagSelection([]);
        setStatus('\u5DF2\u6E05\u9664\u5168\u90E8\u6807\u7B7E');
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
        setStatus('\u6807\u7B7E\u5DF2\u521B\u5EFA');
      };

      els.newTagInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') els.addTagBtn.click(); });

      els.editorPinBtn.onclick = async function () {
        if (!state.editingId) { setStatus('\u8BF7\u5148\u4FDD\u5B58\u7B14\u8BB0\u540E\u518D\u7F6E\u9876'); return; }
        await api('/api/notes/' + encodeURIComponent(state.editingId) + '/pin', { method: 'PUT' });
        await refreshNotes();
        setStatus('\u7F6E\u9876\u72B6\u6001\u5DF2\u66F4\u65B0');
      };

      els.editorShareBtn.onclick = function () {
        if (!state.editingId) { setStatus('\u8BF7\u5148\u4FDD\u5B58\u7B14\u8BB0\u540E\u518D\u5206\u4EAB'); return; }
        openShareDialog(state.editingId);
      };

      els.editorExportBtn.onclick = function () {
        if (!state.editingId) { setStatus('\u8BF7\u5148\u4FDD\u5B58\u7B14\u8BB0\u540E\u518D\u5BFC\u51FA'); return; }
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
        setStatus('\u5206\u4EAB\u94FE\u63A5\u5DF2\u521B\u5EFA');
        loadShareLinks(currentShareNoteId);
      };

      // \u2500\u2500\u2500 Settings Event Listeners \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
      els.webdavSaveBtn.onclick = function () {
        saveWebdavConfig({
          url: els.webdavUrl.value.trim(),
          user: els.webdavUser.value.trim(),
          pass: els.webdavPass.value,
          lastBackup: getWebdavConfig().lastBackup || null,
        });
        els.webdavStatus.textContent = '\u2713 \u914D\u7F6E\u5DF2\u4FDD\u5B58';
        els.webdavStatus.style.color = 'var(--accent)';
        setTimeout(function () { els.webdavStatus.textContent = ''; }, 2000);
        setStatus('WebDAV \u914D\u7F6E\u5DF2\u4FDD\u5B58');
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
        els.webdavTestBtn.textContent = '\u6D4B\u8BD5\u4E2D\u2026';
        try {
          await webdavTestConnection();
          els.webdavStatus.textContent = '\u2713 \u8FDE\u63A5\u6210\u529F';
          els.webdavStatus.style.color = 'var(--accent)';
          setStatus('WebDAV \u8FDE\u63A5\u6210\u529F');
        } catch (e) {
          els.webdavStatus.textContent = '\u2717 ' + e.message;
          els.webdavStatus.style.color = 'var(--danger)';
          setStatus('\u8FDE\u63A5\u5931\u8D25: ' + e.message);
        } finally {
          els.webdavTestBtn.disabled = false;
          els.webdavTestBtn.textContent = '\u6D4B\u8BD5\u8FDE\u63A5';
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
          saveComposer().catch(function (err) { setStatus(err.message || '\u4FDD\u5B58\u5931\u8D25'); });
        }
      });

      // \u2500\u2500\u2500 Init \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
      updateSearchUi(); updateModalUi();
      checkSession().catch(function () { showLogin(); });
      startAutoBackupTimer();
    <\/script>
  </body>
</html>`;

// src/auth.ts
var SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
var LOGIN_MAX_FAILED_ATTEMPTS = 5;
var LOGIN_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1e3;
var LOGIN_LOCKOUT_MS = 15 * 60 * 1e3;
var DEFAULT_VAULT_ID = "default";
function getCookie(request, name) {
  const cookie = request.headers.get("cookie") || "";
  const parts = cookie.split(";").map((item) => item.trim());
  const prefix = name + "=";
  for (const part of parts) {
    if (part.startsWith(prefix)) return decodeURIComponent(part.slice(prefix.length));
  }
  return "";
}
__name(getCookie, "getCookie");
function base64UrlEncode(input) {
  const bytes = typeof input === "string" ? new TextEncoder().encode(input) : input;
  let binary = "";
  const chunkSize = 32768;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
__name(base64UrlEncode, "base64UrlEncode");
function base64UrlDecode(input) {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - input.length % 4) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}
__name(base64UrlDecode, "base64UrlDecode");
async function hmacSha256Base64Url(secret, data) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return base64UrlEncode(new Uint8Array(signature));
}
__name(hmacSha256Base64Url, "hmacSha256Base64Url");
function safeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}
__name(safeEqual, "safeEqual");
function normalizeVaultId(value) {
  const normalized = value.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "-").replace(/-+/g, "-");
  return normalized.replace(/^-|-$/g, "") || DEFAULT_VAULT_ID;
}
__name(normalizeVaultId, "normalizeVaultId");
function getVaultCredentials(env) {
  const credentials = [];
  if (env.APP_PASSWORD) {
    credentials.push({ vaultId: DEFAULT_VAULT_ID, password: env.APP_PASSWORD });
  }
  const extra = env.APP_PASSWORDS || "";
  for (const item of extra.split(",")) {
    const trimmed = item.trim();
    if (!trimmed) continue;
    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex <= 0) continue;
    const vaultId = normalizeVaultId(trimmed.slice(0, separatorIndex));
    const password = trimmed.slice(separatorIndex + 1).trim();
    if (!password) continue;
    credentials.push({ vaultId, password });
  }
  return credentials;
}
__name(getVaultCredentials, "getVaultCredentials");
function isAuthConfigured(env) {
  return Boolean(env.COOKIE_SECRET && getVaultCredentials(env).length > 0);
}
__name(isAuthConfigured, "isAuthConfigured");
function getConfiguredVaultCount(env) {
  return getVaultCredentials(env).length;
}
__name(getConfiguredVaultCount, "getConfiguredVaultCount");
async function getVaultIdForPassword(env, password) {
  for (const credential of getVaultCredentials(env)) {
    if (safeEqual(password, credential.password)) return credential.vaultId;
  }
  return null;
}
__name(getVaultIdForPassword, "getVaultIdForPassword");
async function createSessionToken(env, vaultId = DEFAULT_VAULT_ID) {
  if (!env.COOKIE_SECRET) return "";
  const now = Math.floor(Date.now() / 1e3);
  const payload = base64UrlEncode(
    JSON.stringify({
      v: 1,
      vaultId: normalizeVaultId(vaultId),
      iat: now,
      exp: now + SESSION_MAX_AGE_SECONDS
    })
  );
  const signature = await hmacSha256Base64Url(env.COOKIE_SECRET, payload);
  return `${payload}.${signature}`;
}
__name(createSessionToken, "createSessionToken");
async function verifySessionToken(env, token) {
  if (!env.COOKIE_SECRET) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature || token.split(".").length !== 2) return null;
  const expected = await hmacSha256Base64Url(env.COOKIE_SECRET, payload);
  if (!safeEqual(signature, expected)) return null;
  try {
    const data = JSON.parse(base64UrlDecode(payload));
    if (data.v !== 1 || typeof data.exp !== "number" || data.exp <= Math.floor(Date.now() / 1e3)) {
      return null;
    }
    return normalizeVaultId(data.vaultId || DEFAULT_VAULT_ID);
  } catch {
    return null;
  }
}
__name(verifySessionToken, "verifySessionToken");
async function getSession(request, env) {
  if (!isAuthConfigured(env)) {
    return { authenticated: true, vaultId: DEFAULT_VAULT_ID };
  }
  const session = getCookie(request, "session");
  if (!session) return { authenticated: false, vaultId: DEFAULT_VAULT_ID };
  const vaultId = await verifySessionToken(env, session);
  return vaultId ? { authenticated: true, vaultId } : { authenticated: false, vaultId: DEFAULT_VAULT_ID };
}
__name(getSession, "getSession");
async function isAuthed(request, env) {
  return (await getSession(request, env)).authenticated;
}
__name(isAuthed, "isAuthed");
async function getAuthedVaultId(request, env) {
  return (await getSession(request, env)).vaultId;
}
__name(getAuthedVaultId, "getAuthedVaultId");
function getClientIp(request) {
  return request.headers.get("cf-connecting-ip") || request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}
__name(getClientIp, "getClientIp");
async function getLoginRateLimitKey(request, env) {
  const userAgent = (request.headers.get("user-agent") || "unknown").slice(0, 160);
  return hmacSha256Base64Url(env.COOKIE_SECRET || "missing-secret", `login:${getClientIp(request)}:${userAgent}`);
}
__name(getLoginRateLimitKey, "getLoginRateLimitKey");
async function getLoginRateLimit(request, env) {
  const key = await getLoginRateLimitKey(request, env);
  const now = Date.now();
  const row = await env.DB.prepare(
    `SELECT attempts, first_attempt_at, locked_until
		 FROM auth_rate_limits
		 WHERE key = ?
		 LIMIT 1`
  ).bind(key).first();
  if (row?.locked_until && row.locked_until > now) {
    return {
      key,
      limited: true,
      retryAfterSeconds: Math.ceil((row.locked_until - now) / 1e3)
    };
  }
  return {
    key,
    limited: false,
    retryAfterSeconds: 0
  };
}
__name(getLoginRateLimit, "getLoginRateLimit");
async function recordFailedLogin(env, key) {
  const now = Date.now();
  const row = await env.DB.prepare(
    `SELECT attempts, first_attempt_at
		 FROM auth_rate_limits
		 WHERE key = ?
		 LIMIT 1`
  ).bind(key).first();
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
  ).bind(key, attempts, firstAttemptAt, lockedUntil, now).run();
  return {
    attempts,
    locked: lockedUntil > now,
    retryAfterSeconds: lockedUntil > now ? Math.ceil((lockedUntil - now) / 1e3) : 0
  };
}
__name(recordFailedLogin, "recordFailedLogin");
async function clearFailedLogins(env, key) {
  await env.DB.prepare("DELETE FROM auth_rate_limits WHERE key = ?").bind(key).run();
}
__name(clearFailedLogins, "clearFailedLogins");
async function cleanupOldLoginRateLimits(env) {
  const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1e3;
  await env.DB.prepare("DELETE FROM auth_rate_limits WHERE updated_at < ?").bind(cutoff).run();
}
__name(cleanupOldLoginRateLimits, "cleanupOldLoginRateLimits");
function tooManyLoginAttempts(retryAfterSeconds) {
  const minutes = Math.max(1, Math.ceil(retryAfterSeconds / 60));
  return new Response(
    JSON.stringify(
      {
        ok: false,
        error: `\u767B\u5F55\u5931\u8D25\u6B21\u6570\u8FC7\u591A\uFF0C\u8BF7 ${minutes} \u5206\u949F\u540E\u518D\u8BD5`,
        retryAfterSeconds
      },
      null,
      2
    ),
    {
      status: 429,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
        "retry-after": String(retryAfterSeconds)
      }
    }
  );
}
__name(tooManyLoginAttempts, "tooManyLoginAttempts");

// src/index.ts
function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...extraHeaders
    }
  });
}
__name(json, "json");
function html(content) {
  return new Response(content, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}
__name(html, "html");
function unauthorized() {
  return json({ ok: false, error: "unauthorized" }, 401);
}
__name(unauthorized, "unauthorized");
async function listNotes(env, vaultId, includeDeleted = false) {
  let whereClause = "vault_id = ?";
  if (!includeDeleted) {
    whereClause += " AND deleted_at IS NULL";
  }
  const result = await env.DB.prepare(
    `SELECT id, title, content, created_at, updated_at, is_pinned, deleted_at
		 FROM notes
		 WHERE ${whereClause}
		 ORDER BY is_pinned DESC, updated_at DESC
		 LIMIT 1000`
  ).bind(vaultId).all();
  return result.results ?? [];
}
__name(listNotes, "listNotes");
async function attachNoteTags(env, vaultId, notes) {
  if (!notes.length) return notes;
  const rels = await env.DB.prepare(
    `SELECT nt.note_id, t.id, t.name, t.color
		 FROM note_tags nt
		 JOIN tags t ON t.id = nt.tag_id
		 JOIN notes n ON n.id = nt.note_id
		 WHERE n.vault_id = ?`
  ).bind(vaultId).all();
  const map = /* @__PURE__ */ new Map();
  for (const r of rels.results ?? []) {
    if (!map.has(r.note_id)) map.set(r.note_id, []);
    map.get(r.note_id).push({ id: r.id, name: r.name, color: r.color });
  }
  return notes.map((n) => ({ ...n, tags: map.get(n.id) ?? [] }));
}
__name(attachNoteTags, "attachNoteTags");
async function listTrashNotes(env, vaultId) {
  const result = await env.DB.prepare(
    `SELECT id, title, content, created_at, updated_at, is_pinned, deleted_at
		 FROM notes
		 WHERE vault_id = ? AND deleted_at IS NOT NULL
		 ORDER BY deleted_at DESC
		 LIMIT 500`
  ).bind(vaultId).all();
  return result.results ?? [];
}
__name(listTrashNotes, "listTrashNotes");
async function getNote(env, id, vaultId) {
  return env.DB.prepare(
    `SELECT id, title, content, created_at, updated_at, is_pinned, deleted_at
		 FROM notes
		 WHERE id = ? AND vault_id = ?
		 LIMIT 1`
  ).bind(id, vaultId).first();
}
__name(getNote, "getNote");
var schemaReady = null;
async function ensureNotesSchema(env) {
  if (!schemaReady) {
    schemaReady = runSchemaMigrations(env).catch((err) => {
      schemaReady = null;
      throw err;
    });
  }
  return schemaReady;
}
__name(ensureNotesSchema, "ensureNotesSchema");
async function runSchemaMigrations(env) {
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
  const columns = await env.DB.prepare("PRAGMA table_info(notes)").all();
  const colNames = (columns.results ?? []).map((c) => c.name);
  const addColumns = [];
  if (!colNames.includes("vault_id")) {
    addColumns.push(`ALTER TABLE notes ADD COLUMN vault_id TEXT NOT NULL DEFAULT 'default'`);
  }
  if (!colNames.includes("is_pinned")) {
    addColumns.push(`ALTER TABLE notes ADD COLUMN is_pinned INTEGER NOT NULL DEFAULT 0`);
  }
  if (!colNames.includes("deleted_at")) {
    addColumns.push(`ALTER TABLE notes ADD COLUMN deleted_at INTEGER DEFAULT NULL`);
  }
  for (const sql of addColumns) {
    await env.DB.prepare(sql).run();
  }
  await env.DB.batch([
    env.DB.prepare(`CREATE INDEX IF NOT EXISTS idx_notes_updated_at ON notes(updated_at DESC)`),
    env.DB.prepare(`CREATE INDEX IF NOT EXISTS idx_notes_vault_updated_at ON notes(vault_id, updated_at DESC)`),
    env.DB.prepare(`CREATE INDEX IF NOT EXISTS idx_notes_pinned ON notes(vault_id, is_pinned DESC, updated_at DESC)`),
    env.DB.prepare(`CREATE INDEX IF NOT EXISTS idx_notes_trash ON notes(vault_id, deleted_at)`),
    env.DB.prepare(`CREATE VIRTUAL TABLE IF NOT EXISTS notes_fts USING fts5(id UNINDEXED, title, content)`),
    env.DB.prepare(`CREATE TRIGGER IF NOT EXISTS notes_ai AFTER INSERT ON notes BEGIN
			INSERT INTO notes_fts (id, title, content) VALUES (new.id, new.title, new.content);
		END`),
    env.DB.prepare(`CREATE TRIGGER IF NOT EXISTS notes_au AFTER UPDATE ON notes BEGIN
			DELETE FROM notes_fts WHERE id = old.id;
			INSERT INTO notes_fts (id, title, content) VALUES (new.id, new.title, new.content);
		END`),
    env.DB.prepare(`CREATE TRIGGER IF NOT EXISTS notes_ad AFTER DELETE ON notes BEGIN
			DELETE FROM notes_fts WHERE id = old.id;
		END`),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS app_meta (
			key TEXT PRIMARY KEY,
			value TEXT NOT NULL
		)`),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS tags (
			id TEXT PRIMARY KEY, vault_id TEXT NOT NULL DEFAULT 'default',
			name TEXT NOT NULL, color TEXT DEFAULT '#6366f1', created_at INTEGER NOT NULL
		)`),
    env.DB.prepare(`CREATE INDEX IF NOT EXISTS idx_tags_vault ON tags(vault_id)`),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS note_tags (
			note_id TEXT NOT NULL, tag_id TEXT NOT NULL, PRIMARY KEY (note_id, tag_id)
		)`),
    env.DB.prepare(`CREATE INDEX IF NOT EXISTS idx_note_tags_tag ON note_tags(tag_id)`),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS note_images (
			id TEXT PRIMARY KEY, note_id TEXT NOT NULL DEFAULT '', vault_id TEXT NOT NULL DEFAULT 'default',
			filename TEXT NOT NULL, content_type TEXT NOT NULL, size INTEGER NOT NULL,
			r2_key TEXT NOT NULL, created_at INTEGER NOT NULL
		)`),
    env.DB.prepare(`CREATE INDEX IF NOT EXISTS idx_note_images_vault ON note_images(vault_id)`),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS note_shares (
			token TEXT PRIMARY KEY, note_id TEXT NOT NULL, vault_id TEXT NOT NULL,
			created_at INTEGER NOT NULL, expires_at INTEGER DEFAULT NULL, is_active INTEGER NOT NULL DEFAULT 1
		)`),
    env.DB.prepare(`CREATE INDEX IF NOT EXISTS idx_note_shares_note ON note_shares(note_id)`)
  ]);
}
__name(runSchemaMigrations, "runSchemaMigrations");
async function getMeta(env, key) {
  const row = await env.DB.prepare(`SELECT value FROM app_meta WHERE key = ? LIMIT 1`).bind(key).first();
  return row?.value ?? null;
}
__name(getMeta, "getMeta");
async function setMeta(env, key, value) {
  await env.DB.prepare(`INSERT INTO app_meta (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value`).bind(key, value).run();
}
__name(setMeta, "setMeta");
function bytesToBase64(bytes) {
  let binary = "";
  const chunkSize = 32768;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }
  return btoa(binary);
}
__name(bytesToBase64, "bytesToBase64");
async function getOrCreateVaultSalt(env, vaultId) {
  await ensureNotesSchema(env);
  const key = vaultId === "default" ? "vault_salt" : `vault_salt:${vaultId}`;
  const existing = await getMeta(env, key);
  if (existing) return existing;
  const salt = bytesToBase64(crypto.getRandomValues(new Uint8Array(16)));
  await setMeta(env, key, salt);
  return salt;
}
__name(getOrCreateVaultSalt, "getOrCreateVaultSalt");
var appIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <path d="M32 4L58 32L32 60L6 32Z" fill="#6366f1"/>
  <path d="M32 4L58 32L32 34Z" fill="#818cf8"/>
  <path d="M32 4L6 32L32 34Z" fill="#4f46e5"/>
</svg>`;
var manifestJson = JSON.stringify({
  name: "\u6211\u7684\u7B14\u8BB0",
  short_name: "\u7B14\u8BB0",
  description: "\u4E00\u4E2A\u90E8\u7F72\u5728 Cloudflare Workers \u4E0A\u7684\u7B80\u6D01\u79C1\u4EBA\u7B14\u8BB0\u3002",
  start_url: "/",
  scope: "/",
  display: "standalone",
  background_color: "#f5f5f5",
  theme_color: "#6366f1",
  icons: [{ src: "/app-icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any maskable" }]
});
var serviceWorkerJs = `const CACHE_NAME = 'private-notes-shell-v2';
const APP_SHELL = ['/', '/manifest.webmanifest', '/app-icon.svg'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(APP_SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.pathname.startsWith('/api/') || u.pathname.startsWith('/s/')) return;
  if (r.mode === 'navigate') { e.respondWith(fetch(r).catch(() => caches.match('/'))); return; }
  e.respondWith(caches.match(r).then(c => c || fetch(r).then(res => { if (res && res.status === 200) { const cl = res.clone(); caches.open(CACHE_NAME).then(cache => cache.put(r, cl)); } return res; })));
});`;
function sharePageHtml(title, content, createdAt, updatedAt) {
  const safeTitle = title.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const safeContent = content.replace(/</g, "&lt;").replace(/>/g, "&gt;");
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
<div class="brand"><div class="brand-icon">\u{1F48E}</div>Edge Notes</div>
<div class="card">
<h1>${safeTitle}</h1>
<div class="meta">
<span>\u521B\u5EFA: ${new Date(createdAt).toLocaleDateString("zh-CN")}</span>
<span>\u66F4\u65B0: ${new Date(updatedAt).toLocaleDateString("zh-CN")}</span>
</div>
<div class="content">${safeContent}</div>
</div>
<div class="footer">Shared via Edge Notes \xB7 E2EE</div>
</div>
</body>
</html>`;
}
__name(sharePageHtml, "sharePageHtml");
var index_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/manifest.webmanifest") {
      return new Response(manifestJson, { headers: { "content-type": "application/manifest+json; charset=utf-8", "cache-control": "public, max-age=3600" } });
    }
    if (url.pathname === "/sw.js") {
      return new Response(serviceWorkerJs, { headers: { "content-type": "application/javascript; charset=utf-8", "cache-control": "no-store" } });
    }
    if (url.pathname === "/app-icon.svg") {
      return new Response(appIconSvg, { headers: { "content-type": "image/svg+xml; charset=utf-8", "cache-control": "public, max-age=86400" } });
    }
    if (url.pathname === "/") {
      return html(blogHomeHtml);
    }
    if (url.pathname.startsWith("/s/") && request.method === "GET") {
      await ensureNotesSchema(env);
      const token = url.pathname.slice(3);
      if (!token) return html(sharePageHtml("404", "\u5206\u4EAB\u94FE\u63A5\u4E0D\u5B58\u5728", 0, 0));
      const share = await env.DB.prepare(
        `SELECT * FROM note_shares WHERE token = ? AND is_active = 1 LIMIT 1`
      ).bind(token).first();
      if (!share) return html(sharePageHtml("\u94FE\u63A5\u65E0\u6548", "\u6B64\u5206\u4EAB\u94FE\u63A5\u4E0D\u5B58\u5728\u6216\u5DF2\u88AB\u64A4\u9500\u3002", 0, 0));
      if (share.expires_at && share.expires_at < Date.now()) {
        return html(sharePageHtml("\u94FE\u63A5\u5DF2\u8FC7\u671F", "\u6B64\u5206\u4EAB\u94FE\u63A5\u5DF2\u8FC7\u671F\u3002", 0, 0));
      }
      const note = await env.DB.prepare(
        `SELECT id, title, content, created_at, updated_at FROM notes WHERE id = ? AND vault_id = ? LIMIT 1`
      ).bind(share.note_id, share.vault_id).first();
      if (!note) return html(sharePageHtml("\u7B14\u8BB0\u4E0D\u5B58\u5728", "\u6B64\u7B14\u8BB0\u53EF\u80FD\u5DF2\u88AB\u5220\u9664\u3002", 0, 0));
      return html(sharePageHtml(note.title, note.content, note.created_at, note.updated_at));
    }
    if (url.pathname.startsWith("/_/images/") && request.method === "GET") {
      if (!env.IMAGES) return new Response("Image storage not configured", { status: 503 });
      const key = decodeURIComponent(url.pathname.slice(11));
      const object = await env.IMAGES.get(key);
      if (!object) return new Response("Not found", { status: 404 });
      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set("etag", object.httpEtag);
      headers.set("cache-control", "public, max-age=31536000");
      return new Response(object.body, { headers });
    }
    if (url.pathname === "/api/health" && request.method === "GET") {
      await ensureNotesSchema(env);
      const session = await getSession(request, env);
      if (isAuthConfigured(env) && !session.authenticated) return unauthorized();
      const result = await env.DB.prepare("SELECT COUNT(*) AS note_count FROM notes WHERE vault_id = ? AND deleted_at IS NULL").bind(session.vaultId).first();
      return json({ ok: true, noteCount: result?.note_count ?? 0, authEnabled: isAuthConfigured(env), vaultCount: getConfiguredVaultCount(env), now: Date.now() });
    }
    if (url.pathname === "/api/session" && request.method === "GET") {
      const session = await getSession(request, env);
      return json({ ok: true, authenticated: session.authenticated, vaultId: session.vaultId });
    }
    if (url.pathname === "/api/login" && request.method === "POST") {
      if (!isAuthConfigured(env)) return json({ ok: false, error: "server auth not configured" }, 500);
      const rateLimit = await getLoginRateLimit(request, env);
      if (rateLimit.limited) return tooManyLoginAttempts(rateLimit.retryAfterSeconds);
      const body = await request.json().catch(() => null);
      const vaultId = body?.password ? await getVaultIdForPassword(env, body.password) : null;
      if (!vaultId) {
        const failure = await recordFailedLogin(env, rateLimit.key);
        if (failure.locked) return tooManyLoginAttempts(failure.retryAfterSeconds);
        return unauthorized();
      }
      await clearFailedLogins(env, rateLimit.key);
      await cleanupOldLoginRateLimits(env);
      return json({ ok: true }, 200, { "set-cookie": `session=${await createSessionToken(env, vaultId)}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${SESSION_MAX_AGE_SECONDS}` });
    }
    if (url.pathname === "/api/logout" && request.method === "POST") {
      return json({ ok: true }, 200, { "set-cookie": "session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0" });
    }
    if (url.pathname.startsWith("/api/") && !await isAuthed(request, env)) {
      return unauthorized();
    }
    if (url.pathname === "/api/crypto-config" && request.method === "GET") {
      const vaultId = await getAuthedVaultId(request, env);
      return json({ ok: true, vaultSalt: await getOrCreateVaultSalt(env, vaultId), cipher: "aes-gcm-256", kdf: "pbkdf2-sha256", iterations: 25e4, version: 1 });
    }
    if (url.pathname === "/api/webdav/proxy" && request.method === "POST") {
      await getAuthedVaultId(request, env);
      const body = await request.json().catch(() => null);
      const target = body?.url || "";
      const method = (body?.method || "GET").toUpperCase();
      if (!/^https?:\/\//i.test(target)) return json({ ok: false, status: 0, statusText: "invalid url", body: "" });
      const headers = {};
      if (body?.user || body?.pass) {
        const raw = new TextEncoder().encode((body?.user || "") + ":" + (body?.pass || ""));
        let bin = "";
        raw.forEach((b) => {
          bin += String.fromCharCode(b);
        });
        headers["Authorization"] = "Basic " + btoa(bin);
      }
      if (body?.contentType) headers["Content-Type"] = body.contentType;
      if (body?.depth) headers["Depth"] = body.depth;
      const hasBody = !["GET", "HEAD", "OPTIONS"].includes(method);
      let res;
      try {
        res = await fetch(target, { method, headers, body: hasBody ? body?.body : void 0 });
      } catch (e) {
        return json({ ok: false, status: 0, statusText: "\u65E0\u6CD5\u8FDE\u63A5\u670D\u52A1\u5668", body: String(e) });
      }
      const text = await res.text().catch(() => "");
      return json({ ok: res.ok, status: res.status, statusText: res.statusText, body: text.slice(0, 2e6) });
    }
    if (url.pathname === "/api/notes" && request.method === "GET") {
      await ensureNotesSchema(env);
      const vaultId = await getAuthedVaultId(request, env);
      const tagFilter = url.searchParams.get("tag");
      let notes = await attachNoteTags(env, vaultId, await listNotes(env, vaultId));
      if (tagFilter) {
        const taggedNoteIds = await env.DB.prepare(
          `SELECT note_id FROM note_tags WHERE tag_id = ?`
        ).bind(tagFilter).all();
        const idSet = new Set((taggedNoteIds.results ?? []).map((r) => r.note_id));
        notes = notes.filter((n) => idSet.has(n.id));
      }
      return json({ ok: true, notes });
    }
    if (url.pathname === "/api/notes" && request.method === "POST") {
      await ensureNotesSchema(env);
      const vaultId = await getAuthedVaultId(request, env);
      const body = await request.json().catch(() => null);
      const title = body?.title?.trim() || "\u65E0\u6807\u9898";
      const content = body?.content?.trim() || "";
      if (!title && !content) return json({ ok: false, error: "title/content required" }, 400);
      const now = Date.now();
      const note = { id: crypto.randomUUID(), vault_id: vaultId, title, content, created_at: now, updated_at: now };
      await env.DB.prepare(`INSERT INTO notes (id, vault_id, title, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)`).bind(note.id, vaultId, note.title, note.content, note.created_at, note.updated_at).run();
      return json({ ok: true, note }, 201);
    }
    if (url.pathname.startsWith("/api/notes/")) {
      await ensureNotesSchema(env);
      const vaultId = await getAuthedVaultId(request, env);
      const rest = decodeURIComponent(url.pathname.slice("/api/notes/".length));
      if (rest === "trash" && request.method === "GET") {
        return json({ ok: true, notes: await attachNoteTags(env, vaultId, await listTrashNotes(env, vaultId)) });
      }
      if (rest === "export" && request.method === "GET") {
        const format = url.searchParams.get("format") || "json";
        const notes = await listNotes(env, vaultId);
        if (format === "markdown") {
          let md = "# \u6211\u7684\u7B14\u8BB0\n\n";
          for (const n of notes) {
            md += `## ${n.title}

${n.content}

---

`;
          }
          return new Response(md, { headers: { "content-type": "text/markdown; charset=utf-8", "content-disposition": 'attachment; filename="notes.md"' } });
        }
        return new Response(JSON.stringify(notes, null, 2), { headers: { "content-type": "application/json; charset=utf-8", "content-disposition": 'attachment; filename="notes.json"' } });
      }
      if (rest === "import" && request.method === "POST") {
        await ensureNotesSchema(env);
        const vaultId2 = await getAuthedVaultId(request, env);
        const body = await request.json().catch(() => null);
        if (!body || !Array.isArray(body.notes)) return json({ ok: false, error: "Invalid import data" }, 400);
        const now = Date.now();
        let notesImported = 0;
        let tagsCreated = 0;
        let tagRelsCreated = 0;
        const tagNameToId = {};
        if (Array.isArray(body.tags)) {
          for (const tag of body.tags) {
            const name = (tag.name || "").trim();
            if (!name) continue;
            const existing = await env.DB.prepare(
              `SELECT id FROM tags WHERE vault_id = ? AND name = ?`
            ).bind(vaultId2, name).first();
            if (existing) {
              tagNameToId[name] = existing.id;
            } else {
              const tagId = crypto.randomUUID();
              await env.DB.prepare(
                `INSERT INTO tags (id, vault_id, name, color, created_at) VALUES (?, ?, ?, ?, ?)`
              ).bind(tagId, vaultId2, name, tag.color || "#6366f1", now).run();
              tagNameToId[name] = tagId;
              tagsCreated++;
            }
          }
        }
        for (const item of body.notes) {
          const noteId2 = crypto.randomUUID();
          const title = (item.title || "").trim() || "\u65E0\u6807\u9898";
          const content = (item.content || "").trim();
          const createdAt = item.created_at || now;
          const updatedAt = item.updated_at || now;
          const isPinned = item.is_pinned ? 1 : 0;
          await env.DB.prepare(
            `INSERT INTO notes (id, vault_id, title, content, created_at, updated_at, is_pinned) VALUES (?, ?, ?, ?, ?, ?, ?)`
          ).bind(noteId2, vaultId2, title, content, createdAt, updatedAt, isPinned).run();
          notesImported++;
          if (Array.isArray(item.tag_names)) {
            for (const tagName of item.tag_names) {
              const tagId = tagNameToId[tagName.trim()];
              if (tagId) {
                await env.DB.prepare(
                  `INSERT OR IGNORE INTO note_tags (note_id, tag_id) VALUES (?, ?)`
                ).bind(noteId2, tagId).run();
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
      const idMatch = rest.match(/^([^/]+)(?:\/(.+))?$/);
      if (!idMatch) return json({ ok: false, error: "invalid path" }, 400);
      const noteId = idMatch[1];
      const subRoute = idMatch[2] || "";
      if (!subRoute && request.method === "GET") {
        const note = await getNote(env, noteId, vaultId);
        if (!note) return json({ ok: false, error: "not_found" }, 404);
        return json({ ok: true, note });
      }
      if (!subRoute && request.method === "PUT") {
        const body = await request.json().catch(() => null);
        const title = body?.title?.trim() || "\u65E0\u6807\u9898";
        const content = body?.content?.trim() || "";
        const existing = await getNote(env, noteId, vaultId);
        if (!existing) return json({ ok: false, error: "not_found" }, 404);
        await env.DB.prepare(`UPDATE notes SET title = ?, content = ?, updated_at = ? WHERE id = ? AND vault_id = ?`).bind(title, content, Date.now(), noteId, vaultId).run();
        const note = await getNote(env, noteId, vaultId);
        return json({ ok: true, note });
      }
      if (!subRoute && request.method === "DELETE") {
        await env.DB.prepare(`UPDATE notes SET deleted_at = ?, updated_at = ? WHERE id = ? AND vault_id = ?`).bind(Date.now(), Date.now(), noteId, vaultId).run();
        return json({ ok: true });
      }
      if (subRoute === "pin" && request.method === "PUT") {
        const note = await getNote(env, noteId, vaultId);
        if (!note) return json({ ok: false, error: "not_found" }, 404);
        const newPinned = note.is_pinned ? 0 : 1;
        await env.DB.prepare(`UPDATE notes SET is_pinned = ?, updated_at = ? WHERE id = ? AND vault_id = ?`).bind(newPinned, Date.now(), noteId, vaultId).run();
        return json({ ok: true, is_pinned: newPinned });
      }
      if (subRoute === "tags" && request.method === "PUT") {
        const body = await request.json().catch(() => null);
        const tagIds = body?.tagIds || [];
        await env.DB.prepare(`DELETE FROM note_tags WHERE note_id = ?`).bind(noteId).run();
        for (const tagId of tagIds) {
          await env.DB.prepare(`INSERT OR IGNORE INTO note_tags (note_id, tag_id) VALUES (?, ?)`).bind(noteId, tagId).run();
        }
        return json({ ok: true });
      }
      if (subRoute === "tags" && request.method === "GET") {
        const tags = await env.DB.prepare(
          `SELECT t.* FROM tags t JOIN note_tags nt ON t.id = nt.tag_id WHERE nt.note_id = ?`
        ).bind(noteId).all();
        return json({ ok: true, tags: tags.results ?? [] });
      }
      if (subRoute === "restore" && request.method === "POST") {
        await env.DB.prepare(`UPDATE notes SET deleted_at = NULL, updated_at = ? WHERE id = ? AND vault_id = ?`).bind(Date.now(), noteId, vaultId).run();
        return json({ ok: true });
      }
      if (subRoute === "permanent" && request.method === "DELETE") {
        await env.DB.prepare(`DELETE FROM notes WHERE id = ? AND vault_id = ?`).bind(noteId, vaultId).run();
        await env.DB.prepare(`DELETE FROM note_tags WHERE note_id = ?`).bind(noteId).run();
        await env.DB.prepare(`DELETE FROM note_shares WHERE note_id = ? AND vault_id = ?`).bind(noteId, vaultId).run();
        return json({ ok: true });
      }
      if (subRoute === "share" && request.method === "POST") {
        const note = await getNote(env, noteId, vaultId);
        if (!note) return json({ ok: false, error: "not_found" }, 404);
        const body = await request.json().catch(() => null);
        const token = crypto.randomUUID().replace(/-/g, "").slice(0, 16);
        const now = Date.now();
        const expiresAt = body?.expiresAt || null;
        await env.DB.prepare(`INSERT INTO note_shares (token, note_id, vault_id, created_at, expires_at) VALUES (?, ?, ?, ?, ?)`).bind(token, noteId, vaultId, now, expiresAt).run();
        return json({ ok: true, token, url: `${url.origin}/s/${token}`, expiresAt });
      }
      if (subRoute === "shares" && request.method === "GET") {
        const shares = await env.DB.prepare(`SELECT * FROM note_shares WHERE note_id = ? AND vault_id = ? AND is_active = 1 ORDER BY created_at DESC`).bind(noteId, vaultId).all();
        return json({ ok: true, shares: shares.results ?? [] });
      }
      return json({ ok: false, error: "not_found" }, 404);
    }
    if (url.pathname === "/api/tags" && request.method === "GET") {
      await ensureNotesSchema(env);
      const vaultId = await getAuthedVaultId(request, env);
      const tags = await env.DB.prepare(
        `SELECT t.id, t.vault_id, t.name, t.color, t.created_at,
					(SELECT COUNT(*) FROM note_tags nt JOIN notes n ON n.id = nt.note_id
					 WHERE nt.tag_id = t.id AND n.vault_id = t.vault_id AND n.deleted_at IS NULL) AS count
				 FROM tags t WHERE t.vault_id = ? ORDER BY t.name`
      ).bind(vaultId).all();
      return json({ ok: true, tags: tags.results ?? [] });
    }
    if (url.pathname === "/api/tags" && request.method === "POST") {
      await ensureNotesSchema(env);
      const vaultId = await getAuthedVaultId(request, env);
      const body = await request.json().catch(() => null);
      const name = body?.name?.trim();
      if (!name) return json({ ok: false, error: "name required" }, 400);
      const color = body?.color || "#6366f1";
      const id = crypto.randomUUID();
      await env.DB.prepare(`INSERT INTO tags (id, vault_id, name, color, created_at) VALUES (?, ?, ?, ?, ?)`).bind(id, vaultId, name, color, Date.now()).run();
      return json({ ok: true, tag: { id, vault_id: vaultId, name, color, created_at: Date.now() } }, 201);
    }
    if (url.pathname === "/api/tags/cleanup" && request.method === "POST") {
      await ensureNotesSchema(env);
      const vaultId = await getAuthedVaultId(request, env);
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
    if (url.pathname.startsWith("/api/tags/")) {
      await ensureNotesSchema(env);
      const vaultId = await getAuthedVaultId(request, env);
      const tagId = decodeURIComponent(url.pathname.slice("/api/tags/".length));
      if (request.method === "DELETE") {
        await env.DB.prepare(`DELETE FROM tags WHERE id = ? AND vault_id = ?`).bind(tagId, vaultId).run();
        await env.DB.prepare(`DELETE FROM note_tags WHERE tag_id = ?`).bind(tagId).run();
        return json({ ok: true });
      }
      return json({ ok: false, error: "not_found" }, 404);
    }
    if (url.pathname === "/api/images/upload" && request.method === "POST") {
      await ensureNotesSchema(env);
      if (!env.IMAGES) return json({ ok: false, error: "Image storage not configured" }, 503);
      const vaultId = await getAuthedVaultId(request, env);
      const contentType = request.headers.get("content-type") || "";
      if (!contentType.startsWith("image/")) return json({ ok: false, error: "Only images allowed" }, 400);
      const body = await request.arrayBuffer();
      if (body.byteLength > 5 * 1024 * 1024) return json({ ok: false, error: "Max 5MB" }, 400);
      const ext = contentType.split("/")[1]?.split(";")[0] || "png";
      const id = crypto.randomUUID();
      const r2Key = `${vaultId}/${id}.${ext}`;
      await env.IMAGES.put(r2Key, body, { httpMetadata: { contentType } });
      const noteId = url.searchParams.get("noteId") || "";
      await env.DB.prepare(`INSERT INTO note_images (id, note_id, vault_id, filename, content_type, size, r2_key, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).bind(id, noteId, vaultId, `${id}.${ext}`, contentType, body.byteLength, r2Key, Date.now()).run();
      return json({ ok: true, url: `/_/images/${r2Key}`, id, r2Key });
    }
    if (url.pathname.startsWith("/api/shares/") && request.method === "DELETE") {
      await ensureNotesSchema(env);
      const vaultId = await getAuthedVaultId(request, env);
      const token = decodeURIComponent(url.pathname.slice("/api/shares/".length));
      await env.DB.prepare(`UPDATE note_shares SET is_active = 0 WHERE token = ? AND vault_id = ?`).bind(token, vaultId).run();
      return json({ ok: true });
    }
    return json({ ok: false, error: "not_found" }, 404);
  },
  async scheduled(event, env, ctx) {
    await ensureNotesSchema(env);
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1e3;
    await env.DB.prepare(`DELETE FROM note_shares WHERE expires_at IS NOT NULL AND expires_at < ?`).bind(Date.now()).run();
    await env.DB.prepare(`DELETE FROM notes WHERE deleted_at IS NOT NULL AND deleted_at < ?`).bind(thirtyDaysAgo).run();
  }
};
export {
  index_default as default
};
//# sourceMappingURL=index.js.map
