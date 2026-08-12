import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth/middleware';
import { db } from '@/lib/db/client';
import { appendAuditEvent } from '@/lib/services/audit.service';

// F9.13 — create draft innovation record from contribution (TechArch §4.4)
// T-04-04-04: source_contribution_id immutable — set at INSERT time, stripped from PATCH updates by records.service
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRole(request, 'curator');
  if (auth instanceof Response) return auth;

  const { id } = await params;

  // Fetch the contribution
  const contribution = await db
    .selectFrom('innovation_contributions')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst();

  if (!contribution) {
    return NextResponse.json(
      { status: 'error', error_code: 'NOT_FOUND', message: 'Contribution not found.' },
      { status: 404 }
    );
  }

  if (contribution.created_record_id) {
    return NextResponse.json(
      { status: 'error', error_code: 'ALREADY_CURATED', message: 'A record was already created from this contribution.' },
      { status: 409 }
    );
  }

  const recordId = crypto.randomUUID();
  const slug =
    contribution.contribution_title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 100) +
    '-' +
    Date.now().toString(36);

  // Create draft record pre-populated from contribution (per TechArch §4.4)
  // F7.3 attribution fields preserved: contributing_offices, contributor_names, owner_steward, source_contribution_id
  await db
    .insertInto('innovation_records')
    .values({
      id: recordId,
      slug,
      publication_state: 'draft',
      created_by: auth.session.userId,
      updated_by: auth.session.userId,
      title: contribution.contribution_title,
      summary: '',
      problem_statement: contribution.problem_addressed ?? '',
      hypothesis_or_objective: '',
      outcome_summary: '',
      source_basis: '',
      // F7.3 attribution fields pre-populated from contribution
      contributing_offices: [contribution.contributing_office],
      contributor_names: [contribution.contributor_names],
      owner_steward: contribution.current_owner,
      owner_contact: contribution.owner_contact_email,
      attribution_statement: `Contributed by ${contribution.contributor_names} from ${contribution.contributing_office}.`,
      applicable_disclaimer: '',
      // T-04-04-04: source_contribution_id immutable link — set only here, never updated via PATCH
      source_contribution_id: id,
      maturity: contribution.current_maturity,
      engagement_indicator: 'none',
    })
    .execute();

  // Mark contribution as curated and link to the new record
  await db
    .updateTable('innovation_contributions')
    .set({
      status: 'curated',
      created_record_id: recordId,
      dispositioned_at: new Date() as unknown as Date,
      dispositioned_by: auth.session.userId as unknown as null,
    })
    .where('id', '=', id)
    .execute();

  await appendAuditEvent({
    eventType: 'record_created_from_contribution',
    actorId: auth.session.userId,
    actorName: auth.session.name,
    targetType: 'innovation_record',
    targetId: recordId,
    targetTitle: contribution.contribution_title,
    eventData: {
      contribution_id: id,
      contributing_office: contribution.contributing_office,
    },
  });

  return NextResponse.json(
    {
      status: 'ok',
      data: {
        recordId,
        message: 'Draft record created from contribution. Attribution fields pre-populated.',
      },
    },
    { status: 201 }
  );
}
