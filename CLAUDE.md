# ai_lesson Handoff

Before working in this repo:

1. Read `C:\Users\User\Documents\GitHub\PROJECT_STATUS.md`.
2. Read `CURRENT_STATUS.md`.
3. Run `git status --short` and `git log --oneline -5`.

## 2026-10-15 positioning change (Jerry approved)

The public site is now a **content + email list + store hub** for Jerry's AI workflow talking-head channel(s), not a single-course sales page:
- `/videos` + `/videos/[slug]`: per-video notes (summary, copyable prompts, tools, free-resource CTA). Source: `content/videos/*.json`.
- `/free` + `/free/[slug]`: email-gated free resources; downloads are 10-minute signed URLs from the private `ai-lesson-downloads` bucket.
- `/v/[code]`: spoken/pinned-comment short links with per-video attribution; `/admin/stats` (ADMIN_EMAILS) shows clicks → leads.
- Content format contract: `docs/content-contract.md`.
- Product principle: every paid product must be easy to reproduce — runnable starter + "paste this to Claude Code" setup prompt + checkpoint steps with "success looks like" — not long text lessons.
- The old Claude Code (NT$990) and Codex Remotion (NT$1,490) courses are removed from the public homepage; their code/content stay for possible rework in P2. Codex Remotion is considered outdated.

Historical note: this project started as a text-first paid course platform. Do not assume it should become a video-hosting product just because Remotion and Image2 are now available elsewhere in the workspace.

Preserve Claude Code course content unless Jerry explicitly asks to reposition the product. Codex / Image2 / Remotion now has its own separate course product, so do not merge that workflow back into the Claude Code course unless asked.

Current course positioning:
- Text-first Claude Code course at roughly NT$990.
- Promise: build a real product website with Landing Page, Google login, Stripe payment, purchase records, dashboard unlock, and Vercel deployment.
- Not for total non-programmers. The copy should say basic engineering literacy is expected.
- Do not lead with MCP / Hook / Sub-Agent claims unless the course content actually teaches them in depth.
- Current structure is 8 stages: ch00 setup, ch01 landing, ch02 auth, ch03 env/debug, ch04 Stripe, ch05 deployment, ch06 debug rescue, ch07 reuse template.

Second course product:
- Product slug: `codex-remotion`.
- Content file: `lib/codex-remotion-data.ts`.
- Positioning: Codex plans the video, Image2 creates key visuals, CliRelay bridges model access, Remotion assembles captions/motion/rendered segments.
- Stripe env vars: `STRIPE_PRICE_ID_CODEX_REMOTION` and `STRIPE_PRICE_ID_CODEX_REMOTION_COHORT`.
- Dashboard supports multiple purchases and course switching.
