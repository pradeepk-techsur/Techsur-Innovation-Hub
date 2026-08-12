import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth/middleware';
import { db } from '@/lib/db/client';

// F9.11 — global audit log (admin-only, IP redacted)
export async function GET(request: Request) {
  const auth = await requireRole(request, 'admin');
  if (auth instanceof Response) return auth;

  const { searchParams } = new URL(request.url);
  // W4 fix: parseInt with isNaN guard prevents NaN flowing to Kysely limit/offset
  const rawPage = parseInt(searchParams.get('page') ?? '1', 10);
  const rawPageSize = parseInt(searchParams.get('page_size') ?? '50', 10);
  const page = Math.max(1, isNaN(rawPage) ? 1 : rawPage);
  const pageSize = Math.min(100, isNaN(rawPageSize) ? 50 : rawPageSize);

  // T-04-06-01: ip_address is never selected — admin global view still redacts IP
  const [events, totalRow] = await Promise.all([
    db
      .selectFrom('audit_events')
      .select([
        'audit_id',
        'event_type',
        'actor_name',
        'event_data',
        'target_type',
        'target_title',
        'occurred_at',
        'notes',
      ])
      .orderBy('occurred_at', 'desc')
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .execute(),
    db
      .selectFrom('audit_events')
      .select(db.fn.count('audit_id').as('count'))
      .executeTakeFirst(),
  ]);

  return NextResponse.json({
    status: 'ok',
    data: events,
    meta: { page, page_size: pageSize, total: Number(totalRow?.count ?? 0) },
  });
}
