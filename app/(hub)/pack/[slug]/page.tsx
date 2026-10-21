import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import PromptCard from '@/components/site/PromptCard'
import { recordOrder, verifySession } from '@/lib/kit-orders'
import { loadPack } from '@/lib/packs'
import { deliverables, getProduct } from '@/lib/products'
import { SITE } from '@/lib/site'

export const metadata: Metadata = {
  title: `指令包 | ${SITE.name}`,
  robots: { index: false, follow: false },
}
export const dynamic = 'force-dynamic'

const AI_LINKS = [
  { name: 'ChatGPT', url: 'https://chatgpt.com/' },
  { name: 'Gemini', url: 'https://gemini.google.com/' },
  { name: 'Claude', url: 'https://claude.ai/' },
]

function Locked({ reason }: { reason: string }) {
  return (
    <main className="px-4 pb-28 pt-16 sm:px-8">
      <div className="mx-auto max-w-xl">
        <h1 className="text-3xl font-black">打不開這份指令包</h1>
        <p className="mt-4 text-[16px] leading-8 text-[var(--ink-2)]">{reason}</p>
        <p className="mt-4 text-[16px] leading-8 text-[var(--ink-2)]">
          如果你已經付款，請把 Stripe 寄給你的收據轉寄到 <a href={`mailto:${SITE.contactEmail}`} className="underline">{SITE.contactEmail}</a>，我會把連結重新寄給你。
        </p>
      </div>
    </main>
  )
}

export default async function PackPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ session_id?: string; preview?: string }> }) {
  const { slug } = await params
  const { session_id: sessionId = '', preview } = await searchParams
  const item = getProduct(slug)
  if (!item?.pack) notFound()

  // Local preview only: lets Jerry look at the page without buying.
  const previewing = process.env.NODE_ENV === 'development' && preview === '1'
  if (!previewing) {
    const result = await verifySession(sessionId)
    if (!result.ok) return <Locked reason="這個網址少了訂單資訊，或付款還沒完成。請從付款完成頁的按鈕進來。" />
    if (!deliverables(result.order.product).some(product => product.slug === slug)) return <Locked reason="這筆訂單不包含這份指令包。" />
    await recordOrder(result.order, 'success_page')
  }

  const pack = await loadPack(item.pack.path)
  if (!pack) return <Locked reason="指令包暫時載入失敗，請過一分鐘重新整理。" />

  // Running number across sections, so cards read #01…#13.
  const offsets = pack.sections.map((_, i) => pack.sections.slice(0, i).reduce((sum, section) => sum + section.items.length, 0))
  return (
    <main className="px-4 pb-28 pt-10 sm:px-8 sm:pt-16">
      <div className="mx-auto max-w-3xl">
        <p className="font-mono text-[11px] font-bold tracking-[.16em] text-[var(--ink-2)]">PROMPT PACK · v{pack.version}</p>
        <h1 className="mt-3 text-[clamp(32px,6vw,56px)] font-black leading-[1.08] tracking-[-.02em]">{pack.title}</h1>
        <p className="mt-4 text-[16px] leading-8 text-[var(--ink-2)]">{pack.intro}</p>

        <section className="mt-8 border-2 border-[var(--ink)] bg-[#f5a524] p-5 shadow-[5px_5px_0_var(--ink)]" aria-labelledby="quickstart">
          <h2 id="quickstart" className="text-xl font-black">第一次用？照這 4 步</h2>
          <ol className="mt-3 space-y-2 text-[16px] leading-7">
            {pack.quickstart.map((step, i) => <li key={step}><b>{i + 1}.</b> {step}</li>)}
          </ol>
          <div className="mt-4 flex flex-wrap gap-2">
            {AI_LINKS.map(link => (
              <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center border-2 border-[var(--ink)] bg-white px-4 text-sm font-black">
                打開 {link.name} ↗
              </a>
            ))}
          </div>
          <p className="mt-3 text-sm">👉 把這一頁<b>加入書籤</b>，之後有新版回到這裡就看得到。</p>
        </section>

        <nav className="sticky top-16 z-30 -mx-4 mt-8 flex gap-2 overflow-x-auto border-y border-[var(--rule)] bg-[#f3f0e8]/95 px-4 py-2 backdrop-blur sm:mx-0 sm:px-0" aria-label="章節">
          {pack.sections.map((section, i) => (
            <a key={section.title} href={`#s${i}`} className="shrink-0 rounded-full border border-[var(--ink)] bg-white px-3 py-1.5 text-sm font-bold">
              {(section.title.split('｜')[1] ?? section.title).split('（')[0]}
            </a>
          ))}
        </nav>

        {pack.sections.map((section, i) => (
          <section key={section.title} id={`s${i}`} className="scroll-mt-32 pt-10">
            <h2 className="text-2xl font-black">{section.title}</h2>
            <div className="mt-5 space-y-6">
              {section.items.map((entry, j) => (
                <PromptCard key={entry.name} index={String(offsets[i] + j + 1).padStart(2, '0')} name={entry.name} when={entry.when} prompt={entry.prompt} tip={entry.tip} />
              ))}
            </div>
          </section>
        ))}

        <footer className="mt-16 border-t-2 border-[var(--ink)] pt-6 text-[15px] leading-8 text-[var(--ink-2)]">
          <p>用了覺得哪一組最有用、或想要新的格式，寄信到 <a href={`mailto:${SITE.contactEmail}`} className="underline">{SITE.contactEmail}</a>，下一版就加進來。</p>
          <p className="mt-2"><Link href="/shop" className="underline">看其他工作流與課程 →</Link></p>
        </footer>
      </div>
    </main>
  )
}
