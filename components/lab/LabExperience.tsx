'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Canvas } from '@react-three/fiber'
import LeadForm from '@/components/cinema/LeadForm'
import { panelOpacity, sectionAnchor, sectionPosition } from '@/lib/lab'
import ParticleStage, { loadShape, type Placement, type Shape } from './ParticleStage'
import styles from './lab.module.css'

type Side = 'left' | 'right' | 'center'

interface Section {
  shape: string
  code: string
  side: Side
  hud: [string, string]
}

const SECTIONS: Section[] = [
  { shape: 'logo', code: 'JERRY.AI', side: 'center', hud: ['SIGNAL / ON AIR', 'CH 07 / AUTO'] },
  { shape: 'xun', code: 'CHANNEL_01', side: 'right', hud: ['CHANNEL_01 / 訊號滿格', 'AI NEWS / DAILY'] },
  { shape: 'mochi', code: 'CHANNEL_02', side: 'left', hud: ['CHANNEL_02 / 麻糬QQ', 'COMEDY / DAILY'] },
  { shape: 'doro', code: 'CHANNEL_03', side: 'right', hud: ['CHANNEL_03 / DORO', 'TECH + MEDIA'] },
  { shape: 'workflow', code: 'WORKFLOW', side: 'left', hud: ['PIPELINE / 05 STAGES', 'RUNS EVERY DAY'] },
  { shape: 'mochi_love', code: 'FREE', side: 'right', hud: ['FREE / PROMPT PACK', 'EMAIL → DOWNLOAD'] },
  { shape: 'box', code: 'SHOP', side: 'left', hud: ['KIT_01 / AUTOVIDEO', 'NT$790 / SOON'] },
  { shape: 'xun_thumbsup', code: 'STUDIO', side: 'right', hud: ['COMMISSION / OPEN', 'WEB · LINE · AUTO'] },
]

const PLACEMENTS: Placement[] = SECTIONS.map(s => ({
  x: s.side === 'right' ? -0.9 : s.side === 'left' ? 0.9 : 0,
  y: 0,
  scale: s.shape === 'workflow' ? 0.72 : 1,
}))
// Phones: figure centred in the top half, panel as a sheet below.
const PLACEMENTS_MOBILE: Placement[] = SECTIONS.map(s => ({
  x: 0,
  y: s.side === 'center' ? 0.6 : 1.25,
  scale: s.shape === 'workflow' ? 0.42 : 0.62,
}))

const NAV = [
  { label: '頻道', index: 1 },
  { label: '工作流', index: 4 },
  { label: '免費教學', index: 5 },
  { label: '課程', index: 6 },
  { label: '接案', index: 7 },
]

function scrollToSection(index: number) {
  const track = document.getElementById('lab-track')
  if (!track) return
  const end = track.offsetTop + track.offsetHeight - window.innerHeight
  window.scrollTo({ top: end * sectionAnchor(index, SECTIONS.length), behavior: 'smooth' })
}

function Clip({ name }: { name: string }) {
  return (
    <video className={styles.clip} src={`/popup/clips/${name}.mp4`} poster={`/popup/clips/${name}.jpg`} muted loop playsInline autoPlay preload="none" />
  )
}

interface Props { resource: { slug: string; title: string } | null }

