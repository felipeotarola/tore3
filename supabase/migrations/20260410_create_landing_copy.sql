create table if not exists public.landing_copy (
  key text primary key,
  value text not null default '',
  updated_at timestamptz not null default timezone('utc', now()),
  updated_by uuid references auth.users (id) on delete set null
);

alter table public.landing_copy enable row level security;

drop policy if exists "landing_copy_select_all" on public.landing_copy;
create policy "landing_copy_select_all"
on public.landing_copy
for select
using (true);

drop policy if exists "landing_copy_insert_authenticated" on public.landing_copy;
create policy "landing_copy_insert_authenticated"
on public.landing_copy
for insert
to authenticated
with check (true);

drop policy if exists "landing_copy_update_authenticated" on public.landing_copy;
create policy "landing_copy_update_authenticated"
on public.landing_copy
for update
to authenticated
using (true)
with check (true);
