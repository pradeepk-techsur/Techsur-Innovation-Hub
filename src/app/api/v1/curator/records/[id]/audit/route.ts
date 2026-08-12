import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth/middleware';
import { db } from '@/lib/db/client';

// F9.11 — chronological audit history for a record (curator-accessible, IP redacted)
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRole(request, 'curator');
  if (auth instanceof Response) return auth;

  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get('page') ?? 1));
  const pageSize = Math.min(100, Number(searchParams.get('page_size') ?? 50));

  // Audit history is chronological (oldest-first), append-only
  // T-04-04-03: IP address NOT included — curator-level view redacts ip_address
  const [events, totalRow] = await Promise.all([
    db
      .selectFrom('audit_events')
      .select(['audit_id', 'event_type', 'actor_name', 'event_data', 'target_title', 'occurred_at', 'notes'])
      .where('target_id', '=', id)
      .orderBy('occurred_at', 'asc')
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .execute(),
    db
      .selectFrom('audit_events')
      .select(db.fn.count('audit_id').as('count'))
      .where('target_id', '=', id)
      .executeTakeFirst(),
  ]);

  return NextResponse.json({
    status: 'ok',
    data: events,
    meta: { page, page_size: pageSize, total: Number(totalRow?.count ?? 0) },
  });
}
