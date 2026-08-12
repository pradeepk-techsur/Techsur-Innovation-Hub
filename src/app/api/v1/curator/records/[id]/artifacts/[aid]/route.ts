import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth/middleware';
import { db } from '@/lib/db/client';
import { appendAuditEvent } from '@/lib/services/audit.service';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; aid: string }> }
) {
  const auth = await requireRole(request, 'curator');
  if (auth instanceof Response) return auth;

  const { id, aid } = await params;
  const body = await request.json().catch(() => ({}));

  await db
    .updateTable('artifacts')
    .set(body)
    .where('artifact_id', '=', aid)
    .where('record_id', '=', id)
    .execute();

  await appendAuditEvent({
    eventType: 'artifact_updated',
    actorId: auth.session.userId,
    actorName: auth.session.name,
    targetType: 'artifact',
    targetId: aid,
    eventData: { record_id: id },
  });

  return NextResponse.json({ status: 'ok' });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; aid: string }> }
) {
  const auth = await requireRole(request, 'curator');
  if (auth instanceof Response) return auth;

  const { id, aid } = await params;
  const artifact = await db
    .selectFrom('artifacts')
    .select(['name'])
    .where('artifact_id', '=', aid)
    .executeTakeFirst();

  await db
    .deleteFrom('artifacts')
    .where('artifact_id', '=', aid)
    .where('record_id', '=', id)
    .execute();

  await appendAuditEvent({
    eventType: 'artifact_removed',
    actorId: auth.session.userId,
    actorName: auth.session.name,
    targetType: 'artifact',
    targetId: aid,
    eventData: { record_id: id, name: artifact?.name },
  });

  return NextResponse.json({ status: 'ok' });
}
