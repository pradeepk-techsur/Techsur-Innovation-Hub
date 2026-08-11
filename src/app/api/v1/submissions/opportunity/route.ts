import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db/client';
import { checkRateLimit, generateReferenceNumber } from '@/lib/services/submissions.service';

const OPPORTUNITY_REQUEST_TYPES = [
  'current_mission_problem', 'emerging_tech_question', 'request_for_research',
  'potential_poc', 'request_for_demo', 'collaboration_opportunity',
  'share_existing_work', 'other',
] as const;

const OpportunitySchema = z.object({
  requestType: z.enum(OPPORTUNITY_REQUEST_TYPES),
  problemTitle: z.string().min(5).max(200),
  problemDescription: z.string().min(50).max(5000),  // F6.1: min 50 chars — must describe problem
  affectedUsers: z.string().min(10).max(1000),
  impact: z.string().min(10).max(1000),
  submittingOffice: z.string().min(2).max(200),
  submitterName: z.string().min(2).max(200),
  submitterEmail: z.string().email(),
  currentWorkflow: z.string().max(2000).optional(),
  desiredOutcome: z.string().max(2000).optional(),
  knownConstraints: z.string().max(2000).optional(),
  relatedWorkAttempted: z.string().max(2000).optional(),
  discoveryParticipants: z.string().max(500).optional(),
  additionalContext: z.string().max(3000).optional(),
  consentToContact: z.literal(true),
  nonAcceptanceAcknowledged: z.literal(true),  // F6.4 — must be explicitly true
});

function getClientIp(request: Request): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
}

export async function POST(request: Request) {
  // Rate limiting (SEC-06): 5/IP/hr
  const ip = getClientIp(request);
  if (!checkRateLimit(ip, 'submission')) {
    return NextResponse.json(
      { status: 'error', error_code: 'RATE_LIMITED', message: 'Too many submissions. Please try again later.' },
      { status: 429 }
    );
  }

  // Parse and validate body
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ status: 'error', error_code: 'VALIDATION_ERROR', message: 'Invalid request body' }, { status: 422 });
  }

  const parsed = OpportunitySchema.safeParse(body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fields[issue.path.join('.')] = issue.message;
    }
    return NextResponse.json(
      { status: 'error', error_code: 'VALIDATION_ERROR', message: 'Validation failed', fields },
      { status: 422 }
    );
  }

  const data = parsed.data;

  // Persist (F6.5: must be recorded for curator review)
  const id = crypto.randomUUID();
  const referenceNumber = await generateReferenceNumber('OPP');

  try {
    await db
      .insertInto('opportunity_submissions')
      .values({
        id,
        request_type: data.requestType,
        problem_title: data.problemTitle,
        problem_description: data.problemDescription,
        affected_users: data.affectedUsers,
        current_workflow: data.currentWorkflow ?? null,
        impact: data.impact,
        desired_outcome: data.desiredOutcome ?? null,
        known_constraints: data.knownConstraints ?? null,
        related_work_attempted: data.relatedWorkAttempted ?? null,
        submitting_office: data.submittingOffice,
        submitter_name: data.submitterName,
        submitter_email: data.submitterEmail,
        discovery_participants: data.discoveryParticipants ?? null,
        additional_context: data.additionalContext ?? null,
        consent_to_contact: true,
        non_acceptance_acknowledged: true,
        submission_ip: ip,
        status: 'pending',
      })
      .execute();

    return NextResponse.json(
      { id, referenceNumber, message: 'Your submission has been received. This does not imply acceptance into the I&R portfolio.' },
      { status: 201 }
    );
  } catch (err) {
    console.error('[POST /api/v1/submissions/opportunity] DB error:', err);
    return NextResponse.json(
      { status: 'error', error_code: 'SUBMISSION_FAILED', message: 'Submission could not be saved. Please try again.' },
      { status: 500 }
    );
  }
}
