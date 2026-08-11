import { db } from '@/lib/db/client';
import type { CatalogCardData } from '@/lib/db/types';

export interface RawSearchParams {
  query?: string;           // user-supplied text (may be empty/null → browse mode)
  maturity?: string[];
  mission_areas?: string[];
  technology_areas?: string[];
  review_statuses?: string[];
  contributing_offices?: string[];
  reuse_potential?: string;
  has_artifacts?: boolean;
  publication_states?: string[];  // public callers always get ['published']
  page: number;
  page_size: number;
  sort: 'relevance' | 'last_reviewed_desc' | 'title_asc';
}

export type SearchCardData = CatalogCardData & {
  reuse_potential: 'high' | 'moderate' | 'low' | 'not_assessed' | null;
};

export interface SearchRow extends SearchCardData {
  rank: number;
  total_count: number;
}

export async function executeSearch(params: RawSearchParams): Promise<SearchRow[]> {
  const hasQuery = !!(params.query && params.query.trim().length >= 2);
  const states = params.publication_states ?? ['published'];

  // Build parameterized query manually for correct Kysely + PostgreSQL interop.
  // All user inputs passed as $N params — never interpolated into SQL string.
  const queryParams: unknown[] = [];

  function addParam(value: unknown): string {
    queryParams.push(value);
    return `$${queryParams.length}`;
  }

  const whereParts: string[] = [];

  // Always filter by publication states
  whereParts.push(`ir.publication_state = ANY(${addParam(states)}::text[])`);

  // Full-text search via tsvector
  const queryParamPlaceholder = hasQuery ? addParam(params.query) : null;
  if (hasQuery && queryParamPlaceholder) {
    whereParts.push(`ir.search_vector @@ plainto_tsquery('english', ${queryParamPlaceholder})`);
  }

  if (params.maturity && params.maturity.length > 0) {
    whereParts.push(`ir.maturity = ANY(${addParam(params.maturity)}::text[])`);
  }
  if (params.mission_areas && params.mission_areas.length > 0) {
    whereParts.push(`ir.mission_areas && ${addParam(params.mission_areas)}::text[]`);
  }
  if (params.technology_areas && params.technology_areas.length > 0) {
    whereParts.push(`ir.technology_areas && ${addParam(params.technology_areas)}::text[]`);
  }
  if (params.review_statuses && params.review_statuses.length > 0) {
    whereParts.push(`ir.review_statuses && ${addParam(params.review_statuses)}::text[]`);
  }
  if (params.contributing_offices && params.contributing_offices.length > 0) {
    whereParts.push(`ir.contributing_offices && ${addParam(params.contributing_offices)}::text[]`);
  }
  if (params.reuse_potential) {
    whereParts.push(`ir.reuse_potential = ${addParam(params.reuse_potential)}`);
  }
  if (params.has_artifacts === true) {
    whereParts.push(`EXISTS (SELECT 1 FROM artifacts a WHERE a.record_id = ir.id)`);
  }

  // Rank expression — use same param placeholder if hasQuery
  const rankExpr = hasQuery && queryParamPlaceholder
    ? `ts_rank(ir.search_vector, plainto_tsquery('english', ${queryParamPlaceholder}))`
    : '0';

  // Sort order
  let orderBy: string;
  if (params.sort === 'relevance' && hasQuery) {
    orderBy = `rank DESC, ir.last_reviewed_date DESC NULLS LAST`;
  } else if (params.sort === 'title_asc') {
    orderBy = `ir.title ASC`;
  } else {
    orderBy = `ir.last_reviewed_date DESC NULLS LAST`;
  }

  const limitP = addParam(params.page_size);
  const offsetP = addParam((params.page - 1) * params.page_size);

  const rawSql = `
    SELECT
      ir.id,
      ir.slug,
      ir.title,
      ir.summary,
      ir.maturity,
      ir.review_statuses,
      ir.contributing_offices,
      ir.last_reviewed_date,
      ir.engagement_indicator,
      ir.publication_state,
      ir.technology_areas,
      ir.mission_areas,
      ir.reuse_potential,
      ${rankExpr} AS rank,
      COUNT(*) OVER() AS total_count
    FROM innovation_records ir
    WHERE ${whereParts.join(' AND ')}
    ORDER BY ${orderBy}
    LIMIT ${limitP} OFFSET ${offsetP}
  `;

  const { pool } = await import('@/lib/db/client');
  const result = await pool.query(rawSql, queryParams);
  return result.rows as SearchRow[];
}

export interface FacetEntry { value: string; count: number; }
export interface FacetCounts {
  maturity: FacetEntry[];
  mission_areas: FacetEntry[];
  technology_areas: FacetEntry[];
  review_statuses: FacetEntry[];
  contributing_offices: FacetEntry[];
  reuse_potential: FacetEntry[];
}

export async function executeFacetCounts(): Promise<FacetCounts> {
  const { pool } = await import('@/lib/db/client');

  const [maturity, mission_areas, technology_areas, review_statuses, contributing_offices, reuse_potential] = await Promise.all([
    pool.query<{ maturity: string; count: string }>(
      `SELECT maturity, COUNT(*)::int AS count
       FROM innovation_records
       WHERE publication_state = 'published' AND maturity IS NOT NULL
       GROUP BY maturity
       ORDER BY count DESC`
    ),
    pool.query<{ value: string; count: string }>(
      `SELECT unnest(mission_areas) AS value, COUNT(*)::int AS count
       FROM innovation_records
       WHERE publication_state = 'published'
       GROUP BY value
       ORDER BY count DESC`
    ),
    pool.query<{ value: string; count: string }>(
      `SELECT unnest(technology_areas) AS value, COUNT(*)::int AS count
       FROM innovation_records
       WHERE publication_state = 'published'
       GROUP BY value
       ORDER BY count DESC`
    ),
    pool.query<{ value: string; count: string }>(
      `SELECT unnest(review_statuses) AS value, COUNT(*)::int AS count
       FROM innovation_records
       WHERE publication_state = 'published'
       GROUP BY value
       ORDER BY count DESC`
    ),
    pool.query<{ value: string; count: string }>(
      `SELECT unnest(contributing_offices) AS value, COUNT(*)::int AS count
       FROM innovation_records
       WHERE publication_state = 'published'
       GROUP BY value
       ORDER BY count DESC`
    ),
    pool.query<{ reuse_potential: string; count: string }>(
      `SELECT reuse_potential, COUNT(*)::int AS count
       FROM innovation_records
       WHERE publication_state = 'published' AND reuse_potential IS NOT NULL
       GROUP BY reuse_potential
       ORDER BY count DESC`
    ),
  ]);

  return {
    maturity: maturity.rows.map(r => ({ value: r.maturity, count: Number(r.count) })),
    mission_areas: mission_areas.rows.map(r => ({ value: r.value, count: Number(r.count) })),
    technology_areas: technology_areas.rows.map(r => ({ value: r.value, count: Number(r.count) })),
    review_statuses: review_statuses.rows.map(r => ({ value: r.value, count: Number(r.count) })),
    contributing_offices: contributing_offices.rows.map(r => ({ value: r.value, count: Number(r.count) })),
    reuse_potential: reuse_potential.rows.map(r => ({ value: r.reuse_potential, count: Number(r.count) })),
  };
}
