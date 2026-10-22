// Real test runs shown on product pages ("實測成果"). The data file is generated from the
// test logs in the private kits repo (excerpts only) by scripts in that repo.
import data from '@/content/showcase.json'

export interface ShowcaseBlock {
  label: string
  text?: string
  images?: { src: string; alt: string }[]
  video?: { src: string; poster: string }
  /** Span both columns. */
  wide?: boolean
}
export interface ShowcaseScenario {
  title: string
  setup: string
  blocks: ShowcaseBlock[]
}

const SHOWCASE = data as Record<string, ShowcaseScenario[]>

export function showcaseFor(slug: string): ShowcaseScenario[] {
  return SHOWCASE[slug] ?? []
}
