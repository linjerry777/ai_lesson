import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { PRODUCTS, getProduct, priceLabel } from '@/lib/products'

const FEATURED = getProduct('shorts-studio-kit')!
const INCLUDED = [
  { title: 'Starter 專案', text: '下載就能跑的最小專案，不用從零搭。' },
  { title: '一段 setup prompt', text: '貼給 Claude Code，環境與設定自動裝好。' },
  { title: '每步驟檢查點', text: '每一步都寫「成功長這樣」，卡住就知道卡在哪。' },
]

/** "MONO" chapter: the quiet, premium half of the page where things are sold. */
export default function Shop() {
  return (
    <section id="shop" className="relative scroll-mt-16 overflow-hidden border-t-2 border-[var(--ink)] bg-[#fafaf8] px-4 pt-24 sm:px-8" aria-labelledby="shop-title">
      <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,.85fr)]">
        <div className="pb-20 lg:pb-28">
          <p className="flex items-center gap-4 font-mono text-[11px] tracking-[.2em]">04 <span className="h-px w-10 bg-[var(--ink)]" /> SHOP</p>
          <h2 id="shop-title" className="mt-8 leading-[.92]">
            <span className="font-serif block text-[clamp(56px,8vw,132px)] tracking-[-.02em]">Shorts Studio</span>
            <span className="font-serif-tc mt-2 block text-[clamp(36px,4.8vw,80px)] font-light tracking-[.02em]">AI 每日短影音工作流</span>
          </h2>
          <p className="mt-8 text-lg leading-8 text-[var(--ink-2)]">照著貼，就能跑。訊號滿格和麻糬QQ 每天用的同一條流水線，打包成 Claude Code plugin＋可以直接渲染的模板。</p>

          <ul className="mt-10 max-w-xl border-t border-[#121212]/25">
            {FEATURED.includes.slice(0, 4).map((item, i) => (
              <li key={item.title} className="flex min-h-14 items-center gap-6 border-b border-[#121212]/25">
                <span className="font-mono text-[11px] text-[var(--ink-2)]">0{i + 1}</span>
                <span className="font-serif-tc flex-1 text-xl">{item.title}</span>
              </li>
            ))}
          </ul>

          <div className="mt-12 flex flex-wrap items-end gap-x-10 gap-y-6">
            <div>
              <p className="font-mono text-[10px] tracking-[.2em] text-[var(--ink-2)]">EARLY BIRD · 預購即將開放</p>
              <p className="font-serif mt-1 text-[clamp(64px,7vw,112px)] leading-none">{priceLabel(FEATURED)}</p>
            </div>
            <div>
              <Link href={`/shop/${FEATURED.slug}`} className="group inline-flex min-h-14 items-center gap-3 bg-[var(--ink)] px-8 text-[15px] tracking-[.08em] text-[#fafaf8] transition hover:bg-[#333]">
                看套件內容 <ArrowRight size={17} className="transition group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <p className="mt-2 max-w-xs text-xs leading-6 text-[var(--ink-2)]">付款開通中：先留 Email 拿免費 Prompt 包，開賣時第一個通知你。</p>
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

      <ul className="mx-auto max-w-[1440px] border-t border-[#121212]/25">
        {PRODUCTS.filter(product => product.slug !== FEATURED.slug).map(product => (
          <li key={product.slug} className="border-b border-[#121212]/25 last:border-b-0">
            <Link href={`/shop/${product.slug}`} className="group flex flex-wrap items-center justify-between gap-4 py-6">
              <span className="font-serif-tc text-xl group-hover:underline">{product.kind === 'course' ? '課程' : '工作流'}｜{product.name}</span>
              <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[.16em] text-[var(--ink-2)]">
                {product.status === 'soon' ? 'IN PRODUCTION · 製作中' : priceLabel(product)} <ArrowUpRight size={14} aria-hidden="true" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
