-- Paid kit orders (Stripe Payment Links). One row per Checkout Session.
-- Written only by the server (service role) after it re-reads the session from
-- Stripe; never exposed to anon/authenticated through the Data API.

create table if not exists public.ai_lesson_kit_orders (
  session_id text primary key,
  product_slug text not null,
  email text,
  amount_total integer not null,
  currency text not null,
  payment_link text,
  livemode boolean not null,
  paid_at timestamptz not null default now(),
  first_seen_via text not null check (first_seen_via in ('success_page', 'webhook')),
  download_count integer not null default 0,
  last_download_at timestamptz
);

create index if not exists ai_lesson_kit_orders_email_idx on public.ai_lesson_kit_orders (lower(email));
create index if not exists ai_lesson_kit_orders_product_idx on public.ai_lesson_kit_orders (product_slug, paid_at desc);

alter table public.ai_lesson_kit_orders enable row level security;
revoke all on public.ai_lesson_kit_orders from anon, authenticated;
