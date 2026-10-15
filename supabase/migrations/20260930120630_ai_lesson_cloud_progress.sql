-- Prepared locally. Apply only to the verified AI Lesson project after review.
-- No change to shared purchases grants, policies or other applications.
create table public.ai_lesson_progress (
  app_id text not null default 'ai-lesson' check (app_id = 'ai-lesson'),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id text not null,
  lesson_id text not null,
  completed boolean not null default false,
  last_opened_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (app_id, user_id, product_id, lesson_id),
  check (
    (product_id = 'starter-free' and lesson_id = any(array['start00','start01','start02','start03'])) or
    (product_id = 'claude-code' and lesson_id = any(array['ch00','ch01','ch02','ch03','ch04','ch05','ch06','ch07'])) or
    (product_id = 'codex-remotion' and lesson_id = any(array['cr00','cr01','cr02','cr03','cr04','cr05','cr06','cr07','cr08']))
  )
);
alter table public.ai_lesson_progress enable row level security;
revoke all on public.ai_lesson_progress from anon, authenticated;
grant select, insert, update on public.ai_lesson_progress to authenticated;

create policy learner_progress_read on public.ai_lesson_progress for select to authenticated
using (app_id = 'ai-lesson' and user_id = (select auth.uid()));
create policy learner_progress_insert on public.ai_lesson_progress for insert to authenticated
with check (app_id = 'ai-lesson' and user_id = (select auth.uid()) and (
  product_id = 'starter-free' or exists (
    select 1 from public.purchases p where p.app_id = 'ai-lesson' and p.user_id = (select auth.uid())
      and p.product_id = ai_lesson_progress.product_id and p.status = 'completed'
  )
));
create policy learner_progress_update on public.ai_lesson_progress for update to authenticated
using (app_id = 'ai-lesson' and user_id = (select auth.uid()))
with check (app_id = 'ai-lesson' and user_id = (select auth.uid()) and (
  product_id = 'starter-free' or exists (
    select 1 from public.purchases p where p.app_id = 'ai-lesson' and p.user_id = (select auth.uid())
      and p.product_id = ai_lesson_progress.product_id and p.status = 'completed'
  )
));

-- Atomic per-lesson updates avoid replacing another tab/device's whole course.
-- Invoker security and RLS remain in effect; no user ID accepted from the caller.
create function public.ai_lesson_save_progress(target_product text, target_lesson text,
  target_completed boolean default null, target_opened boolean default false)
returns setof public.ai_lesson_progress language sql security invoker set search_path = '' as $$
  insert into public.ai_lesson_progress as p (app_id, user_id, product_id, lesson_id, completed, last_opened_at)
  values ('ai-lesson', auth.uid(), target_product, target_lesson, coalesce(target_completed, false),
    case when target_opened then now() else null end)
  on conflict (app_id, user_id, product_id, lesson_id) do update set
    completed = coalesce(target_completed, p.completed),
    last_opened_at = case when target_opened then now() else p.last_opened_at end,
    updated_at = now()
  returning *;
$$;
revoke all on function public.ai_lesson_save_progress(text,text,boolean,boolean) from public, anon;
grant execute on function public.ai_lesson_save_progress(text,text,boolean,boolean) to authenticated;
