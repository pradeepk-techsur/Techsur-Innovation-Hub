import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth/middleware';
import { db } from '@/lib/db/client';

// F9.15 — list all hub settings (admin-only, AUTH-03)
export async function GET(request: Request) {
  const auth = await requireRole(request, 'admin');
  if (auth instanceof Response) return auth;

  const settings = await db
    .selectFrom('hub_settings')
    .select(['setting_key', 'setting_value', 'setting_type', 'description', 'updated_at'])
    .orderBy('setting_key', 'asc')
    .execute();

  // Return as a keyed object for easy consumption
  const settingsMap = Object.fromEntries(
    settings.map((s) => [
      s.setting_key,
      {
        value: s.setting_value,
        type: s.setting_type,
        description: s.description,
        updatedAt: s.updated_at,
      },
    ])
  );

  return NextResponse.json({ status: 'ok', data: settingsMap });
}
