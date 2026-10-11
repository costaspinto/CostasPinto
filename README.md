# Costas AI Portfolio

A Next.js 15 / React 19 portfolio with a Supabase-backed public page, private admin dashboard, GitHub repository sync, LinkedIn OpenID Connect, and an OpenRouter AI chatbot.

## What works

- **Public frontend:** reads published profile, projects, skills, education, experience and certification rows from Supabase. Starter content is used as a fallback if Supabase is not configured or has no visible rows.
- **Admin login:** Supabase Auth email/password. Only user IDs listed in `ADMIN_USER_IDS` can access protected admin routes.
- **Profile editor:** saves the portfolio profile using a server-side service-role client after admin authorization.
- **GitHub sync:** imports public, non-fork, non-archived repositories into `projects`. New imports remain unpublished until reviewed in Admin → Projects.
- **LinkedIn OIDC:** connects the LinkedIn developer app, stores the token server-side, and syncs the standard OpenID Connect name/email/picture claims where returned.
- **AI chatbot:** calls OpenRouter server-side and uses the published portfolio data and published `ai_knowledge` rows as context.
- **Access controls:** public clients can read published portfolio records only. Integration tokens, sync logs and feedback are not accessible to ordinary clients. Service-role operations are guarded by server-side admin checks (GitHub cron requests use `CRON_SECRET`).

## Setup

1. Install Node.js 20+ (Node 24 is supported).
2. Extract this archive and run `npm install`.
3. Copy `.env.example` to `.env.local`, then fill in your own credentials. Never commit or share `.env.local`.
4. In Supabase, create an Auth user for your administrator and put the exact user's UUID in `ADMIN_USER_IDS` (comma-separated if multiple admins are intended).
5. For a **new database**, review and run `supabase/schema.sql` in the Supabase SQL Editor. For an **existing database**, review your existing schema first, then apply the additive migration(s) you have not already applied. Do not reset or drop live tables to match this starter.
6. In the LinkedIn Developer Portal, add the exact redirect URL configured in `LINKEDIN_REDIRECT_URI`. For local development it is `http://localhost:3000/api/auth/linkedin/callback`.
7. Run `npm run dev` and open `http://localhost:3000`.
8. Sign in at `/admin/login`, then open Integrations to sync GitHub or connect LinkedIn.

## Environment variables

Required for the complete experience:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only)
- `ADMIN_USER_IDS`
- `OPENROUTER_API_KEY` (server-only)
- `LINKEDIN_CLIENT_ID`
- `LINKEDIN_CLIENT_SECRET` (server-only)
- `LINKEDIN_REDIRECT_URI`
- `CRON_SECRET` (server-only, long random value)

`GITHUB_USERNAME` defaults to `costaspinto`; `GITHUB_TOKEN` is optional for public repositories but helps with API rate limits. `OPENROUTER_MODEL` defaults to `openai/gpt-4o-mini`. `NEXT_PUBLIC_SITE_URL` should be updated for deployment.

Never prefix private values such as the Supabase service-role key, OpenRouter API key, LinkedIn client secret or cron secret with `NEXT_PUBLIC_`.

## Database notes

- `supabase/schema.sql` is intended for a fresh setup and uses `IF NOT EXISTS` / idempotent policy recreation; still review it before applying to a populated database.
- `supabase/migrations/20261011000100_create_ai_knowledge.sql` creates the chatbot knowledge table.
- `supabase/migrations/20261011000200_linkedin_avatar_and_security.sql` adds the LinkedIn avatar column and credential storage table for installations that already have the base schema.
- GitHub-created project rows default to `is_published = false`. Publish them from `/admin/projects`.
- The profile's image field is `avatar_url`; the 20261011000200 migration adds it to an existing `profile` table.

## LinkedIn limits

The app syncs the claims made available by LinkedIn's OpenID Connect userinfo endpoint (typically name, picture and email when returned). Standard `openid profile email` permission does **not** grant unrestricted access to headline, connections, featured posts, activity, experience, education or certification details. Those features require separate approved LinkedIn API products/permissions; the app does not scrape LinkedIn pages.

## Sync

- Admin GitHub sync: submit the form in `/admin/integrations`.
- Scheduled GitHub sync: Vercel calls `/api/sync/github`; configure the same `CRON_SECRET` as a Vercel environment variable. `vercel.json` schedules a daily run.
- LinkedIn: connect/reconnect manually from `/admin/integrations`. LinkedIn authorization is a user-consent flow, not a scheduled cron endpoint.

## Validation and deployment

Run:

```bash
npm run typecheck
npm run lint
npm run build
```

Then deploy with the same server-side environment variables set in the hosting provider. The ZIP does not include live account credentials and cannot verify your Supabase project, LinkedIn app approval or OpenRouter balance/availability on your behalf.
