// Upload every free resource listed in content/free/*.json to the private
// `ai-lesson-downloads` bucket. Source files live in course-resources/free/<path>.
//
//   node --env-file=.env.local scripts/upload-free-resources.mjs [--dry-run]

import { readdirSync, readFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'

const BUCKET = 'ai-lesson-downloads'
const dryRun = process.argv.includes('--dry-run')
const root = process.cwd()
const contentDir = path.join(root, 'content', 'free')
const sourceDir = path.join(root, 'course-resources', 'free')

const TYPES = { '.md': 'text/markdown; charset=utf-8', '.zip': 'application/zip', '.pdf': 'application/pdf', '.json': 'application/json' }

const resources = readdirSync(contentDir).filter(name => name.endsWith('.json'))
  .map(name => JSON.parse(readFileSync(path.join(contentDir, name), 'utf8')))

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!dryRun && (!url || !key)) throw new Error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required')
const db = dryRun ? null : createClient(url, key, { auth: { persistSession: false } })

let failed = false
for (const resource of resources) {
  const objectPath = resource.file?.path
  const local = path.join(sourceDir, objectPath ?? '')
  if (!objectPath || !local.startsWith(sourceDir) || !existsSync(local)) {
    console.error(`✗ ${resource.slug}: missing source file course-resources/free/${objectPath}`)
    failed = true
    continue
  }
  const contentType = TYPES[path.extname(local).toLowerCase()] ?? 'application/octet-stream'
  if (dryRun) { console.log(`• ${resource.slug}: would upload ${objectPath} (${contentType})`); continue }
  const { error } = await db.storage.from(BUCKET).upload(objectPath, readFileSync(local), { upsert: true, contentType })
  if (error) { console.error(`✗ ${resource.slug}: ${error.message}`); failed = true } else console.log(`✓ ${resource.slug}: ${objectPath}`)
}
if (failed) process.exit(1)
