# Architecture

## Purpose

This repository is a single-page personal portfolio for Aryan Raj. It presents selected interface concepts, documented résumé projects, professional experience, contact paths, and a small set of source-integrated interaction studies.

## Runtime

- React 19 application bundled with Vite.
- Framer Motion for page-level animation and transitions.
- Static data in `src/data/portfolio.js` keeps portfolio copy, contact details, projects, credentials, and links separate from UI structure.
- Static assets are served from `public/`; imported imagery lives in `src/assets/`.

## Main application flow

```text
src/main.jsx
  └─ src/App.jsx
      ├─ Portfolio command navigation + theme control + auth dialog
      ├─ Hero + condensation canvas background
      ├─ About, work, documented builds, experience, contact sections
      ├─ Lazy interactive studies
      └─ PortfolioChatbot
```

`App.jsx` owns navigation state, selected project state, auth-session awareness, motion preferences, and progressive mounting of lower-page visual studies. `PortfolioNav` owns responsive navigation behavior, while `AuthDialog` owns the browser-side Supabase Auth flows.

## Interaction studies

The Étale, Character Carousel, and Glass AI Button integrations are source-backed studies. They are intentionally labelled as studies rather than client work.

- The hero Glass AI Button is lazy-loaded because it is an immediate interaction.
- Lower-page studies mount only when near the viewport through `DeferredVisual`.
- `scripts/verify-etale-source.mjs` verifies registered source and asset hashes.

## Quality gates

```bash
npm run lint
npm run build
npm run verify:etale
npm run test:e2e
```

Playwright runs desktop and mobile checks serially because the page includes GPU-heavy WebGL studies.

## Deployment

Vercel builds `dist/` using `npm run build`. `vercel.json` contains the framework configuration and browser-facing security headers. GitHub `main` is the deployment branch.
