'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import styles from '@/components/lab/lab.module.css'
import { firstPanel, secondPanel } from '@/lib/statue'
import StatueScene from './StatueScene'

/** Tech test: a solid Blender statue shatters and its fragments re-form as the next character. */
export default function StatueExperience() {
  const progress = useRef({ g: 0 })
  const first = useRef<HTMLElement>(null)
  const second = useRef<HTMLElement>(null)
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(max-width: 859px)')
    const sync = () => setMobile(query.matches)
    sync()
    query.addEventListener('change', sync)
    let raf = 0
    function update() {
      raf = 0
      const track = document.getElementById('lab2-track')
      const end = track ? track.offsetTop + track.offsetHeight - window.innerHeight : 1
      const g = Math.min(1, Math.max(0, window.scrollY / Math.max(1, end)))
      progress.current.g = g
      const show = (el: HTMLElement | null, o: number) => {
        if (!el) return
        el.style.opacity = o.toFixed(3)
        el.style.pointerEvents = o > 0.6 ? 'auto' : 'none'
        el.querySelectorAll('video').forEach(v => { if (o > 0.3) { if (v.paused) v.play().catch(() => {}) } else if (!v.paused) v.pause() })
      }
      show(first.current, firstPanel(g))
      show(second.current, secondPanel(g))
    }
    const schedule = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      query.removeEventListener('change', sync)
      window.removeEventListener('scroll', schedule)
    }
  }, [])

  return (
    <div className={styles.root}>
      <div className={styles.fog} aria-hidden="true" />
      <div className={styles.dots} aria-hidden="true" />
      <div className={styles.canvas} aria-hidden="true">
        <Canvas dpr={[1, 2]} camera={{ fov: 30, position: [0, 0, mobile ? 13 : 9.5], near: 0.1, far: 60 }} gl={{ antialias: true, alpha: true, toneMapping: 4 }}>
          <Suspense fallback={null}>
            <StatueScene progress={progress} offsetX={mobile ? 0 : 1.1} />
          </Suspense>
        </Canvas>
      </div>
      <header className={styles.top}><span className={styles.logo}>JERRY.AI</span><span className={styles.nav}>SOLID TEST</span></header>
      <main id="lab2-track" className={styles.track} style={{ height: '420vh' }}>
        <div className={styles.panels}>
          <section ref={first} className={`${styles.panel} ${styles.right}`}>
            <p className={styles.mono}>CHANNEL_01</p>
            <h2 className={styles.h2}>訊號滿格</h2>
            <p className={styles.lede}>往下滑：小訊的實體雕像會裂成 140 塊碎片，再重組成麻糬。</p>
            <video className={styles.clip} src="/popup/clips/xun-signal.mp4" poster="/popup/clips/xun-signal.jpg" muted loop playsInline autoPlay preload="none" />
          </section>
          <section ref={second} className={`${styles.panel} ${styles.left}`} style={{ opacity: 0 }}>
            <p className={styles.mono}>CHANNEL_02</p>
            <h2 className={styles.h2}>麻糬QQ</h2>
            <p className={styles.lede}>原創情境梗，每天一個共鳴笑點。</p>
            <video className={styles.clip} src="/popup/clips/mochi-qq.mp4" poster="/popup/clips/mochi-qq.jpg" muted loop playsInline autoPlay preload="none" />
          </section>
        </div>
      </main>
    </div>
  )
}
