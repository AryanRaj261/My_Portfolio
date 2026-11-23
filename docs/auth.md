# Authentication

## Current status

The portfolio has no user accounts, login flow, protected pages, or authentication provider. It should not collect passwords, tokens, or personal profile data.

## Third-party access

GitHub and Vercel authentication happens outside this application, through their respective services and repository/deployment configuration.

## Future requirements

If authentication is ever required for an admin experience or private case studies:

- Use a maintained authentication provider with server-side session validation.
- Never store access tokens in browser source, local static files, or Git history.
- Define authorization roles and logout/session-expiry behavior.
- Add a privacy policy and security review before launch.
