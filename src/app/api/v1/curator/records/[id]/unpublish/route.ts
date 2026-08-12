import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth/middleware';
import { db } from '@/lib/db/client';
import { transitionState } from '@/lib/services/publication.service';

// POST — returns a published record to draft (unpublish)
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireRole(request, 'curator');
  if (auth instanceof Response) return auth;

  const { id } = await params;

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
    to: 'draft',
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
