'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Canvas } from '@react-three/fiber'
import LeadForm from '@/components/cinema/LeadForm'
import styles from '@/components/popup/popup.module.css'
import { coverCopyOpacity, freeCopyOpacity } from '@/lib/book3d'
import BookScene, { type SceneLayer, type Timeline } from './BookScene'

const L = (name: string) => `/popup/${name}.webp`

// Same layout numbers as the CSS book, so both versions stay in sync.
const COVER: SceneLayer[] = [
  { src: L('cover_back'), x: 0.56, depth: 0.92, width: 0.82 },
  { src: L('cover_desk'), x: 0.42, depth: 0.55, width: 0.44 },
  { src: L('cover_xun'), x: 0.66, depth: 0.42, width: 0.17, standee: true },
  { src: L('cover_robot'), x: 0.8, depth: 0.3, width: 0.11, standee: true },
  { src: L('cover_front'), x: 0.3, depth: 0.08, width: 0.4 },
]
const FREE: SceneLayer[] = [
  { src: L('free_back'), x: 0.5, depth: 0.92, width: 0.86 },
  { src: L('free_mailbox'), x: 0.3, depth: 0.6, width: 0.17 },
  { src: L('free_mochi'), x: 0.5, depth: 0.45, width: 0.17, standee: true },
  { src: L('free_envelope'), x: 0.24, depth: 0.22, width: 0.26 },
  { src: L('free_front'), x: 0.68, depth: 0.06, width: 0.42 },
]

interface Props {
  resource: { slug: string; title: string } | null
}

/** Jump the scroll so the timeline lands on `g` (0..1). */
function scrollToProgress(g: number) {
  const track = document.getElementById('book3d-track')
  if (!track) return
  const end = track.offsetTop + track.offsetHeight - window.innerHeight
  window.scrollTo({ top: end * g, behavior: 'smooth' })
}

export default function Book3D({ resource }: Props) {
  const timelineRef = useRef<Timeline>({ g: 0, introStart: 0 })
  const coverCopy = useRef<HTMLDivElement>(null)
  const freeCopy = useRef<HTMLDivElement>(null)
  const [layout, setLayout] = useState<{ shift: { x: number; y: number }; mobile: boolean }>({ shift: { x: 0.17, y: 0 }, mobile: false })

  useEffect(() => {
    const timeline = timelineRef.current
    timeline.introStart = performance.now()
    let raf = 0
    function update() {
      raf = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const track = document.getElementById('book3d-track')
      const trackEnd = track ? track.offsetTop + track.offsetHeight - window.innerHeight : max
      timeline.g = Math.min(1, Math.max(0, window.scrollY / Math.max(1, trackEnd)))
      const c = coverCopyOpacity(timeline.g), f = freeCopyOpacity(timeline.g)
      if (coverCopy.current) { coverCopy.current.style.opacity = String(c); coverCopy.current.style.pointerEvents = c > 0.5 ? 'auto' : 'none' }
      if (freeCopy.current) { freeCopy.current.style.opacity = String(f); freeCopy.current.style.pointerEvents = f > 0.5 ? 'auto' : 'none' }
    }
    const schedule = () => { if (!raf) raf = requestAnimationFrame(update) }
    function measure() {
      const mobile = window.innerWidth < 860
      setLayout({ shift: mobile ? { x: 0, y: 0.16 } : { x: 0.17, y: 0 }, mobile })
      schedule()
    }
    measure()
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', measure)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', measure)
    }
  }, [])

  return (
    <div className={styles.root}>
      <div className="fixed inset-0" aria-hidden="true">
        <Canvas
          shadows
          dpr={[1, layout.mobile ? 1.5 : 1.75]}
          camera={{ fov: layout.mobile ? 48 : 34, near: 0.1, far: 60, position: [0.2, 6.4, 8.6] }}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
        >
          <Suspense fallback={null}>
            <BookScene timeline={timelineRef} cover={COVER} free={FREE} viewShift={layout.shift} effects={!layout.mobile} />
          </Suspense>
        </Canvas>
      </div>

      <header className={styles.topbar}>
        <Link href="/book" className={`${styles.serif} ${styles.brand}`}>Jerry 的 AI 頻道</Link>
        <nav className={styles.nav} aria-label="主要導覽">
          <Link href="/videos">頻道</Link>
          <button type="button" onClick={() => scrollToProgress(0.74)}>免費教學</button>
          <Link href="/book?mode=css#shop">課程</Link>
          <a href="mailto:donutai08@gmail.com?subject=%E5%A7%94%E8%A8%97%E8%A3%BD%E4%BD%9C">接案</a>
        </nav>
      </header>

      <main id="book3d-track" className="relative" style={{ height: '560vh' }}>
        <div className={`pointer-events-none fixed inset-0 z-10 flex ${layout.mobile ? 'items-start pt-24' : 'items-center'} px-5 sm:px-[clamp(20px,5vw,72px)]`}>
          <div ref={coverCopy} className={`${styles.copy} absolute left-5 sm:left-[clamp(20px,5vw,72px)] right-5 sm:right-auto`} style={{ position: 'absolute', transition: 'opacity .2s' }}>
            <p className={styles.kicker} style={{ ['--accent' as string]: '#c98a2e' }}>Chapter 01</p>
            <h1 className={`${styles.serif} ${styles.title}`}>Jerry 的<br />AI 頻道</h1>
            <p className={styles.lede}>看影片・學工作流・拿免費資源</p>
            <div className={styles.actions} style={{ ['--accent' as string]: '#c98a2e' }}>
              <button type="button" onClick={() => scrollToProgress(0.74)} className={styles.button}>翻開 →</button>
              <Link href="/videos" className={styles.link}>直接看影片筆記</Link>
            </div>
          </div>
          <div id="free" ref={freeCopy} className={`${styles.copy} ${layout.mobile ? 'rounded-2xl bg-[#f7f2e8]/85 p-5 shadow-[0_20px_40px_-24px_rgba(60,45,25,.5)] backdrop-blur-md' : ''} absolute left-5 sm:left-[clamp(20px,5vw,72px)] right-5 sm:right-auto`} style={{ position: 'absolute', opacity: 0, transition: 'opacity .2s' }}>
            <p className={styles.kicker} style={{ ['--accent' as string]: '#5f8f7b' }}>Chapter 02 · Free</p>
            <h2 className={`${styles.serif} ${styles.title}`}>免費教學</h2>
            <p className={styles.lede}>{resource ? `留下 Email，「${resource.title}」馬上寄到你手上。` : '免費資源整理中，很快上架。'}</p>
            {resource && (
              <div className="mt-7 max-w-md">
                <LeadForm resource={resource.slug} title={resource.title} variant="paper" submitLabel="寄給我" compact />
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className={`${styles.endnote} relative z-10`} style={{ background: '#f2ece2' }}>
        <p className={styles.serif}>— 下一章：工作流與商店 —</p>
        <nav aria-label="頁尾">
          <Link href="/book?mode=css#shop">看商店章節（平面版）</Link>
          <Link href="/videos">影片筆記</Link>
          <Link href="/privacy">隱私權政策</Link>
        </nav>
      </footer>
    </div>
  )
}
