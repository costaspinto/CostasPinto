# Portfolio upgrade notes

## Implemented in this source update
- Larger hero profile image and responsive visual refinements.
- Expandable descriptions for projects, education, and experience.
- First-visit chatbot welcome nudge; visitors can open the existing AI chat from it.
- Public recommendation submission form and API. Submissions remain unapproved and unpublished until reviewed in admin.
- Privacy-conscious analytics visitor ID support and an estimated unique visitor card.
- Admin appearance settings for accent, background, and text color, with a preview.
- Custom interactive 404 page and route/global error fallback pages.
- Graceful fallback when public recommendation data cannot be loaded.

## Required Supabase migrations
Apply migrations in chronological order, including:
- `20261012000400_portfolio_master_upgrade.sql` (if not already applied)
- `20261012000500_visitor_analytics.sql`
- `20261012000600_site_appearance.sql`

Existing migrations `20261012000300_add_profile_documents.sql` and any earlier project migrations may also be required by the existing application. Do not re-run production migrations blindly; inspect your Supabase migration history first.

## Environment
Keep `.env.local` private and create it locally from your own trusted values. Do not commit or upload it. Required existing values may include Supabase URL/keys and `OPENROUTER_API_KEY`; preserve the names documented in the project's existing setup.

## Validation note
The uploaded ZIP's paths were Windows-style. I normalized the source into a working copy and removed historical backup snapshots from the deliverable. Dependency installation/type-check could not be completed reliably in this execution environment, so run the checks below on your Windows machine after extracting the ZIP:

```powershell
npm ci
npm run typecheck
npm run lint
npm run build
```

Resolve any reported errors before deployment. The appearance controls update global theme tokens; components with hard-coded Tailwind colors may not all respond to custom colors and can be refined after visual QA.
