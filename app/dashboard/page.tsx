import { redirect } from 'next/navigation'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { FREE_PRODUCT, getCourse, type Tier } from '@/lib/courses'
import CoursePage, { type CourseOption } from './CoursePage'

interface PurchaseRow {
  id: string
  product_id?: string | null
  tier?: Tier | null
}

interface DashboardPageProps {
  searchParams?: {
    course?: string
  }
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const serviceClient = createServiceClient()
  const { data: purchases } = await serviceClient
    .from('purchases')
    .select('id, product_id, tier')
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
      initialCourseSlug={searchParams?.course}
    />
  )
}
