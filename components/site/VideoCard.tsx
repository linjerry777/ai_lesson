import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { VideoNote } from '@/lib/content'
import { getChannel } from '@/lib/site'

export function youtubeThumb(id: string) {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
}

/** Print card for a video note: thumbnail (or a channel-coloured title card) above, mono meta below. */
export default function VideoCard({ video }: { video: VideoNote }) {
  const channel = getChannel(video.channel)
  const thumb = video.platforms.youtube ? youtubeThumb(video.platforms.youtube) : null
  const ep = video.code.padStart(2, '0').toUpperCase()
  return (
    <Link href={`/videos/${video.slug}`} className="group block border-2 border-[var(--ink)] bg-[var(--white)] shadow-[6px_6px_0_var(--ink)] transition duration-200 hover:-translate-y-1 hover:shadow-[8px_10px_0_var(--ink)]">
      <div className="relative aspect-video overflow-hidden border-b-2 border-[var(--ink)]" style={{ background: channel?.color ?? 'var(--ink)', color: channel?.ink ?? '#fff' }}>
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumb} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
        ) : (
          <div className="flex h-full flex-col justify-between p-4">
            <span className="font-mono text-[11px] font-bold tracking-[.14em]">EP_{ep} · {channel?.name}</span>
            <span className="max-w-[90%] text-xl font-black leading-snug">{video.title}</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between font-mono text-[11px] tracking-[.08em] text-[var(--ink-2)]">
          <span>EP_{ep}</span>
          <span>{video.publishedAt.replaceAll('-', '.')}</span>
        </div>
        <h3 className="mt-2 flex items-start justify-between gap-3 text-base font-bold leading-snug">
          {video.title}
          <ArrowUpRight size={16} className="mt-1 shrink-0 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
        </h3>
        <p className="mt-1.5 line-clamp-2 text-xs leading-6 text-[var(--ink-2)]">{video.summary}</p>
      </div>
    </Link>
  )
}
