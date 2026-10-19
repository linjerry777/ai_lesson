# ai_lesson Handoff

Before working in this repo:

1. Read `C:\Users\User\Documents\GitHub\PROJECT_STATUS.md`.
2. Read `CURRENT_STATUS.md`.
3. Run `git status --short` and `git log --oneline -5`.

## 2026-10-16 design + channel line-up (Jerry approved)

- Public site brand is JERRY.AI: "一個人，五個頻道，每天自動開播。" Five channels live in `lib/site.ts` `CHANNELS` with their real daily publish times (訊號滿格 11:30, Doro夫子 18:00, 麻糬QQ 19:30, Doro公公 20:00, 奶烙 no fixed slot). Status of every channel: `docs/channel-status-2026-10-17.md`.
- 奶烙 is the talk (口播) channel (2026-10-17, Jerry): the cat hosts, Jerry only voices it. This replaces the "monitor-head" avatar picked earlier in the 口播 session. Never show Jerry's face (his wife asked).
- 鳴潮二創 is licensed for non-commercial Bilibili use only: no characters, clips or stickers on this site; only the footer link to Bilibili (`FAN_WORK`).
- Client work lives on Jerry AI Studio (https://jerry-ai-studio-two.vercel.app); this site's studio section is only a hand-off link, do not duplicate case studies here.
- Store: `lib/products.ts` is the catalogue for `/shop`. Sellable kit sources live in the **private** repo `linjerry777/jerry-ai-kits` (local `../jerry-ai-kits`, zips via `scripts/pack.py`); this repo is public, so never commit kit sources here. Never ship Jerry's channel characters inside a kit.
- Visual system: "A" = paper #f3f0e8 + ink + per-channel signal colour, heavy Noto Sans TC 900 + Anton + JetBrains Mono, die-cut stickers; "C" = #fafaf8 monochrome with Instrument Serif / Noto Serif TC for shop + studio. No WebGL.

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
