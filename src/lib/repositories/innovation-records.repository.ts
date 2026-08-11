/**
 * Innovation Records Repository
 *
 * Data access layer for innovation_records table.
 * Uses Kysely typed query builder for type-safe database queries.
 */

import { db } from '@/lib/db/client';
import type { CatalogCardData } from '@/lib/db/types';

/**
 * Returns all published innovation records projected to CatalogCardData.
 * Only returns records with publication_state = 'published' — draft and other
 * lifecycle states are excluded per T-01-02-01 threat mitigation.
 *
 * Ordered by last_reviewed_date descending (most recently reviewed first).
 * Null last_reviewed_date records appear last.
 */
export async function getPublishedCatalog(): Promise<CatalogCardData[]> {
  return db
    .selectFrom('innovation_records')
    .select([
      'id',
      'slug',
      'title',
      'summary',
      'maturity',
      'review_statuses',
      'contributing_offices',
      'last_reviewed_date',
      'engagement_indicator',
      'publication_state',
      'technology_areas',
      'mission_areas',
    ])
    .where('publication_state', '=', 'published')
    .orderBy('last_reviewed_date', 'desc')
    .execute();
}
