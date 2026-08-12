import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth/middleware';
import { db } from '@/lib/db/client';
import { appendAuditEvent } from '@/lib/services/audit.service';
import { z } from 'zod';

const ARTIFACT_TYPES = [
  'lessons_learned',
  'poc_report',
  'decision_brief',
  'architecture_diagram',
  'demo_video',
  'repository',
  'infrastructure_definition',
  'test_results',
  'security_findings',
  'technical_playbook',
  'other',
] as const;

const ArtifactSchema = z.object({
  name: z.string().min(3).max(200),
  url: z.string().url().max(2048),
  artifact_type: z.enum(ARTIFACT_TYPES),
  is_restricted: z.boolean().default(false),
  access_notes: z.string().max(500).optional(),
  display_order: z.number().int().default(0),
});

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRole(request, 'curator');
  if (auth instanceof Response) return auth;

  const { id } = await params;
  // Curator gets full URLs including restricted
  const artifacts = await db
    .selectFrom('artifacts')
    .selectAll()
    .where('record_id', '=', id)
    .orderBy('display_order')
    .execute();

  return NextResponse.json({ status: 'ok', data: artifacts });
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRole(request, 'curator');
  if (auth instanceof Response) return auth;

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = ArtifactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { status: 'error', error_code: 'VALIDATION_ERROR', fields: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const artifactId = crypto.randomUUID();
  await db
    .insertInto('artifacts')
    .values({
      artifact_id: artifactId,
      record_id: id,
      added_by: auth.session.userId,
      ...parsed.data,
    })
    .execute();

  await appendAuditEvent({
    eventType: 'artifact_added',
    actorId: auth.session.userId,
    actorName: auth.session.name,
    targetType: 'artifact',
    targetId: artifactId,
    eventData: { record_id: id, name: parsed.data.name },
  });

  return NextResponse.json({ status: 'ok', data: { artifact_id: artifactId } }, { status: 201 });
}
