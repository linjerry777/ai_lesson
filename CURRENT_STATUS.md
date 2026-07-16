# ai_lesson Current Status

Last updated: 2026-07-16

AI Lesson is a text-first course platform. It is not a video-hosting product.

## Real And Verified

- Stack: Next.js 16.2.10, React 19.2.4, TypeScript, Tailwind CSS, Supabase Auth/Postgres, Stripe SDK, and Vercel.
- Public products:
  - `starter-free`: AI 實作入門預備課, 4 chapters, available after login without a purchase.
  - `claude-code`: Claude Code 實戰工作流, 8-stage text course, listed at NT$990.
  - `codex-remotion`: Codex + Image2 + Remotion 角色動畫工作流, text course, listed at NT$1,490.
- Course content lives in `lib/starter-course-data.ts`, `lib/course-data.ts`, and `lib/codex-remotion-data.ts`.
- The registry in `lib/courses.ts` is the source of truth for product slugs, lessons, tiers, and Stripe Price env names.
- Shared Supabase project `jerry-platform` is reachable from local credentials.
- Supabase Auth settings return 200; Google and Email providers are enabled.
- AI Lesson reads and writes purchases with `app_id = 'ai-lesson'`.
- OAuth callback registers app membership and attempts CommercePilot entitlement claims without making login depend on the external bridge.
- External claims normalize purchaser email, validate provider/product/tier, use an app-scoped synthetic session id, and are retry-safe through the `(app_id, stripe_session_id)` upsert boundary.
- As of this audit, AI Lesson has 0 purchases, 0 pending external entitlements, and 0 claimed external entitlements in the shared project.
- Vercel Production had empty Supabase values. `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` were restored from the verified local shared-project configuration on 2026-07-16.
- `AI_LESSON_PAYMENTS_ENABLED=false` is set in Vercel Production. Direct paid checkout is blocked server-side and paid CTA buttons are disabled.
- Production from `origin/main` is Ready and served at the stable alias `https://ailesson-two.vercel.app`.

## Payment State

- The only locally available Stripe secret is a Sandbox key, and Stripe reports that key as expired.
- No Checkout Session, charge, customer, or order was created during this audit.
- The old Vercel Stripe variable names exist, but their Production values were empty when pulled on 2026-07-16.
- The landing page therefore labels paid courses honestly as priced but not open for payment.
- Do not set `AI_LESSON_PAYMENTS_ENABLED=true` until all of the following are verified together:
  - a current `sk_test_` secret;
  - active TWD Price IDs for both public paid products;
  - a matching `whsec_` secret for `checkout.session.completed` at `/api/webhooks/stripe`;
  - one non-charging Sandbox end-to-end entitlement test.

## Automated Verification

- `npm run lint`: pass, zero warnings.
- `npm run typecheck`: pass.
- `npm run test`: 4 files, 20 tests, all pass.
- `npm run build`: pass on Next.js 16.2.10.
- Covered boundaries:
  - checkout product/tier selection and fallback;
  - safe internal `next` redirects;
  - Stripe metadata validation, legacy defaults, and app/session upsert key;
  - external entitlement normalization, validation, claim, and idempotency.
- `npm audit --omit=dev` has no high or critical finding. Three moderate entries remain because Next 16.2.10 bundles PostCSS 8.4.31; npm's suggested automatic fix incorrectly downgrades Next to 9 and must not be used.

## Browser Evidence

- Local homepage: desktop and exact 390x844 mobile load with no horizontal overflow or error overlay.
- Public pricing shows free access plus two disabled paid CTAs; no unsupported testimonial section is present.
- `/market`: title, analyzer controls, and 6 external source links render at 390px without overflow.
- `/login`: Google and Email controls render at 390px; Google OAuth reaches the Google authorization page with the local callback preserved.
- Unauthenticated `/dashboard?course=starter-free` redirects to login and preserves the safe `next` path.
- With a one-time local session for an existing Supabase user, the free Dashboard renders on mobile and desktop, shows all 4 primer chapters, and has no console warning/error, overlay, or horizontal overflow.
- Production smoke at `https://ailesson-two.vercel.app` confirms:
  - homepage and login render with zero console errors or warnings;
  - both paid CTAs remain disabled;
  - direct paid checkout redirects to `payments_unavailable` and the pricing section;
  - unauthenticated Dashboard preserves its `next` path;
  - Google OAuth reaches Google's authorization page with the production callback URL.

## Missing Or Intentionally Deferred

- Stripe Sandbox must be re-keyed and re-verified before paid checkout can be enabled.
- The CommercePilot entitlement path has automated coverage but no real pending order row exists for a live integration smoke test.
- Dashboard completion state is currently client memory only; it is not persisted per learner.
- Cohort Price IDs and cohort operations remain intentionally unconfigured.
- No real payment or real customer purchase has been validated.

## Working Tree Boundaries

- `.playwright-mcp/`, `*.log`, and `supabase/.temp/` are ignored as generated local artifacts.
- Existing untracked user documents are preserved and intentionally excluded from delivery commits:
  - `docs/superpowers/plans/2026-04-12-subtitle-gui.md`
  - `docs/text-pivot-audit.md`
- Never commit `.env.local`, `.env.vercel.local`, `.vercel/`, service-role keys, Stripe secrets, or OAuth credentials.

## Next Steps

1. Create or rotate Stripe Sandbox credentials and both self-study Price IDs.
2. Update Vercel Production Stripe values, redeploy, and verify the webhook signature without a real charge.
3. Run one external CommercePilot entitlement claim with a controlled Sandbox order.
4. Decide whether learner progress should persist in the shared project before marketing the Dashboard as cross-device progress tracking.
