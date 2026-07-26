-- Shared Bucket List — schema, seed data, and RLS policies
-- Run this in the Supabase SQL editor (or via `supabase db push`) on a fresh project.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- categories
-- ---------------------------------------------------------------------------
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

insert into categories (name) values
  ('Travel'),
  ('Food & Drink'),
  ('Experiences & Activities'),
  ('Culture'),
  ('Home Projects')
on conflict (name) do nothing;

-- ---------------------------------------------------------------------------
-- items
-- ---------------------------------------------------------------------------
create table if not exists items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  link text,
  category_id uuid references categories (id) on delete set null,
  added_by text,
  status text not null default 'someday'
    constraint items_status_check
    check (status in ('someday', 'this_year', 'booked', 'done')),
  memory_note text,
  photo_link text,
  created_at timestamptz not null default now()
);

create index if not exists items_category_id_idx on items (category_id);
create index if not exists items_status_idx on items (status);

-- ---------------------------------------------------------------------------
-- item_interest
-- ---------------------------------------------------------------------------
create table if not exists item_interest (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references items (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  constraint item_interest_unique_person unique (item_id, name)
);

create index if not exists item_interest_item_id_idx on item_interest (item_id);

-- ---------------------------------------------------------------------------
-- Row Level Security
--
-- NOTE (v1): This app has no authentication — it's built for a small,
-- trusted group of partners. Policies below are intentionally permissive
-- (anyone with the anon key can read/write everything). If this app is
-- ever exposed beyond a trusted group, tighten these policies (e.g. add
-- auth, scope writes to the authenticated user, etc.) before relying on
-- them for anything sensitive.
-- ---------------------------------------------------------------------------
alter table categories enable row level security;
alter table items enable row level security;
alter table item_interest enable row level security;

create policy "categories: public read" on categories
  for select using (true);
create policy "categories: public insert" on categories
  for insert with check (true);

create policy "items: public read" on items
  for select using (true);
create policy "items: public insert" on items
  for insert with check (true);
create policy "items: public update" on items
  for update using (true) with check (true);
create policy "items: public delete" on items
  for delete using (true);

create policy "item_interest: public read" on item_interest
  for select using (true);
create policy "item_interest: public insert" on item_interest
  for insert with check (true);
create policy "item_interest: public delete" on item_interest
  for delete using (true);

-- ---------------------------------------------------------------------------
-- Realtime
-- ---------------------------------------------------------------------------
alter publication supabase_realtime add table items;
alter publication supabase_realtime add table item_interest;
