import { NextResponse } from 'next/server';
import { searchRecords } from '@/lib/services/search.service';

function parseArray(params: string[]): string[] | undefined {
  if (!params || params.length === 0) return undefined;
  return params;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const params = {
    q: searchParams.get('q') ?? undefined,
    mission_areas: parseArray(searchParams.getAll('mission_areas[]')),
    technology_areas: parseArray(searchParams.getAll('technology_areas[]')),
    maturity: parseArray(searchParams.getAll('maturity[]')),
    review_statuses: parseArray(searchParams.getAll('review_statuses[]')),
    contributing_offices: parseArray(searchParams.getAll('contributing_offices[]')),
    reuse_potential: searchParams.get('reuse_potential') ?? undefined,
    has_artifacts: searchParams.get('has_artifacts') === 'true' ? true : searchParams.get('has_artifacts') === 'false' ? false : undefined,
    page: searchParams.get('page') ? Number(searchParams.get('page')) : undefined,
    page_size: searchParams.get('page_size') ? Number(searchParams.get('page_size')) : undefined,
    sort: searchParams.get('sort') ?? undefined,
  };

  const outcome = await searchRecords(params);

  if (!outcome.ok) {
    const statusMap: Record<string, number> = {
      QUERY_TOO_SHORT: 400,
      QUERY_TOO_LONG: 400,
      INVALID_FILTER: 400,
    };
    return NextResponse.json(
      { status: 'error', error_code: outcome.error.type, message: outcome.error.type },
      { status: statusMap[outcome.error.type] ?? 400 }
    );
  }

  return NextResponse.json({
    status: 'ok',
    data: outcome.result.records,
    meta: outcome.result.meta,
  });
}
