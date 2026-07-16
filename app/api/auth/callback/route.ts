import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { normalizeRedirectPath } from '@/lib/safe-redirect'
import { PLATFORM_APP_ID } from '@/lib/platform'
import { claimExternalEntitlements } from '@/lib/external-entitlements'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = normalizeRedirectPath(searchParams.get('next'))

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const { error: membershipError } = await supabase.rpc('platform_register_app', {
        target_app_id: PLATFORM_APP_ID,
      })
      if (membershipError) {
        console.error('[auth/callback] platform membership sync failed:', membershipError)
      }
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user?.email) {
        try {
          await claimExternalEntitlements(user.id, user.email)
        } catch (claimError) {
          // External order sync can recover on the next dashboard visit and
          // must not turn a valid OAuth login into a failed callback.
          console.error('[auth/callback] external entitlement sync failed:', claimError)
        }
      }
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}
