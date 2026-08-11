import { NextResponse } from 'next/server';
import { getFacetCounts } from '@/lib/services/search.service';

export async function GET() {
  try {
    const facets = await getFacetCounts();
    return NextResponse.json({ status: 'ok', data: facets });
  } catch (err) {
    console.error('[/api/v1/search/facets] Error:', err);
    return NextResponse.json({ status: 'error', error_code: 'SEARCH_UNAVAILABLE', message: 'Facets unavailable' }, { status: 503 });
  }
}
