import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Routes that require authentication
const PROTECTED_ROUTES = [
  '/submit-opportunity',
  '/submit-contribution',
  '/curator',       // SSR curator section — any authenticated user; role checked in layout
];

const SESSION_COOKIE = 'tsio_hub_session';

async function hasValidSession(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if this is a protected route
  const isProtected = PROTECTED_ROUTES.some(r => pathname.startsWith(r));

  if (isProtected) {
    const authenticated = await hasValidSession(request);
    if (!authenticated) {
      // Redirect to login with return URL (AUTH-09)
      // Use nextUrl.clone() — avoids carrying the proxy's external hostname from request.url
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/login';
      loginUrl.searchParams.set('returnTo', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/submit-opportunity/:path*',
    '/submit-contribution/:path*',
    '/curator/:path*',
    '/api/v1/curator/:path*',
  ],
};
