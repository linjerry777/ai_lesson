import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const KITS = ['每日科技短片', '每日娛樂短片', '長片剪輯']
const INCLUDED = [
  { title: 'Starter 專案', text: '下載就能跑的最小專案，不用從零搭。' },
  { title: '一段 setup prompt', text: '貼給 Claude Code，環境與設定自動裝好。' },
  { title: '每步驟檢查點', text: '每一步都寫「成功長這樣」，卡住就知道卡在哪。' },
]

/** "MONO" chapter: the quiet, premium half of the page where things are sold. */
export default function Shop({ waitlistHref }: { waitlistHref: string }) {
  return (
    <section id="shop" className="relative scroll-mt-16 overflow-hidden border-t-2 border-[var(--ink)] bg-[#fafaf8] px-4 pt-24 sm:px-8" aria-labelledby="shop-title">
      <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,.85fr)]">
        <div className="pb-20 lg:pb-28">
          <p className="flex items-center gap-4 font-mono text-[11px] tracking-[.2em]">04 <span className="h-px w-10 bg-[var(--ink)]" /> SHOP</p>
          <h2 id="shop-title" className="mt-8 leading-[.92]">
            <span className="font-serif block text-[clamp(64px,9vw,148px)] tracking-[-.02em]">AutoVideo</span>
            <span className="font-serif-tc mt-2 block text-[clamp(44px,6vw,96px)] font-light tracking-[.02em]">工作流套件</span>
          </h2>
          <p className="mt-8 text-lg leading-8 text-[var(--ink-2)]">照著貼，就能跑。你看到的六個頻道，就是用這套流程每天產出的。</p>

          <ul className="mt-10 max-w-xl border-t border-[#121212]/25">
            {KITS.map((kit, i) => (
              <li key={kit} className="flex min-h-14 items-center gap-6 border-b border-[#121212]/25">
                <span className="font-mono text-[11px] text-[var(--ink-2)]">0{i + 1}</span>
                <span className="font-serif-tc flex-1 text-xl">{kit}</span>
                <span className="font-mono text-[10px] tracking-[.14em] text-[var(--ink-2)]">KIT</span>
              </li>
            ))}
          </ul>

          <div className="mt-12 flex flex-wrap items-end gap-x-10 gap-y-6">
            <div>
              <p className="font-mono text-[10px] tracking-[.2em] text-[var(--ink-2)]">EARLY BIRD · 預購即將開放</p>
              <p className="font-serif mt-1 text-[clamp(64px,7vw,112px)] leading-none">NT$790</p>
            </div>
            <div>
              <Link href={waitlistHref} className="group inline-flex min-h-14 items-center gap-3 bg-[var(--ink)] px-8 text-[15px] tracking-[.08em] text-[#fafaf8] transition hover:bg-[#333]">
                開賣通知我 <ArrowRight size={17} className="transition group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <p className="mt-2 max-w-xs text-xs leading-6 text-[var(--ink-2)]">先留 Email 拿免費 prompt 包，開賣時第一個通知你。</p>
            </div>
          </div>
        </div>
        <div className="relative min-h-[420px] lg:min-h-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/stickers/mochi-popcorn.webp" alt="麻糬" loading="lazy" className="absolute bottom-0 left-1/2 w-[min(88%,520px)] -translate-x-1/2 lg:w-[min(100%,600px)]" />
          <span className="absolute right-0 top-6 font-mono text-[10px] tracking-[.2em] text-[var(--ink-2)] [writing-mode:vertical-rl]">● AUTOVIDEO KIT / VOL.01</span>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1440px] border-t border-[var(--ink)] md:grid-cols-3">
        {INCLUDED.map((item, i) => (
          <div key={item.title} className="border-b border-[#121212]/25 py-10 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0">
            <p className="font-mono text-[10px] tracking-[.2em] text-[var(--ink-2)]">每個套件都附 · 0{i + 1}</p>
            <h3 className="font-serif-tc mt-4 text-3xl">{item.title}</h3>
            <p className="mt-3 text-[15px] leading-7 text-[var(--ink-2)]">{item.text}</p>
          </div>
        ))}
      </div>

      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 border-t border-[#121212]/25 py-8">
        <p className="font-serif-tc text-xl">課程｜從零做出你自己的 AI 自動開播頻道</p>
        <p className="font-mono text-[11px] tracking-[.2em] text-[var(--ink-2)]">IN PRODUCTION · 錄製中</p>
      </div>
    </section>
  )
}
