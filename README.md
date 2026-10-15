# MemWeb

A customizable blog and website starter built with Astro, Markdown, and the Astro Pure theme.

## Requirements

- Node.js 22.12 or newer
- npm 9.6.5 or newer

## Develop

```bash
npm install
npm run dev
```

Astro prints the local preview URL (usually `http://localhost:4321`). Add posts as Markdown or MDX files under `src/content/<year>/<category>/`.

## Build and deploy

```bash
npm run verify
npm run build
npm run preview
```

To deploy with GitHub Pages, push the project to a GitHub repository with the `main` branch, then enable GitHub Actions as the Pages publishing source in the repository settings. The included workflow reads the site's origin and base path from GitHub Pages, then builds and deploys on pushes to `main`. For another hosting provider, set `SITE_URL` and `BASE_PATH` when building.

## Customize

- `src/site.config.ts`: title, author label, description, navigation, and optional Waline comments.
- `src/data/pages/`: About, Links, and Projects page copy and sample data.
- `src/content/`: sample post and your Markdown/MDX articles.
- `src/content/<year>/Training.md`: optional dated entries read by the Training page.
- `src/assets/avatar.svg` and `public/favicon/`: replace the sample logo and favicon.
- `src/pages/`: routes and page layouts; remove optional pages and their navigation entries if not needed.

Copy `.env.example` to `.env` only if configuring `PUBLIC_WALINE_SERVER`. Do not commit `.env` or private credentials.

## Commands

- `npm run check`: check Astro and TypeScript.
- `npm test`: run unit tests.
- `npm run lint:check`: run ESLint.
- `npm run format:check`: check formatting.
- `npm run verify`: run all project checks and build.

## License

This project is licensed under Apache-2.0; see `LICENSE`. The Astro Pure theme also includes its license in `packages/pure/LICENSE`. Review third-party asset and dependency licenses before redistributing a customized site.
