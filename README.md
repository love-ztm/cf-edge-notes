# Edge Notes

> 部署在 Cloudflare 边缘的端到端加密私人笔记，密码即你的数据仓库钥匙。

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/love-ztm/cf-edge-notes)

---

## About ｜ 关于

Edge Notes 是一个**端到端加密（E2E）的私人笔记应用**，整个应用构建在 Cloudflare 边缘网络上：Workers 负责业务逻辑、D1（SQLite）存数据、R2 存图片附件，全球节点就近响应，国内访问同样稳定。

它把「隐私」和「顺手」放在同等位置：

- **密码不离开浏览器** — 笔记在浏览器本地用 AES-GCM 加密后才上传，服务端只存密文，即使数据库泄露也无法阅读
- **密码即仓库** — 配置多少个密码就有多少个互相隔离的数据仓库（vault），一套部署、各自加密
- **零框架前端** — 整个界面是一个无框架的单页应用（内嵌于 `homeHtml.ts`），冷启动轻、加载快
- **用得顺手** — 支持多标签 + 智能标签（输入时自动匹配/生成）、全文搜索、Markdown、图片上传、公开分享、置顶、回收站、深浅主题

除此之外还内置了「不依赖任何第三方」的备份方案：WebDAV 手动/定时备份，定时备份由 **Cloudflare Cron 在服务端执行**——页面关闭、电脑关机，备份照跑不误。

## 功能一览

### 核心
- **端到端加密** — AES-GCM + PBKDF2（25 万次迭代），密码不经过网络
- **多密码仓库隔离** — 不同密码进入独立 vault，互不可见
- **三栏工作流** — 左侧标签导航、中间笔记列表、右侧滑动编辑器
- **全文搜索** — 标题 + 正文本地即时过滤，无需重新解密
- **笔记置顶** — 置顶笔记始终排在最前

### 标签
- 自定义标签 + 颜色，侧边栏显示每标签笔记数
- 多标签关联，编辑时回填已选，支持一键清除
- **智能标签** — 输入时自动匹配正文中出现的已有标签，并自动提取关键词生成新标签
- 零计数标签自动清理，列表保持整洁

### 多媒体与分享
- 粘贴 / 拖拽上传图片，加密后存 R2
- Markdown 渲染与编辑
- 为笔记生成公开分享链接，可设过期时间、随时撤销

### 备份与导出
- **一键备份到 WebDAV** — 自动建目录、每次只产生一个文件
- **从 WebDAV 恢复** — 浏览备份文件列表（时间 / 大小），自选某一份导入；也支持本地文件导入
- **定时备份** — 由 Cloudflare Cron 服务端执行（每 5 分钟检查，北京时间判定），可设星期、时间、保留份数，页面无需在线
- 单条导出 Markdown、全部导出 JSON / Markdown

### 其他
- 回收站（30 天自动清理）+ 永久删除
- 深色 / 浅色主题，跟随系统
- PWA，可添加至手机主屏幕

## 快速部署

### 一键部署

点击上方的 **Deploy to Cloudflare** 按钮，授权后 Cloudflare 会自动创建项目与 D1 数据库并完成部署。随后在 Workers 控制台为 Worker 添加 R2 桶并绑定（binding 名 `IMAGES`），再设置下方环境变量即可使用。

### 手动部署

```bash
# 1. 安装依赖
npm install

# 2. 登录 Cloudflare
npx wrangler login

# 3. 创建 D1 数据库，并把返回的 database_id 填入 wrangler.jsonc
npx wrangler d1 create private-notes-db

# 4. 创建 R2 桶（绑定名 IMAGES）
npx wrangler r2 bucket create cf-notes-images

# 5. 设置环境变量
npx wrangler secret put APP_PASSWORD
npx wrangler secret put COOKIE_SECRET
# 可选：多仓库
npx wrangler secret put APP_PASSWORDS

# 6. 迁移数据库并部署
npm run deploy
```

### 环境变量

| 变量 | 说明 |
|------|------|
| `APP_PASSWORD` | 默认 vault 的登录密码（生产环境务必修改） |
| `COOKIE_SECRET` | 会话签名密钥，建议 32 位以上随机字符串 |
| `APP_PASSWORDS` | 可选，多仓库：`vault_id=password,guest=another-password` |

> 同一个密码既是访问站点的口令，也是本地解密的钥匙——改密码后旧笔记将无法解锁，请妥善保管。

## GitHub 自动部署

打开 Cloudflare Dashboard → **Workers & Pages** → 连接仓库 `love-ztm/cf-edge-notes`，开启 Workers Builds。此后 `git push` 到 `main` 即自动构建部署（构建命令 `npm run build` = `tsc --noEmit`，类型不过会被拦截）。

## 本地开发

```bash
cp .dev.vars.example .dev.vars   # 编辑本地密码
npm run dev                      # http://localhost:8787
npm test                         # vitest 单元测试
```

## 手机端使用

- **iPhone（Safari）**：打开站点并登录 → 分享 → 添加到主屏幕
- **Android（Chrome）**：打开站点并登录 → 菜单 → 添加到主屏幕 / 安装应用

## 项目结构

```text
cf-edge-notes/
├── src/
│   ├── index.ts          # Worker 入口 / API 路由 / scheduled 定时任务 / 分享页
│   ├── homeHtml.ts       # 前端单页应用（HTML + CSS + JS 模板）
│   └── auth.ts           # 认证、会话与登录限流
├── migrations/           # D1 数据库迁移（0001-0010）
├── test/                 # vitest 单元测试
├── wrangler.jsonc        # Workers / D1 / R2 / Cron 配置
├── .dev.vars.example     # 本地开发环境变量模板
└── package.json
```

## 技术栈

| 层 | 选型 |
|---|---|
| 运行时 | Cloudflare Workers（V8 Isolates） |
| 数据库 | Cloudflare D1（SQLite） |
| 对象存储 | Cloudflare R2（图片附件） |
| 定时任务 | Workers Cron（每 5 分钟，含回收站清理与 WebDAV 定时备份） |
| 加密 | Web Crypto API（AES-GCM + PBKDF2-SHA256） |
| 前端 | 原生 HTML/CSS/JS，无框架依赖 |

## License

MIT