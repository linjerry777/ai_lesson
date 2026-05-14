import { redirect } from 'next/navigation'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { DEFAULT_PRODUCT, getCourse, type Tier } from '@/lib/courses'
import CoursePage, { type CourseOption } from './CoursePage'

interface PurchaseRow {
  id: string
  product_id?: string | null
  tier?: Tier | null
}

export default async function DashboardPage() {
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

  if (!purchases?.length) redirect('/#pricing')

  const seen = new Set<string>()
  const courses: CourseOption[] = []

  for (const purchase of purchases as PurchaseRow[]) {
    const course = getCourse(purchase.product_id) ?? getCourse(DEFAULT_PRODUCT)
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

  return <CoursePage userEmail={user.email ?? ''} courses={courses} />
}
