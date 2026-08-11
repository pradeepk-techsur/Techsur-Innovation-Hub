// Email service: routes engagement to the configured I&R address
// Mode: 'smtp' uses nodemailer; 'mailto' generates a mailto: link for dev
// F8.3: email send is SECONDARY to DB persistence — failure does not cancel the engagement

export interface EmailPayload {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}

export async function sendEmail(payload: EmailPayload): Promise<{ sent: boolean; error?: string }> {
  const mode = process.env.EMAIL_ROUTING_MODE ?? 'mailto';

  if (mode === 'smtp') {
    try {
      // Production: use nodemailer (add 'nodemailer' to package.json when enabling SMTP)
      // Dynamic require used intentionally to keep nodemailer out of the bundle when not installed.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let nodemailer: any = null;
      try { nodemailer = require('nodemailer'); } catch { /* not installed */ }
      if (!nodemailer) return { sent: false, error: 'nodemailer not installed' };

      const transporter = nodemailer.default.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT ?? 587),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: payload.to,
        subject: payload.subject,
        text: payload.text,
        replyTo: payload.replyTo,
      });
      return { sent: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('[email.service] SMTP send failed:', message);
      return { sent: false, error: message };
    }
  }

  // mailto mode (dev/test): log the email details and return success
  // In dev, the mailto link is constructed in the EngagementModal CTA (F8.3 fallback)
  console.info('[email.service] mailto mode — email not sent:', {
    to: payload.to,
    subject: payload.subject,
  });
  return { sent: false, error: 'EMAIL_ROUTING_MODE=mailto — email not sent; action recorded in DB' };
}

// Build engagement email subject per F8.6 patterns
export function buildEngagementSubject(requestType: string, recordTitle?: string): string {
  const SUBJECT_PATTERNS: Record<string, string> = {
    request_demo: `Demo Request${recordTitle ? ` – ${recordTitle}` : ''}`,
    discuss_use_case: `Related Use Case Discussion${recordTitle ? ` – ${recordTitle}` : ''}`,
    explore_adoption: `Adoption Discussion${recordTitle ? ` – ${recordTitle}` : ''}`,
    request_technical_guidance: `Technical Guidance${recordTitle ? ` – ${recordTitle}` : ''}`,
    share_related_work: `Share Related Work${recordTitle ? ` – ${recordTitle}` : ''}`,
    contact_ir: `Innovation Hub Inquiry${recordTitle ? ` – ${recordTitle}` : ''}`,
  };
  return SUBJECT_PATTERNS[requestType] ?? `Innovation Hub Request${recordTitle ? ` – ${recordTitle}` : ''}`;
}

// Build email body text
export function buildEngagementBody(params: {
  requestType: string;
  requesterName: string;
  requesterOffice: string;
  requesterEmail: string;
  needDescription: string;
  desiredNextStep?: string;
  recordTitle?: string;
  referenceNumber: string;
}): string {
  return [
    `Reference: ${params.referenceNumber}`,
    `Request type: ${params.requestType.replace(/_/g, ' ')}`,
    params.recordTitle ? `Innovation record: ${params.recordTitle}` : '',
    '',
    `From: ${params.requesterName} — ${params.requesterOffice}`,
    `Email: ${params.requesterEmail}`,
    '',
    `Need description:`,
    params.needDescription,
    '',
    params.desiredNextStep ? `Desired next step: ${params.desiredNextStep}` : '',
  ].filter(l => l !== undefined).join('\n');
}
