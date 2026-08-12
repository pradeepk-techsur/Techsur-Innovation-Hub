import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth/middleware';
import { db } from '@/lib/db/client';
import { transitionState } from '@/lib/services/publication.service';

// POST body: { retirement_reason: string (required) }
// Validates reason is present; calls transitionState(to: 'retired', reason)
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireRole(request, 'curator');
  if (auth instanceof Response) return auth;

  const { id } = await params;

  let body: { retirement_reason?: string } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { status: 'error', error_code: 'INVALID_BODY', message: 'Request body must be valid JSON.' },
      { status: 400 }
    );
  }

  if (!body.retirement_reason || body.retirement_reason.trim().length === 0) {
    return NextResponse.json(
      {
        status: 'error',
        error_code: 'MISSING_REQUIRED_FIELD',
        message: 'retirement_reason is required.',
        fields: { retirement_reason: 'A retirement reason is required to retire a record.' },
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

  const result = await transitionState({
    id,
    to: 'retired',
    reason: body.retirement_reason.trim(),
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
