# LaunchLens

LaunchLens audits a public website and turns it into a business-friendly performance, SEO, accessibility and technical-health report.

## Local development

1. Copy `.env.example` to `.env.local` and set `GOOGLE_PAGESPEED_API_KEY`. Without it, the app still performs direct technical checks and labels the result accordingly.
2. Run `npm install` and `npm run dev`.
3. For persistent report links, create a Supabase project, run `supabase/schema.sql` in its SQL editor, then set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.

## Production

Deploy to Vercel, add the environment variables above plus a random `CRON_SECRET`, and connect the project to Supabase. The included Vercel Cron endpoint deletes expired reports each day. Restrict the Google key to the PageSpeed Insights API before launch.

## Boundaries

Only audit public websites you are authorised to assess. Reports are kept for 30 days and contain normalized results, not raw source HTML.
