/**
 * Innovation Records Repository
 *
 * Data access layer for innovation_records table.
 * Uses Kysely typed query builder for type-safe database queries.
 */

import { sql } from 'kysely';
import { db } from '@/lib/db/client';
import type { CatalogCardData, InnovationRecordRow } from '@/lib/db/types';

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

// ─── Record detail types ──────────────────────────────────────────────────

export interface ArtifactRow {
  artifact_id: string;
  record_id: string;
  artifact_type: string;
  name: string;
  url: string | null; // null when is_restricted = true (SEC-04)
  is_restricted: boolean;
  display_order: number;
  access_notes: string | null;
}

export interface RecordNextActionRow {
  action_id: string;
  record_id: string;
  action_type: string;
  custom_label: string | null;
  is_enabled: boolean;
  display_order: number;
}

export interface RecordDetail {
  record: InnovationRecordRow;
  artifacts: ArtifactRow[];
  next_actions: RecordNextActionRow[];
}

/**
 * Returns a full published record by slug, including artifacts and next actions.
 * Only returns records with publication_state = 'published' — accessing a draft slug returns null.
 *
 * SEC-04: Restricted artifact URLs are redacted at the query layer via CASE WHEN.
 * T-01-03-01: URL leakage prevented — restricted artifact URLs are never included in the response.
 * T-01-03-02: Draft records are excluded — unknown or draft slugs return null → 404.
 */
export async function getRecordBySlug(slug: string): Promise<RecordDetail | null> {
  // Fetch the record (published only) — T-01-03-02 mitigation
  const record = await db
    .selectFrom('innovation_records')
    .selectAll()
    .where('slug', '=', slug)
    .where('publication_state', '=', 'published')
    .executeTakeFirst();

  if (!record) return null;

  // Fetch artifacts — omit url for restricted artifacts (SEC-04, T-01-03-01)
  // Uses CASE WHEN to redact URL at query layer before data reaches application layer.
  const artifacts = await db
    .selectFrom('artifacts')
    .select([
      'artifact_id',
      'record_id',
      'artifact_type',
      'name',
      'is_restricted',
      'display_order',
      'access_notes',
      // Conditionally expose URL: null for restricted — SEC-04 enforcement
      sql<string | null>`CASE WHEN is_restricted THEN NULL ELSE url END`.as('url'),
    ])
    .where('record_id', '=', record.id)
    .orderBy('display_order', 'asc')
    .execute();

  // Fetch enabled next actions ordered by display_order
  const next_actions = await db
    .selectFrom('record_next_actions')
    .select([
      'action_id',
      'record_id',
      'action_type',
      'custom_label',
      'is_enabled',
      'display_order',
    ])
    .where('record_id', '=', record.id)
    .where('is_enabled', '=', true)
    .orderBy('display_order', 'asc')
    .execute();

  return { record, artifacts, next_actions };
}
