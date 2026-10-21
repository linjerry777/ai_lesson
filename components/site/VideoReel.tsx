'use client'

import { useEffect, useRef, useState } from 'react'
import { Play } from 'lucide-react'
import type { LatestVideo } from '@/lib/youtube'

const embed = (id: string, muted: boolean) =>
  `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1&rel=0&modestbranding=1${muted ? `&mute=1&loop=1&playlist=${id}` : ''}`

/**
 * A channel's latest uploads side by side as vertical players. The newest one
 * starts playing muted while the reel is on screen; any card plays (with sound)
 * when clicked. Only one clicked player at a time.
 */
export default function VideoReel({ videos, labels, dark = false }: { videos: LatestVideo[]; labels: string[]; dark?: boolean }) {
  const ref = useRef<HTMLUListElement>(null)
  const [visible, setVisible] = useState(false)
  const [playing, setPlaying] = useState<string | null>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.5 })
    io.observe(node)
    return () => io.disconnect()
  }, [])

  return (
    <ul ref={ref} className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0">
      {videos.map((video, i) => {
        const clicked = playing === video.id
        const preview = i === 0 && visible && !playing
        return (
          <li key={video.id} className="w-[44%] shrink-0 snap-start sm:w-auto">
            <div className={`relative aspect-[9/16] overflow-hidden border-2 border-[var(--ink)] bg-black ${i === 0 ? 'shadow-[4px_4px_0_var(--ink)]' : ''}`}>
              {clicked || preview ? (
                <iframe
                  src={embed(video.id, !clicked)}
                  title={video.title}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  className={`absolute inset-0 h-full w-full ${preview ? 'pointer-events-none' : ''}`}
                />
              ) : (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={video.thumb} alt="" loading="lazy" className={`h-full w-full object-cover ${dark ? 'grayscale-[.7]' : ''}`} />
                </>
              )}
              {!clicked && (
                <button
                  type="button"
                  onClick={() => setPlaying(video.id)}
                  className="group absolute inset-0 grid place-items-center"
                  aria-label={`播放：${video.title}`}
                >
                  {preview ? (
                    <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full border-2 border-[var(--ink)] bg-white/90 px-2 py-1 text-[11px] font-black text-[var(--ink)] shadow-[2px_2px_0_var(--ink)]">
                      <Play size={12} className="fill-current" aria-hidden="true" />開聲音看
                    </span>
                  ) : (
                    <span className="grid h-12 w-12 place-items-center rounded-full border-2 border-[var(--ink)] bg-white/90 text-[var(--ink)] shadow-[3px_3px_0_var(--ink)] transition group-hover:scale-110">
                      <Play size={20} className="ml-0.5 fill-current" aria-hidden="true" />
                    </span>
                  )}
                </button>
              )}
              <span className="pointer-events-none absolute left-1.5 top-1.5 bg-black/75 px-1.5 py-0.5 font-mono text-[9px] font-bold tracking-[.1em] text-white">{labels[i] ?? ''}</span>
            </div>
            <a href={video.url} target="_blank" rel="noopener noreferrer" className="mt-2 block hover:underline">
              <span className="line-clamp-2 text-[13px] font-bold leading-5">{video.title}</span>
            </a>
          </li>
        )
      })}
    </ul>
  )
}
