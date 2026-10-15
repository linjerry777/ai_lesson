import Link from 'next/link'
import { PlayCircle } from 'lucide-react'
import type { VideoNote } from '@/lib/content'
import { getChannel } from '@/lib/site'

export function youtubeThumb(id: string) {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
}

export default function VideoCard({ video }: { video: VideoNote }) {
  const channel = getChannel(video.channel)
  const thumb = video.platforms.youtube ? youtubeThumb(video.platforms.youtube) : null
  return (
    <Link href={`/videos/${video.slug}`} className="group flex flex-col overflow-hidden rounded-lg border border-[#e0dfd4] bg-white transition hover:border-ink">
      <div className="relative aspect-video bg-ink">
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumb} alt="" className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="flex h-full flex-col justify-between p-4 text-[#edf0e7]">
            <span className="text-[10px] font-semibold tracking-[0.14em] text-[#c0d0cd]">#{video.code.toUpperCase()}</span>
            <PlayCircle size={28} aria-hidden="true" className="text-[#e7b79d]" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-semibold tracking-wider text-rust">{channel?.name} · {video.publishedAt}</p>
        <h3 className="mt-2 text-base font-semibold leading-snug text-ink group-hover:underline group-hover:underline-offset-4">{video.title}</h3>
        <p className="mt-2 line-clamp-2 text-xs leading-6 text-ink-muted">{video.summary}</p>
      </div>
    </Link>
  )
}
