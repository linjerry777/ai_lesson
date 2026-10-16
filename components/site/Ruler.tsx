'use client'

import { CHANNELS, pad2 } from '@/lib/site'
import { useTaipeiClock } from './useTaipeiClock'

const HOURS = Array.from({ length: 25 }, (_, h) => h)
const pct = (hour: number) => `${(hour / 24) * 100}%`

/**
 * The 24-hour programme ruler: hour ticks, one coloured dot per channel slot and a
 * marker. `hour` pins the marker (scroll-driven schedule); without it the marker
 * follows the Taipei clock.
 */
export default function Ruler({ hour, compact = false }: { hour?: number; compact?: boolean }) {
  const now = useTaipeiClock()
  const marker = hour ?? (now ? now.h + now.m / 60 : null)
  return (
    <div className={`relative ${compact ? 'h-11' : 'h-14'} select-none`} aria-hidden="true">
      <div className="absolute inset-x-0 top-[18px] h-px bg-[var(--ink)]" />
      {HOURS.map(h => (
        <div key={h} className="absolute top-[18px] -translate-x-1/2" style={{ left: pct(h) }}>
          <div className={`w-px bg-[var(--ink)] ${h % 6 === 0 ? 'h-3' : 'h-2'}`} />
          {(!compact || h % 3 === 0) && (
            <span className={`absolute left-1/2 top-4 -translate-x-1/2 font-mono text-[10px] tabular-nums ${h % 6 === 0 ? 'font-bold' : 'text-[var(--ink-2)]'} ${h % 2 && !compact ? 'max-sm:hidden' : ''}`}>{pad2(h)}</span>
          )}
        </div>
      ))}
      {CHANNELS.map(c => (
        <a
          key={c.key}
          href={`#ch-${c.key}`}
          tabIndex={-1}
          className="pointer-events-auto absolute top-[12px] h-3 w-3 -translate-x-1/2 rounded-full border-2 border-[var(--paper)]"
          style={{ left: pct(c.hour), background: c.color }}
          title={c.name}
        />
      ))}
      {marker !== null && (
        <div className="absolute top-0 -translate-x-1/2 transition-[left] duration-700 ease-[cubic-bezier(.2,.8,.2,1)]" style={{ left: pct(marker) }}>
          <div className="mx-auto h-[30px] w-[3px] bg-[var(--red)]" />
          <div className="absolute -top-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-[var(--red)]" />
        </div>
      )}
    </div>
  )
}
