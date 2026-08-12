import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth/middleware';
import { db } from '@/lib/db/client';
import { appendAuditEvent } from '@/lib/services/audit.service';
import { z } from 'zod';

const FOLLOW_UP_STATUSES = ['received', 'in_progress', 'completed', 'no_action_required'] as const;

const StatusSchema = z.object({
  follow_up_status: z.enum(FOLLOW_UP_STATUSES),
  curator_notes: z.string().max(3000).optional(),
});

// F9.14 — update engagement follow-up status (curator-only)
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRole(request, 'curator');
  if (auth instanceof Response) return auth;

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = StatusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { status: 'error', error_code: 'VALIDATION_ERROR', message: 'Invalid status data', details: parsed.error.issues },
      { status: 422 }
    );
  }

  const existing = await db
    .selectFrom('engagement_requests')
    .select(['id', 'originating_record_title', 'requester_name'])
    .where('id', '=', id)
    .executeTakeFirst();

  if (!existing) {
    return NextResponse.json(
      { status: 'error', error_code: 'NOT_FOUND', message: 'Engagement request not found.' },
      { status: 404 }
    );
  }

  await db
    .updateTable('engagement_requests')
    .set({
      follow_up_status: parsed.data.follow_up_status,
      curator_notes: parsed.data.curator_notes ?? null,
      follow_up_updated_at: new Date() as unknown as Date,
      follow_up_updated_by: auth.session.userId as unknown as null,
    })
    .where('id', '=', id)
    .execute();

  await appendAuditEvent({
    eventType: 'engagement_status_updated',
    actorId: auth.session.userId,
    actorName: auth.session.name,
    targetType: 'engagement_request',
    targetId: id,
    targetTitle: existing.originating_record_title ?? `Request from ${existing.requester_name}`,
    eventData: { status: parsed.data.follow_up_status },
  });

  return NextResponse.json({ status: 'ok' });
}
