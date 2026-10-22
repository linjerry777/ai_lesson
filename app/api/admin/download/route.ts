import { NextRequest, NextResponse } from 'next/server'
import { currentAdmin } from '@/lib/admin-session'
import { DOWNLOAD_BUCKET } from '@/lib/leads'
import { findProduct } from '@/lib/products'
import { createServiceClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** GET /api/admin/download?item=slug → 303 to a 10-minute signed URL. Admins only; not counted as an order. */
export async function GET(request: NextRequest) {
  if (!(await currentAdmin())) return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  const file = findProduct(request.nextUrl.searchParams.get('item') ?? '')?.file
  if (!file) return NextResponse.json({ error: 'not found' }, { status: 404 })
  const { data, error } = await createServiceClient().storage.from(DOWNLOAD_BUCKET).createSignedUrl(file.path, 600, { download: file.downloadName })
  if (error || !data?.signedUrl) return NextResponse.json({ error: 'unavailable' }, { status: 503 })
  return NextResponse.redirect(data.signedUrl, 303)
}
