import { redirect } from 'next/navigation'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import CoursePage from './CoursePage'
import { PLATFORM_APP_ID } from '@/lib/platform'
import { claimExternalEntitlements } from '@/lib/external-entitlements'
import { getLearnerCourses } from '@/lib/learner-access'
import { stripeIsLive } from '@/lib/stripe'

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

  if (user.email && user.email_confirmed_at) {
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
    .select('id, product_id, tier, stripe_session_id')
    .eq('app_id', PLATFORM_APP_ID)
    .eq('user_id', user.id)
    .eq('status', 'completed')
    .order('created_at', { ascending: false })

  const courses = getLearnerCourses(purchases ?? [], stripeIsLive())

  if (!courses.length) redirect('/#pricing')

  return (
    <CoursePage
      key={user.id}
      userId={user.id}
      userEmail={user.email ?? ''}
      courses={courses}
      cloudProgressEnabled={process.env.AI_LESSON_CLOUD_PROGRESS_ENABLED === 'true'}
      initialCourseSlug={query?.course}
    />
  )
}
