import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isAdmin = request.cookies.get('admin_auth')?.value === 'true';
  const path = request.nextUrl.pathname;
  const isDashboard = path.startsWith('/dashboard');

  if (isDashboard && !isAdmin) {
    // Only protect the dashboard; allow home/landing to load freely
    return NextResponse.redirect(new URL('/', request.url));
  }
  return NextResponse.next();
}

export const config = {
  // Only run middleware for dashboard pages
  matcher: ['/dashboard/:path*'],
};
