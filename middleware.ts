import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from './i18n/config';

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
  localeDetection: false
});

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Handle admin routes
  if (pathname.startsWith('/admin')) {
    // Allow access to login page and auth API
    if (pathname === '/admin/login' || pathname.startsWith('/api/admin/auth')) {
      return NextResponse.next();
    }

    // Check for session cookie
    const sessionCookie = request.cookies.get('admin_session');

    // Handle /admin base path - redirect based on auth status
    if (pathname === '/admin') {
      if (sessionCookie?.value) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    if (!sessionCookie?.value) {
      // Redirect to login if no session
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // For protected admin routes, verify session on the server side
    // The actual JWT verification happens in the authenticated layout
    return NextResponse.next();
  }

  // Handle API routes (don't apply i18n)
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Apply i18n middleware for all other routes
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Match all paths except static files and _next
    '/((?!_next/static|_next/image|favicon.ico|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|json)$).*)',
  ]
};
