# ai_lesson Current Status

Last updated: 2026-10-16 (JERRY.AI "24H ON AIR" redesign is local only; not pushed or deployed)

## 2026-10-19 production deploy (Jerry approved)

- Deployed local main (f3c43a3 + .vercelignore) with `vercel --prod` → `dpl_F5DBRXTdHYBysND25J8qQtxpkKyF` (ailesson-kfizhayx3), aliased to https://ailesson-two.vercel.app. Rollback target: previous production `ailesson-o5h1zhp9o` (19 days old).
- Kit sources moved to the private repo https://github.com/linjerry777/jerry-ai-kits and stripped from this repo's unpushed history (backup branch `backup/pre-kit-split-20261019` still contains them locally — do not push that branch). main was then pushed to GitHub.
- Added `ADMIN_EMAILS` to Vercel production. `.vercelignore` keeps `products/` out of deployments.
- Live checks: /, /shop, /shop/*, /free, /free/autovideo-prompt-pack, /videos, /videos/*, OG image, clips, kit previews 200; /admin/stats and /dashboard 307; /book, /lab 404; `/v/1` → video note. Live lead POST returned a signed URL that served prompt pack v2; the test lead row was deleted (count 0).
- Payments remain off (expired Stripe key). Old course checkout code still exists but the paid entry stays closed.

## 2026-10-19 shop + first sellable kit (local)

- New `/shop` and `/shop/[slug]` (C monochrome style) driven by `lib/products.ts`: Shorts Studio Kit NT$790 (preorder), Claude Code course NT$990 (preorder), Mystery Doc Kit and Chibi MV Kit (soon). Payments are still paused (expired Stripe key), so every CTA is the email form (free prompt pack + launch notice). Nav "工作流與課程" → /shop; homepage shop section links to the kit.
- `products/shorts-studio-kit/`: Claude Code plugin (`.claude-plugin/plugin.json` + `marketplace.json`, `claude plugin validate` passes) with 5 skills (news-short, meme-short, short-qc, channel-learning, new-host) and a Remotion `starter/` extracted from AutoVideo's Claude Studio (TechNews + EntShort, edge-tts default / Fish optional, loudnorm, QC sheet). Original sample host 「小方」 generated with Codex (no Jerry characters shipped). Clean `npm install` + both sample builds verified (news 44.8s, meme 30.8s, 1080×1920, ~-19 dB mean).
- Zip for delivery: `products/dist/shorts-studio-kit-v1.0.zip` (git-ignored, ~15MB). Not uploaded anywhere yet; buyer delivery needs payments first.
- Free prompt pack replaced with real content (v2, `course-resources/free/autovideo-prompt-pack/autovideo-prompt-pack-v2.md`) and uploaded to the private `ai-lesson-downloads` bucket; content JSON points to v2 (production still serves v1 until deploy).

## 2026-10-17 five channels, real slots, studio hand-off (local)

- Jerry approved the split: this site = channels + free + shop for learners; client work = Jerry AI Studio (studio section is now a short hand-off with link + mailto).
- 鳴潮二創 removed from the site (non-commercial Bilibili licence): stickers, clip and slot deleted; footer links to Bilibili 毛里球OVO only.
- 口播 = 奶烙 hosting with Jerry's voice (overrides the monitor-head avatar from the 口播 session). 奶烙 shows "SOON / 口播籌備中" until it has a slot.
- Ruler/slots use real publish times (Asia/Taipei): 訊號滿格 11:30, Doro夫子 18:00, 麻糬QQ 19:30, Doro公公 20:00.
- Channel/video inventory written to `docs/channel-status-2026-10-17.md`.

## 2026-10-16 JERRY.AI "24H ON AIR" redesign (local)

- Jerry chose direction "A+C" from Image2 mockups: magazine / broadcast-schedule look (paper, ink, one signal colour per channel) for hero + channels + workflow + free, and a quiet monochrome serif look for shop + studio.
- Six channels (lib/site.ts `CHANNELS`): 奶烙 (cat-hosted talk channel, Jerry voices it; Jerry's face is never shown), 訊號滿格, Doro夫子, Doro公公, 麻糬QQ, 鳴潮二創 (fan work: channel showcase only, never used in selling sections). Slot hours on the 24h ruler are display only, not a real publishing schedule.
- Video notes now use channel key `nailao` (was `tech`).
- Homepage: draggable sticker pile (mouse/pen only), live Taipei ON AIR clock, 24h ruler; channel slots with real clips (`public/clips`), a docked ruler that follows the slot in view; workflow (5 steps); free notes + lead form; shop (AutoVideo kit, NT$790 early-bird "預購即將開放", CTA collects email via the free prompt pack); studio (mailto + portfolio).
- Stickers are built by `scripts/build-stickers.py` (sources live in ../AutoVideo; rembg / white-sheet flood fill) → `public/stickers/*.webp`. The 奶烙 photo sticker is cropped from a contact sheet (original photos not found locally). OG card is a static `app/opengraph-image.png` from `scripts/build-og.py` (the old edge OG could not render Chinese).
- Removed all 3D/WebGL experiments (R3F/three/drei/postprocessing deps, statues, Blender scripts, /book, /lab, /lab2).
- Verified: `npm run check` (lint, typecheck, 13 files / 91 tests + 1 skipped, build). Playwright screenshots at 1440 and 390 for /, /videos, /videos/[slug], /free, /free/[slug]; no horizontal overflow; no console errors.
- Not verified: lead submission end-to-end after the restyle (API unchanged); real devices; reduced-motion pass by eye.


## 2026-10-15 content hub P1 (local)

- Repositioned per Jerry: content + email list + store hub. Old course sections removed from the homepage; old course code kept.
- New: `/videos`, `/videos/[slug]`, `/free`, `/free/[slug]`, `/v/[code]`, `/api/leads`, `/admin/stats`; proxy now records utm/`?s=` attribution cookie (last touch, 30 days) and still guards `/dashboard`.
- Content lives in `content/videos/*.json` and `content/free/*.json` (validated at build). Two placeholder videos and one placeholder prompt pack. Contract: `docs/content-contract.md`.
- Applied `supabase/migrations/20261015090000_ai_lesson_content_hub.sql` to shared `jerry-platform` via `supabase db query --linked` (not `db push`; not recorded in schema_migrations). Additive only: `ai_lesson_leads`, `ai_lesson_clicks`, `ai_lesson_capture_lead`, `ai_lesson_video_stats`, private bucket `ai-lesson-downloads`. anon/authenticated have no table grants or function execute (verified).
- Uploaded placeholder `autovideo-prompt-pack/autovideo-prompt-pack-v1.md` with `scripts/upload-free-resources.mjs`; public object URL returns 400.
- Verified: `npm run check` (lint, typecheck, 13 files / 91 tests + 1 skipped, build). Local production server: `/v/1?s=yt` → click row + cookie → video page → consent required → lead row with video=1/source=youtube → signed URL 200 with file content → `/admin/stats` aggregate. 375px no horizontal overflow on home/video/free. Test lead and click rows deleted afterwards.
- Not verified: `/admin/stats` as a logged-in admin (needs Jerry's Google login; `ADMIN_EMAILS` added to local `.env.local` only — add it on Vercel before deploy). No welcome email is sent yet (Resend is P3). No rate limiting beyond a honeypot.
- Next: P2 store (email checkout without pre-login, entitlement claim, workflow kit / preorder / waitlist; needs a fresh `sk_test_`), P3 sync (pipeline → content JSON, YouTube RSS, Resend).

## 2026-09-30 local course delivery and payment preparation

This section supersedes older learner/progress/payment implementation notes below; it does not claim a new production deployment.

- Generated three separate Product Design/built-in image_gen concepts in the Lesson chat; Jerry's 1/2/3 choice is pending. No broad UI rebuild. Exact image2.5 version cannot be verified through the available tool.
- Expanded all 21 text chapters with exercises, artifacts, acceptance checklists and official-source checks. Free/Claude Code/Codex Remotion remain separate: 4/8/9 chapters and 24/84/64 steps. Cohort is not offered.
- Added a runnable, pinned Remotion text-animation lab and authenticated private ZIP download. Actual output: 6 seconds, 1280x720, 30fps H.264, no audio; full decode and both segment frames verified. No model/TTS calls, role animation long film or publishing is claimed.
- Hardened Checkout/Stripe raw-body webhook validation, TWD minor-unit amounts, app/user/product/tier identity, Price/mode checks, idempotency and persistence read-back. Added service-only atomic fulfillment/revocation RPC migration so refunds before/concurrent with checkout and duplicates cannot restore revoked access. Success URLs do not grant access.
- Preserved user-scoped browser progress; prepared optional auth/RLS/atomic cloud progress and recoverable local pending changes. Both new migrations are local preparations only; cloud flags remain off and no shared DB mutation occurred.
- External claims now require verified email and purchase ownership read-back. There are zero real external orders to exercise that bridge.
- Cloud read-only: Google enabled; this app purchases/external pending/claimed all zero. Stripe Sandbox key still returns 401/api_key_expired; Codex Price missing, Claude Price/endpoint secret validity unverified. Paid entry remains closed; no Checkout/customer/charge or legal agreement accepted.
- Validation: lint, typecheck, 11 files / 63 tests and production build pass. Optional actual signed-handler/local-PG round-trip included; 16 additional isolated DB/RLS checks and concurrent fulfillment/refund pass. Nine local next-start HTTP boundaries pass. The synthetic reader source is deleted, route404 and absent from build manifest; private ZIP traced, paid workbook markers absent from public JS.
- Chrome synthetic learner: complete/reload read-back and actual copy/paste verified. CSS320/390 reading checked with no root horizontal overflow. Real Google learner, two real accounts, actual Stripe Sandbox and cloud cross-device acceptance still pending.
- Updated sales delivery copy and removed this repo footer's internal Hub-root service-center link in line with the shared upgrade brief; these changes are local, not deployed.
- Isolated local Docker fixture is stopped and preserved; temporary production :3005 stopped. This chat's dev :3004 remains available. Preserved all existing dirty/untracked work, no commit/push/deploy or sibling edits.
- Handoff/evidence: `../_repo_reviews/jerry-ai-studio/2026-09-30-five-project-upgrade/lesson/handoff.md`; exact external dependencies and replay steps: `docs/payment-activation.md`.

## 2026-09-30 production release

- Promoted the course-notebook redesign to https://ailesson-two.vercel.app. Deployment: `dpl_3R6gUTVcjTeXM7pTMZm6gBrQUs3J`; prior stable rollback: `dpl_5TmuGXR3BM76TV7ugLW9aj9BCZEL`.
- Passed npm run check: lint, TypeScript, 28 tests and production build. Production unauthenticated dashboard remains 307; paid checkout remains paused and redirects with payments_unavailable.
- External Chrome verified public help-brief generation and clipboard success with synthetic UI troubleshooting text. This is local formatting, not an AI model call.
- Formal homepage checked at 320/768/1024/1440 in real-site iframes without root horizontal overflow.
- Real learner login/entitlements remain unverified: the login page states that signing in accepts Terms/Privacy, and the action-time approval question is still pending. No Google sign-in or payment session was initiated.
- Progress remains user-scoped browser storage; cross-device/cloud persistence is not verified. Evidence: `../_repo_reviews/jerry-ai-studio/2026-09-30-release/`.

## 2026-09-28 local course presentation and learning pass

- Replaced the dense hero with an editorial course-notebook layout; simplified the homepage around learning outcomes, tools, curriculum and actual course availability. Removed unsubstantiated loss/time claims from the active footer and repetitive sales sections from the homepage.
- Added a local AI help-brief composer: required goal/evidence, optional attempted steps, chapter-aware context, reviewable output and clipboard success/failure handling. This formats prompts locally; it does not call a model or transmit text.
- Refined the learning sidebar, reading spacing, chapter labels and phone layout. Chapter changes return to the top. Existing user-scoped browser progress is preserved.
- Verified 28 tests, lint, typecheck and production build. Browser verified real composer generation/copy/invalidation; a temporary synthetic learner fixture verified completed count and last chapter after reload. The fixture was removed before production build and its URL now returns 404.
- Unauthenticated `/dashboard` returns 307 to login. Disabled paid checkout returns 307 with `payments_unavailable`. No login, entitlement writes or Stripe sessions were created.
- Responsive visual checks at 320/390/768/1024/1440 via local iframe harness; embedded mobile click automation was unreliable, so do not treat those visual checks as full mobile interaction coverage. Real authenticated learner and cross-device progress remain unverified.
- Evidence: `../_repo_reviews/jerry-ai-studio/2026-09-28-product-quality-pass.md`.

## 2026-09-27 local learning workspace pass

- Completion and last lesson now persist in versioned browser storage scoped to the authenticated user ID; storage failures keep the page usable and show an honest warning. Separate tabs reload saved progress changes.
- Added a clearer learning-progress panel, responsive reading spacing, truthful final-chapter messaging, and clipboard success/failure handling with legible light/dark prompt buttons.
- Verified: lint, typecheck, 24 tests and production build. Storage tests cover reload, separate users, corrupt data, blocked storage and tab updates.
- Persistence is per browser, not cloud sync. Authenticated course UI and cross-device progress were not browser-verified. Payment lock remains intact; no entitlement/purchase writes or production deployment were performed.

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

## 2026-09-28 local Jerry LINE Hub entry integration

Added a public return link to `https://jerry-line-hub.vercel.app` in the existing navigation/footer without altering authentication, business data, payment controls or service APIs. This link and prior UI work remain local, not deployed. The Hub has a new local service portal, requirement draft and isolated workforce module; see `../jerry-line-hub/docs/line-hub-integration.md` for production dependencies and exact integration boundaries.
