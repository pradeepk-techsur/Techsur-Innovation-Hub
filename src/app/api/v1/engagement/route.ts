import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db/client';
import { checkRateLimit, generateReferenceNumber } from '@/lib/services/submissions.service';
import { getRoutingAddress } from '@/lib/services/hub-settings.service';
import { sendEmail, buildEngagementSubject, buildEngagementBody } from '@/lib/services/email.service';

const REQUEST_TYPES = [
  'request_demo', 'discuss_use_case', 'explore_adoption',
  'request_technical_guidance', 'share_related_work', 'contact_ir',
] as const;

const EngagementSchema = z.object({
  requestType: z.enum(REQUEST_TYPES),
  originatingRecordId: z.string().uuid().optional(),
  originatingRecordTitle: z.string().max(200).optional(),
  requesterName: z.string().min(2).max(200),
  requesterOffice: z.string().min(2).max(200),
  requesterEmail: z.string().email(),
  needDescription: z.string().min(20).max(3000),
  desiredNextStep: z.string().max(500).optional(),
  preferredContactMethod: z.enum(['email', 'phone', 'no_preference']).default('email'),
  consentToContact: z.literal(true),
});

function getClientIp(request: Request): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
}

export async function POST(request: Request) {
  // Rate limit: 10/IP/hr (SEC-06, engagement_rate_limit_per_hour in hub_settings)
  const ip = getClientIp(request);
  if (!checkRateLimit(ip, 'engagement')) {
    return NextResponse.json(
      { status: 'error', error_code: 'RATE_LIMITED', message: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ status: 'error', error_code: 'VALIDATION_ERROR', message: 'Invalid request body' }, { status: 422 });
  }

  const parsed = EngagementSchema.safeParse(body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fields[issue.path.join('.')] = issue.message;
    }
    return NextResponse.json({ status: 'error', error_code: 'VALIDATION_ERROR', message: 'Validation failed', fields }, { status: 422 });
  }

  const data = parsed.data;

  // Get routing address BEFORE insert to validate it exists (F8.4, SEC-07)
  const routingAddress = await getRoutingAddress();
  if (!routingAddress) {
    return NextResponse.json(
      { status: 'error', error_code: 'ROUTING_NOT_CONFIGURED', message: 'Engagement routing is not configured. Please contact I&R directly.' },
      { status: 503 }
    );
  }

  const id = crypto.randomUUID();
  const referenceNumber = await generateReferenceNumber('ENG');

  // F8.3 CRITICAL: PERSIST FIRST — before any email attempt
  // email_routing_initiated starts as false; updated to true only if email succeeds
  try {
    await db
      .insertInto('engagement_requests')
      .values({
        id,
        request_type: data.requestType,
        originating_record_id: data.originatingRecordId ?? null,
        originating_record_title: data.originatingRecordTitle ?? null,
        requester_name: data.requesterName,
        requester_office: data.requesterOffice,
        requester_email: data.requesterEmail,
        need_description: data.needDescription,
        desired_next_step: data.desiredNextStep ?? null,
        preferred_contact_method: data.preferredContactMethod,
        consent_to_contact: true,
        submission_ip: ip,
        routing_address_at_submission: routingAddress,  // F8.4: audit snapshot
        email_routing_initiated: false,                  // will be updated if email succeeds
        follow_up_status: 'received',
      })
      .execute();
  } catch (err) {
    console.error('[POST /api/v1/engagement] DB insert failed:', err);
    return NextResponse.json(
      { status: 'error', error_code: 'SUBMISSION_FAILED', message: 'Request could not be recorded.' },
      { status: 500 }
    );
  }

  // THEN attempt email routing (F8.3: failure does not cancel the persisted record)
  const subject = buildEngagementSubject(data.requestType, data.originatingRecordTitle);
  const emailText = buildEngagementBody({
    requestType: data.requestType,
    requesterName: data.requesterName,
    requesterOffice: data.requesterOffice,
    requesterEmail: data.requesterEmail,
    needDescription: data.needDescription,
    desiredNextStep: data.desiredNextStep,
    recordTitle: data.originatingRecordTitle,
    referenceNumber,
  });

  const emailResult = await sendEmail({
    to: routingAddress,
    subject,
    text: emailText,
    replyTo: data.requesterEmail,
  });

  // Update email_routing_initiated flag (best-effort — do not fail the response)
  if (emailResult.sent) {
    await db
      .updateTable('engagement_requests')
      .set({ email_routing_initiated: true })
      .where('id', '=', id)
      .execute()
      .catch(e => console.error('[engagement] Failed to update email_routing_initiated:', e));
  }

  return NextResponse.json(
    {
      id,
      referenceNumber,
      message: 'Your request has been received and routed to the TSIO Innovation & Research team.',
      emailSent: emailResult.sent,
    },
    { status: 201 }
  );
}
