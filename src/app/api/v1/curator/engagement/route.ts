import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth/middleware';
import { db } from '@/lib/db/client';

// F9.14 — engagement activity list (curator-only)
export async function GET(request: Request) {
  const auth = await requireRole(request, 'curator');
  if (auth instanceof Response) return auth;

  const { searchParams } = new URL(request.url);
  const followUpStatus = searchParams.get('follow_up_status') as
    | 'received'
    | 'in_progress'
    | 'completed'
    | 'no_action_required'
    | null;
  const page = Math.max(1, Number(searchParams.get('page') ?? 1));
  const pageSize = Math.min(100, Number(searchParams.get('page_size') ?? 20));

  let query = db
    .selectFrom('engagement_requests')
    .select([
      'id',
      'request_type',
      'originating_record_id',
      'originating_record_title',
      'requester_name',
      'requester_office',
      'submitted_at',
      'follow_up_status',
      'follow_up_updated_at',
      'curator_notes',
      'routing_address_at_submission',
      'email_routing_initiated',
    ])
    .orderBy('submitted_at', 'desc');

  let countQuery = db
    .selectFrom('engagement_requests')
    .select(db.fn.count('id').as('count'));

  if (followUpStatus) {
    query = query.where('follow_up_status', '=', followUpStatus);
    countQuery = countQuery.where('follow_up_status', '=', followUpStatus);
  }

  const [requests, totalRow] = await Promise.all([
    query.limit(pageSize).offset((page - 1) * pageSize).execute(),
    countQuery.executeTakeFirst(),
  ]);

  return NextResponse.json({
    status: 'ok',
    data: requests,
    meta: { page, page_size: pageSize, total: Number(totalRow?.count ?? 0) },
  });
}
