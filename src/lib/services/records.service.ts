import { db } from '@/lib/db/client';
import { appendAuditEvent } from '@/lib/services/audit.service';
import type { InnovationRecordRow } from '@/lib/db/types';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 120)
    + '-' + Date.now().toString(36);
}

export async function createRecord(params: {
  title?: string;
  problemStatement?: string;
  actorId: string;
  actorName: string;
}): Promise<string> {
  const id = crypto.randomUUID();
  const slug = generateSlug(params.title ?? 'untitled-record');

  await db
    .insertInto('innovation_records')
    .values({
      id,
      slug,
      publication_state: 'draft',
      created_by: params.actorId,
      updated_by: params.actorId,
      title: params.title ?? '',
      summary: '',
      problem_statement: params.problemStatement ?? '',
      hypothesis_or_objective: '',
      outcome_summary: '',
      source_basis: '',
      owner_steward: '',
      attribution_statement: '',
      applicable_disclaimer: '',
    })
    .execute();

  await appendAuditEvent({
    eventType: 'record_created',
    actorId: params.actorId,
    actorName: params.actorName,
    targetType: 'innovation_record',
    targetId: id,
    targetTitle: params.title,
    eventData: { slug },
  });

  return id;
}

export type UpdateResult =
  | { ok: true }
  | { ok: false; conflict: true }
  | { ok: false; error: string };

export async function updateRecord(params: {
  id: string;
  version: number;        // optimistic concurrency
  changes: Partial<InnovationRecordRow>;
  actorId: string;
  actorName: string;
  targetTitle?: string;
}): Promise<UpdateResult> {
  // Verify version before update (optimistic concurrency — TechArch §4.4)
  const current = await db
    .selectFrom('innovation_records')
    .select(['version', 'publication_state', 'title'])
    .where('id', '=', params.id)
    .executeTakeFirst();

  if (!current) return { ok: false, error: 'Record not found' };
  if (current.version !== params.version) return { ok: false, conflict: true };

  // Remove system-managed fields from changes
  const {
    id: _id,
    created_at: _ca,
    created_by: _cb,
    version: _v,
    search_vector: _sv,
    ...safeChanges
  } = params.changes as Record<string, unknown>;

  await db
    .updateTable('innovation_records')
    .set({ ...safeChanges, updated_by: params.actorId } as Partial<InnovationRecordRow>)
    .where('id', '=', params.id)
    .where('version', '=', params.version)  // double-check at DB level
    .execute();

  await appendAuditEvent({
    eventType: 'record_updated',
    actorId: params.actorId,
    actorName: params.actorName,
    targetType: 'innovation_record',
    targetId: params.id,
    targetTitle: params.targetTitle ?? current.title,
    eventData: { changedFields: Object.keys(safeChanges) },
  });

  return { ok: true };
}

export async function getRecordForCurator(id: string): Promise<(InnovationRecordRow & { artifacts: Record<string, unknown>[] }) | null> {
  const record = await db
    .selectFrom('innovation_records')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst();

  if (!record) return null;

  // Curator gets FULL artifact URLs (including restricted)
  const artifacts = await db
    .selectFrom('artifacts')
    .selectAll()
    .where('record_id', '=', id)
    .orderBy('display_order', 'asc')
    .execute();

  return { ...record, artifacts };
}
