-- Synthetic local-only model of the verified shared purchase schema.
create role anon nologin;
create role authenticated nologin;
create role service_role nologin bypassrls;
create schema auth;
create table auth.users (id uuid primary key);
insert into auth.users values ('11111111-1111-4111-8111-111111111111'), ('22222222-2222-4222-8222-222222222222');
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
grant usage on schema auth to anon, authenticated;
create table public.platform_memberships (app_id text not null, user_id uuid not null references auth.users(id), primary key(app_id,user_id));
insert into public.platform_memberships values ('ai-lesson','11111111-1111-4111-8111-111111111111'),('ai-lesson','22222222-2222-4222-8222-222222222222');
grant select on public.platform_memberships to authenticated;
alter table public.platform_memberships enable row level security;
create policy membership_self_read on public.platform_memberships for select to authenticated using (user_id=(select auth.uid()));
create table public.purchases (
 id uuid primary key default gen_random_uuid(), app_id text not null, user_id uuid not null references auth.users(id),
 stripe_session_id text not null, stripe_payment_intent text, amount integer, currency text,
 status text not null default 'completed', product_id text not null default 'claude-code', tier text not null default 'self',
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(app_id,stripe_session_id)
);
alter table public.purchases enable row level security;
grant all on public.purchases to anon, authenticated;
grant all on public.purchases to service_role;
create policy purchases_self_read on public.purchases for select to authenticated using (
 (select auth.uid())=user_id and exists (select 1 from public.platform_memberships m where m.app_id=purchases.app_id and m.user_id=(select auth.uid()))
);
