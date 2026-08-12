import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db/client';
import type { StakeholderSession } from '@/lib/auth/session';

// Role hierarchy: admin > curator > stakeholder > anonymous
const ROLE_RANK: Record<string, number> = {
  anonymous: 0,
  stakeholder: 1,
  curator: 2,
  admin: 3,
};

/**
 * Extracts session from Bearer token (API routes) or cookie (SSR routes).
 * API routes: Authorization: Bearer <jwt>
 * SSR routes: cookie (handled by getSession() which reads cookies())
 */
export async function getRequestSession(request: Request): Promise<StakeholderSession | null> {
  // Try Authorization header first (API routes)
  const authHeader = request.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    // Re-use session validation from session.ts
    const { jwtVerify } = await import('jose');
    const secret = process.env.AUTH_SECRET;
    if (!secret || secret.length < 32) return null;
    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
      return {
        id: payload.sessionId as string,
        userId: payload.userId as string,
        name: payload.name as string,
        office: payload.office as string,
        email: payload.email as string,
        role: payload.role as StakeholderSession['role'],
        expiresAt: payload.expiresAt as number,
      };
    } catch {
      return null;
    }
  }
  // Fall through to cookie-based session (SSR pages)
  return getSession();
}

/**
 * requireRole — used at the top of every curator API route handler.
 *
 * Usage:
 *   const auth = await requireRole(request, 'curator');
 *   if (auth instanceof Response) return auth;
 *   const { session } = auth;
 *
 * Returns:
 *   { session } — if user has required role or higher
 *   NextResponse (401) — if not authenticated
 *   NextResponse (403) — if authenticated but insufficient role (AUTH-04, SEC-02)
 *
 * Side effects:
 *   Records unauthorized access attempts in audit_events (AUTH-05, SEC-03)
 */
export async function requireRole(
  request: Request,
  requiredRole: 'curator' | 'admin'
): Promise<{ session: StakeholderSession } | Response> {
  const session = await getRequestSession(request);

  if (!session) {
    // Not authenticated — 401
    await appendAuthAuditEvent({
      actorId: 'anonymous',
      actorName: 'anonymous',
      targetType: 'user_role',
      targetId: '00000000-0000-0000-0000-000000000000',
      eventType: 'user_role_changed',
      eventData: { path: new URL(request.url).pathname, reason: 'unauthenticated' },
      ip: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '',
    });
    return NextResponse.json(
      { status: 'error', error_code: 'UNAUTHORIZED', message: 'Authentication required.' },
      { status: 401 }
    );
  }

  const userRank = ROLE_RANK[session.role] ?? 0;
  const requiredRank = ROLE_RANK[requiredRole] ?? 2;

  if (userRank < requiredRank) {
    // Authenticated but insufficient role — 403
    await appendAuthAuditEvent({
      actorId: session.userId,
      actorName: session.name,
      targetType: 'user_role',
      targetId: session.userId,
      eventType: 'user_role_changed',
      eventData: {
        path: new URL(request.url).pathname,
        reason: 'insufficient_role',
        userRole: session.role,
        requiredRole,
      },
      ip: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '',
    });
    return NextResponse.json(
      { status: 'error', error_code: 'FORBIDDEN', message: 'You do not have permission to perform this action.' },
      { status: 403 }
    );
  }

  return { session };
}

/**
 * appendAuthAuditEvent — writes an audit record for auth events (AUTH-05).
 * Uses INSERT-only on audit_events (no UPDATE/DELETE by app role).
 * Best-effort: never throws — auth failures should still return the HTTP error.
 *
 * Note: Uses event_type='user_role_changed' for unauthorized access attempts
 * since the DB CHECK constraint only permits predefined event types.
 * The event_data.reason field distinguishes 'unauthenticated' vs 'insufficient_role'.
 */
export async function appendAuthAuditEvent(params: {
  actorId: string;
  actorName: string;
  targetType: string;
  targetId: string;
  eventType: string;
  eventData?: Record<string, unknown>;
  ip?: string;
}): Promise<void> {
  try {
    await db
      .insertInto('audit_events')
      .values({
        actor_id: params.actorId === 'anonymous'
          ? '00000000-0000-0000-0000-000000000000'
          : params.actorId,
        actor_name: params.actorName,
        target_type: (params.targetType as 'innovation_record' | 'artifact' | 'opportunity_submission' | 'innovation_contribution' | 'engagement_request' | 'hub_settings' | 'user_role'),
        target_id: params.targetId === 'unknown'
          ? '00000000-0000-0000-0000-000000000000'
          : params.targetId,
        event_type: (params.eventType as 'record_created' | 'user_role_changed'),
        event_data: params.eventData ?? {},
        ip_address: params.ip ?? null,
      })
      .execute();
  } catch (err) {
    console.error('[auth.middleware] appendAuthAuditEvent failed (non-fatal):', err);
  }
}

/**
 * appendAuditEvent — general audit event helper for service layer.
 * Wraps the INSERT in a try/catch so caller logic isn't disrupted by audit failures.
 */
export async function appendAuditEvent(params: {
  eventType: string;
  actorId: string;
  actorName: string;
  targetType: string;
  targetId: string;
  targetTitle?: string;
  eventData?: Record<string, unknown>;
  notes?: string;
  ip?: string;
}): Promise<void> {
  try {
    await db
      .insertInto('audit_events')
      .values({
        actor_id: params.actorId,
        actor_name: params.actorName,
        target_type: params.targetType as 'innovation_record',
        target_id: params.targetId,
        target_title: params.targetTitle ?? null,
        event_type: params.eventType as 'record_created',
        event_data: params.eventData ?? {},
        notes: params.notes ?? null,
        ip_address: params.ip ?? null,
      })
      .execute();
  } catch (err) {
    console.error('[appendAuditEvent] Failed (non-fatal):', err);
  }
}
