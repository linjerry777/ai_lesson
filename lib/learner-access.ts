import { FREE_PRODUCT, getCourse, isValidTier } from './courses'

export interface LearnerPurchase { product_id?: string | null; tier?: string | null; stripe_session_id?: string | null }

export function purchaseMatchesMode(sessionId: string | null | undefined, live: boolean) {
  return !!sessionId && (sessionId.startsWith('external:') || sessionId.startsWith(live ? 'cs_live_' : 'cs_test_'))
}

/** Caller must query completed purchases for the verified user and this app. */
export function getLearnerCourses(purchases: LearnerPurchase[], live: boolean) {
  const free = getCourse(FREE_PRODUCT)!
  const result = [{ slug: free.slug, title: free.title, lessons: free.lessons, tier: 'free' as 'free' | 'self' | 'cohort' }]
  const seen = new Set([free.slug])
  for (const purchase of purchases) {
    const course = getCourse(purchase.product_id)
    if (!course || seen.has(course.slug) || !isValidTier(purchase.tier) || !purchaseMatchesMode(purchase.stripe_session_id, live)) continue
    seen.add(course.slug)
    result.push({ slug: course.slug, title: course.title, lessons: course.lessons, tier: purchase.tier })
  }
  return result
}
