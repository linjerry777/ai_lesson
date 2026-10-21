import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowRight, Check, X } from 'lucide-react'
import LeadForm from '@/components/site/LeadForm'
import PromptCard from '@/components/site/PromptCard'
import { productType } from '@/components/site/ProductGrid'
import { BackLink } from '@/components/site/ui'
import { getPublishedResources } from '@/lib/content'
import { PRODUCTS, canBuy, compareLabel, deliverables, getProduct, priceLabel, type Product } from '@/lib/products'
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
  return <h2 className="flex items-center gap-3 font-mono text-[11px] font-bold tracking-[.18em]">{children}<span className="h-px flex-1 bg-[var(--ink)] opacity-30" /></h2>
}

type GalleryItem = NonNullable<Product['gallery']>[number]

function Shot({ item }: { item: GalleryItem }) {
  return (
    <figure>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={item.src} alt={item.alt} loading="lazy" className="w-full border-2 border-[var(--ink)] bg-white shadow-[4px_4px_0_var(--ink)]" />
      <figcaption className="mt-2 text-[12px] leading-5 text-[var(--ink-2)]">{item.caption}</figcaption>
    </figure>
  )
}

/** Wide screenshots on the left, phone screenshots in a narrow column beside them. */
function Gallery({ items }: { items: GalleryItem[] }) {
  const wide = items.filter(item => !item.phone)
  const phones = items.filter(item => item.phone)
  return (
    <div className={`grid items-start gap-4 ${wide.length && phones.length ? 'sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]' : ''}`}>
      {wide.length > 0 && (
        <div className={`grid gap-4 ${wide.length > 1 ? 'grid-cols-2 xl:grid-cols-3' : ''}`}>
          {wide.map(item => <Shot key={item.src} item={item} />)}
        </div>
      )}
      {phones.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {phones.map(item => <Shot key={item.src} item={item} />)}
        </div>
      )}
    </div>
  )
}

