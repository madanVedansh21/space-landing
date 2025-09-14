import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isAdmin = request.cookies.get('admin_auth')?.value === 'true';
  const isAdminPage = request.nextUrl.pathname === '/admin';

  if (!isAdmin && !isAdminPage) {
    // Redirect to /admin if not authenticated
    return NextResponse.redirect(new URL('/admin', request.url));
  }
  if (isAdmin && isAdminPage) {
    // If already logged in, redirect away from /admin
    return NextResponse.redirect(new URL('/', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api|public|favicon.ico|images|videos|.*\\.mp4$).*)'],
};
