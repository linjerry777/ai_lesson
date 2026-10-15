# AI Lesson — Codex Handoff

Last updated: 2026-07-24

Read `AGENTS.md` first. AI Lesson is a text-first course platform. It is not a
video-hosting product, and paid checkout is intentionally disabled.

Production: <https://ailesson-two.vercel.app>

## Current Products

- `starter-free`: AI 實作入門預備課, four chapters, available after login.
- `claude-code`: Claude Code 實戰工作流, eight-stage text course, listed at
  NT$990.
- `codex-remotion`: Codex + Image2 + Remotion 角色動畫工作流, listed at
  NT$1,490.

`lib/courses.ts` is the product/course registry. Course content lives in the
corresponding files under `lib/`.

## Current Capabilities

- Public landing, pricing, login, market, and course dashboard routes
- Google and Email Supabase authentication
- Free-course access after login
- App-scoped purchase and entitlement schema under `app_id = 'ai-lesson'`
- Retry-safe external entitlement claim logic
- Safe internal redirect handling
- Responsive Traditional Chinese course experience

## Payment Lock

`AI_LESSON_PAYMENTS_ENABLED=false` must remain set in production.

Do not enable paid checkout until all of these are verified together:

1. A current Stripe Sandbox `sk_test_` secret.
2. Active TWD Price IDs for both paid products.
3. A matching Sandbox webhook secret for
   `checkout.session.completed` at `/api/webhooks/stripe`.
4. One end-to-end non-charging Sandbox entitlement test.

Never use a live Stripe secret or real charge for routine verification. Do not
infer that a listed price means checkout is available.

## Known Gaps

- No real customer purchase has been validated.
- Learner completion and last chapter persist per user in browser storage (local 2026-09-27 change); cloud/cross-device progress is not implemented.
- Cohort operations and cohort Price IDs are unconfigured.
- CommercePilot entitlement logic has automated coverage but no real pending
  order row has been used for a live smoke test.

## Stack

- Next.js 16 App Router, React 19, TypeScript
- Tailwind CSS
- Supabase Auth/Postgres
- Stripe SDK with server-side payment feature flag
- Vercel

## Verification

```powershell
npm run check
```

The check command runs lint, TypeScript, tests, and production build. Also
browser-check desktop and 390 px mobile:

- public pricing shows disabled paid actions;
- direct checkout redirects to `payments_unavailable`;
- login preserves only safe internal `next` paths;
- unauthenticated dashboard redirects to login;
- authenticated free course renders all four chapters.

## Repository Boundaries

- Never commit `.env.local`, `.env.vercel.local`, `.vercel/`, Supabase
  service-role keys, Stripe secrets, OAuth credentials, generated browser logs,
  or local test artifacts.
- Do not reopen payments merely to improve the portfolio demonstration.

