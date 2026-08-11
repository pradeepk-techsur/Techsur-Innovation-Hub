---

## 5. Security Architecture

### 5.1 Security Requirements Mapping

| Requirement | Control | Implementation |
|---|---|---|
| SEC-01 | Admin/curator capabilities require auth | Auth middleware on all `/api/v1/curator/*` routes; SSR curator pages check session server-side |
| SEC-02 | Unauthorized users cannot access protected functions | Auth middleware returns 401 (not authenticated) or 403 (insufficient role); no silent access |
| SEC-03 | Auth/authz events are auditable | Login events, role assignments, and unauthorized access attempts on curator routes are logged to `audit_events` |
| SEC-04 | Publishing does not broaden artifact access | `is_restricted` field on artifacts is independent of publication state; restricted URLs never returned to non-curators |
| SEC-05 | Submitter contact info protected per privacy policy | `submitter_email`, `requester_email` not in public API responses; curator-only views; `submission_ip` admin-only |
| SEC-06 | Public forms protected against automated abuse | IP-based rate limiting on all public submission endpoints; CAPTCHA integration point (TBD) |
| SEC-07 | Security control failure defaults to protected state | Rate limiter failure → deny; auth service failure → deny; routing not configured → 503 |
| SEC-08 | No credentials in source code | All secrets via environment variables; `.env` gitignored; `.env.example` with placeholders committed |
| SEC-09 | Dev stubs not active in production | `ENABLE_DEV_AUTH_BYPASS` causes startup error if set in non-dev environment |
| SEC-10 | HTTP security headers in all responses | Security header middleware applied globally |
| SEC-11 | Security review status visually distinct from technical review | Separate badge components; different color and label; never merged or conflated in display |
| SEC-12 | Security decisions resolved before implementation | TBD items tracked in integration register; no capability built for operational use until resolved |

### 5.2 Authentication Architecture

#### 5.2.1 Production Authentication (INT-01 — TBD)

The authentication mechanism is TBD pending identity system discovery. The application is architected around an `AuthProvider` interface that can be swapped between implementations:

```typescript
interface AuthProvider {
  /** Validate a token (JWT or session ID) and return the authenticated user */
  validateToken(token: string): Promise<AuthenticatedUser | null>;
  /** Generate a login URL for redirect-based flows (OIDC) */
  getLoginUrl(callbackUrl: string): string;
  /** Handle the OIDC callback and return a session token */
  handleCallback(code: string, state: string): Promise<SessionToken>;
}

interface AuthenticatedUser {
  id: string;                          // UUID — stable user identifier
  displayName: string;                 // Snapshot used in audit events
  email: string;
  role: 'curator' | 'admin';
}

type SessionToken = {
  token: string;
  expiresAt: Date;
};
```

**Likely implementation candidates** (pending discovery):
- **Azure Entra ID (Government):** OIDC provider; token is a JWT with role claims from Azure AD group membership; application validates RS256 JWT without per-request callback
- **Judiciary SSO:** SAML or OIDC; similar pattern to Azure Entra ID

#### 5.2.2 Development Auth Stub (SEC-09)

```typescript
// src/lib/auth/dev-stub.ts
// NEVER imported in production builds.

const DEV_AUTH_BYPASS = process.env.ENABLE_DEV_AUTH_BYPASS === 'true';
const NODE_ENV = process.env.NODE_ENV;

if (DEV_AUTH_BYPASS && NODE_ENV === 'production') {
  console.error('FATAL: ENABLE_DEV_AUTH_BYPASS is true in production. Refusing to start.');
  process.exit(1);
}

// Fixed dev credentials — enabled only when both conditions are true
export const DEV_CURATOR_USER: AuthenticatedUser = {
  id: '00000000-0000-0000-0000-000000000001',
  displayName: 'Dev Curator',
  email: 'dev-curator@localhost',
  role: 'curator',
};

export const DEV_ADMIN_USER: AuthenticatedUser = {
  id: '00000000-0000-0000-0000-000000000002',
  displayName: 'Dev Admin',
  email: 'dev-admin@localhost',
  role: 'admin',
};
```

The dev stub accepts a `X-Dev-Auth: curator` or `X-Dev-Auth: admin` header in development mode only. In production, this header is ignored.

### 5.3 Authorization Model

#### 5.3.1 Role Definitions

