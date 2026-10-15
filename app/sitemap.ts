import type { MetadataRoute } from 'next'
import { getPublishedResources, getPublishedVideos } from '@/lib/content'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ailesson-two.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const videos = getPublishedVideos().map(video => ({
    url: `${SITE_URL}/videos/${video.slug}`, lastModified: new Date(video.publishedAt), changeFrequency: 'monthly' as const, priority: 0.8,
  }))
  const resources = getPublishedResources().map(resource => ({
    url: `${SITE_URL}/free/${resource.slug}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7,
  }))
  return [
    { url: `${SITE_URL}/videos`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/free`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    ...videos,
    ...resources,
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/refund`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/login`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/market`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]
}
