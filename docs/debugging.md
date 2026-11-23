# Debugging

## Local app will not start

1. Confirm Node.js is current enough for Vite.
2. Run `npm install`.
3. Check whether the chosen Vite port is already in use.

## A study is blank or has no height

- Confirm its wrapper has a defined height.
- Check that `DeferredVisual` has mounted the component after it nears the viewport.
- Check the browser console for iframe, WebGL, or asset-load errors.
- Do not replace an authored study source with an approximation; verify the source/asset paths instead.

## Étale verification fails

Run `npm run verify:etale` and compare the reported file with the registered local source or asset. Restore the exact expected version rather than editing a binary asset manually.

## Browser tests fail intermittently

- Run `npm run test:e2e` again without competing local servers.
- Keep Playwright serial for GPU-heavy studies.
- Inspect the generated Playwright trace or `test-results` failure context.

## Deployment does not update

- Confirm the intended commit was pushed to `main`.
- Check the Vercel deployment log and build command.
- Confirm the output directory is `dist` and the build succeeds locally.
