import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import LeadForm from '@/components/cinema/LeadForm'
import Timecode from '@/components/cinema/Timecode'
import VideoCard from '@/components/cinema/VideoCard'
import styles from '@/components/cinema/cinema.module.css'
import { getPublishedResources, getPublishedVideos } from '@/lib/content'

const COMING = [
  {
    kind: '工作流套件',
    title: 'AutoVideo\n工作流套件',
    logline: '填好 .env，跑一個指令，第一支短影音就出來了。附一段「貼給 Claude Code」的安裝 prompt——不懂原理，也能先跑起來。',
    credits: ['可直接執行的成品專案', '貼給 AI 的安裝 prompt', '跑不動時的求助單'],
  },
  {
    kind: '完整課程',
    title: '用 Claude Code\n打造 AI 短影音工廠',
    logline: '選題、腳本、配音、剪輯到發布，一步一個檢查點。每一步都有「成功長這樣」的畫面讓你對照。',
    credits: ['一步一個檢查點', '成功畫面對照', '卡住時的除錯路線'],
  },
]

function SectionTitle({ id, kicker, title, children }: { id: string; kicker: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className={`${styles.mono} text-[10px] text-[#f0a65a]`}>{kicker}</p>
        <h2 id={id} className={`${styles.display} mt-3 text-[clamp(28px,4.5vw,44px)] leading-tight text-[#ece7dd]`}>{title}</h2>
      </div>
      {children}
    </div>
  )
}

