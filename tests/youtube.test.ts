import { describe, expect, it } from 'vitest'
import { ago, parseFeed } from '@/lib/youtube'

const FEED = `<feed><entry><yt:videoId>abc123DEF45</yt:videoId><title>麻糬 &amp; 小麻糬</title><published>2026-10-21T03:00:00+00:00</published><media:statistics views="1150"/></entry>
<entry><yt:videoId>zzz</yt:videoId><title>second</title><published>2026-10-20T03:00:00+00:00</published></entry></feed>`

describe('youtube feed', () => {
  it('parses entries with decoded titles, views and thumbnails', () => {
    const [first, second] = parseFeed(FEED)
    expect(first).toMatchObject({ id: 'abc123DEF45', title: '麻糬 & 小麻糬', views: 1150, url: 'https://www.youtube.com/watch?v=abc123DEF45' })
    expect(first.thumb).toContain('abc123DEF45')
    expect(second.views).toBeNull()
  })
  it('respects the limit and survives junk', () => {
    expect(parseFeed(FEED, 1)).toHaveLength(1)
    expect(parseFeed('not xml')).toEqual([])
  })
  it('formats relative time', () => {
    const now = Date.parse('2026-10-21T06:00:00Z')
    expect(ago('2026-10-21T03:00:00Z', now)).toBe('3 小時前')
    expect(ago('2026-10-18T03:00:00Z', now)).toBe('3 天前')
  })
})
