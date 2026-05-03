import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <section className="container flex min-h-[70vh] items-center py-16">
      <div className="max-w-2xl space-y-5">
        <p className="tk-eyebrow">404</p>
        <h1 className="tk-page-title">Page not found</h1>
        <p className="tk-lead">
          The page you are looking for is not available. Return to the studio
          overview and continue from there.
        </p>
        <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft className="size-4" aria-hidden />
            Back to home
          </Link>
        </Button>
      </div>
    </section>
  );
}
