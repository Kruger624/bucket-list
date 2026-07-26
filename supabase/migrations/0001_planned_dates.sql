-- v2.1: planned dates for booked items + Upcoming view
-- Run this in the Supabase SQL editor against your existing project.

alter table items
  add column if not exists planned_start_date date,
  add column if not exists planned_end_date date;

comment on column items.planned_start_date is 'First day of a booked plan (or the only day, for single-day items).';
comment on column items.planned_end_date is 'Last day of a booked plan. Null or equal to planned_start_date means a single-day item.';
