import { readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
for (const name of ['shorts-studio-kit-v1.0.zip', 'auto-publish-kit-v1.0.zip']) {
  const body = readFileSync(`../jerry-ai-kits/dist/${name}`)
  const { error } = await db.storage.from('ai-lesson-downloads').upload(`kits/${name}`, body, { upsert: true, contentType: 'application/zip' })
  console.log(error ? `✗ ${name}: ${error.message}` : `✓ kits/${name} ${Math.round(body.length / 1024)} KB`)
}
// Copy-paste packs: JSON rendered by /pack/[slug] after a verified order.
for (const [src, dest] of [['packs/shorts-script-pack/pack.json', 'packs/shorts-script-pack-v1.json']]) {
  const body = readFileSync(`../jerry-ai-kits/${src}`)
  JSON.parse(body.toString('utf8'))
  const { error } = await db.storage.from('ai-lesson-downloads').upload(dest, body, { upsert: true, contentType: 'application/json' })
  console.log(error ? `✗ ${dest}: ${error.message}` : `✓ ${dest} ${Math.round(body.length / 1024)} KB`)
}
