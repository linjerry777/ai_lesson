import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { CHANNELS } from '@/lib/site'
import { Kicker } from '@/components/site/ui'

const STEPS = [
  { name: '選題', text: '每天抓新聞與趨勢，AI 排出今天每個頻道要講什麼。', tool: 'LLM · RSS' },
  { name: '腳本', text: '同一個題目，依角色人設寫成不同口吻的腳本。', tool: 'CLAUDE CODE' },
  { name: '配音', text: '每個角色有自己的聲音，奶烙的聲音是我。', tool: 'TTS' },
  { name: '剪輯', text: '字幕、版面、動畫用程式自動排好，不開剪輯軟體。', tool: 'REMOTION · FFMPEG' },
  { name: '發布', text: '排程發到 YouTube 與 IG，隔天回收數據再調整。', tool: 'SCHEDULER' },
]

export default function Workflow() {
  return (
    <section id="workflow" className="relative scroll-mt-16 overflow-hidden bg-[var(--ink)] px-4 py-24 text-[var(--paper)] sm:px-8" aria-labelledby="workflow-title">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/stickers/xun-explain.webp" alt="" loading="lazy" className="sticker-img pointer-events-none absolute right-6 top-16 hidden w-[150px] rotate-6 lg:block" />
      <div className="mx-auto max-w-[1440px]">
        <Kicker color="#2747ff" className="text-[#c9c4b8]">02 — BEHIND THE SCENES / 幕後</Kicker>
        <h2 id="workflow-title" className="mt-5 max-w-4xl text-[clamp(34px,8.6vw,104px)] font-black leading-[1] tracking-[-.04em]">
          一個點子，<br />自動長成<span className="text-[#f5a524]">五支</span>影片。
        </h2>
        <ol className="mt-16 grid border-t border-white/25 md:grid-cols-5">
          {STEPS.map((step, i) => (
            <li key={step.name} className="reveal border-b border-white/25 py-8 md:border-b-0 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0">
              <p className="font-display text-outline-paper text-[clamp(64px,6vw,96px)] leading-none">0{i + 1}</p>
              <h3 className="mt-4 text-3xl font-black">{step.name}</h3>
              <p className="mt-3 text-[15px] leading-7 text-[#c9c4b8]">{step.text}</p>
              <p className="mt-5 font-mono text-[10px] font-bold tracking-[.16em] text-[#8d887c]">{step.tool}</p>
            </li>
          ))}
        </ol>
        <div className="mt-12 flex flex-col gap-6 border-t border-white/25 pt-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-2 font-mono text-[11px] font-bold tracking-[.16em] text-[#c9c4b8]">DISPATCH →</span>
            {CHANNELS.map(c => (
              <a key={c.key} href={`#ch-${c.key}`} className="border-2 border-[var(--paper)] px-3 py-1.5 text-sm font-bold" style={{ background: c.color, color: c.ink }}>{c.name}</a>
            ))}
          </div>
          <Link href="#shop" className="inline-flex min-h-12 items-center gap-2 self-start border-2 border-[var(--paper)] px-6 text-sm font-bold transition hover:bg-[var(--paper)] hover:text-[var(--ink)]">
            這整套流程，就是工作流套件 <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
