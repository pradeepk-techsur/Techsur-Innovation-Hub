import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth/middleware';
import { db } from '@/lib/db/client';
import { transitionState } from '@/lib/services/publication.service';

// POST body: { supersession_reason: string (required), successor_record_id?: string }
// Validates reason is present; calls transitionState(to: 'superseded', reason)
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireRole(request, 'curator');
  if (auth instanceof Response) return auth;

  const { id } = await params;

  let body: { supersession_reason?: string; successor_record_id?: string } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { status: 'error', error_code: 'INVALID_BODY', message: 'Request body must be valid JSON.' },
      { status: 400 }
    );
  }

  if (!body.supersession_reason || body.supersession_reason.trim().length === 0) {
    return NextResponse.json(
      {
        status: 'error',
        error_code: 'MISSING_REQUIRED_FIELD',
        message: 'supersession_reason is required.',
        fields: { supersession_reason: 'A supersession reason is required to supersede a record.' },
      },
      { status: 422 }
    );
  }

  const record = await db
    .selectFrom('innovation_records')
    .select(['title'])
    .where('id', '=', id)
    .executeTakeFirst();

  if (!record) {
    return NextResponse.json(
      { status: 'error', error_code: 'NOT_FOUND' },
      { status: 404 }
    );
  }

  // Optionally update superseded_by_record_id if a successor was specified
  if (body.successor_record_id) {
    await db
      .updateTable('innovation_records')
      .set({ superseded_by_record_id: body.successor_record_id })
      .where('id', '=', id)
      .execute();
  }

  const result = await transitionState({
    id,
    to: 'superseded',
    reason: body.supersession_reason.trim(),
    actorId: auth.session.userId,
    actorName: auth.session.name,
    targetTitle: record.title,
  });

  if (!result.ok) {
    return NextResponse.json(
      { status: 'error', error_code: 'TRANSITION_FAILED', message: result.error },
      { status: 400 }
    );
  }

  return NextResponse.json({ status: 'ok' });
}
