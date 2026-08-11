import { executeSearch, executeFacetCounts } from '@/lib/repositories/search.repository';
import type { SearchRow, FacetCounts, RawSearchParams } from '@/lib/repositories/search.repository';

// Canonical filter value sets for validation (F2.3)
const VALID_MATURITY_VALUES = ['idea', 'evaluated_idea', 'experiment_poc', 'prototype_pilot', 'production_validated', 'archived_retired'] as const;
const VALID_REUSE_POTENTIAL = ['high', 'moderate', 'low', 'not_assessed'] as const;
const VALID_SORTS = ['relevance', 'last_reviewed_desc', 'title_asc'] as const;

export interface SearchParams {
  q?: string;
  mission_areas?: string[];
  technology_areas?: string[];
  problem_type_tags?: string[];
  maturity?: string[];
  review_statuses?: string[];
  contributing_offices?: string[];
  reuse_potential?: string;
  has_artifacts?: boolean;
  publication_state?: string[];
  page?: number;
  page_size?: number;
  sort?: string;
}

export type { SearchRow, FacetCounts };

export interface SearchResult {
  records: Omit<SearchRow, 'rank' | 'total_count'>[];
  meta: {
    page: number;
    page_size: number;
    total: number;
    query: string;
    active_filters: Record<string, unknown>;
  };
}

export type SearchError =
  | { type: 'QUERY_TOO_SHORT' }
  | { type: 'QUERY_TOO_LONG' }
  | { type: 'INVALID_FILTER'; field: string; value: string };

export type SearchServiceResult =
  | { ok: true; result: SearchResult }
  | { ok: false; error: SearchError };

export async function searchRecords(params: SearchParams): Promise<SearchServiceResult> {
  // Validate query length (F2.1 — min 2 when provided; TechArch: max 500)
  if (params.q !== undefined && params.q !== '') {
    if (params.q.length < 2) return { ok: false, error: { type: 'QUERY_TOO_SHORT' } };
    if (params.q.length > 500) return { ok: false, error: { type: 'QUERY_TOO_LONG' } };
  }

  // Validate maturity filter values
  if (params.maturity) {
    for (const v of params.maturity) {
      if (!VALID_MATURITY_VALUES.includes(v as typeof VALID_MATURITY_VALUES[number])) {
        return { ok: false, error: { type: 'INVALID_FILTER', field: 'maturity', value: v } };
      }
    }
  }

  // Validate reuse_potential
  if (params.reuse_potential && !VALID_REUSE_POTENTIAL.includes(params.reuse_potential as typeof VALID_REUSE_POTENTIAL[number])) {
    return { ok: false, error: { type: 'INVALID_FILTER', field: 'reuse_potential', value: params.reuse_potential } };
  }

  const page = Math.max(1, params.page ?? 1);
  const page_size = Math.min(100, Math.max(1, params.page_size ?? 20));
  const sort = (VALID_SORTS.includes(params.sort as typeof VALID_SORTS[number]) ? params.sort : 'relevance') as RawSearchParams['sort'];

  const rows = await executeSearch({
    query: params.q,
    maturity: params.maturity,
    mission_areas: params.mission_areas,
    technology_areas: params.technology_areas,
    review_statuses: params.review_statuses,
    contributing_offices: params.contributing_offices,
    reuse_potential: params.reuse_potential,
    has_artifacts: params.has_artifacts,
    publication_states: ['published'],  // public always sees published only
    page,
    page_size,
    sort,
  });

  const total = rows.length > 0 ? Number(rows[0].total_count) : 0;
  const records = rows.map(({ rank: _r, total_count: _t, ...rest }) => rest);

  return {
    ok: true,
    result: {
      records,
      meta: {
        page,
        page_size,
        total,
        query: params.q ?? '',
        active_filters: {
          maturity: params.maturity,
          mission_areas: params.mission_areas,
          technology_areas: params.technology_areas,
          review_statuses: params.review_statuses,
          contributing_offices: params.contributing_offices,
          reuse_potential: params.reuse_potential,
          has_artifacts: params.has_artifacts,
        },
      },
    },
  };
}

export async function getFacetCounts(): Promise<FacetCounts> {
  return executeFacetCounts();
}
