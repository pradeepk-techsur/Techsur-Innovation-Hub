/**
 * GET /api/v1/catalog — Public catalog endpoint.
 *
 * Returns all published innovation records projected to CatalogCardData.
 * Threat T-01-02-01: Only published records returned; draft/other states
 * are excluded at the repository level (WHERE publication_state = 'published').
 * Threat T-01-02-04: No dangerouslySetInnerHTML; all values JSX-escaped.
 * No authentication required (AUTH-01: anonymous browsing).
 */

import { NextResponse } from 'next/server';
import { getPublishedCatalog } from '@/lib/repositories/innovation-records.repository';

export async function GET() {
  try {
    const records = await getPublishedCatalog();
    return NextResponse.json({ data: records, meta: { total: records.length } });
  } catch (err) {
    console.error('[/api/v1/catalog] Error:', err);
    return NextResponse.json(
      { error: 'Failed to load catalog' },
      { status: 500 }
    );
  }
}
