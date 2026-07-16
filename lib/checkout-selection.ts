import {
  DEFAULT_PRODUCT,
  DEFAULT_TIER,
  getCourse,
  isValidProduct,
  isValidTier,
  type Course,
  type ProductSlug,
  type Tier,
} from '@/lib/courses'

export interface CheckoutSelection {
  productId: ProductSlug
  tier: Tier
  course: Course
}

export function resolveCheckoutSelection(
  rawProduct: string | null | undefined,
  rawTier: string | null | undefined,
): CheckoutSelection {
  const productId = isValidProduct(rawProduct) ? rawProduct : DEFAULT_PRODUCT
  const tier = isValidTier(rawTier) ? rawTier : DEFAULT_TIER
  const course = getCourse(productId)

  if (!course) {
    throw new Error(`Course registry is missing ${productId}`)
  }

  return { productId, tier, course }
}
