import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth/middleware';
import { db } from '@/lib/db/client';
import { appendAuditEvent } from '@/lib/services/audit.service';

// F9.15 — update a hub setting (admin-only, AUTH-03)
// T-04-04-01: curator role returns 403; every change emits settings_changed audit event
export async function PUT(request: Request, { params }: { params: Promise<{ key: string }> }) {
  const auth = await requireRole(request, 'admin');  // Admin only — F9.15 / AUTH-03
  if (auth instanceof Response) return auth;

  const { key } = await params;
  const body = await request.json().catch(() => null);

  if (!body || typeof body.value !== 'string') {
    return NextResponse.json(
      { status: 'error', error_code: 'VALIDATION_ERROR', message: 'value field required (string).' },
      { status: 422 }
    );
  }

  const existing = await db
    .selectFrom('hub_settings')
    .select(['setting_key', 'setting_value', 'setting_type', 'description'])
    .where('setting_key', '=', key)
    .executeTakeFirst();

  if (!existing) {
    return NextResponse.json(
      { status: 'error', error_code: 'NOT_FOUND', message: `Setting '${key}' not found.` },
      { status: 404 }
    );
  }

  await db
    .updateTable('hub_settings')
    .set({
      setting_value: body.value,
      updated_at: new Date() as unknown as Date,
      updated_by: auth.session.userId as unknown as null,
    })
    .where('setting_key', '=', key)
    .execute();

  // T-04-04-01: every settings change emits audit event with previous + new values
  await appendAuditEvent({
    eventType: 'settings_changed',
    actorId: auth.session.userId,
    actorName: auth.session.name,
    targetType: 'hub_settings',
    targetId: key,
    targetTitle: existing.description ?? key,
    eventData: {
      key,
      previousValue: existing.setting_value,
      newValue: body.value,
    },
  });

  return NextResponse.json({ status: 'ok' });
}
