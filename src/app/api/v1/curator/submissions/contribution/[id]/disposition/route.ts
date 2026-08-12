import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth/middleware';
import { db } from '@/lib/db/client';
import { appendAuditEvent } from '@/lib/services/audit.service';
import { z } from 'zod';

const VALID_STATUSES = ['accepted_for_curation', 'declined', 'needs_more_information', 'duplicate'] as const;

const DispositionSchema = z.object({
  status: z.enum(VALID_STATUSES),
  curator_notes: z.string().max(3000).optional(),
});

// F9.13 — disposition a contribution submission (T-04-04-02: repudiation mitigated)
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRole(request, 'curator');
  if (auth instanceof Response) return auth;

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = DispositionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { status: 'error', error_code: 'VALIDATION_ERROR', message: 'Invalid disposition data', details: parsed.error.issues },
      { status: 422 }
    );
  }

  const existing = await db
    .selectFrom('innovation_contributions')
    .select(['id', 'contribution_title'])
    .where('id', '=', id)
    .executeTakeFirst();

  if (!existing) {
    return NextResponse.json(
      { status: 'error', error_code: 'NOT_FOUND', message: 'Contribution not found.' },
      { status: 404 }
    );
  }

  await db
    .updateTable('innovation_contributions')
    .set({
      status: parsed.data.status,
      curator_notes: parsed.data.curator_notes ?? null,
      dispositioned_at: new Date() as unknown as Date,
      dispositioned_by: auth.session.userId as unknown as null,
    })
    .where('id', '=', id)
    .execute();

  await appendAuditEvent({
    eventType: 'submission_dispositioned',
    actorId: auth.session.userId,
    actorName: auth.session.name,
    targetType: 'innovation_contribution',
    targetId: id,
    targetTitle: existing.contribution_title,
    eventData: {
      status: parsed.data.status,
      hasNotes: !!parsed.data.curator_notes,
    },
  });

  return NextResponse.json({ status: 'ok' });
}
