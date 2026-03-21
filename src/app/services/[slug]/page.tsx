import { redirect } from 'next/navigation';

interface ServiceSlugPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ServiceSlugRedirectPage({
  params,
}: ServiceSlugPageProps) {
  await params;
  redirect('/what-we-do');
}

export async function generateStaticParams() {
  return [];
}

