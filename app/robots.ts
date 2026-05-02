import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ailesson-two.vercel.app'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // 學員專區與 callback 不需要被 index
        disallow: ['/api/', '/dashboard', '/auth/callback', '/success'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
