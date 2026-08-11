import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Curator routes require authentication (enforcement in Phase 4)
  // For now: pass through with a note that Phase 4 adds full RBAC
  if (pathname.startsWith('/curator')) {
    // Phase 4: implement full RBAC enforcement here
    // Phase 1: placeholder — curator routes are accessible in dev
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/curator/:path*', '/api/v1/curator/:path*'],
};
