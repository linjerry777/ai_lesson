import Channels from '@/components/home/Channels'
import FreeSection from '@/components/home/FreeSection'
import Hero from '@/components/home/Hero'
import Shop from '@/components/home/Shop'
import Studio from '@/components/home/Studio'
import Versus from '@/components/home/Versus'
import Workflow from '@/components/home/Workflow'
import { getPublishedResources, getPublishedVideos } from '@/lib/content'

export default function Home() {
  const notes = getPublishedVideos().slice(0, 3).map(v => ({ slug: v.slug, code: v.code, title: v.title, publishedAt: v.publishedAt }))
  const first = getPublishedResources()[0]
  const resource = first ? { slug: first.slug, title: first.title, summary: first.summary, format: first.format } : null
  return (
    <main>
      <Hero />
      <Versus />
      <Channels />
      <Workflow />
      <FreeSection notes={notes} resource={resource} />
      <Shop />
      <Studio />
    </main>
  )
}
