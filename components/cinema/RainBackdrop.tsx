'use client'

import { useEffect, useRef } from 'react'
import styles from './cinema.module.css'

interface Streak { x: number; y: number; len: number; speed: number; alpha: number; width: number }
interface Bead { x: number; y: number; r: number; vy: number; trail: number }

const WIND = 0.16

function makeStreak(w: number, h: number, layer: number, anywhere: boolean): Streak {
  const depth = [0.45, 0.75, 1.15][layer]
  return {
    x: Math.random() * (w + 200) - 100,
    y: anywhere ? Math.random() * h : -Math.random() * 200,
    len: (10 + Math.random() * 18) * depth * 1.6,
    speed: (7 + Math.random() * 5) * depth * 1.4,
    alpha: (0.12 + Math.random() * 0.2) * (layer === 2 ? 1.5 : 1),
    width: layer === 2 ? 1.3 : layer === 1 ? 0.9 : 0.6,
  }
}

function makeBead(w: number, h: number): Bead {
  return { x: Math.random() * w, y: Math.random() * h, r: 0.8 + Math.random() * 2.6, vy: 0, trail: 0 }
}

/** Rain behind a window: falling streaks in three depths + beads that sometimes slide down the glass. */
export default function RainBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0, h = 0, raf = 0
    let streaks: { s: Streak; layer: number }[] = []
    let beads: Bead[] = []

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      w = window.innerWidth; h = window.innerHeight
      canvas!.width = Math.round(w * dpr); canvas!.height = Math.round(h * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      const density = Math.min(1, (w * h) / (1440 * 900))
      const count = Math.round(170 * Math.max(0.4, density))
      streaks = Array.from({ length: count }, (_, i) => {
        const layer = i % 10 < 5 ? 0 : i % 10 < 8 ? 1 : 2
        return { s: makeStreak(w, h, layer, true), layer }
      })
      beads = Array.from({ length: Math.round(55 * Math.max(0.5, density)) }, () => makeBead(w, h))
    }

    function drawBead(b: Bead) {
      if (b.trail > 2) {
        const g = ctx!.createLinearGradient(b.x, b.y - b.trail, b.x, b.y)
        g.addColorStop(0, 'rgba(200,220,240,0)')
        g.addColorStop(1, 'rgba(200,220,240,0.10)')
        ctx!.strokeStyle = g
        ctx!.lineWidth = b.r * 0.9
        ctx!.beginPath(); ctx!.moveTo(b.x, b.y - b.trail); ctx!.lineTo(b.x, b.y); ctx!.stroke()
      }
      const body = ctx!.createRadialGradient(b.x - b.r * 0.3, b.y - b.r * 0.4, 0, b.x, b.y, b.r)
      body.addColorStop(0, 'rgba(255,240,220,0.55)')
      body.addColorStop(0.45, 'rgba(160,190,215,0.16)')
      body.addColorStop(1, 'rgba(10,14,20,0.35)')
      ctx!.fillStyle = body
      ctx!.beginPath(); ctx!.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx!.fill()
    }

    function frame() {
      ctx!.clearRect(0, 0, w, h)
      ctx!.lineCap = 'round'
      for (const item of streaks) {
        const s = item.s
        ctx!.strokeStyle = `rgba(190,210,235,${s.alpha})`
        ctx!.lineWidth = s.width
        ctx!.beginPath()
        ctx!.moveTo(s.x, s.y)
        ctx!.lineTo(s.x - s.len * WIND, s.y + s.len)
        ctx!.stroke()
        if (!reduced) {
          s.y += s.speed
          s.x -= s.speed * WIND
          if (s.y > h + 20 || s.x < -120) item.s = makeStreak(w, h, item.layer, false)
        }
      }
      for (const b of beads) {
        if (!reduced) {
          if (b.vy === 0 && b.r > 2.4 && Math.random() < 0.0016) b.vy = 0.6 + Math.random() * 1.6
          if (b.vy > 0) {
            b.y += b.vy
            b.x += (Math.random() - 0.5) * 0.4
            b.trail = Math.min(b.trail + b.vy, 140)
            if (Math.random() < 0.01) b.vy = 0
            if (b.y > h + 10) Object.assign(b, makeBead(w, h), { y: -10 })
          } else if (b.trail > 0) b.trail = Math.max(0, b.trail - 0.5)
        }
        drawBead(b)
      }
      if (!reduced) raf = requestAnimationFrame(frame)
    }

    function onVisibility() {
      cancelAnimationFrame(raf)
      if (!document.hidden) raf = requestAnimationFrame(frame)
    }

    resize()
    raf = requestAnimationFrame(frame)
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <div className={styles.backdrop} aria-hidden="true">
      <div className={styles.city} />
      <div className={styles.bokeh} />
      <div className={styles.bokeh} />
      <div className={styles.bokeh} />
      <div className={styles.bokeh} />
      <div className={styles.flash} />
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.vignette} />
      <div className={styles.grain} />
    </div>
  )
}
