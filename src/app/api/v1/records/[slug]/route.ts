/**
 * GET /api/v1/records/[slug]
 *
 * Returns the full detail of a single published innovation record identified by slug.
 *
 * Security:
 *   - Only published records are returned (T-01-03-02: draft records → 404)
 *   - Restricted artifact URLs are null in the response (T-01-03-01 / SEC-04)
 *   - Slug is a parameterized Kysely query — no SQL injection risk (T-01-03-04)
 *   - All content rendered via React JSX — no dangerouslySetInnerHTML (T-01-03-03)
 */

import { NextResponse } from 'next/server';
import { getRecordBySlug } from '@/lib/repositories/innovation-records.repository';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const result = await getRecordBySlug(slug);

  if (!result) {
    return NextResponse.json({ error: 'Record not found' }, { status: 404 });
  }

  return NextResponse.json({ data: result });
}