function SampleOutput({ output }: { output: NonNullable<Product['sampleOutput']> }) {
  return (
    <div className="border-2 border-[var(--ink)] bg-white shadow-[5px_5px_0_var(--ink)]">
      <p className="flex items-center justify-between gap-3 border-b-2 border-[var(--ink)] px-4 py-3">
        <span className="text-lg font-black">AI 會回你這樣的東西</span>
        <span className="font-mono text-[10px] font-bold tracking-[.12em] text-[var(--ink-2)]">範例・節錄</span>
      </p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] text-left text-[13px] leading-5">
          <thead className="bg-[var(--ink)] text-white">
            <tr>{output.columns.map(column => <th key={column} className="px-3 py-2 font-bold">{column}</th>)}</tr>
          </thead>
          <tbody>
            {output.rows.map(row => (
              <tr key={row[0]} className="border-t border-[var(--rule)] align-top">
                {row.map((cell, i) => <td key={i} className={`px-3 py-2 ${i === 0 ? 'font-bold' : 'text-[var(--ink-2)]'}`}>{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="flex items-end gap-2 border-t-2 border-[var(--ink)] px-4 py-3 text-[13px] leading-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/stickers/xun-explain.webp" alt="" className="sticker-img h-14 w-auto" />
        <span><b>小訊：</b>挑一個你也想看的，丟進下一組「寫腳本」，30 秒就有一支完整腳本。</span>
      </p>
    </div>
  )
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const product = getProduct((await params).slug)
  if (!product) notFound()
  const resource = getPublishedResources()[0]
  const soon = product.status === 'soon'
  const buyable = canBuy(product)
  const type = productType(product)
  const items = deliverables(product)

  return (
    <main className="bg-[#fafaf8] px-4 pb-24 pt-8 sm:px-8 sm:pt-10">
      <div className="mx-auto max-w-[1240px]">
        <BackLink href="/shop">全部工作流與課程</BackLink>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
          <div className="min-w-0 space-y-10">
            <section>
              <p className="flex flex-wrap items-center gap-3">
                <span className="px-2 py-0.5 text-[12px] font-black" style={{ background: type.color, color: type.ink }}>{type.label}</span>
                <span className="font-mono text-[11px] tracking-[.16em] text-[var(--ink-2)]">{product.latin}</span>
              </p>
              <h1 className="mt-3 text-[clamp(30px,3.6vw,48px)] font-black leading-[1.15] tracking-[-.02em]">{product.name}</h1>
              <p className="mt-3 text-lg font-bold leading-8">{product.tagline}</p>
              <p className="mt-2 max-w-3xl text-[15px] leading-7 text-[var(--ink-2)]">{product.description}</p>
              {product.highlights && (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {product.highlights.map(item => <li key={item} className="border border-[var(--ink)] bg-white px-2.5 py-1 text-[13px] font-bold">{item}</li>)}
                </ul>
              )}
            </section>

            {product.gallery && <section aria-label="產品畫面"><Gallery items={product.gallery} /></section>}

            {product.previews && (
              <section>
                <Label>PREVIEW · 套件直接渲染出來的範例</Label>
                <div className="mt-4 grid max-w-[560px] grid-cols-2 gap-4">
                  {product.previews.map(preview => (
                    <figure key={preview.src}>
                      <video className="aspect-[9/16] w-full border-2 border-[var(--ink)] bg-black shadow-[4px_4px_0_var(--ink)]" controls preload="none" playsInline poster={preview.poster}>
                        <source src={preview.src} type="video/mp4" />
                      </video>
                      <figcaption className="mt-2 text-[12px] text-[var(--ink-2)]">{preview.label}</figcaption>
                    </figure>
                  ))}
                </div>
              </section>
            )}

            {product.includes.length > 0 && (
              <section>
                <Label>INCLUDED · 內容</Label>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {product.includes.map((item, index) => (
                    <li key={item.title} className="flex gap-3 border border-[var(--ink)] bg-white p-4">
                      <span className="font-display text-2xl leading-none text-[var(--ink-2)]">{String(index + 1).padStart(2, '0')}</span>
                      <span>
                        <span className="block text-[16px] font-black leading-6">{item.title}</span>
                        <span className="mt-1 block text-[14px] leading-6 text-[var(--ink-2)]">{item.text}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {product.samples && product.samples.length > 0 && (
              <section>
                <Label>FREE SAMPLE · 先試一組，複製貼到 ChatGPT 看看</Label>
                <div className="mt-4 grid items-start gap-5 xl:grid-cols-2">
                  {product.samples.map((sample, index) => (
                    <PromptCard key={sample.name} index={`試用 ${index + 1}`} name={sample.name} prompt={sample.prompt} />
                  ))}
                  {product.sampleOutput && <SampleOutput output={product.sampleOutput} />}
                </div>
              </section>
            )}

            {product.audience && (
              <section className="grid gap-3 sm:grid-cols-2">
                <div className="border border-[var(--ink)] bg-white p-4">
                  <h2 className="font-black">適合你，如果…</h2>
                  <ul className="mt-2 space-y-1.5 text-[14px] leading-6">
                    {product.audience.yes.map(item => <li key={item} className="flex gap-2"><Check size={16} className="mt-1 shrink-0 text-[#0e9f6e]" aria-hidden="true" />{item}</li>)}
                  </ul>
                </div>
                <div className="border border-[var(--rule)] bg-white p-4">
                  <h2 className="font-black">先別買，如果…</h2>
                  <ul className="mt-2 space-y-1.5 text-[14px] leading-6 text-[var(--ink-2)]">
                    {product.audience.no.map(item => <li key={item} className="flex gap-2"><X size={16} className="mt-1 shrink-0 text-[var(--red)]" aria-hidden="true" />{item}</li>)}
                  </ul>
                </div>
              </section>
            )}

            {product.steps.length > 0 && (
              <section className="grid gap-6 border-y border-[var(--ink)] py-6 sm:grid-cols-3">
                <div>
                  <Label>FLOW · 拿到之後</Label>
                  <ol className="mt-3 space-y-2 text-[14px] leading-6">
                    {product.steps.map((step, index) => <li key={step} className="flex gap-2"><span className="font-display text-lg leading-6 text-[var(--ink-2)]">{index + 1}</span>{step}</li>)}
                  </ol>
                </div>
                <div>
                  <Label>NEEDS · 需要準備</Label>
                  <ul className="mt-3 space-y-2 text-[14px] leading-6">{product.requirements.map(item => <li key={item}>・{item}</li>)}</ul>
                </div>
                <div>
                  <Label>NOT INCLUDED · 不包含</Label>
                  <ul className="mt-3 space-y-2 text-[14px] leading-6 text-[var(--ink-2)]">{product.excluded.map(item => <li key={item}>・{item}</li>)}</ul>
                </div>
              </section>
            )}

            {product.faq && (
              <section>
                <Label>FAQ · 常見問題</Label>
                <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                  {product.faq.map(item => (
                    <div key={item.q} className="border border-[var(--rule)] bg-white p-4">
                      <dt className="font-black">{item.q}</dt>
                      <dd className="mt-1 text-[14px] leading-6 text-[var(--ink-2)]">{item.a}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}
          </div>

          <aside className="space-y-4 lg:sticky lg:top-20">
            <div className="border-2 border-[var(--ink)] bg-white p-5 shadow-[6px_6px_0_var(--ink)]">
              {buyable ? (
                <>
                  <p className="font-mono text-[10px] tracking-[.2em] text-[var(--ink-2)]">ONE-TIME · 一次買斷</p>
                  <p className="mt-2 flex items-end gap-3">
                    <span className="font-display text-6xl leading-none">{priceLabel(product)}</span>
                    {compareLabel(product) && <s className="mb-1 text-lg text-[var(--ink-2)]">{compareLabel(product)}</s>}
                  </p>
                  <a href={product.paymentLink} className="group mt-5 flex min-h-14 items-center justify-center gap-3 bg-[var(--ink)] px-6 text-[16px] font-black text-[#fafaf8] shadow-[4px_4px_0_var(--red)] transition hover:-translate-y-0.5">
                    立即購買 <ArrowRight size={18} className="transition group-hover:translate-x-1" aria-hidden="true" />
                  </a>
                  <ul className="mt-4 space-y-1 text-[12px] leading-6 text-[var(--ink-2)]">
                    <li>・Stripe 安全付款：信用卡、Apple Pay、Google Pay</li>
                    <li>・付款完成立刻拿到，不用等寄信</li>
                    <li>・之後的更新版本免費</li>
                    <li>・7 天內不滿意可退費，見<Link href="/refund" className="underline">退費政策</Link></li>
                  </ul>
                </>
              ) : (
                <>
                  <p className="font-mono text-[10px] tracking-[.2em] text-[var(--ink-2)]">{soon ? 'IN PRODUCTION · 製作中' : 'EARLY BIRD · 預購即將開放'}</p>
                  <p className="font-display mt-2 text-6xl leading-none">{priceLabel(product)}</p>
                  <p className="mt-4 text-sm leading-7 text-[var(--ink-2)]">
                    {soon ? '這個工作流還在整理成可以照著跑的版本。' : '即將開賣。'}
                    留下 Email，先收到免費的 AI 短影音 Prompt 包，{soon ? '推出' : '開賣'}時第一個通知你。
                  </p>
                  {resource && <div className="mt-5"><LeadForm resource={resource.slug} title={resource.title} submitLabel={soon ? '推出時通知我' : '開賣通知我'} /></div>}
                </>
              )}
            </div>

            {buyable && (
              <div className="border border-[var(--ink)] bg-white p-4">
                <p className="font-mono text-[10px] font-bold tracking-[.16em] text-[var(--ink-2)]">付款後你會拿到</p>
                <ul className="mt-2 space-y-2 text-[13px] leading-5">
                  {items.map(item => (
                    <li key={item.slug} className="flex gap-2">
                      <Check size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
                      <span>
                        <b>{item.name}</b>
                        <span className="block text-[var(--ink-2)]">{item.pack ? '網頁版，付款完成頁直接打開' : item.grantsCourse ? '用付款 Email 登入 Google 自動開通' : '付款完成頁直接下載 zip'}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="hidden items-end gap-2 lg:flex">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/stickers/${product.sticker}.webp`} alt="" className="sticker-img h-24 w-auto shrink-0" />
              <p className="mb-3 border-2 border-[var(--ink)] bg-white px-3 py-2 text-[12px] leading-5 shadow-[3px_3px_0_var(--ink)]">
                有問題寄信到 <a href={`mailto:${SITE.contactEmail}`} className="underline">{SITE.contactEmail}</a>，通常一天內回。
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* Phone: the buy button stays reachable at the bottom of the screen. */}
      {buyable && (
        <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t-2 border-[var(--ink)] bg-white px-4 py-2.5 lg:hidden">
          <span className="font-display text-3xl leading-none">{priceLabel(product)}{compareLabel(product) && <s className="ml-2 font-sans text-sm text-[var(--ink-2)]">{compareLabel(product)}</s>}</span>
          <a href={product.paymentLink} className="inline-flex min-h-12 items-center gap-2 bg-[var(--ink)] px-5 text-[15px] font-black text-white">
            立即購買 <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>
      )}
    </main>
  )
}
