# Database

## Current status

This portfolio does not use a database. It is a static React/Vite site: portfolio content is versioned in `src/data/portfolio.js`, assets are delivered with the application, and the client-side portfolio guide does not store messages.

## Why this is appropriate

- A static portfolio is fast, low-maintenance, and deployable without credentials or a server.
- Project, credential, and contact data changes are reviewed through Git.
- There is no personal-data collection workflow that would justify a database today.

## If a database is added later

Use a server-side API rather than exposing database credentials in the browser. Suggested records:

- `projects`: title, role, stack, links, images, public/private status.
- `caseStudies`: problem, contribution, outcomes, content blocks.
- `inquiries`: only with an explicit privacy policy, spam protection, retention policy, and consent.

Do not migrate content to a database unless editing needs cannot be met through the current versioned data file.
