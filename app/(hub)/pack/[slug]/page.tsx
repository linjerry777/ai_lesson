import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Download } from 'lucide-react'
import PromptCard from '@/components/site/PromptCard'
import { currentAdmin } from '@/lib/admin-session'
import { recordOrder, verifySession } from '@/lib/kit-orders'
import { loadPack } from '@/lib/packs'
import { deliverables, findProduct } from '@/lib/products'
import { SITE } from '@/lib/site'

export const metadata: Metadata = {
  title: `購買內容 | ${SITE.name}`,
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
        <h1 className="text-3xl font-black">打不開這個頁面</h1>
        <p className="mt-4 text-[16px] leading-8 text-[var(--ink-2)]">{reason}</p>
        <p className="mt-4 text-[16px] leading-8 text-[var(--ink-2)]">
          如果你已經付款，到 <Link href="/orders" className="underline">找回購買內容</Link> 用付款時的 Email 登入就能找回；還是不行，把 Stripe 收據轉寄到 <a href={`mailto:${SITE.contactEmail}`} className="underline">{SITE.contactEmail}</a>。
        </p>
      </div>
    </main>
  )
}

export default async function PackPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ session_id?: string; preview?: string }> }) {
  const { slug } = await params
  const { session_id: sessionId = '', preview } = await searchParams
  const item = findProduct(slug)
  if (!item?.pack) notFound()

  // Local preview (dev) or a signed-in admin: look at the page without buying.
  const previewing = (process.env.NODE_ENV === 'development' && preview === '1') || Boolean(await currentAdmin())
  if (!previewing) {
    const result = await verifySession(sessionId)
    if (!result.ok) return <Locked reason="這個網址少了訂單資訊，或付款還沒完成。請從付款完成頁的按鈕進來。" />
    if (!deliverables(result.order.product).some(product => product.slug === slug)) return <Locked reason="這筆訂單不包含這個內容。" />
    await recordOrder(result.order, 'success_page')
  }

  const pack = await loadPack(item.pack.path)
  if (!pack) return <Locked reason="內容暫時載入失敗，請過一分鐘重新整理。" />

  const course = pack.kind === 'course'
  const links = pack.links ?? AI_LINKS
  const download = !item.file ? null : previewing ? `/api/admin/download?item=${item.slug}` : `/api/kit-download?session_id=${encodeURIComponent(sessionId)}&item=${item.slug}`

  // Running number across sections, so cards read #01…#14.
  const offsets = pack.sections.map((_, i) => pack.sections.slice(0, i).reduce((sum, section) => sum + section.items.length, 0))
  return (
    <main className="px-4 pb-28 pt-10 sm:px-8 sm:pt-16">
      <div className="mx-auto max-w-[1200px]">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
          <div>
            <p className="font-mono text-[11px] font-bold tracking-[.16em] text-[var(--ink-2)]">{course ? 'COURSE' : 'PROMPT PACK'} · v{pack.version}</p>
            <h1 className="mt-3 text-[clamp(32px,4.4vw,52px)] font-black leading-[1.08] tracking-[-.02em]">{pack.title}</h1>
            <p className="mt-3 text-[16px] leading-8 text-[var(--ink-2)]">{pack.intro}</p>
            <div className="mt-4 flex items-end gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/stickers/xun-explain.webp" alt="小訊" className="sticker-img h-[110px] w-auto shrink-0" />
              <p className="relative mb-4 border-2 border-[var(--ink)] bg-white px-4 py-3 text-[14px] leading-6 shadow-[4px_4px_0_var(--ink)]">
                <b>小訊：</b>{course ? '一關一關來：複製指令貼給 Claude Code，做完對照綠色的「成功長這樣」，卡住就打開紅色的「卡住救援」。粉紅色的地方換成你的內容！' : '每一組都附「什麼時候用」和小提醒，按「看 AI 回覆範例」就知道 AI 會回什麼。粉紅色的地方記得換成你的內容！'}
              </p>
            </div>
            {pack.exampleNote && <p className="mt-1 text-[13px] leading-6 text-[var(--ink-2)]">ℹ️ {pack.exampleNote}</p>}
          </div>

          <section className="border-2 border-[var(--ink)] bg-[#f5a524] p-5 shadow-[5px_5px_0_var(--ink)]" aria-labelledby="quickstart">
            <h2 id="quickstart" className="text-xl font-black">第一次用？照這 4 步</h2>
            <ol className="mt-3 space-y-2 text-[16px] leading-7">
              {pack.quickstart.map((step, i) => <li key={step}><b>{i + 1}.</b> {step}</li>)}
            </ol>
            {download && (
              <a href={download} className="mt-4 flex min-h-12 items-center justify-center gap-2 border-2 border-[var(--ink)] bg-[var(--ink)] px-4 text-[15px] font-black text-white">
                <Download size={17} aria-hidden="true" /> 下載 {item.file!.downloadName}
              </a>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              {links.map(link => (
                <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center border-2 border-[var(--ink)] bg-white px-4 text-sm font-black">
                  打開 {link.name} ↗
                </a>
              ))}
            </div>
            <p className="mt-3 text-sm">👉 把這一頁<b>加入書籤</b>，之後有新版回到這裡就看得到。</p>
          </section>
        </div>

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
            <div className="mt-5 grid items-start gap-6 lg:grid-cols-2">
              {section.items.map((entry, j) => (
                <PromptCard key={entry.name} index={String(offsets[i] + j + 1).padStart(2, '0')} name={entry.name} when={entry.when} prompt={entry.prompt} tip={entry.tip} example={entry.example} exampleImage={entry.exampleImage} success={entry.success} rescue={entry.rescue} target={course ? 'Claude Code' : 'ChatGPT'} />
              ))}
            </div>
          </section>
        ))}

        <footer className="mt-16 border-t-2 border-[var(--ink)] pt-6 text-[15px] leading-8 text-[var(--ink-2)]">
          <p>{course ? '卡在救援指令也解決不了的地方，' : '用了覺得哪一組最有用、或想要新的格式，'}寄信到 <a href={`mailto:${SITE.contactEmail}`} className="underline">{SITE.contactEmail}</a>，{course ? '附上畫面截圖，我會回你。' : '下一版就加進來。'}</p>
          <p className="mt-2"><Link href="/shop" className="underline">看其他工作流與課程 →</Link></p>
        </footer>
      </div>
    </main>
  )
}
