import type { Metadata } from 'next'
import VideoCard from '@/components/site/VideoCard'
import { Kicker, Lede, PageTitle } from '@/components/site/ui'
import { getPublishedVideos } from '@/lib/content'
import { SITE } from '@/lib/site'

export const metadata: Metadata = {
  title: `影片筆記 | ${SITE.name}`,
  description: '每支影片的重點整理、可直接複製的 prompt 與工具清單。',
  alternates: { canonical: '/videos' },
}

export default function VideosPage() {
  const videos = getPublishedVideos()
  return (
    <main className="px-4 pb-28 pt-16 sm:px-8 sm:pt-24">
      <div className="mx-auto max-w-[1200px]">
        <Kicker color="#f5a524">NOTES / ALL EPISODES</Kicker>
        <PageTitle>影片筆記</PageTitle>
        <Lede>看完影片想照著做？每一支都整理好重點、可直接複製的 prompt 和用到的工具。</Lede>
        {videos.length ? (
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map(video => <VideoCard key={video.slug} video={video} />)}
          </div>
        ) : (
          <p className="mt-14 text-sm text-[var(--ink-2)]">影片筆記整理中。</p>
        )}
      </div>
    </main>
  )
}
