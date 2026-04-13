'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';

function slugifyTitle(title: string): string {
  const base = title
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
  return base || 'inlagg';
}

/**
 * Temporär: snabb publicering när du är inloggad i Supabase (samma konto som CMS).
 */
export function BlogQuickComposer() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [excerpt, setExcerpt] = useState('');
  const [body, setBody] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      queueMicrotask(() => {
        setLoggedIn(false);
        setReady(true);
      });
      return;
    }
    void supabase.auth.getSession().then(({ data }) => {
      setLoggedIn(Boolean(data.session?.user));
      setReady(true);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, session) => {
      setLoggedIn(Boolean(session?.user));
    });
    return () => subscription.unsubscribe();
  }, []);

  const onTitleChange = useCallback(
    (v: string) => {
      setTitle(v);
      if (!slugTouched) {
        setSlug(slugifyTitle(v));
      }
    },
    [slugTouched],
  );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setMessage('Supabase är inte konfigurerat.');
      return;
    }
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) {
      setMessage('Logga in via CMS (hemsidan) först.');
      return;
    }

    const finalSlug = (slug.trim() ? slug : slugifyTitle(title)).trim();
    if (!finalSlug || !title.trim()) {
      setMessage('Titel och slug krävs.');
      return;
    }

    setBusy(true);
    setMessage(null);

    const publishedAt = new Date().toISOString();
    const { error } = await supabase.from('blog_posts').insert({
      slug: finalSlug,
      title: title.trim(),
      excerpt: excerpt.trim() || null,
      body: body.trim() || null,
      cover_image_url: coverUrl.trim() || null,
      is_published: true,
      published_at: publishedAt,
    });

    setBusy(false);

    if (error) {
      setMessage(error.message || 'Kunde inte spara.');
      return;
    }

    setMessage('Publicerat.');
    setTitle('');
    setSlug('');
    setSlugTouched(false);
    setExcerpt('');
    setBody('');
    setCoverUrl('');
    router.refresh();
  };

  if (!ready || !loggedIn) {
    return null;
  }

  return (
    <section
      className="border-border bg-muted/20 mt-14 rounded-lg border p-6 md:p-8"
      aria-label="Snabb blogg — endast inloggad"
    >
      <p className="nav-caps text-muted-foreground mb-2 text-xs">Temporärt · redaktör</p>
      <h2 className="mb-4 text-xl font-semibold tracking-tight">Nytt blogginlägg</h2>
      <form onSubmit={submit} className="grid max-w-xl gap-4">
        <div className="grid gap-2">
          <Label htmlFor="blog-title">Titel</Label>
          <Input
            id="blog-title"
            value={title}
            onChange={(ev) => onTitleChange(ev.target.value)}
            placeholder="Rubrik"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="blog-slug">Slug (URL)</Label>
          <Input
            id="blog-slug"
            value={slug}
            onChange={(ev) => {
              setSlugTouched(true);
              setSlug(ev.target.value);
            }}
            placeholder="min-rubrik"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="blog-excerpt">Ingress / sammanfattning</Label>
          <Textarea
            id="blog-excerpt"
            value={excerpt}
            onChange={(ev) => setExcerpt(ev.target.value)}
            rows={3}
            placeholder="Kort text som syns i kortet"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="blog-body">Brödtext (valfritt)</Label>
          <Textarea
            id="blog-body"
            value={body}
            onChange={(ev) => setBody(ev.target.value)}
            rows={6}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="blog-cover">Omslagsbild URL (valfritt)</Label>
          <Input
            id="blog-cover"
            value={coverUrl}
            onChange={(ev) => setCoverUrl(ev.target.value)}
            placeholder="https://…"
            type="url"
          />
        </div>
        {message ? (
          <p className="text-muted-foreground text-sm" role="status">
            {message}
          </p>
        ) : null}
        <Button type="submit" disabled={busy}>
          {busy ? 'Publicerar…' : 'Publicera'}
        </Button>
      </form>
    </section>
  );
}
