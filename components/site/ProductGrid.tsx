import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import { PRODUCTS, canBuy, compareLabel, priceLabel, type Product } from '@/lib/products'

export function productType(product: Product) {
  if (product.bundle) return { label: '全套組合', color: '#121212', ink: '#ffffff' }
  if (product.pack) return { label: '指令包・新手', color: '#ff5d8f', ink: '#ffffff' }
  if (product.kind === 'course') return { label: '線上課程', color: '#2747ff', ink: '#ffffff' }
  return { label: '工作流套件', color: '#f5a524', ink: '#1a1208' }
}

/** Buyable products as cards (bundle highlighted), plus a line for the ones still in production. */
export default function ProductGrid() {
  const live = PRODUCTS.filter(product => product.status !== 'soon')
  const soon = PRODUCTS.filter(product => product.status === 'soon')
  return (
    <>
      <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {live.map(product => {
          const type = productType(product)
          const best = Boolean(product.bundle)
          return (
            <li key={product.slug} className="relative">
              {best && <span className="absolute -top-3 right-4 z-10 rotate-2 bg-[var(--red)] px-2.5 py-1 text-xs font-black text-white shadow-[2px_2px_0_var(--ink)]">最划算</span>}
              <Link
                href={`/shop/${product.slug}`}
                className={`group flex h-full flex-col border-2 border-[var(--ink)] p-5 transition hover:-translate-y-1 ${best ? 'bg-[var(--ink)] text-[#fafaf8] shadow-[6px_6px_0_var(--red)]' : 'bg-white shadow-[6px_6px_0_var(--ink)]'}`}
              >
                <span className="self-start px-2 py-0.5 text-[12px] font-black" style={best ? { background: '#fafaf8', color: '#121212' } : { background: type.color, color: type.ink }}>{type.label}</span>
                <span className="mt-3 text-[20px] font-black leading-snug">{product.name}</span>
                <span className={`mt-2 text-[14px] leading-6 ${best ? 'text-[#c9c4b8]' : 'text-[var(--ink-2)]'}`}>{product.tagline}</span>
                <ul className="mt-4 space-y-1.5 text-[13px] leading-5">
                  {product.includes.slice(0, 3).map(item => (
                    <li key={item.title} className="flex gap-2"><Check size={15} className="mt-0.5 shrink-0" aria-hidden="true" />{item.title}</li>
                  ))}
                </ul>
                <span className="mt-auto flex items-end justify-between gap-3 pt-6">
                  <span>
                    {compareLabel(product) && <s className={`block text-sm ${best ? 'text-[#8d887c]' : 'text-[var(--ink-2)]'}`}>{compareLabel(product)}</s>}
                    <span className="font-display text-[40px] leading-none">{priceLabel(product)}</span>
                  </span>
                  <span className={`inline-flex min-h-11 items-center gap-1.5 px-3 text-sm font-black ${best ? 'bg-[#fafaf8] text-[#121212]' : 'bg-[var(--ink)] text-white'}`}>
                    {canBuy(product) ? '看內容・購買' : '看內容'} <ArrowRight size={15} className="transition group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
      {soon.length > 0 && (
        <p className="mt-6 text-sm text-[var(--ink-2)]">
          製作中：{soon.map((product, i) => (
            <span key={product.slug}>{i > 0 && '、'}<Link href={`/shop/${product.slug}`} className="underline">{product.name}</Link></span>
          ))}
        </p>
      )}
      <p className="mt-3 font-mono text-[11px] leading-6 tracking-[.04em] text-[var(--ink-2)]">Stripe 安全付款 · 付款完成立刻拿到 · 7 天內不滿意可退費</p>
    </>
  )
}
