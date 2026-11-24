# Architecture

## Purpose

This repository is a single-page personal portfolio for Aryan Raj. It presents selected interface concepts, documented résumé projects, professional experience, and contact paths.

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
      └─ PortfolioChatbot
```

`App.jsx` owns navigation state, selected project state, auth-session awareness, and motion preferences. `PortfolioNav` owns responsive navigation behavior, while `AuthDialog` owns the browser-side Supabase Auth flows.

## Quality gates

```bash
npm run lint
npm run build
npm run test:e2e
```

Playwright runs desktop and mobile checks serially to keep responsive checks deterministic.

## Deployment

Vercel builds `dist/` using `npm run build`. `vercel.json` contains the framework configuration and browser-facing security headers. GitHub `main` is the deployment branch.
