# Aryan Raj Portfolio

A single-page React portfolio built with Vite and Framer Motion.

Project documentation lives in [`docs/`](docs/), starting with its [documentation index](docs/readme.md).

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## Quality checks

```bash
npm run lint
npm run typecheck
npm run verify:etale
npm run test:e2e
```

## Authentication setup

The portfolio includes a Supabase Auth integration for email/phone OTP, Google/Facebook/X OAuth, and authenticator-app MFA. It remains safely inactive until `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` are configured. See [authentication setup](docs/auth.md).

## Deployment SEO

Copy `.env.example` to `.env` and set the final public site URL before deploying:

    VITE_SITE_URL=https://your-domain.example

This emits canonical, Open Graph, Twitter, structured-data, sitemap, and robots URLs during the production build. The social image is `public/og-cover.png`. On Vercel, the deployment URL is used automatically until you set `VITE_SITE_URL` to a custom domain.

## Browser checks

Run `npm run test:e2e` to check primary navigation, project switching, and the mobile navigation menu.
