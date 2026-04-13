import { CalendarDays, Info } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { DetailCloseButton } from '@/components/navigation/detail-close-button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import type { BlogPostRow } from '@/lib/blog-posts';
import { FOUNDER_PORTRAIT, TOREKULL } from '@/lib/torekull';

// ─── Markdown renderer ────────────────────────────────────────────────────────
// Handles the subset of markdown the agent produces: ## headings, **bold**, *italic*, paragraphs.

function inlineHtml(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>');
}

function MarkdownBody({ body }: { body: string }) {
  const blocks = body
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);

  return (
    <div className="space-y-6">
      {blocks.map((block, i) => {
        if (block.startsWith('## ')) {
          return (
            <h2
              key={i}
              className="text-foreground mt-2 text-xl font-semibold tracking-tight md:text-2xl"
            >
              {block.slice(3)}
            </h2>
          );
        }
        if (block.startsWith('### ')) {
          return (
            <h3
              key={i}
              className="text-foreground mt-1 text-lg font-semibold tracking-tight"
            >
              {block.slice(4)}
            </h3>
          );
        }
        return (
          <p
            key={i}
            className={`text-muted-foreground leading-relaxed md:text-base ${
              i === 0 ? 'text-foreground/90 text-[1.05rem] md:text-lg' : ''
            }`}
            dangerouslySetInnerHTML={{ __html: inlineHtml(block) }}
          />
        );
      })}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

type Props = { post: BlogPostRow };

/**
 * Blog detail layout — shadcnblocks blogpost1 inspired:
 * title → description → author/date row → hero image → alert → markdown body → tags → meta table
 */
export function BlogPostDetail({ post }: Props) {
  const minutes = Math.max(
    1,
    Math.round(
      [post.excerpt, post.body].filter(Boolean).join(' ').trim().split(/\s+/).filter(Boolean)
        .length / 200,
    ),
  );

  const publishedLabel = post.published_at
    ? new Date(post.published_at).toLocaleDateString('sv-SE', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  const publishedShort = post.published_at
    ? new Date(post.published_at).toLocaleDateString('sv-SE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <main className="bg-background text-foreground min-h-screen">
      <article className="section-padding container max-w-3xl">
        <DetailCloseButton fallbackHref="/blog" />

        {/* Header */}
        <header className="mt-8 space-y-6">
          <Badge variant="outline" className="w-fit">
            Blogg
          </Badge>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
              {post.title}
            </h1>
            {post.excerpt ? (
              <p className="text-muted-foreground text-lg leading-relaxed md:text-xl md:leading-relaxed">
                {post.excerpt}
              </p>
            ) : null}
          </div>

          {/* Author + date */}
          <div className="border-border flex flex-wrap items-center gap-4 border-y py-6 md:gap-6">
            <div className="border-border bg-muted relative size-12 shrink-0 overflow-hidden rounded-full border md:size-14">
              <Image
                src={FOUNDER_PORTRAIT.src}
                alt={FOUNDER_PORTRAIT.alt}
                fill
                className="object-cover object-[center_15%]"
                sizes="56px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium leading-tight">{FOUNDER_PORTRAIT.caption}</p>
              <div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="size-3.5 shrink-0 opacity-70" aria-hidden />
                  {publishedLabel ? (
                    <time dateTime={post.published_at!}>{publishedLabel}</time>
                  ) : (
                    <span>Datum kommer snart</span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Hero image */}
        {post.cover_image_url ? (
          <figure className="mt-10 overflow-hidden rounded-xl border border-border shadow-sm">
            <div className="bg-muted relative aspect-[16/9] w-full md:aspect-[2/1]">
              <Image
                src={post.cover_image_url}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
                priority
                unoptimized
              />
            </div>
          </figure>
        ) : null}

        {/* Body */}
        <div className="mt-10 space-y-8">
          <Alert className="flex gap-3">
            <Info className="text-foreground mt-0.5 size-4 shrink-0 opacity-80" aria-hidden />
            <div className="min-w-0">
              <AlertTitle>Om TOREKULL</AlertTitle>
              <AlertDescription>
                <p>
                  {TOREKULL.legalName} — interior architecture och design med bas i Stockholm.
                  Vill du samarbeta kring ett projekt?{' '}
                  <Link
                    href="/contact"
                    className="text-primary font-medium underline-offset-4 hover:underline"
                  >
                    Kontakta oss
                  </Link>
                  {' · '}
                  <Link
                    href="/about"
                    className="text-primary font-medium underline-offset-4 hover:underline"
                  >
                    Om studion
                  </Link>
                  .
                </p>
              </AlertDescription>
            </div>
          </Alert>

          {post.body ? <MarkdownBody body={post.body} /> : null}

          {/* Tags */}
          {post.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs font-normal">
                  {tag}
                </Badge>
              ))}
            </div>
          ) : null}

          {/* Meta table */}
          <div className="border-border overflow-hidden rounded-lg border">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-border bg-muted/30 border-b">
                  <th
                    scope="row"
                    className="text-muted-foreground w-[40%] px-4 py-3 text-left font-medium md:w-1/3"
                  >
                    Publicerad
                  </th>
                  <td className="px-4 py-3">
                    {publishedShort ? (
                      <time dateTime={post.published_at!}>{publishedShort}</time>
                    ) : (
                      '—'
                    )}
                  </td>
                </tr>
                <tr className="border-border bg-background border-b">
                  <th
                    scope="row"
                    className="text-muted-foreground px-4 py-3 text-left font-medium"
                  >
                    Lästid
                  </th>
                  <td className="px-4 py-3 tabular-nums">{minutes} min</td>
                </tr>
                <tr className="border-border bg-muted/30 border-b">
                  <th
                    scope="row"
                    className="text-muted-foreground px-4 py-3 text-left font-medium"
                  >
                    Studio
                  </th>
                  <td className="px-4 py-3">{TOREKULL.name}</td>
                </tr>
                {post.sources_used.length > 0 ? (
                  <tr className="bg-background">
                    <th
                      scope="row"
                      className="text-muted-foreground px-4 py-3 align-top text-left font-medium"
                    >
                      Källor
                    </th>
                    <td className="px-4 py-3">
                      <ul className="space-y-1">
                        {post.sources_used.map((src, i) => (
                          <li key={i} className="text-muted-foreground text-xs">
                            {src.startsWith('http') ? (
                              <a
                                href={src}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary underline-offset-4 hover:underline"
                              >
                                {new URL(src).hostname.replace(/^www\./, '')}
                              </a>
                            ) : (
                              src
                            )}
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-14 border-border border-t pt-10">
          <Link
            href="/blog"
            className="text-primary inline-flex items-center gap-2 text-sm font-medium hover:underline underline-offset-4"
          >
            <span aria-hidden>←</span>
            Alla inlägg
          </Link>
        </p>
      </article>
    </main>
  );
}
