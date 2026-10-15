import Link from 'next/link'
import type { VideoNote } from '@/lib/content'
import { getChannel } from '@/lib/site'
import styles from './cinema.module.css'

export function youtubeThumb(id: string) {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
}

/** A film frame: perforated edges, timecode, title card when there's no thumbnail yet. */
export default function VideoCard({ video, index }: { video: VideoNote; index?: number }) {
  const channel = getChannel(video.channel)
  const thumb = video.platforms.youtube ? youtubeThumb(video.platforms.youtube) : null
  const ep = video.code.padStart(2, '0').toUpperCase()
  return (
    <Link href={`/videos/${video.slug}`} className="group block">
      <div className={`${styles.filmEdge} overflow-hidden rounded-sm bg-black px-[14px] ring-1 ring-white/10 transition duration-500 group-hover:ring-[#f0a65a]/60`}>
        <div className={`relative aspect-video overflow-hidden ${thumb ? '' : styles.poster}`}>
          {thumb ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={thumb} alt="" loading="lazy" className="h-full w-full object-cover opacity-75 grayscale-[35%] transition duration-700 group-hover:scale-[1.04] group-hover:opacity-100 group-hover:grayscale-0" />
          ) : (
            <div className={`${styles.scanlines} flex h-full flex-col justify-between p-4`}>
              <span className={`${styles.mono} text-[10px] text-[#b9bec4]`}>EP.{ep}</span>
              <span className={`${styles.display} ${styles.outlineNum} absolute -bottom-6 right-2 text-[120px] leading-none transition duration-700 group-hover:-translate-y-1`}>{ep}</span>
              <span className={`${styles.display} relative max-w-[85%] text-lg leading-snug text-[#ece7dd]`}>{video.title}</span>
            </div>
          )}
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <span className={`${styles.mono} text-[10px] text-[#f0a65a]`}>{index !== undefined ? `Scene ${String(index + 1).padStart(2, '0')}` : `EP.${ep}`}</span>
        <span className="h-px flex-1 bg-white/10" />
        <span className={`${styles.mono} text-[10px] text-[#7d858f]`}>{video.publishedAt.replaceAll('-', '.')}</span>
      </div>
      <h3 className="mt-2 text-base font-medium leading-snug text-[#ece7dd] transition group-hover:text-white">{video.title}</h3>
      <p className="mt-1.5 line-clamp-2 text-xs leading-6 text-[#8b939d]">{channel?.name} · {video.summary}</p>
    </Link>
  )
}
