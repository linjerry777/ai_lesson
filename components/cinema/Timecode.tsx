'use client'

import { useEffect, useState } from 'react'

function format(frames: number) {
  const f = frames % 24
  const s = Math.floor(frames / 24)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(f)}`
}

/** A running SMPTE-style timecode, like the corner of a camera viewfinder. */
export default function Timecode({ className }: { className?: string }) {
  const [frames, setFrames] = useState(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const start = performance.now()
    const id = window.setInterval(() => setFrames(Math.floor(((performance.now() - start) / 1000) * 24)), 1000 / 12)
    return () => window.clearInterval(id)
  }, [])
  return <span className={className} suppressHydrationWarning>{format(frames)}</span>
}
