import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_ADMIN_PATHS = ['/admin/login', '/api/admin/auth'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Let login page and auth endpoint through
  if (PUBLIC_ADMIN_PATHS.some((p) => pathname === p)) {
    return NextResponse.next();
  }

  const token = req.cookies.get('admin_auth')?.value;
  const expected = process.env.ADMIN_TOKEN;

  if (!expected || token !== expected) {
    const loginUrl = new URL('/admin/login', req.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
