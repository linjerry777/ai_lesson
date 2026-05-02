// One-off migration runner: applies a .sql file via the Vercel-Supabase
// pooled connection string (POSTGRES_URL_NON_POOLING).
//
// Usage:
//   node scripts/run-migration.mjs scripts/migrations/<file>.sql
//
// Reads connection from .env.vercel.local (preferred) or .env.local.

import { readFileSync } from 'node:fs'
import { config } from 'dotenv'
import pg from 'pg'

// Load env (vercel pulled file first, then fallbacks)
for (const path of ['.env.vercel.local', '.env.local']) {
  try { config({ path, override: false }) } catch {}
}

const sqlFile = process.argv[2]
if (!sqlFile) { console.error('usage: node scripts/run-migration.mjs <file.sql>'); process.exit(2) }

// Prefer the pooled URL — it has `?supa=base-pooler.x` which Supavisor needs
// for tenant routing. The non-pooling URL on port 5432 also goes through
// Supavisor but without that hint and rejects with "tenant not found".
const rawConn =
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.DATABASE_URL
if (!rawConn) { console.error('no POSTGRES_URL in env'); process.exit(2) }

// Strip sslmode from the URL — newer pg parser hard-promotes "require" to
// "verify-full" which rejects Supabase's CA chain. We re-set ssl below.
// Keep `options` (Supavisor needs it for tenant routing).
const url = new URL(rawConn)
url.searchParams.delete('sslmode')
const connectionString = url.toString()

const sql = readFileSync(sqlFile, 'utf8')
console.log(`[migrate] applying ${sqlFile} (${sql.split('\n').length} lines)`)

const client = new pg.Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
})
await client.connect()
try {
  await client.query(sql)
  console.log('[migrate] success')
} catch (e) {
  console.error('[migrate] FAIL:', e.message)
  process.exitCode = 1
} finally {
  await client.end()
}
