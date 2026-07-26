-- v2.4: icon + banner images for items
-- Run this in the Supabase SQL editor against your existing project.
-- Reuses the "media" Storage bucket + RLS policies created in 0003_people.sql.

alter table items
  add column if not exists icon_image text,
  add column if not exists banner_image text;

comment on column items.icon_image is 'Public URL of a small icon shown on cards (Storage bucket: media).';
comment on column items.banner_image is 'Public URL of a wide banner shown in the item detail view (Storage bucket: media).';
