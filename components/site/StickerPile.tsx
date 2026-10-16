'use client'

import { useRef, useState } from 'react'

interface PileSticker {
  src: string
  alt: string
  /** Box in % of the pile (left, top, width) and tilt in degrees. */
  x: number
  y: number
  w: number
  r: number
  tag?: { label: string; name: string; color: string; ink: string; x: number; y: number; r: number }
  bubble?: string
  mirror?: boolean
}

const PILE: PileSticker[] = [
  { src: 'mochi', alt: '麻糬', x: 37, y: 0, w: 31, r: 5, tag: { label: 'MOCHI', name: '麻糬QQ', color: '#ff5d8f', ink: '#fff', x: 60, y: 26, r: 7 } },
  { src: 'doro', alt: 'Doro夫子', x: 67, y: 4, w: 31, r: 8, tag: { label: 'DORO', name: 'Doro夫子', color: '#0e9f6e', ink: '#fff', x: 22, y: 82, r: -4 } },
  { src: 'xun', alt: '小訊', x: 1, y: 10, w: 35, r: -6, tag: { label: 'XUN', name: '訊號滿格', color: '#2747ff', ink: '#fff', x: 4, y: 84, r: -4 } },
  { src: 'doro', alt: 'Doro公公', x: 64, y: 50, w: 33, r: -7, mirror: true, tag: { label: 'DORO', name: 'Doro公公', color: '#ff4a1c', ink: '#fff', x: 30, y: 80, r: 5 } },
  { src: 'nailao', alt: '奶烙（橘白貓）', x: 36, y: 38, w: 27, r: -3, tag: { label: 'NAILAO', name: '奶烙', color: '#f5a524', ink: '#1a1208', x: 50, y: 86, r: -5 }, bubble: '喵，今天聊 AI' },
]

/**
 * The hero's pile of die-cut stickers. They drop in on load and can be dragged
 * around with a mouse or pen (touch is left to page scrolling).
 */
export default function StickerPile() {
  const [offsets, setOffsets] = useState<Record<number, { x: number; y: number }>>({})
  const [order, setOrder] = useState(PILE.map((_, i) => i))
  const drag = useRef<{ i: number; sx: number; sy: number; ox: number; oy: number } | null>(null)

  function down(i: number, e: React.PointerEvent) {
    if (e.pointerType === 'touch') return
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    const o = offsets[i] ?? { x: 0, y: 0 }
    drag.current = { i, sx: e.clientX, sy: e.clientY, ox: o.x, oy: o.y }
    setOrder(prev => [...prev.filter(n => n !== i), i])
  }
  function move(e: React.PointerEvent) {
    const d = drag.current
    if (!d) return
    setOffsets(prev => ({ ...prev, [d.i]: { x: d.ox + e.clientX - d.sx, y: d.oy + e.clientY - d.sy } }))
  }
  function up() { drag.current = null }

  return (
    <div className="relative mx-auto aspect-[1/0.92] w-full max-w-[720px]">
      {PILE.map((s, i) => {
        const o = offsets[i] ?? { x: 0, y: 0 }
        return (
          <div
            key={s.alt}
            className="sticker-drop absolute cursor-grab active:cursor-grabbing"
            style={{
              left: `${s.x}%`, top: `${s.y}%`, width: `${s.w}%`,
              zIndex: order.indexOf(i) + 1,
              transform: `translate(${o.x}px, ${o.y}px) rotate(${s.r}deg)`,
              animationDelay: `${120 + i * 110}ms`,
            }}
            onPointerDown={e => down(i, e)}
            onPointerMove={move}
            onPointerUp={up}
            onPointerCancel={up}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/stickers/${s.src}.webp`}
              alt={s.alt}
              draggable={false}
              className={`sticker-img block h-auto w-full ${s.mirror ? '-scale-x-100' : ''}`}
            />
            {s.tag && (
              <span
                className="absolute whitespace-nowrap rounded-[3px] px-2.5 py-1 shadow-[2px_2px_0_var(--ink)]"
                style={{ left: `${s.tag.x}%`, top: `${s.tag.y}%`, background: s.tag.color, color: s.tag.ink, transform: `rotate(${s.tag.r - s.r}deg)` }}
              >
                <span className="font-display block text-[clamp(13px,1.3vw,19px)] leading-none tracking-[.04em]">{s.tag.label}</span>
                <span className="block text-[clamp(10px,.85vw,12px)] font-bold leading-tight">{s.tag.name}</span>
              </span>
            )}
            {s.bubble && (
              <span className="absolute -top-[9%] left-[48%] whitespace-nowrap rounded-[999px] border-2 border-[var(--ink)] bg-white px-3 py-1.5 text-[clamp(11px,1vw,14px)] font-bold shadow-[3px_3px_0_var(--ink)]" style={{ transform: `rotate(${-s.r - 4}deg)` }}>
                {s.bubble}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
