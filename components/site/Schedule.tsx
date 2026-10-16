'use client'

import { useEffect, useRef, useState } from 'react'
import { CHANNELS, pad2 } from '@/lib/site'
import Ruler from './Ruler'

/**
 * Wraps the channel slots (`[data-slot]` children). While the programme is on
 * screen a ruler docks to the bottom of the viewport and its marker travels to
 * the hour of whichever slot is in view.
 */
export default function Schedule({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const slots = Array.from(root.querySelectorAll<HTMLElement>('[data-slot]'))
    const slotIo = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.slot))
      }
    }, { rootMargin: '-45% 0px -45% 0px' })
    slots.forEach(slot => slotIo.observe(slot))
    const rootIo = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '-30% 0px -30% 0px' })
    rootIo.observe(root)
    return () => { slotIo.disconnect(); rootIo.disconnect() }
  }, [])

  const channel = CHANNELS[active]
  return (
    <div ref={ref} className="relative">
      {children}
      <div
        className={`pointer-events-none fixed inset-x-0 bottom-0 z-40 transition duration-500 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
        aria-hidden={!visible}
      >
        <div className="pointer-events-auto border-t border-[var(--ink)] bg-[#f3f0e8]/95 backdrop-blur">
          <div className="mx-auto flex max-w-[1440px] items-center gap-5 px-4 pt-2 sm:px-8">
            <div className="hidden w-48 shrink-0 sm:block">
              <p className="font-mono text-[10px] font-bold tracking-[.16em] text-[var(--ink-2)]">NOW ON AIR · {pad2(active + 1)}/{pad2(CHANNELS.length)}</p>
              <p className="flex items-center gap-2 text-sm font-black">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: channel.color }} />
                {pad2(channel.hour)}:00 {channel.name}
              </p>
            </div>
            <div className="min-w-0 flex-1"><Ruler hour={channel.hour} compact /></div>
          </div>
        </div>
      </div>
    </div>
  )
}
