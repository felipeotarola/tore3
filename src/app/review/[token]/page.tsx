import { CalendarDays, Info } from 'lucide-react';
import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import { ReviewActions } from './review-actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { getDraftByReviewToken } from '@/lib/blog-posts';
import { FOUNDER_PORTRAIT, TOREKULL } from '@/lib/torekull';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ token: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;
  const post = await getDraftByReviewToken(token);
  if (!post) return { title: 'Utkast hittades inte' };
  return {
    title: `Granska: ${post.title}`,
    robots: { index: false, follow: false },
  };
}

function inlineHtml(text: string) {
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
            <h2 key={i} className="text-foreground mt-2 text-xl font-semibold tracking-tight md:text-2xl">
              {block.slice(3)}
            </h2>
          );
        }
        if (block.startsWith('### ')) {
          return (
            <h3 key={i} className="text-foreground mt-1 text-lg font-semibold tracking-tight">
              {block.slice(4)}
            </h3>
          );
        }
        return (
          <p
            key={i}
            className={`text-muted-foreground leading-relaxed md:text-base ${i === 0 ? 'text-foreground/90 text-[1.05rem] md:text-lg' : ''}`}
            dangerouslySetInnerHTML={{ __html: inlineHtml(block) }}
          />
        );
      })}
    </div>
  );
}

export default async function ReviewPage({ params }: Props) {
  const { token } = await params;
  const post = await getDraftByReviewToken(token);
  if (!post) notFound();

  const createdLabel = new Date(post.created_at).toLocaleDateString('sv-SE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <main className="bg-background text-foreground min-h-screen">
      {/* Review bar */}
      <div className="bg-muted border-border sticky top-0 z-50 border-b px-4 py-3 md:px-6">
        <div className="container flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium">Granska utkast — {TOREKULL.name}</p>
            <p className="text-muted-foreground text-xs">Genererat {createdLabel}</p>
          </div>
          <ReviewActions token={token} currentStatus={post.review_status} />
        </div>
      </div>

      <article className="section-padding container max-w-3xl">
        <header className="mt-8 space-y-6">
          <Badge variant="outline" className="w-fit">
            Utkast
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
              <div className="text-muted-foreground mt-1 flex items-center gap-1.5 text-sm">
                <CalendarDays className="size-3.5 shrink-0 opacity-70" aria-hidden />
                <span>Genererat {createdLabel}</span>
              </div>
            </div>
          </div>
        </header>

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

        <div className="mt-10 space-y-8">
          <Alert className="flex gap-3">
            <Info className="text-foreground mt-0.5 size-4 shrink-0 opacity-80" aria-hidden />
            <div className="min-w-0">
              <AlertTitle>Detta är ett AI-genererat utkast</AlertTitle>
              <AlertDescription>
                Texten är producerad av TOREKULL:s contentagent och väntar på din granskning.
                Godkänn för att publicera direkt, begär redigering för att skicka tillbaka med
                instruktioner, eller avvisa för att kasta utkastet.
              </AlertDescription>
            </div>
          </Alert>

          {post.body ? <MarkdownBody body={post.body} /> : null}

          {post.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs font-normal">
                  {tag}
                </Badge>
              ))}
            </div>
          ) : null}

          <div className="border-border overflow-hidden rounded-lg border">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-border bg-muted/30 border-b">
                  <th scope="row" className="text-muted-foreground w-[40%] px-4 py-3 text-left font-medium md:w-1/3">
                    Status
                  </th>
                  <td className="px-4 py-3 capitalize">{post.review_status.replace(/_/g, ' ')}</td>
                </tr>
                {post.review_notes ? (
                  <tr className="border-border bg-background border-b">
                    <th scope="row" className="text-muted-foreground px-4 py-3 align-top text-left font-medium">
                      Noteringar
                    </th>
                    <td className="px-4 py-3 whitespace-pre-wrap">{post.review_notes}</td>
                  </tr>
                ) : null}
                {post.sources_used.length > 0 ? (
                  <tr className="bg-muted/30">
                    <th scope="row" className="text-muted-foreground px-4 py-3 align-top text-left font-medium">
                      Källor
                    </th>
                    <td className="px-4 py-3">
                      <ul className="space-y-1">
                        {post.sources_used.map((src, i) => (
                          <li key={i} className="text-xs">
                            {src.startsWith('http') ? (
                              <a
                                href={src}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary underline-offset-4 hover:underline"
                              >
                                {(() => { try { return new URL(src).hostname.replace(/^www\./, ''); } catch { return src; } })()}
                              </a>
                            ) : (
                              <span className="text-muted-foreground">{src}</span>
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
      </article>
    </main>
  );
}