| Role | Description | Scope |
|---|---|---|
| `anonymous` | Unauthenticated user | Public catalog, search, record viewing (published only), submission forms |
| `curator` | Authenticated I&R team member | All anonymous actions + create/edit/manage records, submissions, artifacts, engagement, audit history |
| `admin` | Authenticated user with settings authority | All curator actions + settings management, system-wide audit log, role management (if in scope) |

#### 5.3.2 Route-Level Authorization Matrix

| Route Pattern | Anonymous | Curator | Admin |
|---|---|---|---|
| `GET /api/v1/catalog` | ✓ | ✓ | ✓ |
| `GET /api/v1/search` | ✓ | ✓ | ✓ |
| `GET /api/v1/records/:id` (published) | ✓ | ✓ | ✓ |
| `GET /api/v1/records/:id` (draft/retired) | ✗ (404) | ✓ | ✓ |
| `GET /api/v1/records/:id/artifacts` | ✓ (restricted URL omitted) | ✓ (full URL) | ✓ |
| `POST /api/v1/engagement` | ✓ (rate-limited) | ✓ | ✓ |
| `POST /api/v1/submissions/*` | ✓ (rate-limited) | ✓ | ✓ |
| `GET /api/v1/curator/*` | ✗ (401) | ✓ | ✓ |
| `GET /api/v1/curator/audit` (system-wide) | ✗ | ✗ (403) | ✓ |
| `GET /api/v1/curator/settings` | ✗ | ✗ (403) | ✓ |
| `PUT /api/v1/curator/settings/:key` | ✗ | ✗ (403) | ✓ |

#### 5.3.3 Data-Level Authorization

- **Artifact URL suppression (SEC-04):** The `artifacts.service.ts` strips `url` from all artifacts with `is_restricted = true` before returning data to non-curator requests. This is enforced in the service layer, not the route handler, so it cannot be bypassed by route-level bugs.
- **Submission contact data (SEC-05):** `submitter_email`, `requester_email`, and `submission_ip` are never included in any public API response. They are returned only in curator API responses.
- **Catalog suppression:** Records with missing required trust fields (`maturity` or `review_statuses` null on a published record) are suppressed from public catalog and flagged for curators.

### 5.4 Rate Limiting Implementation (SEC-06)

```typescript
// Rate limit configuration (loaded from hub_settings at startup, cached 60s)
interface RateLimitConfig {
  windowMs: number;            // 3600000 (1 hour)
  maxRequests: number;         // from hub_settings
  keyGenerator: (req) => string; // IP address extraction
  skip: (req) => boolean;      // dev bypass check
  store: RateLimitStore;       // Redis or in-memory
}

// Applied to these endpoints:
const RATE_LIMITED_ROUTES = [
  { path: '/api/v1/engagement', limit: 'engagement_rate_limit_per_hour' },
  { path: '/api/v1/submissions/opportunity', limit: 'submission_rate_limit_per_hour' },
  { path: '/api/v1/submissions/contribution', limit: 'submission_rate_limit_per_hour' },
];

// IP extraction (from trusted X-Forwarded-For header behind load balancer)
const getClientIP = (req: Request): string => {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0].trim();
  return req.ip ?? '0.0.0.0';
};
```

**SEC-07 — Rate limiter failure behavior:** If the rate limit store (Redis) is unavailable and no in-memory fallback is configured, the middleware must default to **denying** the request with 503, not allowing it through.

**Development bypass (SEC-09):** `ENABLE_CAPTCHA_BYPASS=true` allows rate limit bypass only in development. If this env var is true and `NODE_ENV=production`, the application logs a startup warning and the bypass is ignored (not a hard error, unlike auth bypass, since rate limits are a softer control).

### 5.5 CSRF Protection

All mutating requests (POST, PATCH, PUT, DELETE) from browser clients require CSRF protection:

- **Next.js API routes:** Use the `csrf` package or Next.js built-in CSRF token mechanism
- **SameSite cookies:** Session cookies use `SameSite=Strict` to prevent cross-site requests
- **Custom header requirement:** API routes may require the `X-Requested-With: XMLHttpRequest` header as a secondary CSRF defense for browser-based requests
- **Public form submissions:** Use CSRF tokens embedded in the HTML form (hidden input) and validated server-side

### 5.6 Input Validation and Sanitization

All user-supplied input is validated and sanitized at the API boundary using Zod schemas before reaching the service layer:

