import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import assert from 'node:assert/strict'

const container = 'ai-lesson-verify-20260930'
const inspect = JSON.parse(execFileSync('docker', ['inspect', container], { encoding: 'utf8' }))[0]
assert.equal(inspect.HostConfig.NetworkMode, 'none')
assert.equal(Object.keys(inspect.HostConfig.PortBindings ?? {}).length, 0)
const sql = (query, database = 'lesson_verify') => execFileSync('docker', ['exec', '-i', container, 'psql', '-U', 'postgres', '-d', database, '-v', 'ON_ERROR_STOP=1', '-At'], { input: query, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim()
const actor = (uid, query) => sql(`set role authenticated; select set_config('request.jwt.claim.sub','${uid}',false); ${query}`)
const a = '11111111-1111-4111-8111-111111111111', b = '22222222-2222-4222-8222-222222222222'
if (!sql("select 1 from pg_database where datname='lesson_verify'", 'postgres')) {
  sql('create database lesson_verify', 'postgres')
  sql(readFileSync('tests/fixtures/lesson-local.sql', 'utf8'))
  sql(readFileSync('supabase/migrations/20260930120630_ai_lesson_cloud_progress.sql', 'utf8'))
}
if (!sql("select 1 from pg_roles where rolname='service_role'")) sql('create role service_role nologin bypassrls; grant all on public.purchases to service_role')
if (!sql("select to_regclass('public.ai_lesson_payment_revocations')")) sql(readFileSync('supabase/migrations/20260930123002_ai_lesson_payment_events.sql', 'utf8'))
const results = []
function denied(name, action) {
  let error
  try { action() } catch (caught) { error = caught }
  assert.ok(error, `${name} must be denied`)
  results.push({ test: name, passed: true })
}
// Only synthetic rows in the dedicated, isolated fixture database.
sql('truncate public.ai_lesson_progress, public.purchases, public.ai_lesson_payment_revocations')
actor(a, "select * from public.ai_lesson_save_progress('starter-free','start00',true,true)")
actor(a, "select * from public.ai_lesson_save_progress('starter-free','start00',null,true)")
assert.equal(actor(a, "select completed from public.ai_lesson_progress where lesson_id='start00'").split('\n').at(-1), 't')
results.push({ test: 'open does not erase completion; repeated saves keep one row', passed: true })
assert.equal(sql('select count(*) from public.ai_lesson_progress'), '1')
actor(a, "select * from public.ai_lesson_save_progress('starter-free','start00',false,false)")
assert.equal(sql('select completed from public.ai_lesson_progress'), 'f')
results.push({ test: 'un-completion persists and reads back', passed: true })
denied('unbought paid course', () => actor(a, "select * from public.ai_lesson_save_progress('claude-code','ch00',true,true)"))
denied('learner cannot forge purchases', () => actor(a, `insert into purchases(app_id,user_id,stripe_session_id) values('ai-lesson','${a}','cs_test_forged')`))
sql(`insert into purchases(app_id,user_id,stripe_session_id,stripe_payment_intent,amount,currency,product_id,tier) values('ai-lesson','${a}','cs_test_db','pi_db',99000,'twd','claude-code','self')`)
actor(a, "select * from public.ai_lesson_save_progress('claude-code','ch00',true,true)")
assert.equal(actor(b, 'select count(*) from public.purchases').split('\n').at(-1), '0')
assert.equal(actor(b, 'select count(*) from public.ai_lesson_progress').split('\n').at(-1), '0')
results.push({ test: 'paid owner allowed; second user reads neither purchase nor progress', passed: true })
denied('user reassignment', () => actor(a, `update public.ai_lesson_progress set user_id='${b}'`))
denied('another user row injection', () => actor(b, `insert into public.ai_lesson_progress(user_id,product_id,lesson_id) values('${a}','starter-free','start01')`))
denied('unknown lesson', () => actor(a, "select * from public.ai_lesson_save_progress('starter-free','ch00',true,true)"))
denied('anon progress API', () => sql("set role anon; select * from public.ai_lesson_save_progress('starter-free','start00',true,true)"))
denied('other app scope', () => actor(a, `insert into public.ai_lesson_progress(app_id,user_id,product_id,lesson_id) values('other-app','${a}','starter-free','start02')`))
sql("update purchases set status='refunded' where stripe_session_id='cs_test_db'")
denied('revoked purchase cannot write paid progress', () => actor(a, "select * from public.ai_lesson_save_progress('claude-code','ch00',true,true)"))
denied('learner cannot invoke payment fulfillment', () => actor(a, `select * from public.ai_lesson_fulfill_payment('${a}','cs_test_fake','pi_fake',99000,'twd','claude-code','self',false)`))
denied('learner cannot access revocation ledger', () => actor(a, 'select * from public.ai_lesson_payment_revocations'))
const fulfill = (id, intent) => `select * from public.ai_lesson_fulfill_payment('${a}','${id}','${intent}',99000,'twd','claude-code','self',false)`
sql("set role service_role; select public.ai_lesson_revoke_payment('pi_early',false,'refunded','evt_early')")
assert.equal(sql(`set role service_role; ${fulfill('cs_test_early','pi_early')}`).split('|').at(-1), 'refunded')
assert.equal(sql(`set role service_role; ${fulfill('cs_test_early','pi_early')}`).split('|').at(-1), 'refunded')
results.push({ test: 'refund before checkout and duplicate checkout never restore access', passed: true })
sql(`set role service_role; ${fulfill('cs_test_late','pi_late')}`)
sql("set role service_role; select public.ai_lesson_revoke_payment('pi_late',false,'disputed','evt_late')")
assert.equal(sql(`set role service_role; ${fulfill('cs_test_late','pi_late')}`).split('|').at(-1), 'disputed')
results.push({ test: 'dispute after checkout remains revoked on duplicate', passed: true })
denied('immutable purchase owner conflict', () => sql(`set role service_role; select * from public.ai_lesson_fulfill_payment('${b}','cs_test_late','pi_late',99000,'twd','claude-code','self',false)`))
console.log(JSON.stringify({ boundary: 'isolated local PostgreSQL; synthetic auth.uid and users; no cloud writes', container, migrationAppliedToCloud: false, results }, null, 2))