export default function Home() {
  const videos = getPublishedVideos()
  const featured = getPublishedResources()[0]

  return (
    <main>
      {/* ── Opening shot ── */}
      <section className={`${styles.letterbox} relative flex min-h-[100svh] items-center px-4 pb-[calc(clamp(18px,5vh,54px)+64px)] pt-[calc(clamp(18px,5vh,54px)+112px)] sm:px-6`}>
        <div className={`${styles.mono} pointer-events-none absolute inset-x-4 top-[calc(clamp(18px,5vh,54px)+64px)] z-[3] flex justify-between text-[10px] text-[#b9bec4] sm:inset-x-8`}>
          <span className="flex items-center gap-2"><span className={styles.rec} />REC</span>
          <Timecode className="tabular-nums" />
        </div>
        <div className={`${styles.mono} pointer-events-none absolute inset-x-4 bottom-[calc(clamp(18px,5vh,54px)+16px)] z-[3] flex justify-between text-[10px] text-[#7d858f] sm:inset-x-8`}>
          <span>Scene 01 — 雨夜工作室</span>
          <span className="hidden sm:inline">23.976 fps · 2.39:1</span>
        </div>

        <div className="relative z-[1] mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className={`${styles.mono} ${styles.reveal} text-[10px] text-[#9aa3ad]`}>一個工程師的 AI 工作流片場</p>
            <h1 className={`${styles.display} ${styles.reveal2} mt-6 text-[clamp(38px,6.2vw,80px)] leading-[1.14] text-[#ece7dd]`}>
              把 AI 工作流，<br />做成你也<span className={`${styles.glow} whitespace-nowrap`}>跑得起來</span><br />的東西。
            </h1>
            <p className={`${styles.subtitle} ${styles.reveal3} mt-8 max-w-xl text-[17px] leading-8 sm:text-lg`}>
              —— 看完影片，照著做，就能復現。<br />
              <span className="text-[15px] text-[#c9ced3]">每支影片的重點、可複製的 prompt、能一鍵跑起來的套件，全放在這裡。</span>
            </p>
            <div className={`${styles.reveal3} mt-10 flex flex-wrap items-center gap-6`}>
              <Link href="/videos" className="group inline-flex min-h-12 items-center gap-3 rounded-full border border-white/25 px-6 text-sm text-[#ece7dd] transition hover:border-white">
                進入片單 <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <span className={`${styles.mono} text-[10px] text-[#7d858f]`}>{videos.length} 部影片筆記 · 持續更新</span>
            </div>
          </div>

          {featured && (
            <aside className={`${styles.glass} ${styles.reveal3} rounded-2xl p-6 sm:p-8`} aria-label="免費資源">
              <div className="flex items-center justify-between">
                <p className={`${styles.mono} text-[10px] text-[#f0a65a]`}>Free · 片尾彩蛋</p>
                <p className={`${styles.mono} text-[10px] text-[#7d858f]`}>{featured.format}</p>
              </div>
              <h2 className={`${styles.display} mt-4 text-2xl leading-snug text-[#ece7dd] sm:text-[28px]`}>{featured.title}</h2>
              <ul className="mt-5 space-y-2.5">
                {featured.bullets.slice(0, 3).map((item, index) => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-[#b9bec4]">
                    <span className={`${styles.mono} pt-0.5 text-[10px] text-[#f0a65a]`}>{String(index + 1).padStart(2, '0')}</span>{item}
                  </li>
                ))}
              </ul>
              <div className="mt-6"><LeadForm resource={featured.slug} title={featured.title} /></div>
            </aside>
          )}
        </div>
      </section>

      {/* ── Now showing ── */}
      <section className="px-4 py-24 sm:px-6" aria-labelledby="now-showing">
        <div className="mx-auto max-w-6xl">
          <SectionTitle id="now-showing" kicker="Now Showing · 正在放映" title="片單">
            <Link href="/videos" className={`${styles.mono} inline-flex min-h-11 items-center gap-2 text-[10px] text-[#b9bec4] hover:text-white`}>全部影片 <ArrowRight size={14} aria-hidden="true" /></Link>
          </SectionTitle>
          <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {videos.slice(0, 6).map((video, index) => <VideoCard key={video.slug} video={video} index={index} />)}
          </div>
        </div>
      </section>

      {/* ── Coming soon ── */}
      <section id="coming" className="scroll-mt-20 px-4 py-24 sm:px-6" aria-labelledby="coming-title">
        <div className="mx-auto max-w-6xl">
          <SectionTitle id="coming-title" kicker="Coming Soon · 即將上映" title="工作流與課程" />
          <p className="mt-5 max-w-2xl text-[15px] leading-8 text-[#9aa3ad]">每一部都照同一個規格拍：<span className="text-[#ece7dd]">可直接執行的成品</span>＋<span className="text-[#ece7dd]">貼給 AI 的安裝 prompt</span>＋<span className="text-[#ece7dd]">一步一個檢查點</span>。學不來沒關係，先讓它跑起來。</p>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {COMING.map(item => (
              <article key={item.title} className={`${styles.poster} ${styles.scanlines} group relative flex min-h-[400px] flex-col sm:min-h-[460px] justify-between overflow-hidden rounded-sm p-7 ring-1 ring-white/10 sm:p-9`}>
                <div className="flex items-start justify-between gap-4">
                  <span className={`${styles.mono} text-[10px] text-[#f0a65a]`}>{item.kind}</span>
                  <span className={`${styles.mono} -rotate-6 rounded-sm border border-[#ff4d3d]/70 px-2 py-1 text-[10px] text-[#ff7b6d]`}>上映日 待定</span>
                </div>
                <div>
                  <h3 className={`${styles.display} whitespace-pre-line text-[clamp(30px,4vw,42px)] leading-[1.15] text-[#ece7dd]`}>{item.title}</h3>
                  <p className="mt-5 max-w-md text-sm leading-7 text-[#b9bec4]">{item.logline}</p>
                  <div className={`${styles.mono} mt-8 border-t border-white/15 pt-4 text-[9px] leading-5 text-[#7d858f]`}>
                    {item.credits.join('  ·  ')}
                  </div>
                </div>
              </article>
            ))}
          </div>
          {featured && (
            <p className="mt-10 text-sm text-[#9aa3ad]">
              想第一個看到？<Link href={`/free/${featured.slug}`} className="ml-1 text-[#f0a65a] underline decoration-[#f0a65a]/40 underline-offset-4 hover:decoration-[#f0a65a]">先拿免費 Prompt 包，上映時通知你 →</Link>
            </p>
          )}
        </div>
      </section>

      {/* ── Director's note ── */}
      <section id="director" className="scroll-mt-20 px-4 py-28 sm:px-6" aria-label="導演的話">
        <div className="mx-auto max-w-3xl">
          <p className={`${styles.mono} text-[10px] text-[#f0a65a]`}>Director&apos;s Note · 導演的話</p>
          <blockquote className={`${styles.display} mt-8 text-[clamp(22px,3.4vw,32px)] font-semibold leading-[1.7] text-[#ece7dd]`}>
            「我不保證你會爆紅，<br />只保證每一步都講清楚、跑得起來。」
          </blockquote>
          <p className="mt-8 max-w-2xl text-[15px] leading-8 text-[#9aa3ad]">
            我是 Jerry，在台灣做全端開發與 AI 自動化。自己經營幾個 AI 短影音頻道，整條產片流程是用 Claude Code 一段一段接起來的。這裡放的，是我真的每天在用、而你照著做也能復現的東西。
          </p>
          <p className={`${styles.mono} mt-8 text-[10px] text-[#7d858f]`}>— Jerry Lin · 全端工程師</p>
        </div>
      </section>
    </main>
  )
}
