# Authentication

## Implementation

The portfolio uses Supabase Auth as its authentication backend. The browser receives only a Supabase URL and publishable (or legacy anon) key; no service-role key, OAuth client secret, SMS key, or authenticator secret belongs in this repository or the client bundle.

The login dialog supports:

- Email one-time-password (OTP) sign-in and sign-up.
- Phone/SMS OTP sign-in and sign-up using an E.164 number.
- Google, Facebook, and X/Twitter OAuth redirects.
- TOTP authenticator-app enrollment with a QR code and six-digit verification challenge.
- TOTP challenge after sign-in when an enrolled authenticator is required.

When credentials are absent, the interface says it is unconfigured and does not pretend to authenticate anyone.

## Required configuration

1. Create a Supabase project and add these Vercel environment variables for Production, Preview, and Development:

   ```text
   VITE_SUPABASE_URL=https://<project-ref>.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=<publishable-key>
   ```

   `VITE_SUPABASE_ANON_KEY` is accepted as a compatibility fallback. Never set `SUPABASE_SERVICE_ROLE_KEY` in Vercel client variables.

2. In Supabase Auth URL Configuration, set the Site URL to the production portfolio URL and add both the production and Vercel preview URLs to Redirect URLs.

3. Enable Email OTP. The email template must contain `{{ .Token }}` for the code-entry flow; using only `{{ .ConfirmationURL }}` sends a magic link instead.

4. Enable Phone auth and configure a compliant SMS provider (Twilio, Vonage, MessageBird, or a supported regional provider). Add CAPTCHA and rate limits before accepting public traffic. India deployments must also satisfy applicable DLT/SMS regulations.

5. Enable and configure Google, Facebook, and Twitter/X in Supabase Auth Providers. Their OAuth client IDs and secrets are entered in Supabase, never in this app.

6. TOTP MFA is enabled by default on Supabase projects. Test enrollment, sign-in challenge, sign-out, and recovery procedures with a non-production account.

## Security boundaries

- OTP delivery, provider tokens, TOTP factor enrollment, and session refresh are handled by Supabase Auth.
- The app uses PKCE, secure provider redirects, session persistence, and Supabase MFA assurance-level checks.
- This portfolio currently has no protected user data or server routes. If an authenticated feature stores data later, add row-level security and server-side authorization before exposing it.
- A real privacy policy and account-deletion process are required before collecting production user accounts.

## Local setup

Copy `.env.example` to `.env.local`, fill it with browser-safe values, then run `npm run dev`. `.env.local` is ignored by Git.

## Verification checklist

- Email OTP arrives as a code and verifies.
- Phone OTP arrives only for configured test and production numbers.
- Every enabled OAuth provider returns to the configured portfolio URL.
- A newly scanned TOTP QR code verifies and upgrades the session to AAL2.
- A user with an existing TOTP factor sees an authenticator challenge after first-factor sign-in.
- Sign-out removes the local session and changes the navigation action back to `Log in`.
