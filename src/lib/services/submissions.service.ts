import { db } from '@/lib/db/client';

// Simple in-memory rate limiter (dev; production: Redis-backed per TechArch §5.4)
const ipSubmissions = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(ip: string, limitKey: 'submission' | 'engagement'): boolean {
  const limit = limitKey === 'submission' ? 5 : 10;  // from hub_settings
  const now = Date.now();
  const entry = ipSubmissions.get(`${ip}:${limitKey}`);

  if (!entry || entry.resetAt < now) {
    ipSubmissions.set(`${ip}:${limitKey}`, { count: 1, resetAt: now + 3600_000 });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

export async function generateReferenceNumber(prefix: 'OPP' | 'CONTRIB' | 'ENG'): Promise<string> {
  const year = new Date().getFullYear();
  // Count existing submissions of this type for sequential numbering
  const table = prefix === 'OPP' ? 'opportunity_submissions'
    : prefix === 'CONTRIB' ? 'innovation_contributions'
    : 'engagement_requests';
  // Simple sequential approach: count rows and pad
  const result = await db
    .selectFrom(table as 'opportunity_submissions')
    .select(db.fn.count('id').as('count'))
    .executeTakeFirst();
  const seq = String((Number(result?.count ?? 0) + 1)).padStart(3, '0');
  return `${prefix}-${year}-${seq}`;
}
