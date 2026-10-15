-- Local preparation only; apply to the verified AI Lesson database before enabling payments.
-- Uses existing shared purchases schema without changing its policies or grants.
create table public.ai_lesson_payment_revocations (
  app_id text not null default 'ai-lesson' check (app_id = 'ai-lesson'),
  payment_intent text primary key,
  livemode boolean not null,
  status text not null check (status in ('refunded','disputed')),
  event_id text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.ai_lesson_payment_revocations enable row level security;
revoke all on public.ai_lesson_payment_revocations from public, anon, authenticated;
grant select, insert, update on public.ai_lesson_payment_revocations to service_role;

-- Both functions take the same transaction lock. A refund arriving before a
-- checkout cannot be lost; a late/duplicate checkout cannot restore revoked access.
create function public.ai_lesson_revoke_payment(target_intent text, target_live boolean,
  target_status text, target_event text)
returns text language plpgsql security invoker set search_path = '' as $$
declare revoked_status text;
begin
  if target_intent is null or target_intent !~ '^pi_[A-Za-z0-9_]+$' or target_live is null or
    target_status is null or target_status not in ('refunded','disputed') or
    target_event is null or target_event !~ '^evt_[A-Za-z0-9_]+$' then
    raise exception 'Invalid payment revocation';
  end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('ai-lesson:' || target_intent, 0));
  if exists (select 1 from public.ai_lesson_payment_revocations where payment_intent=target_intent and livemode<>target_live) then
    raise exception 'Payment mode conflict';
  end if;
  insert into public.ai_lesson_payment_revocations as r (payment_intent,livemode,status,event_id)
  values (target_intent,target_live,target_status,target_event)
  on conflict(payment_intent) do update set
    status=case when r.status='disputed' or excluded.status='disputed' then 'disputed' else 'refunded' end,
    event_id=excluded.event_id, updated_at=now()
  returning status into revoked_status;
  update public.purchases set status=revoked_status,updated_at=now()
  where app_id='ai-lesson' and stripe_payment_intent=target_intent and status='completed';
  return revoked_status;
end;
$$;

create function public.ai_lesson_fulfill_payment(target_user uuid, target_session text, target_intent text,
  target_amount integer, target_currency text, target_product text, target_tier text, target_live boolean)
returns table(purchase_id uuid, purchase_status text)
language plpgsql security invoker set search_path = '' as $$
declare existing public.purchases%rowtype; final_status text;
begin
  if target_user is null or target_intent is null or target_intent !~ '^pi_[A-Za-z0-9_]+$' or
    target_live is null or target_session is null or target_session !~ '^cs_(test|live)_[A-Za-z0-9_]+$' or
    (target_live and target_session not like 'cs_live_%') or (not target_live and target_session not like 'cs_test_%') or
    target_currency is distinct from 'twd' or target_tier is distinct from 'self' or
    not ((target_product='claude-code' and target_amount=99000) or (target_product='codex-remotion' and target_amount=149000)) or
    target_product is null or target_amount is null then
    raise exception 'Invalid payment offer';
  end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('ai-lesson:' || target_intent, 0));
  select status into final_status from public.ai_lesson_payment_revocations
    where payment_intent=target_intent and livemode=target_live;
  final_status := coalesce(final_status,'completed');
  insert into public.purchases(app_id,user_id,stripe_session_id,stripe_payment_intent,amount,currency,status,product_id,tier)
    values('ai-lesson',target_user,target_session,target_intent,target_amount,target_currency,final_status,target_product,target_tier)
    on conflict(app_id,stripe_session_id) do nothing;
  select * into existing from public.purchases where app_id='ai-lesson' and stripe_session_id=target_session for update;
  if existing.user_id is distinct from target_user or existing.stripe_payment_intent is distinct from target_intent or
    existing.product_id is distinct from target_product or existing.tier is distinct from target_tier or
    existing.amount is distinct from target_amount or existing.currency is distinct from target_currency then
    raise exception 'Immutable purchase identity conflict';
  end if;
  if final_status<>'completed' and existing.status='completed' then
    update public.purchases set status=final_status,updated_at=now() where id=existing.id;
    existing.status := final_status;
  end if;
  return query select existing.id,existing.status;
end;
$$;
revoke all on function public.ai_lesson_revoke_payment(text,boolean,text,text) from public,anon,authenticated;
revoke all on function public.ai_lesson_fulfill_payment(uuid,text,text,integer,text,text,text,boolean) from public,anon,authenticated;
grant execute on function public.ai_lesson_revoke_payment(text,boolean,text,text) to service_role;
grant execute on function public.ai_lesson_fulfill_payment(uuid,text,text,integer,text,text,text,boolean) to service_role;
