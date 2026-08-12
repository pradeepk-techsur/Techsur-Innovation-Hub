import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth/middleware';
import { db } from '@/lib/db/client';

// F9.13 — contribution submission queue (curator-only)
export async function GET(request: Request) {
  const auth = await requireRole(request, 'curator');
  if (auth instanceof Response) return auth;

  const { searchParams } = new URL(request.url);
  const status = (searchParams.get('status') ?? 'pending') as
    | 'pending'
    | 'accepted_for_curation'
    | 'declined'
    | 'needs_more_information'
    | 'duplicate'
    | 'curated';
  const page = Math.max(1, Number(searchParams.get('page') ?? 1));
  const pageSize = Math.min(100, Number(searchParams.get('page_size') ?? 20));

  const [submissions, totalRow] = await Promise.all([
    db
      .selectFrom('innovation_contributions')
      .select([
        'id',
        'contribution_title',
        'contributing_office',
        'contributor_names',
        'current_maturity',
        'submission_date',
        'status',
        'dispositioned_at',
        'curator_notes',
        'created_record_id',
      ])
      .where('status', '=', status)
      .orderBy('submission_date', 'asc')
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .execute(),
    db
      .selectFrom('innovation_contributions')
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
