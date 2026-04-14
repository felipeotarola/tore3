-- Optional: kör i Supabase SQL Editor efter att blog_posts-migreringar är applicerade.
-- Skapar ett publicerat exempelinlägg (samma slug som kod-placeholdern: preview-hello-torekull).
-- Körs säkert flera gånger: gör inget om raden redan finns.

insert into public.blog_posts (
  slug,
  title,
  excerpt,
  body,
  cover_image_url,
  published_at,
  is_published
)
select
  'preview-hello-torekull',
  'Välkommen till TOREKULL-bloggen',
  'Ett exempelinlägg så du kan se kort, ingress och detaljsida.',
  E'Det här inlägget kommer från seed-skriptet i Supabase.\n\nByt text i Table Editor eller lägg till nya rader — då syns dina riktiga poster istället.',
  null,
  timezone('utc', now()),
  true
where not exists (
  select 1 from public.blog_posts where slug = 'preview-hello-torekull'
);
