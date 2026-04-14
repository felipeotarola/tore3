import { ArrowRight } from 'lucide-react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { BlogQuickComposer } from '@/components/blog/blog-quick-composer';
import { DetailCloseButton } from '@/components/navigation/detail-close-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getPublishedBlogPosts } from '@/lib/blog-posts';

export const metadata: Metadata = {
  title: 'Blogg',
  description:
    'Nyheter och anteckningar från TOREKULL — experimentyta kopplad mot Supabase.',
};

export const revalidate = 60;

/** Shadcnblocks blog7-inspirerad layout: badge, rubrik, ingress, CTA, 3-kolumnskort. */
export default async function BlogPage() {
  const posts = await getPublishedBlogPosts();

  return (
    <main className="bg-background text-foreground min-h-screen">
      <section className="hero-padding container">
        <DetailCloseButton fallbackHref="/" />

        <div className="mt-8 flex max-w-3xl flex-col gap-4 md:mt-10">
          <Badge variant="outline" className="w-fit">
            Blogg
          </Badge>
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
            Senaste inläggen
          </h1>
          <p className="text-muted-foreground max-w-2xl text-base leading-relaxed md:text-lg">
            Temporär bloggvy med kort i rutnät. Inlägg hämtas från tabellen{' '}
            <code className="text-foreground text-sm">blog_posts</code> i Supabase. Logga in på
            sajten som redaktör för att få fram formuläret längst ner.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild variant="default">
              <Link href="#inlagg">Visa inlägg</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/contact">Kontakt</Link>
            </Button>
          </div>
        </div>
      </section>

      <section
        id="inlagg"
        className="container scroll-mt-24 pt-4 pb-18.75 md:pt-6 md:pb-26 lg:pt-8 lg:pb-31.25"
      >
        {posts.length === 0 ? (
          <p className="text-muted-foreground max-w-xl text-base">
            Inga publicerade inlägg än. Applicera migrationen{' '}
            <code className="text-foreground text-sm">20260413_create_blog_posts.sql</code> i
            Supabase och publicera ett inlägg via formuläret (inloggad).
          </p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            {posts.map((post) => (
              <article
                key={post.id}
                className="border-border bg-card group flex flex-col overflow-hidden rounded-lg border shadow-sm transition-shadow hover:shadow-md"
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="focus-visible:ring-ring block rounded-t-lg focus-visible:ring-2 focus-visible:outline-none"
                >
                  <div className="bg-muted relative aspect-[16/10] w-full overflow-hidden">
                    {post.cover_image_url ? (
                      <Image
                        src={post.cover_image_url}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        unoptimized
                      />
                    ) : (
                      <div
                        className="text-muted-foreground flex h-full w-full items-center justify-center text-xs font-medium tracking-widest uppercase"
                        aria-hidden
                      >
                        TOREKULL
                      </div>
                    )}
                  </div>
                </Link>
                <div className="flex flex-1 flex-col gap-3 p-6 md:p-7">
                  <h2 className="text-lg font-semibold tracking-tight md:text-xl">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="hover:text-primary focus-visible:ring-ring rounded-sm focus-visible:ring-2 focus-visible:outline-none"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  {post.excerpt ? (
                    <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
                      {post.excerpt}
                    </p>
                  ) : null}
                  <div className="mt-auto flex items-center justify-between gap-3 border-border border-t pt-4">
                    {post.published_at ? (
                      <time
                        className="text-muted-foreground text-xs tabular-nums"
                        dateTime={post.published_at}
                      >
                        {new Date(post.published_at).toLocaleDateString('sv-SE', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </time>
                    ) : (
                      <span />
                    )}
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-primary inline-flex items-center gap-1 text-sm font-medium hover:underline"
                    >
                      Läs mer
                      <ArrowRight className="size-4" aria-hidden />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <div className="section-padding-tight container pb-20">
        <BlogQuickComposer />
      </div>
    </main>
  );
}
