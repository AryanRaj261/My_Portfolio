# Debugging

## Local app will not start

1. Confirm Node.js is current enough for Vite.
2. Run `npm install`.
3. Check whether the chosen Vite port is already in use.

## Browser tests fail intermittently

- Run `npm run test:e2e` again without competing local servers.
- Inspect the generated Playwright trace or `test-results` failure context.

## Deployment does not update

- Confirm the intended commit was pushed to `main`.
- Check the Vercel deployment log and build command.
- Confirm the output directory is `dist` and the build succeeds locally.
