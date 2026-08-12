import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db/client';
import { checkRateLimit, generateReferenceNumber } from '@/lib/services/submissions.service';

const MATURITY_VALUES = ['idea', 'evaluated_idea', 'experiment_poc', 'prototype_pilot', 'production_validated', 'archived_retired'] as const;
const COLLABORATION_PREFS = ['open_for_reuse', 'seeking_collaborator', 'informational_only', 'seeking_adopter', 'discuss_with_ir'] as const;

const ContributionSchema = z.object({
  contributionTitle: z.string().min(5).max(200),
  problemAddressed: z.string().min(30).max(3000),
  workDescription: z.string().min(50).max(5000),
  contributingOffice: z.string().min(2).max(200),   // F7.3: required — attribution
  contributorNames: z.string().min(2).max(500),       // F7.3: required — attribution
  currentMaturity: z.enum(MATURITY_VALUES),
  currentOwner: z.string().min(2).max(200),           // F7.3: required — ownership
  ownerContactEmail: z.string().email(),
  collaborationPreference: z.enum(COLLABORATION_PREFS),
  artifactLinks: z.string().max(3000).optional(),
  knownLimitations: z.string().max(3000).optional(),
  additionalContext: z.string().max(3000).optional(),
  submitterName: z.string().min(2).max(200),
  submitterEmail: z.string().email(),
  nonEndorsementAcknowledged: z.literal(true),        // F7.4 — required
  consentToContact: z.literal(true),
});

function getClientIp(request: Request): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
}

export async function POST(request: Request) {
  // Rate limiting (SEC-06): shared 5/IP/hr with opportunity submissions
  const ip = getClientIp(request);
  if (!checkRateLimit(ip, 'submission')) {
    return NextResponse.json(
      { status: 'error', error_code: 'RATE_LIMITED', message: 'Too many submissions. Please try again later.' },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ status: 'error', error_code: 'VALIDATION_ERROR', message: 'Invalid request body' }, { status: 422 });
  }

  const parsed = ContributionSchema.safeParse(body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fields[issue.path.join('.')] = issue.message;
    }
    return NextResponse.json({ status: 'error', error_code: 'VALIDATION_ERROR', message: 'Validation failed', fields }, { status: 422 });
  }

  const data = parsed.data;
  const id = crypto.randomUUID();
  const referenceNumber = await generateReferenceNumber('CONTRIB');

  try {
    await db
      .insertInto('innovation_contributions')
      .values({
        id,
        contribution_title: data.contributionTitle,
        problem_addressed: data.problemAddressed,
        work_description: data.workDescription,
        contributing_office: data.contributingOffice,    // F7.3: preserved immutably
        contributor_names: data.contributorNames,         // F7.3: preserved immutably
        current_maturity: data.currentMaturity,
        current_owner: data.currentOwner,
        owner_contact_email: data.ownerContactEmail,
        collaboration_preference: data.collaborationPreference,
        artifact_links: data.artifactLinks ?? null,
        known_limitations: data.knownLimitations ?? null,
        additional_context: data.additionalContext ?? null,
        submitter_name: data.submitterName,
        submitter_email: data.submitterEmail,
        non_endorsement_acknowledged: true,
        consent_to_contact: true,
        submission_ip: ip,
        status: 'pending',
      })
      .execute();

    return NextResponse.json(
      {
        id,
        referenceNumber,
        message: 'Your contribution has been received and will enter the curation review process. Submission does not imply central endorsement or immediate publication.',
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('[POST /api/v1/submissions/contribution] DB error:', err);
    return NextResponse.json(
      { status: 'error', error_code: 'SUBMISSION_FAILED', message: 'Submission could not be saved. Please try again.' },
      { status: 500 }
    );
  }
}
