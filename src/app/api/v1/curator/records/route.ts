import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth/middleware';
import { db } from '@/lib/db/client';
import { createRecord } from '@/lib/services/records.service';
import type { PublicationState } from '@/lib/db/types';

export async function GET(request: Request) {
  const auth = await requireRole(request, 'curator');
  if (auth instanceof Response) return auth;

  const { searchParams } = new URL(request.url);
  const state = searchParams.get('state');  // F9.2: filter by lifecycle state
  const page = Math.max(1, Number(searchParams.get('page') ?? 1));
  const pageSize = Math.min(100, Number(searchParams.get('page_size') ?? 20));

  let query = db
    .selectFrom('innovation_records')
    .select(['id', 'slug', 'title', 'publication_state', 'maturity', 'review_statuses', 'updated_at', 'owner_steward'])
    .orderBy('updated_at', 'desc');

  if (state) {
    query = query.where('publication_state', '=', state as PublicationState);
  }

  const [records, totalRow] = await Promise.all([
    query.limit(pageSize).offset((page - 1) * pageSize).execute(),
    db.selectFrom('innovation_records')
      .select(db.fn.count('id').as('count'))
      .$if(!!state, q => q.where('publication_state', '=', state as PublicationState))
      .executeTakeFirst(),
  ]);

  return NextResponse.json({
    status: 'ok',
    data: records,
    meta: { page, page_size: pageSize, total: Number(totalRow?.count ?? 0) },
  });
}

export async function POST(request: Request) {
  const auth = await requireRole(request, 'curator');
  if (auth instanceof Response) return auth;

  const body = await request.json().catch(() => ({}));
  const title = String(body.title ?? '').slice(0, 200);

  const id = await createRecord({
    title,
    actorId: auth.session.userId,
    actorName: auth.session.name,
  });

  return NextResponse.json({ status: 'ok', data: { id } }, { status: 201 });
}
