// DEV-ONLY authentication stub
// CRITICAL: This module MUST NOT be used in production.
// The startup guard below enforces this at boot time.

if (process.env.NODE_ENV === 'production' && process.env.ENABLE_DEV_AUTH_BYPASS === 'true') {
  console.error(
    '[FATAL] ENABLE_DEV_AUTH_BYPASS=true is set in a production environment. ' +
    'This is a development-only mechanism and MUST NOT be active in production. ' +
    'Refusing to start. (AUTH-07 / SEC-09)'
  );
  process.exit(1);
}

export interface DevSession {
  id: string;
  name: string;
  email: string;
  role: 'anonymous' | 'stakeholder' | 'curator' | 'admin';
}

const DEV_SESSIONS: Record<string, DevSession> = {
  'dev-anon':    { id: 'dev-anon',    name: 'Anonymous User',  email: '',                   role: 'anonymous' },
  'dev-stake':   { id: 'dev-stake',   name: 'Dev Stakeholder', email: 'stake@dev.local',    role: 'stakeholder' },
  'dev-curator': { id: 'dev-curator', name: 'Dev Curator',     email: 'curator@dev.local',  role: 'curator' },
  'dev-admin':   { id: 'dev-admin',   name: 'Dev Admin',       email: 'admin@dev.local',    role: 'admin' },
};

export function getDevSession(sessionId?: string): DevSession {
  if (!isDevAuthEnabled()) return DEV_SESSIONS['dev-anon'];
  return DEV_SESSIONS[sessionId ?? 'dev-anon'] ?? DEV_SESSIONS['dev-anon'];
}

export function isDevAuthEnabled(): boolean {
  return process.env.ENABLE_DEV_AUTH_BYPASS === 'true';
}

export function devAuthMiddleware(_req: Request): Response | null {
  // In dev mode: allow all requests through (returns null = "continue")
  // Future: inspect session cookie, return 401 Response if not authenticated
  return null;
}
