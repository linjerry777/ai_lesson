import { redirect } from 'next/navigation'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { FREE_PRODUCT, getCourse, type Tier } from '@/lib/courses'
import CoursePage, { type CourseOption } from './CoursePage'
import { PLATFORM_APP_ID } from '@/lib/platform'
import { claimExternalEntitlements } from '@/lib/external-entitlements'

interface PurchaseRow {
  id: string
  product_id?: string | null
  tier?: Tier | null
}

interface DashboardPageProps {
  searchParams?: Promise<{
    course?: string
  }>
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const query = await searchParams
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  if (user.email) {
    try {
      await claimExternalEntitlements(user.id, user.email)
    } catch (error) {
      // Existing purchases and the free primer should remain available even
      // when the external order bridge is temporarily unavailable.
      console.error('[dashboard] external entitlement sync failed:', error)
    }
  }

  const serviceClient = createServiceClient()
  const { data: purchases } = await serviceClient
    .from('purchases')
    .select('id, product_id, tier')
    .eq('app_id', PLATFORM_APP_ID)
    .eq('user_id', user.id)
    .eq('status', 'completed')
    .order('created_at', { ascending: false })

  const seen = new Set<string>()
  const courses: CourseOption[] = []
  const starterCourse = getCourse(FREE_PRODUCT)

  if (starterCourse) {
    seen.add(starterCourse.slug)
    courses.push({
      slug: starterCourse.slug,
      title: starterCourse.title,
      lessons: starterCourse.lessons,
      tier: 'free',
    })
  }

  for (const purchase of (purchases ?? []) as PurchaseRow[]) {
    const course = getCourse(purchase.product_id)
    if (!course || seen.has(course.slug)) continue

    seen.add(course.slug)
    courses.push({
      slug: course.slug,
      title: course.title,
      lessons: course.lessons,
      tier: purchase.tier ?? 'self',
    })
  }

  if (!courses.length) redirect('/#pricing')

  return (
    <CoursePage
      userEmail={user.email ?? ''}
      courses={courses}
      initialCourseSlug={query?.course}
    />
  )
}
