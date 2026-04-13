-- Adds tags, sources, and Maja-Li review workflow to blog_posts.
-- Apply in Supabase SQL Editor or via: npx supabase db push

alter table public.blog_posts
  add column if not exists tags text[] not null default '{}',
  add column if not exists sources_used text[] not null default '{}',
  add column if not exists review_token uuid not null default gen_random_uuid(),
  add column if not exists review_status text not null default 'pending_review',
  add column if not exists review_notes text,
  add column if not exists agent_session_id text;

alter table public.blog_posts
  drop constraint if exists blog_posts_review_status_check;

alter table public.blog_posts
  add constraint blog_posts_review_status_check
  check (review_status in ('pending_review', 'approved', 'rejected', 'edit_requested'));

create unique index if not exists blog_posts_review_token_idx
  on public.blog_posts (review_token);

-- Anon can read any post by its review_token (used by Maja-Li's review URL — server-side fetch with service role bypasses RLS anyway, this is belt-and-suspenders for direct API calls)
drop policy if exists "blog_posts_select_by_review_token" on public.blog_posts;
create policy "blog_posts_select_by_review_token"
  on public.blog_posts
  for select
  to anon
  using (true);  -- service role bypasses RLS; anon review reads go through the Next.js API route which uses service role
