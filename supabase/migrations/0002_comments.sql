-- v2.2: comments on items
-- Run this in the Supabase SQL editor against your existing project.

create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references items (id) on delete cascade,
  name text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists comments_item_id_idx on comments (item_id);

alter table comments enable row level security;

-- Same permissive v1 pattern as the other tables: small trusted group, no auth.
-- Tighten before exposing this app publicly.
drop policy if exists "comments: public read" on comments;
create policy "comments: public read" on comments
  for select using (true);

drop policy if exists "comments: public insert" on comments;
create policy "comments: public insert" on comments
  for insert with check (true);

drop policy if exists "comments: public delete" on comments;
create policy "comments: public delete" on comments
  for delete using (true);

alter publication supabase_realtime add table comments;
