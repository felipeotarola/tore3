import type { ReactNode } from 'react';

/** Admin routes skip the site Navbar and Footer. */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
