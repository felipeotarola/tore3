import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/utils';

const Logo = ({ className }: { className?: string }) => {
  return (
    <Link href="/" aria-label="TOREKULL">
      <Image
        src="/Torekull_logo_new2.png"
        alt="TOREKULL"
        width={746}
        height={999}
        priority
        className={cn('h-8 w-auto', className)}
      />
    </Link>
  );
};

export default Logo;
