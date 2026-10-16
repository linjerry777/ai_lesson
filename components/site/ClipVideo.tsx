'use client'

import { useEffect, useRef } from 'react'

/** Muted looping channel clip that only plays while on screen. */
export default function ClipVideo({ name, label, className = '' }: { name: string; label: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !reduce) video.play().catch(() => {})
      else video.pause()
    }, { threshold: 0.35 })
    io.observe(video)
    return () => io.disconnect()
  }, [])

  return (
    <video
      ref={ref}
      className={className}
      poster={`/clips/${name}.jpg`}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
    >
      <source src={`/clips/${name}.webm`} type="video/webm" />
      <source src={`/clips/${name}.mp4`} type="video/mp4" />
    </video>
  )
}
