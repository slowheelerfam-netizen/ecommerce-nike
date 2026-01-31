import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const publicRoutes = [
    '/',
    '/sign-in',
    '/sign-up',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
    '/products',
    '/categories',
    '/cart',
    '/api/auth',
  ];

  const checkoutRoutes = ['/checkout', '/checkout/payment', '/checkout/success'];

  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );

  const isCheckoutRoute = checkoutRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );

  if (isCheckoutRoute) {
    const returnUrl = encodeURIComponent(pathname);
    return NextResponse.redirect(new URL(`/sign-in?returnUrl=${returnUrl}`, request.url));
  }

  const authCookie = request.cookies.get('auth_session');
  if (authCookie && (pathname === '/sign-in' || pathname === '/sign-up')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
