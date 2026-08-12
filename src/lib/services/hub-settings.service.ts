import { db } from '@/lib/db/client';

// Cache settings in memory with 60s TTL to avoid per-request DB reads
const cache = new Map<string, { value: string; expiresAt: number }>();

export async function getSettingValue(key: string): Promise<string | null> {
  const cached = cache.get(key);
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  const row = await db
    .selectFrom('hub_settings')
    .select(['setting_value'])
    .where('setting_key', '=', key)
    .executeTakeFirst();

  if (!row) return null;
  cache.set(key, { value: row.setting_value, expiresAt: Date.now() + 60_000 });
  return row.setting_value;
}

// F8.4: routing address configurable without code change
export async function getRoutingAddress(): Promise<string> {
  const addr = await getSettingValue('engagement_routing_address');
  // Default from PRD if not set — should always be set via hub_settings seed
  return addr ?? 'AOml_TSO_IRB_Team@ao.uscourts.gov';
}

export async function getRoutingDisplayName(): Promise<string> {
  return (await getSettingValue('engagement_routing_display_name')) ?? 'TSIO Innovation & Research';
}
