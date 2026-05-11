# StackSight

StackSight is a founder-facing AI spend audit that helps startup teams spot overspend across coding assistants, chat subscriptions, and API usage before the monthly bill becomes normalized. The app gives value instantly, stores a shareable public report, and only asks for email after the audit is visible.

## What is included

- Landing page with a persistent spend-input form
- Deterministic audit engine with per-tool recommendations and savings math
- Shareable report URLs with public redaction and Open Graph metadata
- Post-result lead capture with server-side storage, honeypot protection, and optional Resend email delivery
- LLM-generated summary with graceful fallback when AI providers are unavailable

## Screenshots

Add three screenshots here after running the app locally or on a deployed URL.

- Screenshot 1: homepage hero and input form
- Screenshot 2: generated audit results state
- Screenshot 3: public report page and lead capture panel

## Quick start

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

For AI summaries, set either `ANTHROPIC_API_KEY` or `OPENAI_API_KEY`.
For transactional email, set `RESEND_API_KEY` and `RESEND_FROM_EMAIL`.

## Deploy

Deploy to Vercel, Netlify, or Render as a standard Next.js app. Set `NEXT_PUBLIC_SITE_URL` to the final production URL so shared report links and email copy reference the correct domain.

## Decisions

1. I used Next.js App Router because the assignment needs a public share URL, API routes, metadata generation, and a polished landing page in one codebase.
2. The audit math is rule-based instead of AI-generated because plan-fit reasoning should be deterministic and easy to defend.
3. I used local JSON persistence to keep the project runnable in a clean repo without provisioning external infrastructure during implementation; in production this should be swapped for Supabase or Postgres.
4. I made the visual direction editorial and warm instead of dashboard-generic because this product needs to feel screenshot-worthy and launch-ready.
5. Email capture happens only after the result appears because the assignment explicitly rewards value-first UX and honest lead generation.

## Repo status

This repo includes the application, tests, CI workflow, and the evaluator-facing markdown files. The only items that still require real-world follow-through from the submitter are deployment, screenshots, live pricing re-verification at submission time, and genuine user interview notes.

