import { isAdminEmail } from '@/lib/admin'
import { createClient } from '@/lib/supabase/server'

/** The signed-in user when they are an admin (ADMIN_EMAILS), else null. Server-only. */
export async function currentAdmin() {
  const { data: { user } } = await (await createClient()).auth.getUser()
  return user && isAdminEmail(user.email, !!user.email_confirmed_at) ? user : null
}
