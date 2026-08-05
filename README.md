# Edge Notes

一个部署在 Cloudflare Workers + D1 上的端到端加密私人笔记应用。

- 🔒 浏览器端端到端加密（AES-GCM + PBKDF2），密码不离开浏览器
- 🗂️ 多密码多数据仓库隔离，不同密码进入独立 vault
- 📱 PWA 支持，手机可添加到主屏幕
- ☁️ 基于 Cloudflare Workers + D1 + R2，全球边缘部署
- 🌙 深色 / 浅色主题切换

## 功能一览

### 核心功能
- **端到端加密** — 笔记在浏览器本地加密后上传，服务端只存储密文
- **多密码隔离** — 不同密码登录进入不同数据仓库，彼此完全隔离
- **全文搜索** — 支持标题和正文关键词搜索
- **笔记置顶** — 重要笔记一键置顶，置顶笔记始终显示在最前

### 标签管理
- 创建自定义标签并设置颜色
- 为笔记添加多个标签，编辑时回填已选标签，支持一键清除
- **智能标签** — 输入时自动匹配正文中出现过的已有标签，并自动提取关键词生成新标签
- 侧边栏标签显示笔记数量，按标签筛选笔记
- 标签数量归零（或笔记被删除）时自动清理标签，保持列表整洁

### 图片上传
- 支持编辑器内粘贴、拖拽上传图片
- 图片加密后存储到 Cloudflare R2
- 笔记内图片预览

### 笔记分享
- 为笔记生成公开分享链接（无需登录即可查看）
- 可设置分享链接过期时间
- 随时撤销分享

### 导出
- 单条笔记导出为 Markdown
- 全部笔记导出为 JSON 或 Markdown

### WebDAV 备份与恢复
- 一键备份所有数据到 WebDAV 服务器
- 从 WebDAV 恢复备份数据
- 支持本地文件导入
- 定时自动备份，可设置备份间隔（1h / 6h / 12h / 24h）
- 备份文件按日期命名，支持保留份数设置
- 从 WebDAV 浏览和选择历史备份恢复

### 回收站
- 删除的笔记进入回收站，可随时恢复
- 支持永久删除
- 定时自动清理过期回收站内容

### 主题切换
- 深色 / 浅色模式一键切换
- 自动跟随系统偏好
- 用户选择持久化到 localStorage

## 一键部署

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/love-ztm/cf-edge-notes)

Cloudflare 会自动创建 D1 数据库并部署 Worker。部署后需要在 Workers 设置中添加 R2 Bucket 绑定（binding 名称：`IMAGES`）。

## 手动部署

### 1. 安装依赖

```bash
npm install
```

### 2. 登录 Cloudflare

```bash
npx wrangler login
```

### 3. 创建 D1 数据库

```bash
npx wrangler d1 create private-notes-db
```

把返回的 `database_id` 填到 `wrangler.jsonc` 中。

### 4. 创建 R2 Bucket

```bash
npx wrangler r2 bucket create cf-notes-images
```

### 5. 执行数据库迁移

```bash
npx wrangler d1 migrations apply DB --remote
```

### 6. 设置环境变量

```bash
npx wrangler secret put APP_PASSWORD
npx wrangler secret put COOKIE_SECRET
# 可选：多数据仓库密码
npx wrangler secret put APP_PASSWORDS
```

| 变量 | 说明 |
|------|------|
| `APP_PASSWORD` | 默认 vault 密码，生产环境务必修改 |
| `COOKIE_SECRET` | 会话签名密钥，建议 32 字符以上随机字符串 |
| `APP_PASSWORDS` | 可选，格式 `vault_id=password,guest=another-password` |

### 7. 部署

```bash
npm run deploy
```

部署完成后获得 `*.workers.dev` 地址。

## GitHub 自动部署

1. 打开 Cloudflare Dashboard → **Workers & Pages**
2. 连接 GitHub 仓库 `love-ztm/cf-edge-notes`
3. 开启 Workers Builds

以后 `git push` 到 main 分支会自动部署。

## 本地开发

```bash
cp .dev.vars.example .dev.vars
# 编辑 .dev.vars 设置本地密码
npx wrangler dev
```

## 手机端使用

### iPhone (Safari)

1. 打开站点并登录
2. 点击分享按钮 → **添加到主屏幕**

### Android (Chrome)

1. 打开站点并登录
2. 菜单 → **添加到主屏幕** / **安装应用**

## 项目结构

```text
cf-edge-notes/
├── src/
│   ├── index.ts          # Worker 入口 / API 路由 / 分享页面
│   ├── homeHtml.ts       # 前端单页应用（HTML + CSS + JS）
│   └── auth.ts           # 认证与会话管理
├── migrations/
│   ├── 0001_init.sql            # notes 表初始化
│   ├── 0002_notes_fts.sql       # 全文搜索索引
│   ├── 0003_app_meta.sql        # 应用元数据表
│   ├── 0004_auth_rate_limits.sql # 登录频率限制
│   ├── 0005_note_vaults.sql     # 多 vault 支持
│   ├── 0006_add_is_pinned.sql   # 笔记置顶
│   ├── 0007_add_tags.sql        # 标签系统
│   ├── 0008_add_trash.sql       # 回收站
│   ├── 0009_add_images.sql      # 图片上传
│   └── 0010_add_sharing.sql     # 笔记分享
├── wrangler.jsonc         # Cloudflare Workers 配置
├── .dev.vars.example      # 本地开发环境变量模板
└── package.json
```

## 技术栈

- **运行时**: Cloudflare Workers (V8 Isolates)
- **数据库**: Cloudflare D1 (SQLite)
- **存储**: Cloudflare R2 (图片附件)
- **加密**: Web Crypto API (AES-GCM + PBKDF2)
- **前端**: 原生 HTML/CSS/JS，无框架依赖

## License

MIT
