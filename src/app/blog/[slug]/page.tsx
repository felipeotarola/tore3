import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { BlogPostDetail } from '@/components/blog/blog-post-detail';
import { getPublishedBlogPostBySlug } from '@/lib/blog-posts';

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug);
  if (!post) {
    return { title: 'Inlägg hittades inte' };
  }
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return <BlogPostDetail post={post} />;
}