export default function LabExperience({ resource }: Props) {
  const progress = useRef({ g: 0 })
  const hud = useRef<HTMLDivElement>(null)
  const counter = useRef<HTMLSpanElement>(null)
  const [shapes, setShapes] = useState<Shape[] | null>(null)
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(max-width: 859px)')
    const sync = () => setMobile(query.matches)
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    let cancelled = false
    Promise.all(SECTIONS.map(s => loadShape(`/lab/particles/${s.shape}.bin`)))
      .then(result => { if (!cancelled) setShapes(result) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    let raf = 0
    function update() {
      raf = 0
      const track = document.getElementById('lab-track')
      const end = track ? track.offsetTop + track.offsetHeight - window.innerHeight : 1
      const g = Math.min(1, Math.max(0, window.scrollY / Math.max(1, end)))
      progress.current.g = g
      document.querySelectorAll<HTMLElement>('[data-panel]').forEach((el, i) => {
        const o = panelOpacity(g, SECTIONS.length, i)
        el.style.opacity = o.toFixed(3)
        el.style.transform = `translateY(${((1 - o) * 14).toFixed(1)}px)`
        el.style.pointerEvents = o > 0.6 ? 'auto' : 'none'
        el.querySelectorAll('video').forEach(v => { if (o > 0.3) { if (v.paused) v.play().catch(() => {}) } else if (!v.paused) v.pause() })
      })
      const index = Math.min(SECTIONS.length - 1, Math.round(sectionPosition(g, SECTIONS.length)))
      if (counter.current) counter.current.textContent = `${String(index + 1).padStart(2, '0')} / ${String(SECTIONS.length).padStart(2, '0')}`
      if (hud.current) {
        const s = SECTIONS[index]
        hud.current.dataset.side = s.side
        hud.current.querySelector('[data-a]')!.textContent = s.hud[0]
        hud.current.querySelector('[data-b]')!.textContent = s.hud[1]
        hud.current.style.opacity = panelOpacity(g, SECTIONS.length, index).toFixed(3)
      }
    }
    const schedule = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])

  return (
    <div className={styles.root}>
      <div className={styles.fog} aria-hidden="true" />
      <div className={styles.dots} aria-hidden="true" />
      <div className={styles.canvas} aria-hidden="true">
        {shapes && (
          <Canvas dpr={[1, 2]} camera={{ fov: 32, position: [0, 0.1, 10.2], near: 0.1, far: 60 }} gl={{ antialias: true, alpha: true }}>
            <Suspense fallback={null}>
              <ParticleStage shapes={shapes} placements={mobile ? PLACEMENTS_MOBILE : PLACEMENTS} progress={progress} />
            </Suspense>
          </Canvas>
        )}
        {!shapes && <p className={styles.loader}>=+==--==++</p>}
      </div>

      <div ref={hud} className={styles.hud} data-side="center" aria-hidden="true">
        <span className={styles.hudLine} />
        <span data-a className={styles.hudA} />
        <span data-b className={styles.hudB} />
      </div>

      <header className={styles.top}>
        <Link href="/lab" className={styles.logo}>JERRY.AI</Link>
        <nav className={styles.nav} aria-label="主要導覽">
          {NAV.map(item => <button key={item.label} type="button" onClick={() => scrollToSection(item.index)}>{item.label}</button>)}
        </nav>
      </header>
      <p className={styles.counter}><span ref={counter}>01 / 08</span></p>

      <main id="lab-track" className={styles.track} style={{ height: `${SECTIONS.length * 135}vh` }}>
        <div className={styles.panels}>
          <section data-panel className={`${styles.panel} ${styles.center}`}>
            <p className={styles.mono}>{'////// Manifesto'}</p>
            <h1 className={styles.title}>一個人，七個頻道，<br />每天自動開播。</h1>
            <p className={styles.lede}>Jerry 的 AI 工作流片場。往下滑，看角色怎麼被拆開、再組回來。</p>
            <p className={styles.scroll}>SCROLL</p>
          </section>

          <section data-panel className={`${styles.panel} ${styles.right}`}>
            <p className={styles.mono}>CHANNEL_01</p>
            <h2 className={styles.h2}>訊號滿格</h2>
            <p className={styles.lede}>小訊每天播報 AI 新聞：哪個工具更新了、對你有什麼影響。</p>
            <Clip name="xun-signal" />
          </section>

          <section data-panel className={`${styles.panel} ${styles.left}`}>
            <p className={styles.mono}>CHANNEL_02</p>
            <h2 className={styles.h2}>麻糬QQ</h2>
            <p className={styles.lede}>原創情境梗，每天一個共鳴笑點。</p>
            <Clip name="mochi-qq" />
          </section>

          <section data-panel className={`${styles.panel} ${styles.right}`}>
            <p className={styles.mono}>CHANNEL_03 · 04</p>
            <h2 className={styles.h2}>Doro夫子／Doro公公</h2>
            <p className={styles.lede}>科技日更與娛樂日更，兩條線同一套自動化產線。</p>
            <div className={styles.clipPair}><Clip name="doro-fuzi" /><Clip name="doro-gonggong" /></div>
          </section>

          <section data-panel className={`${styles.panel} ${styles.left}`}>
            <p className={styles.mono}>WORKFLOW</p>
            <h2 className={styles.h2}>每天自動產出的工作流</h2>
            <ol className={styles.steps}>
              <li><span>01</span>選題：抓當天資訊，挑出值得講的</li>
              <li><span>02</span>腳本：結果先講、證據跟上</li>
              <li><span>03</span>配音：固定聲線、自動對字幕</li>
              <li><span>04</span>剪輯：角色、畫面、字幕自動排版</li>
              <li><span>05</span>發布：多平台排程上架</li>
            </ol>
          </section>

          <section data-panel className={`${styles.panel} ${styles.right}`}>
            <p className={styles.mono}>FREE</p>
            <h2 className={styles.h2}>免費教學</h2>
            <p className={styles.lede}>{resource ? `留下 Email，「${resource.title}」馬上寄給你。` : '免費資源整理中。'}</p>
            {resource && <div className={styles.form}><LeadForm resource={resource.slug} title={resource.title} variant="frost" submitLabel="寄給我" /></div>}
          </section>

          <section data-panel className={`${styles.panel} ${styles.left}`}>
            <p className={styles.mono}>KIT_01</p>
            <h2 className={styles.h2}>AutoVideo 工作流套件</h2>
            <p className={styles.lede}>填好設定，一個指令跑出第一支片。附貼給 Claude Code 的安裝 prompt。</p>
            <p className={styles.price}>NT$790 <span>預購即將開放</span></p>
            <p className={styles.note}>完整課「用 Claude Code 打造 AI 短影音工廠」同步準備中。</p>
          </section>

          <section data-panel className={`${styles.panel} ${styles.right}`}>
            <p className={styles.mono}>STUDIO</p>
            <h2 className={styles.h2}>委託我做一個</h2>
            <p className={styles.lede}>網站、LINE 機器人、自動化流程。跟我聊你的需求。</p>
            <a className={styles.cta} href="mailto:donutai08@gmail.com?subject=%E5%A7%94%E8%A8%97%E8%A3%BD%E4%BD%9C">聊聊你的需求 →</a>
          </section>
        </div>
      </main>
    </div>
  )
}
