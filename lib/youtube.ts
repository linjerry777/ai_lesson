// Latest uploads from a channel's public YouTube RSS feed (no API key needed).
// Fetched on the server and cached for 30 minutes; a failed fetch returns [] so
// the page still renders.

export interface LatestVideo {
  id: string
  title: string
  publishedAt: string
  views: number | null
  url: string
  thumb: string
}

const decode = (text: string) =>
  text.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")

export function parseFeed(xml: string, limit = 3): LatestVideo[] {
  const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? []
  return entries.slice(0, limit).flatMap(entry => {
    const id = entry.match(/<yt:videoId>([^<]+)</)?.[1]
    const title = entry.match(/<title>([^<]*)</)?.[1]
    const publishedAt = entry.match(/<published>([^<]+)</)?.[1]
    if (!id || !title || !publishedAt) return []
    const views = entry.match(/views="(\d+)"/)?.[1]
    return [{
      id,
      title: decode(title),
      publishedAt,
      views: views ? Number(views) : null,
      url: `https://www.youtube.com/watch?v=${id}`,
      thumb: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    }]
  })
}

export async function latestVideos(channelId: string, limit = 3): Promise<LatestVideo[]> {
  try {
    const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`, { next: { revalidate: 1800 } })
    if (!res.ok) return []
    return parseFeed(await res.text(), limit)
  } catch {
    return []
  }
}

/** "3 小時前" / "2 天前" relative to `now`. */
export function ago(iso: string, now = Date.now()) {
  const hours = Math.max(0, (now - new Date(iso).getTime()) / 3_600_000)
  if (hours < 1) return '剛剛'
  if (hours < 24) return `${Math.floor(hours)} 小時前`
  return `${Math.floor(hours / 24)} 天前`
}

export const daysSince = (iso: string, now = Date.now()) => (now - new Date(iso).getTime()) / 86_400_000
