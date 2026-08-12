/**
 * Catch-all curator API route — RBAC enforcement layer (04-01).
 *
 * All /api/v1/curator/* paths run through requireRole('curator') first.
 * Plan 04-02 will add individual handlers for:
 *   - GET /api/v1/curator/dashboard
 *   - GET/POST /api/v1/curator/records
 *   - etc.
 *
 * This catch-all ensures any unlisted path returns 200 to authenticated curators
 * (or 401/403 if not authorized) so RBAC testing can proceed before handlers exist.
 */
import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth/middleware';

async function handler(request: NextRequest) {
  const auth = await requireRole(request, 'curator');
  if (auth instanceof Response) return auth;

  // Placeholder response — individual routes added in 04-02 through 04-04
  const pathSegments = (request.nextUrl.pathname.split('/api/v1/curator/')[1] ?? '').split('/');
  return NextResponse.json(
    { status: 'ok', curator: auth.session.name, path: pathSegments },
    { status: 200 }
  );
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
