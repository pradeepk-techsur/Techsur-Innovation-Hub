import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth/middleware';
import { db } from '@/lib/db/client';

// F9.12 — opportunity submission queue (curator-only)
export async function GET(request: Request) {
  const auth = await requireRole(request, 'curator');
  if (auth instanceof Response) return auth;

  const { searchParams } = new URL(request.url);
  const status = (searchParams.get('status') ?? 'pending') as
    | 'pending'
    | 'accepted'
    | 'declined'
    | 'needs_more_information'
    | 'duplicate';
  const page = Math.max(1, Number(searchParams.get('page') ?? 1));
  const pageSize = Math.min(100, Number(searchParams.get('page_size') ?? 20));

  const [submissions, totalRow] = await Promise.all([
    db
      .selectFrom('opportunity_submissions')
      .select([
        'id',
        'problem_title',
        'request_type',
        'submitting_office',
        'submitter_name',
        'submission_date',
        'status',
        'dispositioned_at',
        'curator_notes',
      ])
      .where('status', '=', status)
      .orderBy('submission_date', 'asc')
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .execute(),
    db
      .selectFrom('opportunity_submissions')
      .select(db.fn.count('id').as('count'))
      .where('status', '=', status)
      .executeTakeFirst(),
  ]);

  return NextResponse.json({
    status: 'ok',
    data: submissions,
    meta: { page, page_size: pageSize, total: Number(totalRow?.count ?? 0) },
  });
}
