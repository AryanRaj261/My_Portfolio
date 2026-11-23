# API

## Current status

There is no application API. The portfolio is static and has no backend endpoints.

## Client-side behavior

- Contact uses `mailto:` and LinkedIn links.
- The portfolio guide answers from local, predefined content and does not make network requests.
- Interaction studies run from local bundled files and assets.

## Future API requirements

If a contact form, CMS, analytics service, or dynamic project feed is introduced:

1. Keep credentials and secrets server-side.
2. Validate all request payloads at the API boundary.
3. Rate-limit public endpoints and add spam protection for forms.
4. Document request/response schemas, failure states, and privacy implications here.
5. Add API integration tests before enabling production traffic.
