import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/** POST: sign out and go back to the orders page (to sign in with another email). */
export async function POST(request: NextRequest) {
  await (await createClient()).auth.signOut()
  return NextResponse.redirect(new URL('/orders', request.url), 303)
}
