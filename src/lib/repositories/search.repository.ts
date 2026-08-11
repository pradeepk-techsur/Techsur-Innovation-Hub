import { sql } from 'kysely';
import { db } from '@/lib/db/client';
import type { CatalogCardData } from '@/lib/db/types';
import type { MaturityValue, PublicationState } from '@/lib/db/types';

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
  const hasQuery = params.query && params.query.trim().length >= 2;
  const states = (params.publication_states ?? ['published']) as PublicationState[];

  // Use raw SQL for the full query to avoid Kysely type inference issues with
  // window functions, tsvector operators, and array operators simultaneously.
  // All user inputs are passed as parameterized values — never interpolated.
  const whereClauses: string[] = [
    `ir.publication_state = ANY(${
      sql.raw('$' + 1)
    })`,
  ];
  // We'll build this as a raw parameterized query
  // Collect params in order
  const queryParams: unknown[] = [states];
  let paramIdx = 2;

  if (hasQuery) {
    whereClauses.push(
      `ir.search_vector @@ plainto_tsquery('english', $${paramIdx})`
    );
    queryParams.push(params.query);
    paramIdx++;
  }

  if (params.maturity && params.maturity.length > 0) {
    whereClauses.push(`ir.maturity = ANY($${paramIdx}::text[])`);
    queryParams.push(params.maturity);
    paramIdx++;
  }
  if (params.mission_areas && params.mission_areas.length > 0) {
    whereClauses.push(`ir.mission_areas && $${paramIdx}::text[]`);
    queryParams.push(params.mission_areas);
    paramIdx++;
  }
  if (params.technology_areas && params.technology_areas.length > 0) {
    whereClauses.push(`ir.technology_areas && $${paramIdx}::text[]`);
    queryParams.push(params.technology_areas);
    paramIdx++;
  }
  if (params.review_statuses && params.review_statuses.length > 0) {
    whereClauses.push(`ir.review_statuses && $${paramIdx}::text[]`);
    queryParams.push(params.review_statuses);
    paramIdx++;
  }
  if (params.contributing_offices && params.contributing_offices.length > 0) {
    whereClauses.push(`ir.contributing_offices && $${paramIdx}::text[]`);
    queryParams.push(params.contributing_offices);
    paramIdx++;
  }
  if (params.reuse_potential) {
    whereClauses.push(`ir.reuse_potential = $${paramIdx}`);
    queryParams.push(params.reuse_potential);
    paramIdx++;
  }
  if (params.has_artifacts === true) {
    whereClauses.push(`EXISTS (SELECT 1 FROM artifacts a WHERE a.record_id = ir.id)`);
  }

  // Rank expression
  const rankExpr = hasQuery
    ? `ts_rank(ir.search_vector, plainto_tsquery('english', $${
        queryParams.indexOf(params.query) + 1
      }))`
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

  const offset = (params.page - 1) * params.page_size;
  queryParams.push(params.page_size);
  const limitParam = paramIdx++;
  queryParams.push(offset);
  const offsetParam = paramIdx++;

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
    WHERE ${whereClauses.join(' AND ')}
    ORDER BY ${orderBy}
    LIMIT $${limitParam} OFFSET $${offsetParam}
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
  // Unnest array fields to count distinct values among published records
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
