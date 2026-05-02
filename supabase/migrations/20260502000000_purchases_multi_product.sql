-- Adds multi-product + cohort-tier support to the purchases table.
--
-- Migration is idempotent: safe to re-run. Existing rows backfill to the
-- original single-product self-serve assumption.
--
-- Run via Supabase SQL Editor:
--   https://supabase.com/dashboard/project/_/sql/new

alter table purchases add column if not exists product_id text;
alter table purchases add column if not exists tier text;

update purchases set product_id = 'claude-code' where product_id is null;
update purchases set tier = 'self' where tier is null;

alter table purchases alter column product_id set default 'claude-code';
alter table purchases alter column tier set default 'self';
alter table purchases alter column product_id set not null;
alter table purchases alter column tier set not null;

-- Index so dashboard queries (where user_id + product_id) stay fast as more
-- products ship.
create index if not exists purchases_user_product_idx
  on purchases (user_id, product_id, status);
