# LaunchLens

**A polished website-health auditor that turns any public URL into a clear, shareable report.**

[View the live product →](https://launchlens-zeta.vercel.app)

LaunchLens is built for the moment a technical finding needs to become a useful client conversation. It combines Google Lighthouse lab data with direct, server-side checks and presents the result in an editorial report designed to be understood beyond an engineering team.

## What it does

- Audits a public website URL with Google PageSpeed Insights / Lighthouse.
- Summarises performance, SEO, accessibility and best-practice signals.
- Detects practical on-page issues: HTTPS, title, description, H1 count, viewport, canonical, Open Graph, missing image alt text, `robots.txt`, and `sitemap.xml`.
- Produces a persistent, shareable report with PDF export and copy-link actions.
- Falls back to direct website checks when Lighthouse is slow, unavailable, or blocked for a particular domain.
- Stores reports for 30 days and removes expired records through a scheduled cleanup job.

## Product principles

- **Useful before exhaustive.** Reports lead with the highest-impact actions instead of raw audit output.
- **Graceful degradation.** A slow third-party service never makes a public audit fail outright.
- **No account wall.** A URL is enough to create and share a report.
- **Intentional visual system.** The landing page, example report, and live reports share a reusable section layout and responsive design tokens.

## Stack

| Area        | Technology                                 |
| ----------- | ------------------------------------------ |
| App         | Next.js 15, React 19, TypeScript           |
| Validation  | Zod                                        |
| Audit data  | Google PageSpeed Insights API / Lighthouse |
| Persistence | Supabase Postgres                          |
| UI          | CSS design tokens, Lucide icons            |
| Deployment  | Vercel + Vercel Cron                       |

## Architecture

```text
src/
├── app/                  # App Router pages and API routes
├── components/           # Reusable UI and report presentation
├── lib/
│   ├── audit.ts          # Lighthouse + direct technical checks
│   ├── url.ts            # URL normalization and SSRF safeguards
│   └── storage.ts        # Supabase-backed report persistence
└── components/section-frame.tsx
                           # Shared layout primitive for landing and reports
supabase/schema.sql        # Database schema and server-role permissions
vercel.json                # Daily expired-report cleanup schedule
```

## Run locally

Requires Node.js 24+.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

| Variable                    | Required    | Purpose                                                                               |
| --------------------------- | ----------- | ------------------------------------------------------------------------------------- |
| `GOOGLE_PAGESPEED_API_KEY`  | Recommended | Enables Lighthouse / PageSpeed data. Restrict this key to the PageSpeed Insights API. |
| `SUPABASE_URL`              | Production  | Supabase project root URL, without `/rest/v1`.                                        |
| `SUPABASE_SERVICE_ROLE_KEY` | Production  | Server-only key used to persist and retrieve reports.                                 |
| `CRON_SECRET`               | Production  | Random secret used to authorize the cleanup route.                                    |
| `NEXT_PUBLIC_APP_URL`       | Optional    | Canonical application URL for deployments.                                            |

Run `supabase/schema.sql` in the Supabase SQL Editor before enabling persistence. The schema enables RLS and grants the server role only the permissions required for report storage.

## Quality checks

```bash
npm run format:check
npm run typecheck
npm run lint
```

Use `npm run format` to format the full repository with Prettier.

## Deploy

Deploy to Vercel as a Next.js project, then add the production environment variables listed above and redeploy. The `POST /api/audits` route is explicitly configured for a 60-second function window to accommodate Lighthouse runs; if Google does not finish, LaunchLens returns a direct-check report instead.

`vercel.json` registers a daily cleanup request to `/api/cron/cleanup`. Set `CRON_SECRET` in Vercel so that this route cannot be invoked by arbitrary clients.

## Security and privacy

- The auditor accepts only public `http(s)` URLs.
- Before fetching, it normalizes the input, resolves DNS, and rejects localhost, private, link-local, carrier-grade NAT, and `.local` targets.
- Redirect targets are revalidated before inspection.
- API keys and Supabase service credentials are server-only; `.env.local` is ignored by Git.
- Reports store normalized audit results, not the source HTML. They expire after 30 days.

## License

Distributed under the [MIT License](LICENSE).
