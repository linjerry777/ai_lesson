import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import LeadForm from '@/components/site/LeadForm'
import { BackLink } from '@/components/site/ui'
import { getPublishedResources } from '@/lib/content'
import { PRODUCTS, canBuy, compareLabel, getProduct, priceLabel } from '@/lib/products'
import { SITE } from '@/lib/site'

export function generateStaticParams() {
  return PRODUCTS.map(product => ({ slug: product.slug }))
}
export const dynamicParams = false

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const product = getProduct((await params).slug)
  if (!product) return {}
  return {
    title: `${product.name} | ${SITE.name}`,
    description: product.description,
    alternates: { canonical: `/shop/${product.slug}` },
  }
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="flex items-center gap-4 font-mono text-[11px] tracking-[.2em]">{children}</p>
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const product = getProduct((await params).slug)
  if (!product) notFound()
  const resource = getPublishedResources()[0]
  const soon = product.status === 'soon'
  const buyable = canBuy(product)

  return (
    <main className="bg-[#fafaf8] px-4 pb-28 pt-12 sm:px-8 sm:pt-20">
      <div className="mx-auto max-w-[1200px]">
        <BackLink href="/shop">全部工作流與課程</BackLink>

        <section className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start">
          <div>
            <Label>{product.kind === 'kit' ? 'WORKFLOW KIT' : 'COURSE'} <span className="h-px w-10 bg-[var(--ink)]" /> {product.latin}</Label>
            <h1 className="font-serif-tc mt-8 text-[clamp(40px,5.6vw,84px)] font-light leading-[1.1]">{product.name}</h1>
            <p className="mt-6 text-xl leading-9">{product.tagline}</p>
            <p className="mt-4 max-w-2xl text-[16px] leading-8 text-[var(--ink-2)]">{product.description}</p>
          </div>

          <aside className="relative border border-[var(--ink)] bg-white p-7 lg:sticky lg:top-24">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/stickers/${product.sticker}.webp`} alt="" className="sticker-img pointer-events-none absolute -top-24 right-4 hidden w-24 rotate-6 lg:block" />
            {buyable ? (
              <>
                <p className="font-mono text-[10px] tracking-[.2em] text-[var(--ink-2)]">ONE-TIME · 一次買斷</p>
                <p className="font-serif mt-2 flex items-end gap-3 text-6xl leading-none">{priceLabel(product)}{compareLabel(product) && <s className="mb-1 text-xl text-[var(--ink-2)]">{compareLabel(product)}</s>}</p>
                <a href={product.paymentLink} className="group mt-7 flex min-h-14 items-center justify-center gap-3 bg-[var(--ink)] px-8 text-[15px] tracking-[.08em] text-[#fafaf8] transition hover:bg-[#333]">
                  立即購買 <ArrowRight size={17} className="transition group-hover:translate-x-1" aria-hidden="true" />
                </a>
                <ul className="mt-5 space-y-1.5 text-xs leading-6 text-[var(--ink-2)]">
                  <li>・Stripe 安全付款，支援信用卡、Apple Pay、Google Pay</li>
                  <li>・付款完成立刻下載，不用等寄信</li>
                  <li>・之後的更新版本免費下載</li>
                  <li>・買家專屬 LINE 社群，卡住就問</li>
                  <li>・7 天內不滿意可退費，見<Link href="/refund" className="underline">退費政策</Link></li>
                </ul>
              </>
            ) : (
              <>
                <p className="font-mono text-[10px] tracking-[.2em] text-[var(--ink-2)]">{soon ? 'IN PRODUCTION · 製作中' : 'EARLY BIRD · 預購即將開放'}</p>
                <p className="font-serif mt-2 text-6xl leading-none">{priceLabel(product)}</p>
                <p className="mt-5 text-sm leading-7 text-[var(--ink-2)]">
                  {soon ? '這個工作流還在整理成可以照著跑的版本。' : '即將開賣。'}
                  留下 Email，先收到免費的 AI 短影音 Prompt 包，{soon ? '推出' : '開賣'}時第一個通知你。
                </p>
                {resource && <div className="mt-6"><LeadForm resource={resource.slug} title={resource.title} submitLabel={soon ? '推出時通知我' : '開賣通知我'} /></div>}
              </>
            )}
          </aside>
        </section>

        {product.previews && (
          <section className="mt-24">
            <Label>PREVIEW <span className="h-px w-10 bg-[var(--ink)]" /> 套件直接渲染出來的範例</Label>
            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:max-w-[760px]">
              {product.previews.map(preview => (
                <figure key={preview.src}>
                  <video className="aspect-[9/16] w-full border border-[var(--ink)] bg-black" controls preload="none" playsInline poster={preview.poster}>
                    <source src={preview.src} type="video/mp4" />
                  </video>
                  <figcaption className="mt-3 font-mono text-[11px] tracking-[.06em] text-[var(--ink-2)]">{preview.label}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        {product.includes.length > 0 && (
          <section className="mt-24">
            <Label>INCLUDED <span className="h-px w-10 bg-[var(--ink)]" /> 內容</Label>
            <ul className="mt-8 border-t border-[var(--ink)]">
              {product.includes.map((item, index) => (
                <li key={item.title} className="grid gap-2 border-b border-[#121212]/25 py-7 sm:grid-cols-[3rem_minmax(0,1fr)]">
                  <span className="font-mono text-[11px] text-[var(--ink-2)]">0{index + 1}</span>
                  <span>
                    <span className="font-serif-tc block text-2xl">{item.title}</span>
                    <span className="mt-2 block text-[15px] leading-7 text-[var(--ink-2)]">{item.text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {product.steps.length > 0 && (
          <section className="mt-24 grid gap-12 lg:grid-cols-2">
            <div>
              <Label>FLOW <span className="h-px w-10 bg-[var(--ink)]" /> 拿到之後</Label>
              <ol className="mt-8 space-y-5">
                {product.steps.map((step, index) => (
                  <li key={step} className="flex gap-5">
                    <span className="font-serif text-3xl leading-none text-[var(--ink-2)]">{index + 1}</span>
                    <span className="pt-1 text-[16px] leading-7">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="space-y-10">
              <div>
                <Label>NEEDS <span className="h-px w-10 bg-[var(--ink)]" /> 需要準備</Label>
                <ul className="mt-5 space-y-2 text-[15px] leading-7">{product.requirements.map(item => <li key={item}>・{item}</li>)}</ul>
              </div>
              <div>
                <Label>NOT INCLUDED <span className="h-px w-10 bg-[var(--ink)]" /> 不包含</Label>
                <ul className="mt-5 space-y-2 text-[15px] leading-7 text-[var(--ink-2)]">{product.excluded.map(item => <li key={item}>・{item}</li>)}</ul>
              </div>
            </div>
          </section>
        )}

        {product.faq && (
          <section className="mt-24 max-w-3xl">
            <Label>FAQ <span className="h-px w-10 bg-[var(--ink)]" /> 常見問題</Label>
            <dl className="mt-8 border-t border-[var(--ink)]">
              {product.faq.map(item => (
                <div key={item.q} className="border-b border-[#121212]/25 py-6">
                  <dt className="font-serif-tc text-xl">{item.q}</dt>
                  <dd className="mt-2 text-[15px] leading-7 text-[var(--ink-2)]">{item.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}
      </div>
    </main>
  )
}
