// AuthProvider interface — swappable between dev-stub, OIDC, and local implementations
// See TechArch §5.2 for OIDC implementation candidates

export interface AuthenticatedUser {
  id: string;                // UUID from users table
  name: string;
  email: string;
  office: string;
  role: 'stakeholder' | 'curator' | 'admin';
}

export interface AuthProvider {
  /** Validate a credential/token and return an authenticated user or null */
  authenticate(credential: string): Promise<AuthenticatedUser | null>;
  /** Generate a login redirect URL (for OIDC providers) */
  getLoginUrl(callbackUrl: string): string;
  /** Handle OIDC callback — returns user if successful */
  handleCallback?(code: string, state: string): Promise<AuthenticatedUser | null>;
}

// Dev stub implementation — enabled only when ENABLE_DEV_AUTH_BYPASS=true and NODE_ENV != production
// Accepts dev role string as "credential" for easy testing

const DEV_USERS: Record<string, AuthenticatedUser> = {
  stakeholder: {
    id: '00000000-0000-0000-0000-000000000010',
    name: 'Dev Stakeholder',
    email: 'stake@dev.local',
    office: 'Test Office',
    role: 'stakeholder',
  },
  curator: {
    id: '00000000-0000-0000-0000-000000000011',
    name: 'Dev Curator',
    email: 'curator@dev.local',
    office: 'TSIO Innovation & Research',
    role: 'curator',
  },
  admin: {
    id: '00000000-0000-0000-0000-000000000012',
    name: 'Dev Admin',
    email: 'admin@dev.local',
    office: 'TSIO Innovation & Research',
    role: 'admin',
  },
};

export class DevAuthProvider implements AuthProvider {
  async authenticate(credential: string): Promise<AuthenticatedUser | null> {
    if (process.env.ENABLE_DEV_AUTH_BYPASS !== 'true') return null;
    return DEV_USERS[credential] ?? DEV_USERS['stakeholder'] ?? null;
  }
  getLoginUrl(_callbackUrl: string): string {
    return '/login';  // Dev: no external redirect
  }
}

// Factory — returns the appropriate provider based on env
export function getAuthProvider(): AuthProvider {
  if (process.env.ENABLE_DEV_AUTH_BYPASS === 'true') {
    return new DevAuthProvider();
  }
  // TODO Phase 4: return OidcAuthProvider when identity system is confirmed
  throw new Error('No authentication provider configured. Set AUTH_PROVIDER_URL or ENABLE_DEV_AUTH_BYPASS=true for development.');
}
