/**
 * Upload course videos to Supabase Storage (private bucket)
 * Usage: node scripts/upload-videos.mjs
 */
import { createClient } from '@supabase/supabase-js'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

// ── Read .env.local ──────────────────────────────────────────────────────────
function loadEnv() {
  const envPath = join(process.cwd(), '.env.local')
  if (!existsSync(envPath)) {
    console.error('.env.local not found — run from project root')
    process.exit(1)
  }
  const lines = readFileSync(envPath, 'utf8').split('\n')
  const env = {}
  for (const line of lines) {
    const match = line.match(/^([^#=]+)=(.*)$/)
    if (match) env[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '')
  }
  return env
}

const env = loadEnv()
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const BUCKET      = 'videos'
// Set VIDEO_DIR to the folder containing ch01/, ch02/, ... subfolders,
// each with an output.mp4 file. Example: '/path/to/AutoVideo/pipeline/2026-03-28'
const VIDEO_DIR   = process.env.VIDEO_DIR ?? './videos'
const CHAPTERS    = ['ch01', 'ch02', 'ch03', 'ch04', 'ch05', 'ch06', 'ch07']

async function main() {
  // Create private bucket (idempotent)
  const { error: bucketErr } = await supabase.storage.createBucket(BUCKET, { public: false })
  if (bucketErr && !bucketErr.message.includes('already exists')) {
    console.error('❌ Bucket error:', bucketErr.message); process.exit(1)
  }
  console.log(`✓ Bucket "${BUCKET}" ready\n`)

  for (const ch of CHAPTERS) {
    const filePath = join(VIDEO_DIR, ch, 'output.mp4')
    if (!existsSync(filePath)) {
      console.log(`⚠️  ${ch}: output.mp4 not found, skipping`)
      continue
    }

    const size = readFileSync(filePath).length
    console.log(`⬆  Uploading ${ch}.mp4 (${(size / 1024 / 1024).toFixed(1)} MB)...`)

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(`${ch}.mp4`, readFileSync(filePath), {
        contentType: 'video/mp4',
        upsert: true,
      })

    if (error) console.error(`❌ ${ch}:`, error.message)
    else       console.log(`✓  ${ch}.mp4 uploaded`)
  }

  console.log('\nDone!')
}

main()
