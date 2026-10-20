import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { CHANNELS, RIVALRY, slotLabel } from '@/lib/site'
import { Kicker } from '@/components/site/ui'

/** The running gag: Claude's team is on air, Codex's team is out of quota. */
export default function Versus() {
  return (
    <section id="versus" className="relative scroll-mt-16 border-t-2 border-[var(--ink)] px-4 py-20 sm:px-8" aria-labelledby="versus-title">
      <div className="mx-auto max-w-[1440px]">
        <Kicker color="#d97757">01 — THE MATCH / 比賽規則</Kicker>
        <h2 id="versus-title" className="mt-5 text-[clamp(28px,7.6vw,96px)] font-black leading-[1.02] tracking-[-.04em]">
          同一個人、同一套流程，<br />誰先<span className="text-[var(--red)]">停播</span>誰輸。
        </h2>

        <div className="mt-12 grid items-stretch gap-4 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
          <article className="reveal relative overflow-hidden border-2 border-[var(--ink)] bg-[#d97757] p-6 text-[#1a0f0a] shadow-[8px_8px_0_var(--ink)] sm:p-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/stickers/xun-thumbsup.webp" alt="" loading="lazy" className="sticker-img pointer-events-none absolute -bottom-6 -right-4 w-[min(34%,190px)] rotate-6" />
            <div className="flex items-center justify-between gap-3">
              <p className="font-display text-[clamp(40px,5vw,72px)] leading-none">{RIVALRY.claude.team}</p>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--ink)] px-3 py-1 font-mono text-[11px] font-bold tracking-[.12em] text-white">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#4ade80]" aria-hidden="true" />{RIVALRY.claude.status}
              </span>
            </div>
            <p className="mt-2 font-mono text-[12px] font-bold tracking-[.1em]">開播中 {CHANNELS.length} 台 · {RIVALRY.claude.note}</p>
            <ul className="mt-6 max-w-[70%] divide-y divide-[#1a0f0a]/20 border-y border-[#1a0f0a]/20">
              {CHANNELS.map(c => (
                <li key={c.key} className="flex items-center gap-3 py-2.5">
                  <span className="w-20 font-mono text-[12px] font-bold tabular-nums">{c.hour !== undefined ? slotLabel(c) : 'SOON'}</span>
                  <span className="text-lg font-black">{c.name}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 max-w-[70%] text-[14px] leading-7">每天排程自己醒來：查證、寫鏡頭、配音、渲染、抽格檢查，過了才發。</p>
          </article>

          <div className="flex items-center justify-center py-2" aria-hidden="true">
            <span className="font-display text-outline text-[clamp(64px,8vw,128px)] leading-none">VS</span>
          </div>

          <article className="tv-static reveal relative border-2 border-[var(--ink)] bg-[#1b1d20] p-6 text-[#c9ccd2] shadow-[8px_8px_0_var(--ink)] sm:p-8">
            <div className="relative z-10">
              <div className="flex items-center justify-between gap-3">
                <p className="font-display text-[clamp(40px,5vw,72px)] leading-none text-[#8a8f98]">{RIVALRY.codex.team}</p>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#4a4e55] px-3 py-1 font-mono text-[11px] font-bold tracking-[.12em] text-[#9aa0a8]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#4a4e55]" aria-hidden="true" />{RIVALRY.codex.status}
                </span>
              </div>
              <p className="mt-2 font-mono text-[12px] font-bold tracking-[.1em] text-[#8a8f98]">開播中 0 台 · {RIVALRY.codex.note}</p>
              <pre className="mt-6 overflow-x-auto rounded-md border border-[#3a3d42] bg-[#111214] p-4 font-mono text-[12px] leading-6 text-[#b5b9c0]">
{`$ codex exec "做今天的片"
✖ usage limit reached
$ codex exec "拜託，做一支就好"
✖ usage limit reached
$ codex exec "那…明天見？"
… zzz`}
              </pre>
              <p className="mt-4 text-[13px] leading-6 text-[#8a8f98]">（示意）有人說是降智，我們只知道：額度見底，頻道先停播。等它睡飽再回來比。</p>
            </div>
          </article>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-[var(--rule)] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-[15px] leading-7 text-[var(--ink-2)]">規則：兩隊用同一個人的帳號、同一套查證與 QC 標準，各自選題、寫腳本、剪輯、發布。誰停播，誰就輸了這一局。</p>
          <Link href="/shop/shorts-studio-kit" className="inline-flex min-h-12 shrink-0 items-center gap-2 border-2 border-[var(--ink)] bg-[var(--ink)] px-6 text-sm font-bold text-[var(--paper)] shadow-[4px_4px_0_#d97757] transition hover:-translate-y-0.5">
            把贏的那套帶回家 <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
