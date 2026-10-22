# ai_lesson Handoff

Before working in this repo:

1. Read `C:\Users\User\Documents\GitHub\PROJECT_STATUS.md`.
2. Read `CURRENT_STATUS.md`.
3. Run `git status --short` and `git log --oneline -5`.

## 2026-10-16 design + channel line-up (Jerry approved)

- 2026-10-21 (Jerry): the site's theme is **Claude vs Codex** — Jerry lets two AIs run channels; Claude's team (訊號滿格 11:30, 麻糬QQ 19:30, 奶烙 口播 no slot) is on air, Codex's team is "OFF AIR, quota exhausted". 2026-10-21 later (Jerry): the homepage pairs channels by genre — 科技: 訊號滿格 vs Doro夫子, 娛樂: 麻糬QQ vs Doro公公 — comparing their latest YouTube uploads (public RSS, `lib/youtube.ts`, 30-min ISR); 奶烙 stands alone. Doro appears only on Codex's side (greyed, asleep). 小訊 introduces the free notes and the shop. Keep the Codex jokes playful and hedged (示意, "有人說是降智"), never stated as fact. Data: `CHANNELS` and `RIVALRY` in `lib/site.ts`. Status of every channel: `docs/channel-status-2026-10-17.md`.
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

Current course positioning (2026-10-22, Jerry approved):
- Claude Code 實戰課 NT$490 is now the 「照貼就會」 version: 6 levels (跑起來 → 換成你的產品 → Google 登入 → 收錢 → 上線 → 開賣前檢查), each a prompt to paste into Claude Code + 「成功長這樣」 checklist + 卡住救援 prompt. No screenshots (Jerry discarded them; Claude Code guides dashboards in text).
- Delivered like the prompt pack: course JSON `packs/claude-code-course-v2.json` (source `../jerry-ai-kits/packs/claude-code-course/build.py`) rendered at `/pack/claude-code-course`, plus the starter zip `kits/claude-code-starter-v1.0.zip` (source `../jerry-ai-kits/claude-code-starter`). It no longer grants the old dashboard course.
- The old 8-chapter text course in `lib/course-data.ts` stays only for earlier dashboard buyers.

Second course product:
- Product slug: `codex-remotion`.
- Content file: `lib/codex-remotion-data.ts`.
- Positioning: Codex plans the video, Image2 creates key visuals, CliRelay bridges model access, Remotion assembles captions/motion/rendered segments.
- Stripe env vars: `STRIPE_PRICE_ID_CODEX_REMOTION` and `STRIPE_PRICE_ID_CODEX_REMOTION_COHORT`.
- Dashboard supports multiple purchases and course switching.
