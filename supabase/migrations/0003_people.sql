-- v2.3: people directory + tagging in memories
-- Run this in the Supabase SQL editor against your existing project.

create table if not exists people (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  photo text,
  bio text,
  created_at timestamptz not null default now()
);

create table if not exists item_people (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references items (id) on delete cascade,
  person_id uuid not null references people (id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint item_people_unique unique (item_id, person_id)
);

create index if not exists item_people_item_id_idx on item_people (item_id);
create index if not exists item_people_person_id_idx on item_people (person_id);

alter table people enable row level security;
alter table item_people enable row level security;

-- Same permissive v1 pattern as the other tables: small trusted group, no auth.
-- Tighten before exposing this app publicly.
drop policy if exists "people: public read" on people;
create policy "people: public read" on people for select using (true);
drop policy if exists "people: public insert" on people;
create policy "people: public insert" on people for insert with check (true);
drop policy if exists "people: public update" on people;
create policy "people: public update" on people for update using (true) with check (true);
drop policy if exists "people: public delete" on people;
create policy "people: public delete" on people for delete using (true);

drop policy if exists "item_people: public read" on item_people;
create policy "item_people: public read" on item_people for select using (true);
drop policy if exists "item_people: public insert" on item_people;
create policy "item_people: public insert" on item_people for insert with check (true);
drop policy if exists "item_people: public delete" on item_people;
create policy "item_people: public delete" on item_people for delete using (true);

alter publication supabase_realtime add table people;
alter publication supabase_realtime add table item_people;

-- ---------------------------------------------------------------------------
-- Storage: a single public bucket for person photos (and, later, item
-- icon/banner images in the v2.4 migration). Client-side code compresses
-- images before upload; policies below are the same permissive pattern as
-- the rest of the app.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "media: public read" on storage.objects;
create policy "media: public read" on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists "media: public insert" on storage.objects;
create policy "media: public insert" on storage.objects
  for insert with check (bucket_id = 'media');

drop policy if exists "media: public update" on storage.objects;
create policy "media: public update" on storage.objects
  for update using (bucket_id = 'media');

drop policy if exists "media: public delete" on storage.objects;
create policy "media: public delete" on storage.objects
  for delete using (bucket_id = 'media');
