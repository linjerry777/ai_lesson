# ai_lesson Current Status

Last updated: 2026-05-13

This repo is the AI course / paid learning platform. It is currently a text-first course product, not a video-hosting product.

## Current Product State

- Stack: Next.js 14 App Router, TypeScript, Tailwind CSS, Supabase Auth/DB, Stripe Checkout + webhook, Vercel.
- Current offer: Claude Code product-shipping workflow course, text-only edition around NT$990.
- Course content lives mainly in `lib/course-data.ts`.
- Product registry lives in `lib/courses.ts`; checkout/dashboard are already multi-product aware.
- Dashboard intentionally does not fetch videos from Supabase Storage right now.
- `CLAUDE.md` was previously empty; use this file as the durable handoff state.

## Course Positioning

- This is not a zero-basis programming course.
- Target learner: has basic engineering literacy, can follow terminal/setup steps, and can paste errors/logs into Claude for repair.
- Core promise: use Claude Code to build a real product website with Landing Page, Google login, Stripe Checkout/Webhook, purchase records, dashboard unlock, and Vercel deployment.
- Avoid over-promising MCP / Hook / Sub-Agent as the main course. Those are future advanced modules or separate products.

## Latest Course Upgrade

Updated on 2026-05-13:

- Course now presents itself as an 8-stage workflow from ch00 to ch07.
- Added per-chapter validation/checkpoint steps in `lib/course-data.ts`.
- Added stronger rescue prompts and a fixed bug-report format for learners who get stuck.
- Corrected Stripe lesson amount from TWD 2640 to current TWD 990 offer.
- Landing copy now emphasizes "can login, can pay, can deploy" instead of vague AI superpower claims.
- FAQ explicitly says the course is not suitable for complete non-programmers.

## Local Working Tree Notes

- Before editing, run `git status --short` and do not clean up unrelated untracked files unless Jerry asks.
- Known untracked files seen on 2026-05-13:
  - `.playwright-mcp/*`
  - `docs/superpowers/plans/2026-04-12-subtitle-gui.md`
  - `docs/text-pivot-audit.md`
  - `CLAUDE.md`

## Cross-Project Tech Now Available

These are available in Jerry's workspace and should inform future course/content/product decisions:

- Codex / Codex CLI is now a serious implementation path, not only Claude Code.
- CliRelay / OpenAI-compatible local bridge is available in some projects for using ChatGPT/Codex-side capabilities from local apps.
- Image2 is the strongest current visual generation path. Use it for high-quality keyframes, Doro character art, carousel visuals, thumbnails, and storyboards.
- Doro LoRA assets are shared across projects. Read `C:\Users\User\Documents\GitHub\DORO_LORA_REGISTRY.md` before generating Doro visuals.
- ComfyUI is available at `127.0.0.1:8188` when started, but local video generation is not production-ready.
- Local video model findings:
  - LTX Video: rejected for Doro work; character identity and anatomy break too often.
  - Wan2.2 TI2V 5B: rejected; faster, but character quality is not acceptable.
  - Wan2.2 I2V 14B fp8 + 4-step LoRA: usable only as an experimental 2-3 second atmosphere/motion tool, not a core production pipeline.
- Remotion is the current reliable long-form video assembly layer: script, captions, motion graphics, camera moves, transitions, and final render.
- open-carrusel is the strongest proof that Image2 + Doro references + HTML overlays can produce publishable visual content.
- upload-post is the preferred publishing provider when it covers the target platform.
- doro-palace is the blog / funnel hub for traffic from carousels, short videos, and long-form YouTube.

## Remotion Direction

Do not build long-form videos around local video models yet. The practical production path is:

1. Codex plans the video: topic, hook, script, segment list, visual beats, title/description.
2. Image2 generates clean key visuals per scene, with Doro identity and scene-specific props.
3. Remotion creates motion using deterministic techniques: pan/zoom, parallax, cutaways, UI cards, kinetic text, timeline beats, subtitles, sound effects, and scene transitions.
4. Optional: Wan 14B I2V can be used for a small number of short transition or atmosphere shots, but only after the keyframe is already strong.

Key rule: Image2 owns visual quality; Remotion owns timing and motion; local video models are optional garnish.

## ai_lesson Opportunities

- Keep the existing Claude Code course intact until there is a clear product decision to reposition it.
- Consider a future appendix or second product around "AI content factory" workflows:
  - Codex as producer / engineer
  - Image2 as art department
  - Remotion as editor
  - upload-post as publisher
  - doro-palace as traffic capture
- If updating course copy, do not claim ChatGPT Pro automatically provides OpenAI API keys. Treat ChatGPT subscription features, API billing, and local proxy bridges as separate concepts.
- Good near-term content angle: "AI tools are not one magic model; the workflow wins when each model owns the right job."

## Next Priorities

1. Decide whether ai_lesson stays a Claude Code engineering course or becomes a broader Codex/Cursor/Claude AI workflow course.
2. If broadening, add new course module(s) instead of rewriting the whole product at once.
3. If productizing the Remotion workflow, keep it separate from ai_lesson until there is a clearer offer.
