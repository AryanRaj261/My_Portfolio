# Setup

## Requirements

- Node.js 20 or later.
- npm.

## Install and run

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

To enable the authentication backend, copy `.env.example` to `.env.local`, configure the browser-safe Supabase values, and follow [auth.md](./auth.md). Do not add service-role keys to the frontend.

## Production preview

```bash
npm run build
npm run preview
```

## Useful commands

```bash
npm run lint
npm run typecheck
npm run test:e2e
```

## Deployment

The repository deploys from `main` through Vercel. Verify the build passes locally before pushing. When a custom domain is ready, update canonical and social metadata, `robots.txt`, and `sitemap.xml` together.
