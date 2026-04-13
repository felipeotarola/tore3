-- Snabb blogg (temporär experimentyta). Applicera i Supabase SQL editor eller via CLI.
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  body text,
  cover_image_url text,
  published_at timestamptz,
  is_published boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists blog_posts_published_sort_idx
  on public.blog_posts (is_published, published_at desc nulls last);

alter table public.blog_posts enable row level security;

-- Publika besökare: endast publicerade inlägg
drop policy if exists "blog_posts_select_published" on public.blog_posts;
create policy "blog_posts_select_published"
on public.blog_posts
for select
using (is_published = true);

-- Inloggad (samma roll som CMS): läs alla inkl. utkast
drop policy if exists "blog_posts_select_authenticated" on public.blog_posts;
create policy "blog_posts_select_authenticated"
on public.blog_posts
for select
to authenticated
using (true);

drop policy if exists "blog_posts_insert_authenticated" on public.blog_posts;
create policy "blog_posts_insert_authenticated"
on public.blog_posts
for insert
to authenticated
with check (true);

drop policy if exists "blog_posts_update_authenticated" on public.blog_posts;
create policy "blog_posts_update_authenticated"
on public.blog_posts
for update
to authenticated
using (true)
with check (true);

drop policy if exists "blog_posts_delete_authenticated" on public.blog_posts;
create policy "blog_posts_delete_authenticated"
on public.blog_posts
for delete
to authenticated
using (true);
