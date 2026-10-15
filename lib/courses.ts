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
import {
  lessons as codexRemotionLessons,
  COURSE_TITLE as codexRemotionTitle,
  COURSE_SUBTITLE as codexRemotionSubtitle,
} from './codex-remotion-data'
import {
  lessons as starterLessons,
  COURSE_TITLE as starterTitle,
  COURSE_SUBTITLE as starterSubtitle,
} from './starter-course-data'

export type Tier = 'self' | 'cohort'

export interface Course {
  slug: string
  title: string
  subtitle: string
  lessons: Lesson[]
  isFree?: boolean
  sale?: {
    currency: 'twd'
    amountMinor: number
    displayPrice: string
    format: 'text'
    prerequisites: string[]
    deliverables: string[]
    excluded: string[]
  }
  /** Env var name that stores the Stripe price id for each tier. */
  stripePriceEnv?: Record<Tier, string>
}

export const courses = {
  'starter-free': {
    slug: 'starter-free',
    title: starterTitle,
    subtitle: starterSubtitle,
    lessons: starterLessons,
    isFree: true,
  },
  'claude-code': {
    slug: 'claude-code',
    title: claudeCodeTitle,
    subtitle: claudeCodeSubtitle,
    lessons: claudeCodeLessons,
    sale: {
      currency: 'twd', amountMinor: 99000, displayPrice: 'NT$990', format: 'text',
      prerequisites: ['能操作終端機與 Git', '能讀基本 TypeScript 與錯誤訊息'],
      deliverables: ['8 章文字實作與逐章練習', '網站、Google 登入、Sandbox 付款與學員權限', '部署驗收與第二個產品交接清單'],
      excluded: ['影片授課', '一對一指導或 cohort 服務', 'Claude 訂閱、API、主機或其他第三方費用', '收益或完成時間保證'],
    },
    stripePriceEnv: {
      // Back-compat: the original `STRIPE_PRICE_ID` env still drives the
      // self-serve tier so existing deployments keep working with no change.
      self: 'STRIPE_PRICE_ID',
      cohort: 'STRIPE_PRICE_ID_CC_COHORT',
    },
  },
  'codex-remotion': {
    slug: 'codex-remotion',
    title: codexRemotionTitle,
    subtitle: codexRemotionSubtitle,
    lessons: codexRemotionLessons,
    sale: {
      currency: 'twd', amountMinor: 149000, displayPrice: 'NT$1,490', format: 'text',
      prerequisites: ['能操作 Node、Git 與本機檔案', '理解基本 React 與 JSON'],
      deliverables: ['9 章文字實作與逐章練習', '可重建的原創文字動畫、JSX、JSON 與驗證器練習包', '影片 QC 與手動交付清單'],
      excluded: ['影片授課', '付費圖像、TTS、模型或 render 額度', '頻道代營運與自動發布', '第三方代理的授權或可用性保證'],
    },
    stripePriceEnv: {
      self: 'STRIPE_PRICE_ID_CODEX_REMOTION',
      cohort: 'STRIPE_PRICE_ID_CODEX_REMOTION_COHORT',
    },
  },
} satisfies Record<string, Course>

export type ProductSlug = keyof typeof courses

export const DEFAULT_PRODUCT: ProductSlug = 'claude-code'
export const FREE_PRODUCT: ProductSlug = 'starter-free'
export const DEFAULT_TIER: Tier = 'self'

export function getCourse(slug: string | null | undefined): Course | null {
  if (!slug) return null
  return Object.hasOwn(courses, slug) ? courses[slug as ProductSlug] : null
}

/** Resolve the Stripe price id for the given product/tier from env vars. */
export function resolveStripePriceId(
  slug: string,
  tier: Tier,
): { priceId: string; envKey: string } | null {
  const course = getCourse(slug)
  if (!course) return null
  if (course.isFree || !course.stripePriceEnv) return null
  const envKey = course.stripePriceEnv[tier]
  const raw = process.env[envKey]
  const trimmed = raw?.trim()
  if (!trimmed) return null
  return { priceId: trimmed, envKey }
}

export function isValidProduct(slug: string | null | undefined): slug is ProductSlug {
  return !!slug && Object.hasOwn(courses, slug)
}

/** Only the published self-study offer is for sale; cohort has no promised service. */
export function getSaleOffer(slug: string, tier: Tier) {
  return tier === 'self' ? getCourse(slug)?.sale ?? null : null
}

export function isValidTier(t: string | null | undefined): t is Tier {
  return t === 'self' || t === 'cohort'
}
