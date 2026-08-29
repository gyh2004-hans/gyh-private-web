# 部署指南（gyhcookingmenu.space）

站点为纯静态构建（`npm run build` → `dist/`），推荐部署到 GitHub Pages（免费、稳定、支持自定义域名）。

## 一次性准备（需要你操作一次）

1. 安装并登录 GitHub CLI（在项目目录打开终端）：

   ```bash
   gh auth login
   # 选择 GitHub.com → HTTPS → Login with a web browser，按提示在浏览器完成授权
   ```

2. 告诉 ZCode「部署上线」，接下来的步骤会自动完成：
   - 创建 GitHub 仓库 `gyh-site` 并推送代码
   - 构建并把 `dist/` 发布到 `gh-pages` 分支
   - 配置自定义域名 gyhcookingmenu.space（生成 CNAME 文件）

3. 去你的域名解析服务商（在哪里买的域名就在哪里）添加解析记录：

   | 类型 | 主机记录 | 记录值 |
   |---|---|---|
   | A | @ | 185.199.108.153 |
   | A | @ | 185.199.109.153 |
   | A | @ | 185.199.110.153 |
   | A | @ | 185.199.111.153 |
   | CNAME | www | <你的GitHub用户名>.github.io |

4. 等待 DNS 生效（几分钟到几小时），访问 https://gyhcookingmenu.space 即可。
   若 HTTPS 未自动开启，到仓库 Settings → Pages → 勾选 Enforce HTTPS。

## 后续更新内容

改完代码或图片后，只需再执行发布命令（或让 ZCode 代劳）：

```bash
npm run build && npx gh-pages -d dist
```

## 备选方案

- **Vercel / Cloudflare Pages**：导入 GitHub 仓库即可，构建命令 `npm run build`，输出目录 `dist`，自定义域名在面板里填 gyhcookingmenu.space 后按提示加 CNAME。
- 图片已全部包含在仓库 `public/images/` 内（约 36MB），不依赖任何外部图床。
