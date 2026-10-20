import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { getPublishedResources, getPublishedVideos } from '@/lib/content'
import { PRODUCTS, canBuy, priceLabel } from '@/lib/products'
import { CHANNELS, SITE } from '@/lib/site'

export const metadata: Metadata = {
  title: `${SITE.name}｜連結`,
  description: SITE.manifesto,
  alternates: { canonical: '/link' },
}

/** Link-in-bio page for IG / YouTube profiles: free first, then products, then channels. */
export default function LinkPage() {
  const resource = getPublishedResources()[0]
  const notes = getPublishedVideos().slice(0, 2)
  const sellable = PRODUCTS.filter(product => product.status !== 'soon')
  return (
    <main className="px-4 pb-24 pt-10">
      <div className="mx-auto max-w-md">
        <div className="text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/stickers/nailao.webp" alt="奶烙" className="sticker-img mx-auto h-28 w-auto -rotate-3" />
          <h1 className="font-display mt-4 text-4xl tracking-[.02em]">JERRY<span className="text-[var(--red)]">.</span>AI</h1>
          <p className="mt-2 text-[15px] font-bold">{SITE.manifesto}</p>
          <p className="mt-1 text-sm text-[var(--ink-2)]">把 AI 工作流做成你也能跑起來的東西</p>
        </div>

        {resource && (
          <Link href={`/free/${resource.slug}`} className="mt-8 block border-2 border-[var(--ink)] bg-[#f5a524] p-5 shadow-[5px_5px_0_var(--ink)] transition hover:-translate-y-0.5">
            <p className="font-mono text-[10px] font-bold tracking-[.16em]">第一次來？先拿免費的</p>
            <p className="mt-2 flex items-center justify-between gap-3 text-xl font-black leading-snug">📩 {resource.title} <ArrowRight size={20} className="shrink-0" aria-hidden="true" /></p>
            <p className="mt-1 text-sm">留 Email 馬上下載，不用註冊</p>
          </Link>
        )}

        <p className="mt-10 font-mono text-[11px] font-bold tracking-[.16em]">工作流與課程</p>
        <ul className="mt-3 space-y-3">
          {sellable.map(product => (
            <li key={product.slug}>
              <Link href={`/shop/${product.slug}`} className="flex items-center justify-between gap-4 border-2 border-[var(--ink)] bg-[var(--white)] p-4 transition hover:-translate-y-0.5 hover:shadow-[4px_4px_0_var(--ink)]">
                <span>
                  <span className="block text-[16px] font-black leading-snug">{product.name}</span>
                  <span className="mt-1 block text-xs text-[var(--ink-2)]">{product.tagline}</span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="font-display block text-xl">{priceLabel(product)}</span>
                  <span className="font-mono text-[10px] font-bold tracking-[.1em] text-[var(--red)]">{canBuy(product) ? '現在可買' : '預購'}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {notes.length > 0 && (
          <>
            <p className="mt-10 font-mono text-[11px] font-bold tracking-[.16em]">最新影片筆記</p>
            <ul className="mt-3 divide-y divide-[var(--rule)] border-y border-[var(--rule)]">
              {notes.map(note => (
                <li key={note.slug}>
                  <Link href={`/videos/${note.slug}`} className="flex min-h-14 items-center justify-between gap-3 py-3 text-[15px] font-bold">
                    {note.title} <ArrowRight size={16} className="shrink-0" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}

        <p className="mt-10 font-mono text-[11px] font-bold tracking-[.16em]">Claude 隊的頻道</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {CHANNELS.map(c => {
            const href = c.links.youtube ?? c.links.instagram
            return (
              <a key={c.key} href={href ?? `/#ch-${c.key}`} target={href ? '_blank' : undefined} rel={href ? 'noopener noreferrer' : undefined}
                className="flex min-h-14 items-center justify-between border-2 border-[var(--ink)] px-3 text-[15px] font-black" style={{ background: c.color, color: c.ink }}>
                {c.name} <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            )
          })}
        </div>

        <a href={SITE.studioUrl} target="_blank" rel="noopener noreferrer" className="mt-10 flex min-h-12 items-center justify-center gap-2 border border-[var(--ink)] text-sm font-bold">
          接案合作：Jerry AI Studio <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </div>
    </main>
  )
}
