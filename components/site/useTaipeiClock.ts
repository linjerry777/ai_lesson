'use client'

import { useEffect, useState } from 'react'

export interface ClockParts { h: number; m: number; s: number }

function taipeiNow(): ClockParts {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Taipei', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
  }).formatToParts(new Date())
  const get = (type: string) => Number(parts.find(p => p.type === type)?.value ?? 0)
  return { h: get('hour'), m: get('minute'), s: get('second') }
}

/** Taipei wall clock, ticking every second. `null` until mounted (avoids hydration mismatch). */
export function useTaipeiClock() {
  const [now, setNow] = useState<ClockParts | null>(null)
  useEffect(() => {
    const first = window.setTimeout(() => setNow(taipeiNow()), 0)
    const timer = window.setInterval(() => setNow(taipeiNow()), 1000)
    return () => { window.clearTimeout(first); window.clearInterval(timer) }
  }, [])
  return now
}
