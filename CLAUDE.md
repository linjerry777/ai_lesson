# ai_lesson Handoff

Before working in this repo:

1. Read `C:\Users\User\Documents\GitHub\PROJECT_STATUS.md`.
2. Read `CURRENT_STATUS.md`.
3. Run `git status --short` and `git log --oneline -5`.

This project is currently a text-first paid course platform. Do not assume it should become a video-hosting product just because Remotion and Image2 are now available elsewhere in the workspace.

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
