import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth/middleware';
import { db } from '@/lib/db/client';

export async function GET(request: Request) {
  const auth = await requireRole(request, 'curator');
  if (auth instanceof Response) return auth;

  const [recordCounts, pendingOpps, pendingContribs, unreadEngagement] = await Promise.all([
    db.selectFrom('innovation_records')
      .select(['publication_state', db.fn.count('id').as('count')])
      .groupBy('publication_state')
      .execute(),
    db.selectFrom('opportunity_submissions')
      .select(db.fn.count('id').as('count'))
      .where('status', '=', 'pending')
      .executeTakeFirst(),
    db.selectFrom('innovation_contributions')
      .select(db.fn.count('id').as('count'))
      .where('status', '=', 'pending')
      .executeTakeFirst(),
    db.selectFrom('engagement_requests')
      .select(db.fn.count('id').as('count'))
      .where('follow_up_status', '=', 'received')
      .executeTakeFirst(),
  ]);

  const byState = Object.fromEntries(recordCounts.map(r => [r.publication_state, Number(r.count)]));

  return NextResponse.json({
    status: 'ok',
    data: {
      records: {
        draft: byState.draft ?? 0,
        submitted_for_review: byState.submitted_for_review ?? 0,
        published: byState.published ?? 0,
        superseded: byState.superseded ?? 0,
        archived: byState.archived ?? 0,
        retired: byState.retired ?? 0,
      },
      pendingOpportunities: Number(pendingOpps?.count ?? 0),
      pendingContributions: Number(pendingContribs?.count ?? 0),
      unreadEngagement: Number(unreadEngagement?.count ?? 0),
    },
  });
}
