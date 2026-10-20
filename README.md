# MemWeb

基于 Astro 和 Markdown 的个人网站模板，可用于搭建博客或内容网站。

## 环境要求

- Node.js 22.12 或更高版本
- npm 9.6.5 或更高版本

## 安装与预览

在项目根目录运行：

```bash
npm ci
npm run dev
```

按终端提示打开本地预览地址（通常为 `http://localhost:4321`）。

## 构建与部署

```bash
npm run verify  # 检查代码并构建
npm run build   # 仅构建，生成 dist 目录
npm run preview # 本地预览构建结果
```

部署到 GitHub Pages：将项目推送到 GitHub，在仓库 **Settings → Pages → Build and deployment** 中选择 **GitHub Actions**。之后推送到 `main` 分支即可触发自动构建和发布。

## 常用目录

- `src/site.config.ts`：网站标题、简介、导航等设置
- `src/content/`：Markdown 或 MDX 文章
- `src/data/pages/`：关于、链接和项目页面内容
- `src/assets/`、`public/favicon/`：站点图片与图标

评论功能为可选项。如需启用，将 `.env.example` 复制为 `.env`，填写 `PUBLIC_WALINE_SERVER`。不要提交 `.env` 或其他密钥。

## 许可

项目采用 Apache-2.0 许可，详见 `LICENSE`。主题和第三方资源可能有各自的许可，发布前请一并确认。
