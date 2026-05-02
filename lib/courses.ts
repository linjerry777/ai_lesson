// Multi-product registry for the ai_lesson platform.
//
// Each entry maps a `productSlug` (e.g. "claude-code") to its course content
// + the env-var names that hold the Stripe price IDs for each tier.
//
// Adding a new product:
//   1. Author lessons in `lib/<product>-data.ts`
//   2. Add an entry below
//   3. Set the matching env vars on Vercel (and in `.env.local`)
//   4. Done — checkout + dashboard pick it up automatically.

import {
  lessons as claudeCodeLessons,
  COURSE_TITLE as claudeCodeTitle,
  COURSE_SUBTITLE as claudeCodeSubtitle,
  type Lesson,
} from './course-data'

export type Tier = 'self' | 'cohort'

export interface Course {
  slug: string
  title: string
  subtitle: string
  lessons: Lesson[]
  /** Env var name that stores the Stripe price id for each tier. */
  stripePriceEnv: Record<Tier, string>
}

export const courses = {
  'claude-code': {
    slug: 'claude-code',
    title: claudeCodeTitle,
    subtitle: claudeCodeSubtitle,
    lessons: claudeCodeLessons,
    stripePriceEnv: {
      // Back-compat: the original `STRIPE_PRICE_ID` env still drives the
      // self-serve tier so existing deployments keep working with no change.
      self: 'STRIPE_PRICE_ID',
      cohort: 'STRIPE_PRICE_ID_CC_COHORT',
    },
  },
} satisfies Record<string, Course>

export type ProductSlug = keyof typeof courses

export const DEFAULT_PRODUCT: ProductSlug = 'claude-code'
export const DEFAULT_TIER: Tier = 'self'

export function getCourse(slug: string | null | undefined): Course | null {
  if (!slug) return null
  return slug in courses ? courses[slug as ProductSlug] : null
}

/** Resolve the Stripe price id for the given product/tier from env vars. */
export function resolveStripePriceId(
  slug: string,
  tier: Tier,
): { priceId: string; envKey: string } | null {
  const course = getCourse(slug)
  if (!course) return null
  const envKey = course.stripePriceEnv[tier]
  const raw = process.env[envKey]
  const trimmed = raw?.trim()
  if (!trimmed) return null
  return { priceId: trimmed, envKey }
}

export function isValidProduct(slug: string | null | undefined): slug is ProductSlug {
  return !!slug && slug in courses
}

export function isValidTier(t: string | null | undefined): t is Tier {
  return t === 'self' || t === 'cohort'
}
