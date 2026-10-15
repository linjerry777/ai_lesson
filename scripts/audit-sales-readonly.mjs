import { readFileSync } from 'node:fs'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

// Outputs only presence, provider status and aggregate counts. Never dump errors/keys/users.
const values = Object.fromEntries(readFileSync('.env.local', 'utf8').split(/\r?\n/).filter(line => /^[A-Z_]+=/.test(line)).map(line => {
  const i = line.indexOf('=')
  return [line.slice(0, i), line.slice(i + 1).trim().replace(/^['"]|['"]$/g, '')]
}))
const db = createClient(values.NEXT_PUBLIC_SUPABASE_URL, values.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
const report = { boundary: 'read-only; no Checkout/charge/account creation/database writes', supabaseHost: new URL(values.NEXT_PUBLIC_SUPABASE_URL).hostname }
const settings = await fetch(`${values.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/settings`, { headers: { apikey: values.NEXT_PUBLIC_SUPABASE_ANON_KEY } })
const auth = settings.ok ? await settings.json() : null
report.auth = { httpStatus: settings.status, google: auth?.external?.google ?? null }
for (const [table, status] of [['purchases', null], ['ai_lesson_external_entitlements', 'pending'], ['ai_lesson_external_entitlements', 'claimed']]) {
  let query = db.from(table).select('id', { count: 'exact', head: true }).eq('app_id', 'ai-lesson')
  if (status) query = query.eq('status', status)
  const result = await query
  report[`${table}:${status ?? 'all'}`] = { count: result.error ? null : result.count, errorCode: result.error?.code ?? null }
}
report.stripe = { testKey: values.STRIPE_SECRET_KEY?.startsWith('sk_test_') ?? false }
if (report.stripe.testKey) {
  try {
    const stripe = new Stripe(values.STRIPE_SECRET_KEY)
    const account = await stripe.accounts.retrieve()
    report.stripe.account = { id: account.id, country: account.country, chargesEnabled: account.charges_enabled }
    for (const name of ['STRIPE_PRICE_ID', 'STRIPE_PRICE_ID_CODEX_REMOTION']) {
      if (!values[name]) { report.stripe[name] = { configured: false }; continue }
      const price = await stripe.prices.retrieve(values[name])
      report.stripe[name] = { id: price.id, active: price.active, currency: price.currency, unitAmount: price.unit_amount, livemode: price.livemode }
    }
  } catch (error) { report.stripe.error = { type: error.type ?? 'request_error', code: error.code ?? null, status: error.statusCode ?? null } }
}
report.webhookSecretPresent = Boolean(values.STRIPE_WEBHOOK_SECRET)
console.log(JSON.stringify(report, null, 2))
