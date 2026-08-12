import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth/middleware';
import { getRecordForCurator } from '@/lib/services/records.service';
import { runPublicationGate, transitionState } from '@/lib/services/publication.service';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireRole(request, 'curator');
  if (auth instanceof Response) return auth;

  const { id } = await params;

  const record = await getRecordForCurator(id);
  if (!record) {
    return NextResponse.json(
      { status: 'error', error_code: 'NOT_FOUND' },
      { status: 404 }
    );
  }

  // Run all 15 publication gate checks (FRD F9.10)
  const gate = await runPublicationGate(record);

  if (!gate.passed) {
    return NextResponse.json(
      {
        status: 'error',
        error_code: 'PUBLICATION_GATE_FAILED',
        message: 'Cannot publish. Required fields are missing or invalid.',
        fields: gate.errors,
        warnings: gate.warnings,
      },
      { status: 422 }
    );
  }

  const result = await transitionState({
    id,
    to: 'published',
    actorId: auth.session.userId,
    actorName: auth.session.name,
    targetTitle: record.title,
  });

  if (!result.ok) {
    return NextResponse.json(
      { status: 'error', error_code: 'TRANSITION_FAILED', message: result.error },
      { status: 400 }
    );
  }

  // Return warnings even on success (e.g., maturity/disclaimer mismatch)
  return NextResponse.json({ status: 'ok', warnings: gate.warnings });
}
