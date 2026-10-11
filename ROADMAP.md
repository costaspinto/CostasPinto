# Project status and next steps

## Implemented in this bundle

- [x] Responsive public portfolio with starter-content fallback.
- [x] Public page reads published profile, projects, skills, education, experience and certifications from Supabase.
- [x] Supabase email/password admin sign-in, admin allow-list check and logout.
- [x] Admin profile editor.
- [x] GitHub public repository sync with unpublished-by-default imports, project publish/feature controls, and sync-run logging.
- [x] LinkedIn OpenID Connect authorization, state validation, server-side token storage, and sync of supported name/email/avatar claims.
- [x] Admin-managed chatbot knowledge entries. Only published entries are provided to the public AI endpoint.
- [x] OpenRouter chatbot with input validation and dynamic context from published portfolio data.
- [x] Idempotent fresh-install schema and additive migration for LinkedIn profile photos/credential storage.
- [x] Daily GitHub sync schedule for Vercel.

## Required before production

- [ ] Copy environment values into `.env.local` for local development and into the hosting provider for deployment.
- [ ] Run/review the schema or missing additive migrations in Supabase; never reset a populated database merely to match the starter.
- [ ] Verify `ADMIN_USER_IDS` contains the exact Supabase Auth user UUID.
- [ ] Connect LinkedIn with the registered callback URL. LinkedIn only provides data allowed by approved products/scopes; standard OpenID Connect does not expose all profile sections.
- [ ] Test GitHub sync, publish at least one project, and verify it appears on the public page.
- [ ] Test the chatbot with a real OpenRouter key and review the model's responses.
- [ ] Run `npm install`, `npm run typecheck`, `npm run lint`, and `npm run build` on a machine with npm registry access.
- [ ] Configure production environment variables, cron secret, monitoring and appropriate provider-level usage limits.

## Current boundaries

- LinkedIn integration syncs standard OpenID Connect user claims only (typically name, profile picture and email if returned). Connections counts, activity, featured posts, full experience, education and certification records need separate LinkedIn API access and are not scraped.
- GitHub sync imports public repositories only and leaves new imports unpublished for review.
- Chat input is schema-validated, but production hosting should also use platform-level request/rate limits to control API spend.
