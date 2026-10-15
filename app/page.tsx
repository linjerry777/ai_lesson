import Link from 'next/link'
import { ArrowRight, Boxes, Check, GraduationCap, Terminal } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/sections/Footer'
import LeadForm from '@/components/hub/LeadForm'
import VideoCard from '@/components/hub/VideoCard'
import { getPublishedResources, getPublishedVideos } from '@/lib/content'
import { SITE } from '@/lib/site'

const COMING = [
  {
    icon: Boxes,
    tag: '工作流套件',
    title: 'AutoVideo 工作流套件',
    body: '一個可直接執行的短影音自動化專案：填好 .env、跑一個指令就能出第一支片。附「貼給 Claude Code」的安裝 prompt，不懂原理也能先跑起來。',
  },
  {
    icon: GraduationCap,
    tag: '完整課程',
    title: '用 Claude Code 打造 AI 短影音自動化工廠',
    body: '從選題、腳本、配音到剪輯與發布，分成一步一個檢查點。每一步都有「成功長這樣」的對照，卡住就把錯誤整理成求助單貼給 AI。',
  },
]

export default function Home() {
  const videos = getPublishedVideos()
  const resources = getPublishedResources()
  const featured = resources[0]

  return (
    <>
      <Navbar />
      <main className="bg-paper text-ink">
        <section className="border-b border-[#e0dfd4] px-4 pb-14 pt-28 sm:px-6 sm:pt-32">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.14em] text-[#695e4d]"><span className="h-1.5 w-1.5 rounded-full bg-rust" />看完影片，照著做就能復現</p>
              <h1 className="mt-5 text-[clamp(32px,6vw,54px)] font-bold leading-[1.25] tracking-tight">{SITE.tagline}</h1>
              <p className="mt-5 max-w-lg text-[15px] leading-8 text-ink-muted">{SITE.description}</p>
              <ul className="mt-6 grid gap-2 text-sm text-ink">
                <li className="flex items-center gap-2"><Check size={16} className="text-[#5c795f]" aria-hidden="true" />每支影片都有文字重點與可複製 prompt</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-[#5c795f]" aria-hidden="true" />工作流做成成品包，先跑起來再理解</li>
                <li className="flex items-center gap-2"><Terminal size={16} className="text-[#5c795f]" aria-hidden="true" />卡住時有一段能直接貼給 AI 的求助格式</li>
              </ul>
            </div>
            {featured && (
              <div className="rounded-xl border border-[#d9dbd0] bg-[#fffefa] p-6 shadow-[10px_10px_0_#e8e7dd] sm:p-7">
                <p className="text-[11px] font-semibold tracking-[0.14em] text-rust">免費下載 · {featured.format}</p>
                <h2 className="mt-3 text-2xl font-semibold leading-snug">{featured.title}</h2>
                <ul className="mt-4 space-y-2 text-sm leading-6 text-ink-muted">
                  {featured.bullets.slice(0, 3).map(item => <li key={item} className="flex gap-2"><Check size={16} className="mt-1 shrink-0 text-[#5c795f]" aria-hidden="true" />{item}</li>)}
                </ul>
                <div className="mt-5"><LeadForm resource={featured.slug} title={featured.title} /></div>
              </div>
            )}
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6" aria-labelledby="latest-videos">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.14em] text-rust">最新影片</p>
                <h2 id="latest-videos" className="mt-2 text-2xl font-semibold sm:text-3xl">影片筆記</h2>
              </div>
              <Link href="/videos" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold hover:underline hover:underline-offset-4">全部影片<ArrowRight size={15} aria-hidden="true" /></Link>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {videos.slice(0, 6).map(video => <VideoCard key={video.slug} video={video} />)}
            </div>
          </div>
        </section>

        <section id="coming" className="border-y border-[#e0dfd4] bg-[#fffefa] px-4 py-16 sm:px-6" aria-labelledby="coming-title">
          <div className="mx-auto max-w-6xl">
            <p className="text-[11px] font-semibold tracking-[0.14em] text-rust">準備中</p>
            <h2 id="coming-title" className="mt-2 text-2xl font-semibold sm:text-3xl">工作流與課程</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-ink-muted">每個商品都是「可直接執行的成品＋貼給 AI 的安裝 prompt＋一步一個檢查點」。下載任何免費資源，上架時會第一個通知你。</p>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {COMING.map(item => (
                <article key={item.title} className="rounded-lg border border-[#e0dfd4] bg-paper p-6">
                  <div className="flex items-center gap-2 text-xs font-semibold text-rust"><item.icon size={16} aria-hidden="true" />{item.tag} · 即將推出</div>
                  <h3 className="mt-3 text-lg font-semibold leading-snug">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-ink-muted">{item.body}</p>
                </article>
              ))}
            </div>
            {featured && <Link href={`/free/${featured.slug}`} className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-md bg-ink px-5 text-sm font-semibold text-white hover:bg-ink-soft">先拿免費 Prompt 包，上架時通知我<ArrowRight size={16} aria-hidden="true" /></Link>}
          </div>
        </section>

        <section id="about" className="px-4 py-16 sm:px-6" aria-labelledby="about-title">
          <div className="mx-auto max-w-3xl">
            <p className="text-[11px] font-semibold tracking-[0.14em] text-rust">關於</p>
            <h2 id="about-title" className="mt-2 text-2xl font-semibold sm:text-3xl">Jerry Lin · 全端工程師</h2>
            <p className="mt-4 text-sm leading-8 text-ink-muted">在台灣做全端開發與 AI 自動化，自己經營多個 AI 短影音頻道，整條產片流程是用 Claude Code 一步步做出來的。這裡放的是我實際在用、而且你照著做也能跑起來的東西——不保證爆紅或收益，只保證每一步都講清楚、能驗證。</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
