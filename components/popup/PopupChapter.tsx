'use client'

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { copyVisibility, layerLift, sectionProgress } from '@/lib/popup'
import styles from './popup.module.css'

export interface PopupLayer {
  src: string
  /** Horizontal center on the open book, 0 (left edge) – 1 (right edge). */
  x: number
  /** Where the layer stands: 0 = near edge of the page, 1 = far edge. */
  depth: number
  /** Width as a fraction of the book width. */
  width: number
  /** Pop-up order, 0 (first) – 1 (last). Defaults to back-to-front by depth. */
  order?: number
  standee?: boolean
  className?: string
  children?: ReactNode
}

interface Props {
  id: string
  index: number
  total: number
  accent: string
  cover: string
  layers: PopupLayer[]
  copy: ReactNode
  /** First chapter is already open on arrival instead of waiting for scroll. */
  startOpen?: boolean
  className?: string
  hint?: string
}

const INTRO_MS = 1500

export default function PopupChapter({ id, index, total, accent, cover, layers, copy, startOpen, className, hint }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const layerRefs = useRef<(HTMLDivElement | null)[]>([])
  const shadowRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const section = sectionRef.current
    const stage = stageRef.current
    if (!section || !stage) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mountedAt = performance.now()
    let raf = 0
    let mx = 0, my = 0, tx = 0, ty = 0

    const orders = layers.map((layer, i) => layer.order ?? (layers.length > 1 ? i / (layers.length - 1) : 0))

    function frame() {
      raf = 0
      const rect = section!.getBoundingClientRect()
      const viewport = window.innerHeight
      // Skip work while the chapter is far off screen.
      if (rect.bottom < -viewport || rect.top > viewport * 2) return
      let progress = sectionProgress(rect.top, rect.height, viewport)
      let animating = false
      if (startOpen && !reduced) {
        const intro = Math.min(1, (performance.now() - mountedAt) / INTRO_MS)
        progress = Math.max(progress, 0.42 * intro)
        animating = intro < 1
      }
      layerRefs.current.forEach((el, i) => {
        const lift = layerLift(progress, orders[i], reduced).toFixed(4)
        el?.style.setProperty('--lift', lift)
        shadowRefs.current[i]?.style.setProperty('--lift', lift)
      })
      stage!.style.setProperty('--copy', copyVisibility(progress, reduced).toFixed(3))
      stage!.style.setProperty('--fill', `${Math.round(progress * 100)}%`)
      if (!reduced) {
        mx += (tx - mx) * 0.08
        my += (ty - my) * 0.08
        stage!.style.setProperty('--mx', mx.toFixed(4))
        stage!.style.setProperty('--my', my.toFixed(4))
        if (Math.abs(tx - mx) > 0.001 || Math.abs(ty - my) > 0.001) animating = true
      }
      if (animating) schedule()
    }
    function schedule() { if (!raf) raf = requestAnimationFrame(frame) }
    function onPointer(event: PointerEvent) {
      if (event.pointerType !== 'mouse') return
      tx = event.clientX / window.innerWidth - 0.5
      ty = event.clientY / window.innerHeight - 0.5
      schedule()
    }

    frame()
    schedule()
    // rAF is paused in background tabs; make sure the cover still ends up open.
    const settle = startOpen ? window.setTimeout(frame, INTRO_MS + 50) : 0
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    window.addEventListener('pointermove', onPointer, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(settle)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      window.removeEventListener('pointermove', onPointer)
    }
  }, [layers, startOpen])

  return (
    <section id={id} ref={sectionRef} className={`${styles.chapter} ${className ?? ''}`} aria-labelledby={`${id}-title`}>
      <div ref={stageRef} className={styles.stage} style={{ '--accent': accent, '--cover': cover } as CSSProperties}>
        <div className={styles.copy}>{copy}</div>
        <div className={styles.scene} aria-hidden="true">
          <div className={styles.book}>
            <div className={styles.cover} />
            {[6, 5, 4, 3, 2, 1].map(n => <div key={n} className={styles.sheet} style={{ transform: `translateZ(${-n * 1.2}px)` }} />)}
            <div className={styles.pages}>
              <div className={`${styles.page} ${styles.pageLeft}`} />
              <div className={`${styles.page} ${styles.pageRight}`} />
              {layers.map((layer, i) => (
                <div
                  key={`${layer.src}-shadow`}
                  ref={el => { shadowRefs.current[i] = el }}
                  className={styles.contact}
                  style={{ left: `${layer.x * 100}%`, bottom: `${8 + layer.depth * 78}%`, width: `${layer.width * 80}%` }}
                />
              ))}
              {layers.map((layer, i) => (
                <div
                  key={layer.src}
                  ref={el => { layerRefs.current[i] = el }}
                  className={styles.layer}
                  style={{
                    left: `${(layer.x - layer.width / 2) * 100}%`,
                    bottom: `${8 + layer.depth * 78}%`,
                    width: `${layer.width * 100}%`,
                    transform: `translateZ(${(1 - layer.depth) * 2 + 1}px) rotateX(calc(var(--lift, 1) * -72deg))`,
                    '--sway': `${5 + (i % 3)}s`,
                  } as CSSProperties}
                >
                  <div className={`${layer.standee ? styles.standee : ''} ${layer.className ?? ''}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={layer.src} alt="" draggable={false} loading={startOpen ? 'eager' : 'lazy'} decoding="async" />
                    {layer.children}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.pager}>
          <span>{String(index).padStart(2, '0')}</span>
          <span className={styles.pagerBar} />
          <span>{String(total).padStart(2, '0')}</span>
        </div>
        {hint && <p className={styles.hint}>{hint}</p>}
      </div>
    </section>
  )
}
