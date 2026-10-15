-- AI Lesson content hub: email leads, short-link clicks, private download bucket.
-- Additive only: new ai_lesson_* objects; no change to shared tables, grants or other apps.
-- All access is server-side through the service role; anon/authenticated get nothing.

create table if not exists public.ai_lesson_leads (
  id uuid primary key default gen_random_uuid(),
  app_id text not null default 'ai-lesson' check (app_id = 'ai-lesson'),
  email text not null check (email = lower(email) and length(email) <= 254 and email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  resource_slug text not null check (resource_slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(resource_slug) <= 80),
  video_code text check (video_code ~ '^[a-z0-9]{1,16}$'),
  utm_source text check (utm_source ~ '^[a-z0-9._-]{1,64}$'),
  utm_medium text check (utm_medium ~ '^[a-z0-9._-]{1,64}$'),
  utm_campaign text check (utm_campaign ~ '^[a-z0-9._-]{1,64}$'),
  utm_content text check (utm_content ~ '^[a-z0-9._-]{1,64}$'),
  landing_path text check (length(landing_path) <= 200),
  consent_text text not null check (length(consent_text) between 10 and 500),
  consented_at timestamptz not null default now(),
  download_count integer not null default 1 check (download_count >= 1),
  unsubscribed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (app_id, email, resource_slug)
);
create index if not exists ai_lesson_leads_video_idx on public.ai_lesson_leads (video_code) where video_code is not null;

create table if not exists public.ai_lesson_clicks (
  id bigint generated always as identity primary key,
  app_id text not null default 'ai-lesson' check (app_id = 'ai-lesson'),
  video_code text not null check (video_code ~ '^[a-z0-9]{1,16}$'),
  utm_source text check (utm_source ~ '^[a-z0-9._-]{1,64}$'),
  utm_campaign text check (utm_campaign ~ '^[a-z0-9._-]{1,64}$'),
  created_at timestamptz not null default now()
);
create index if not exists ai_lesson_clicks_video_idx on public.ai_lesson_clicks (video_code, created_at);

alter table public.ai_lesson_leads enable row level security;
alter table public.ai_lesson_clicks enable row level security;
revoke all on public.ai_lesson_leads, public.ai_lesson_clicks from public, anon, authenticated;
grant select, insert, update on public.ai_lesson_leads to service_role;
grant select, insert on public.ai_lesson_clicks to service_role;

-- First touch wins for attribution; repeat downloads only bump the counter.
create or replace function public.ai_lesson_capture_lead(
  target_email text, target_resource text, target_consent text,
  target_video text default null, target_source text default null, target_medium text default null,
  target_campaign text default null, target_content text default null, target_landing text default null)
returns table(lead_id uuid, is_new boolean)
language sql security invoker set search_path = '' as $$
  insert into public.ai_lesson_leads as l (email, resource_slug, consent_text, video_code,
    utm_source, utm_medium, utm_campaign, utm_content, landing_path)
  values (lower(trim(target_email)), target_resource, target_consent, target_video,
    target_source, target_medium, target_campaign, target_content, target_landing)
  on conflict (app_id, email, resource_slug) do update set
    download_count = l.download_count + 1,
    consent_text = excluded.consent_text,
    consented_at = now(),
    unsubscribed_at = null,
    updated_at = now()
  returning l.id, (xmax = 0);
$$;

create or replace function public.ai_lesson_video_stats(since timestamptz default now() - interval '90 days')
returns table(video_code text, clicks bigint, leads bigint)
language sql stable security invoker set search_path = '' as $$
  with c as (
    select video_code, count(*) as clicks from public.ai_lesson_clicks
    where app_id = 'ai-lesson' and created_at >= since group by video_code
  ), l as (
    select video_code, count(*) as leads from public.ai_lesson_leads
    where app_id = 'ai-lesson' and video_code is not null and created_at >= since group by video_code
  )
  select coalesce(c.video_code, l.video_code), coalesce(c.clicks, 0), coalesce(l.leads, 0)
  from c full join l on l.video_code = c.video_code
  order by 2 desc, 3 desc;
$$;

revoke all on function public.ai_lesson_capture_lead(text,text,text,text,text,text,text,text,text) from public, anon, authenticated;
revoke all on function public.ai_lesson_video_stats(timestamptz) from public, anon, authenticated;
grant execute on function public.ai_lesson_capture_lead(text,text,text,text,text,text,text,text,text) to service_role;
grant execute on function public.ai_lesson_video_stats(timestamptz) to service_role;

-- Private bucket: objects are only reachable through short-lived signed URLs.
insert into storage.buckets (id, name, public, file_size_limit)
values ('ai-lesson-downloads', 'ai-lesson-downloads', false, 104857600)
on conflict (id) do update set public = false;