```typescript
// Example: engagement request validation schema
const engagementRequestSchema = z.object({
  requestType: z.enum([
    'request_demo', 'discuss_use_case', 'explore_adoption',
    'request_technical_guidance', 'share_related_work', 'contact_ir'
  ]),
  originatingRecordId: z.string().uuid().optional(),
  requesterName: z.string().min(2).max(200),
  requesterOffice: z.string().min(2).max(200),
  requesterEmail: z.string().email().max(254),
  needDescription: z.string().min(20).max(3000),
  desiredNextStep: z.string().max(500).optional(),
  preferredContactMethod: z.enum(['email', 'phone', 'no_preference']).optional(),
  consentToContact: z.literal(true),  // must be true
});
```

**XSS prevention:**
- All text fields sanitized with `DOMPurify` (server-side via JSDOM or equivalent) before storage
- HTML is stripped or escaped; only plain text is stored in the database
- CSP headers prevent inline script execution even if sanitization is bypassed

**SQL injection prevention:**
- All database queries use parameterized queries (Kysely or Drizzle ORM)
- No string concatenation in SQL construction

### 5.7 HTTP Security Headers Implementation (SEC-10)

Applied via Next.js middleware to all responses:

```typescript
// next.config.ts
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline'",  // Tailwind requires this; nonce-based alternative preferred
      "img-src 'self' data:",
      "font-src 'self'",
      "connect-src 'self'",
      "frame-ancestors 'none'",
    ].join('; '),
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains',   // HTTPS deployments only
  },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];
```

**Note:** HSTS is only set in operational (HTTPS) deployments. In local development (HTTP), it is omitted.

### 5.8 Secrets Management (SEC-08)

All secrets are injected via environment variables. The following secrets must never appear in committed source code:

| Secret | Environment Variable | Used For |
|---|---|---|
| Database credentials | `DATABASE_URL` | PostgreSQL connection |
| Auth signing secret | `AUTH_SECRET` | JWT signing or OIDC client secret |
| Auth provider URL | `AUTH_PROVIDER_URL` | OIDC provider endpoint |
| Auth client ID | `AUTH_CLIENT_ID` | OIDC client identifier |
| SMTP credentials | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | Email routing |
| Redis connection | `REDIS_URL` | Rate limit store |

**`.env.example`** (committed — no real values):
```bash
# Database
DATABASE_URL=postgresql://tsio_hub_app:REPLACE_ME@localhost:5432/tsio_hub

# Authentication (TBD — replace with operational identity system)
AUTH_SECRET=REPLACE_ME
AUTH_PROVIDER_URL=https://login.microsoftonline.us/TENANT_ID/v2.0
AUTH_CLIENT_ID=REPLACE_ME

# Email routing
SMTP_HOST=REPLACE_ME
SMTP_PORT=587
SMTP_USER=REPLACE_ME
SMTP_PASS=REPLACE_ME
EMAIL_ROUTING_MODE=mailto   # smtp | mailto

# Rate limiting
RATE_LIMIT_STORE=memory     # memory | redis
REDIS_URL=redis://localhost:6379

# Development controls (MUST be false in production)
ENABLE_DEV_AUTH_BYPASS=false
ENABLE_CAPTCHA_BYPASS=false
NODE_ENV=production
```

**Operational secrets management:** In Azure Government Cloud (anticipated hosting), secrets should be injected via Azure Key Vault references in the container configuration, not passed as plain environment variables in deployment manifests committed to version control.

### 5.9 Audit Security Requirements

- All `audit_events` rows are INSERT-only at the database role level
- Curators may read audit history; they may not edit or delete entries
- The `ip_address` column in `audit_events` is not returned in standard curator API responses; accessible only to Admin role in the system-wide audit log
- `submission_ip` in submission tables is similarly restricted to Admin view
- Authentication events (login, role changes, unauthorized access attempts) are recorded in `audit_events` via the auth middleware

### 5.10 Artifact Security (SEC-04)

The Hub links to externally-hosted artifacts — it does not host, proxy, or cache artifact content. Security controls:

1. **URL suppression:** `is_restricted = true` artifacts have their `url` field stripped from all public API responses. Only `name`, `accessNotes`, `isRestricted`, and `displayOrder` are returned.
2. **Publication independence:** Changing a record's `publication_state` never changes `is_restricted` on its artifacts. These fields are completely independent.
3. **No URL validation for reachability:** The Hub stores artifact URLs as plain strings. It does not fetch, proxy, or validate artifact content at storage time. Curators are responsible for URL accuracy.
4. **HTTPS enforcement:** Artifact URLs are validated as valid URLs at storage time. HTTPS is strongly preferred; HTTP is permitted only for internal/intranet URLs (access_notes should document this).

---
