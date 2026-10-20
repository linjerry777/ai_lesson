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
  { src: 'mochi', alt: '麻糬', x: 34, y: 0, w: 32, r: 5, tag: { label: 'MOCHI', name: '麻糬QQ', color: '#ff5d8f', ink: '#fff', x: 60, y: 26, r: 7 } },
  { src: 'xun', alt: '小訊', x: 0, y: 8, w: 37, r: -6, tag: { label: 'XUN', name: '訊號滿格', color: '#2747ff', ink: '#fff', x: 4, y: 84, r: -4 } },
  { src: 'codex', alt: 'Codex 隊：額度見底，休息中', x: 67, y: 50, w: 32, r: 8 },
  { src: 'mochi-love', alt: '麻糬比心', x: 72, y: 2, w: 18, r: 8 },
  { src: 'nailao', alt: '奶烙（橘白貓）', x: 38, y: 38, w: 28, r: -3, tag: { label: 'NAILAO', name: '奶烙', color: '#f5a524', ink: '#1a1208', x: 50, y: 86, r: -5 }, bubble: '喵，Claude 隊報到' },
]

/** Codex's corner of the pile: a powered-off monitor sticker instead of a character. */
function CodexCard({ label }: { label: string }) {
  return (
    <div role="img" aria-label={label} className="sticker-img select-none rounded-[14px] border-[6px] border-white bg-[#26282c] p-3 text-[#c9ccd2]">
      <div className="tv-static flex aspect-[4/3] flex-col items-center justify-center rounded-md border-2 border-[#3a3d42] bg-[#16181b] text-center">
        <span className="font-display text-[clamp(16px,2.2vw,32px)] leading-none tracking-[.06em] text-[#8a8f98]">NO SIGNAL</span>
        <span className="mt-1 font-mono text-[clamp(9px,.8vw,11px)] text-[#6b7079]">quota exceeded · zzz</span>
      </div>
      <div className="mt-2 flex items-center justify-between font-mono text-[clamp(9px,.85vw,12px)] font-bold">
        <span className="tracking-[.12em]">CODEX 隊</span>
        <span className="rounded-full bg-[#3a3d42] px-2 py-0.5 text-[#9aa0a8]">OFF AIR</span>
      </div>
    </div>
  )
}

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
            {s.src === 'codex' ? <CodexCard label={s.alt} /> : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`/stickers/${s.src}.webp`}
                alt={s.alt}
                draggable={false}
                className={`sticker-img block h-auto w-full ${s.mirror ? '-scale-x-100' : ''}`}
              />
            )}
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
