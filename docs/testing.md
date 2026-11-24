# Testing

## Automated checks

```bash
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

## What is covered

- Work project switching by pointer and keyboard.
- Condensation canvas backing resolution.
- Mobile navigation keyboard behavior.
- Portfolio guide open/close behavior.
- Direct email contact path.

## Browser test design

Playwright runs one worker so desktop and mobile interactions are checked deterministically in local and CI environments.

## Manual regression checks

- Review desktop and small-mobile layouts.
- Test Tab, Enter, Space, Escape, and arrow-key behavior.
- Enable reduced motion and make sure content remains usable.
- Check browser console for failed assets or WebGL errors.
- Verify the deployed site includes the intended canonical URL, social image, and sitemap.
