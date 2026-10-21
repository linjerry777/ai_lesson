import Channels, { type Feeds } from '@/components/home/Channels'
import FreeSection from '@/components/home/FreeSection'
import Hero from '@/components/home/Hero'
import Shop from '@/components/home/Shop'
import Studio from '@/components/home/Studio'
import Workflow from '@/components/home/Workflow'
import { getPublishedResources, getPublishedVideos } from '@/lib/content'
import { CODEX_CHANNELS, YOUTUBE_IDS } from '@/lib/site'
import { daysSince, latestVideos } from '@/lib/youtube'

// The match section reads the channels' YouTube feeds; rebuild at most every 30 minutes.
export const revalidate = 1800

async function loadFeeds(): Promise<Feeds> {
  const ids: [string, string][] = [...Object.entries(YOUTUBE_IDS), ...CODEX_CHANNELS.map(c => [c.key, c.youtubeId] as [string, string])]
  const results = await Promise.all(ids.map(([, id]) => latestVideos(id, 3)))
  return Object.fromEntries(ids.map(([key], i) => [key, results[i]]))
}

export default async function Home() {
  const notes = getPublishedVideos().slice(0, 3).map(v => ({ slug: v.slug, code: v.code, title: v.title, publishedAt: v.publishedAt }))
  const first = getPublishedResources()[0]
  const resource = first ? { slug: first.slug, title: first.title, summary: first.summary, format: first.format } : null
  const feeds = await loadFeeds()
  // eslint-disable-next-line react-hooks/purity -- server render time, refreshed by ISR
  const now = Date.now()
  const claudeToday = Object.keys(YOUTUBE_IDS).flatMap(key => feeds[key] ?? []).filter(v => daysSince(v.publishedAt, now) < 1).length
  const codexLatest = CODEX_CHANNELS.flatMap(c => feeds[c.key]?.slice(0, 1) ?? []).map(v => daysSince(v.publishedAt, now))
  const codexIdleDays = codexLatest.length ? Math.min(...codexLatest) : null
  return (
    <main>
      <Hero stats={{ claudeToday, codexIdleDays }} />
      <Channels feeds={feeds} now={now} />
      <FreeSection notes={notes} resource={resource} />
      <Shop />
      <Workflow />
      <Studio />
    </main>
  )
}
