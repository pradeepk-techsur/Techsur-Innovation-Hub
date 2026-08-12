import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth/middleware';
import { getRecordForCurator, updateRecord } from '@/lib/services/records.service';
import { db } from '@/lib/db/client';
import { appendAuditEvent } from '@/lib/services/audit.service';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRole(request, 'curator');
  if (auth instanceof Response) return auth;

  const { id } = await params;
  const record = await getRecordForCurator(id);
  if (!record) return NextResponse.json({ status: 'error', error_code: 'NOT_FOUND', message: 'Record not found' }, { status: 404 });

  return NextResponse.json({ status: 'ok', data: record });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRole(request, 'curator');
  if (auth instanceof Response) return auth;

  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body || typeof body.version !== 'number') {
    return NextResponse.json({ status: 'error', error_code: 'VALIDATION_ERROR', message: 'version field required' }, { status: 400 });
  }

  const { version, ...changes } = body;
  const result = await updateRecord({
    id,
    version,
    changes,
    actorId: auth.session.userId,
    actorName: auth.session.name,
  });

  if (!result.ok && 'conflict' in result) {
    return NextResponse.json({ status: 'error', error_code: 'VERSION_CONFLICT', message: 'Record was modified by another user. Reload and try again.' }, { status: 409 });
  }
  if (!result.ok) {
    return NextResponse.json({ status: 'error', error_code: 'UPDATE_FAILED', message: (result as { error: string }).error }, { status: 400 });
  }

  return NextResponse.json({ status: 'ok' });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRole(request, 'curator');
  if (auth instanceof Response) return auth;

  const { id } = await params;

  // Only draft records can be deleted (soft-delete)
  const record = await db
    .selectFrom('innovation_records')
    .select(['publication_state', 'title'])
    .where('id', '=', id)
    .executeTakeFirst();

  if (!record) return NextResponse.json({ status: 'error', error_code: 'NOT_FOUND' }, { status: 404 });
  if (record.publication_state !== 'draft') {
    return NextResponse.json({ status: 'error', error_code: 'INVALID_STATE', message: 'Only draft records can be deleted.' }, { status: 400 });
  }

  await db.deleteFrom('innovation_records').where('id', '=', id).execute();
  await appendAuditEvent({
    eventType: 'record_updated',
    actorId: auth.session.userId,
    actorName: auth.session.name,
    targetType: 'innovation_record',
    targetId: id,
    targetTitle: record.title,
    eventData: { action: 'deleted' },
  });

  return NextResponse.json({ status: 'ok' });
}
