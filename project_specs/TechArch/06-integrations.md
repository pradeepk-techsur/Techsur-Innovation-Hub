---

## 7. Integration Points

### 7.1 Integration Registry

| ID | Integration | Required For | Operational Blocker | Dev Stub Permitted | Status |
|---|---|---|---|---|---|
| INT-01 | Identity and Access Management | All curator/admin routes | Yes | Yes (dev auth bypass) | TBD — discovery |
| INT-02 | Hosting Environment | Operational deployment | Yes | Yes (local dev) | TBD — discovery |
| INT-03 | Engagement Email Routing | F8 engagement requests | No (email-first approved) | Yes (mailto or log) | Address confirmed; mechanism TBD |
| INT-04 | Authoritative Artifact Repositories | F3.8 artifact links | No | No (plain URLs) | URLs per-record |
| INT-05 | Automated Submission Protection | F6/F7/F8 public forms | Yes (if security baseline requires) | Yes (in-memory rate limit) | TBD — security baseline |
| INT-06 | Usage Analytics | PRD §11 hypothesis validation | No (pre-launch) | Yes (structured logs) | Method TBD |
| INT-07 | Database (PostgreSQL) | All persistence | Yes (part of hosting) | Yes (local PostgreSQL) | TBD — hosting |
| INT-08 | Secrets Management | SEC-08 compliance | Yes | Yes (.env for dev) | Required before operational |

### 7.2 INT-01 — Identity and Access Management

**What the Hub needs:**
- Authenticate curator/admin users before granting access to `/api/v1/curator/*` endpoints and `/curator/*` SSR pages
- A stable user identifier (UUID) per authenticated user — for `created_by`, `updated_by`, `actor_id` in audit events
- A role claim (`curator` | `admin`) per user
- Token validation that does not require a per-request callback to the identity provider (JWT preferred)

**Integration contract:**
```typescript
// The Hub's AuthProvider interface — concrete implementation TBD
interface AuthProvider {
  validateToken(token: string): Promise<AuthenticatedUser | null>;
  getLoginUrl(callbackUrl: string): string;
  handleCallback(code: string, state: string): Promise<SessionToken>;
}
```

**Likely implementation:** Azure Entra ID Government via OIDC. NextAuth.js v5 provides the integration framework. User roles mapped from Azure AD group membership to `curator` / `admin` claims.

**Dev stub:** `ENABLE_DEV_AUTH_BYPASS=true` enables fixed dev credentials. Startup error if enabled in `NODE_ENV=production`.

**Blocker condition:** Must be resolved and implemented before any non-development deployment of curator/admin functionality.

### 7.3 INT-02 — Hosting Environment

**What the Hub needs:**
- HTTPS with a valid TLS certificate
- Container runtime support (Docker / Kubernetes / App Service)
- Secrets injection mechanism (not plain env vars in committed config)
- Network access controls (restrict database port; expose only HTTP/HTTPS)
- Persistent storage for PostgreSQL data volume

**Anticipated environment:** Azure Government Cloud. Compatible hosting options:
- Azure App Service (Web App for Containers)
- Azure Kubernetes Service (AKS)
- Azure Container Apps

**Architecture impact:** The application is containerized and hosting-agnostic. No Azure-specific SDK calls in application code. Configuration via environment variables ensures portability.

**Blocker condition:** Must be resolved before operational deployment. Affects database hosting decision (INT-07), secrets management approach (INT-08), and CI/CD pipeline (TBD).

### 7.4 INT-03 — Engagement Email Routing

**What the Hub needs:**
- Route engagement requests to `hub_settings.engagement_routing_address` (default: `AOml_TSO_IRB_Team@ao.uscourts.gov`)
- Routing address must be configurable without code change (F8.4, F9.15)
- Engagement request persisted to `engagement_requests` table before email is triggered
- Email send failure must not result in a lost engagement record

**MVP routing flow:**
```
User submits engagement form
         │
         ▼
System validates + persists to engagement_requests table
         │
         ▼
EMAIL_ROUTING_MODE = ?
    ┌────┴────┐
    ▼         ▼
 smtp       mailto
    │         │
    ▼         ▼
Send email  Open user's
via SMTP    email client
    │       with pre-filled
    │       to/subject/body
    ▼         │
Set email_routing_initiated = true
    │
    ▼
Return success to user
(reference number)
```

**SMTP implementation (when `EMAIL_ROUTING_MODE=smtp`):**
```typescript
interface EmailRoutingConfig {
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  secure: true,   // TLS
}

interface EngagementEmail {
  to: string;                    // from hub_settings.engagement_routing_address
  subject: string;               // formatted subject pattern (F8.6)
  text: string;                  // engagement request details (no HTML required)
}
```

**Email failure handling:** If SMTP send fails, `email_routing_initiated` is set to `false` and the engagement request is flagged in the curator engagement queue. The user receives a success confirmation (the request is recorded). The curator must manually follow up.

**Subject patterns (F8.6):**

| Request Type | Subject Pattern |
|---|---|
| `request_demo` | `Demo Request – {Innovation Record Title}` |
| `discuss_use_case` | `Innovation Opportunity – {Office} – {Topic}` |
| `explore_adoption` | `Adoption Discussion – {Innovation Record Title}` |
| `request_technical_guidance` | `Technical Guidance – {Innovation Record Title}` |
| `share_related_work` | `Innovation Opportunity – {Office} – {Topic}` |
| `contact_ir` | `Innovation Opportunity – {Office} – {Topic}` |

### 7.5 INT-04 — Authoritative Artifact Repositories

**What the Hub needs:**
- Store artifact metadata (name, type, URL, access notes, is_restricted) in the `artifacts` table
- Link to authoritative sources via URL (SharePoint, Git, network file locations)
- No API integration with source systems — artifact links are plain URLs

**No integration required.** Artifact URLs are curator-provided strings. The Hub:
- Does not crawl, fetch, or validate artifact reachability at storage time
- Does not proxy artifact content
- Does not check URL freshness
- Does display `access_notes` so users know what access is required

**Security:** Restricted artifact URLs (`is_restricted = true`) are never returned in public API responses (SEC-04). Publishing a record does not change `is_restricted`.

### 7.6 INT-05 — Automated Submission Protection

**What the Hub needs:**
- Rate limiting on public submission endpoints (F6/F7: 5/IP/hr, F8: 10/IP/hr)
- Optionally: CAPTCHA for operational environments (TBD — pending security baseline)

**Rate limiting implementation:**
- Configured per IP address using `X-Forwarded-For` header (trusted from load balancer)
- Limits configurable via `hub_settings` (`submission_rate_limit_per_hour`, `engagement_rate_limit_per_hour`)
- Store: Redis (production multi-instance) or in-memory (development single-instance)
- SEC-07: if rate limit store unavailable → deny requests

**CAPTCHA integration point (when required):**
```typescript
// CAPTCHA is wired but bypassable in development
const CAPTCHA_BYPASS = process.env.ENABLE_CAPTCHA_BYPASS === 'true' 
  && process.env.NODE_ENV !== 'production';

async function validateCaptcha(token: string): Promise<boolean> {
  if (CAPTCHA_BYPASS) return true;
  // Implementation: Google reCAPTCHA v3, hCaptcha, or AO-approved equivalent
  // TBD pending security baseline decision
  return await callCaptchaVerificationAPI(token);
}
```

### 7.7 INT-06 — Usage Analytics

**What the Hub needs:**
- Basic event tracking for catalog views, record views, search queries, CTA clicks, submissions
- No PII collection without Judiciary privacy approval
- No third-party tracking without appropriate review

**Development approach:** Structured JSON server-side logging is acceptable for development and MVP. Events logged to application stdout/stderr, captured by container logging infrastructure.

**Event schema (development/MVP):**
```typescript
interface AnalyticsEvent {
  eventName: string;    // 'catalog_view', 'record_view', 'search_query', 'cta_click', etc.
  timestamp: string;    // ISO 8601
  sessionId?: string;   // anonymous session identifier; no PII
  recordId?: string;    // UUID of related record (no title in logs)
  searchQuery?: string; // sanitized; no PII
  filterKeys?: string[]; // which filters were used (not values)
}
```

**Operational approach:** TBD pending Judiciary privacy review and analytics method decision. Options include Azure Application Insights (Government), self-hosted Matomo, or structured log analysis.

### 7.8 INT-07 — Database

**What the Hub needs:**
- PostgreSQL 15+ with JSONB, text arrays, tsvector, referential integrity, and row-level constraints
- Application DB role with INSERT-only on `audit_events`
- Persistent data volume (not ephemeral)
- Regular automated backups (operational requirement; configuration TBD per hosting)

**Development:** Local PostgreSQL via Docker container (`postgres:15-alpine` image).

**Operational:** TBD pending hosting decision. Azure Database for PostgreSQL (Flexible Server — Government) is the expected candidate.

**Connection configuration:**
```
DATABASE_URL=postgresql://{user}:{password}@{host}:{port}/{database}
```

Maximum connection pool size should be configured based on hosting environment. Default: 10 connections.

### 7.9 INT-08 — Secrets Management

**Development approach:**
- `.env` file (gitignored) for local development
- `.env.example` with placeholder values committed to version control
- Never commit real credentials

**Operational approach (anticipated Azure Government):**
- Azure Key Vault for secret storage
- Secrets injected as environment variables into the container at runtime via Azure Key Vault references
- No secrets in Dockerfiles, docker-compose files committed to version control, or CI/CD pipeline definitions

**Secret inventory:**

| Secret | Environment Variable | Notes |
|---|---|---|
| PostgreSQL connection string | `DATABASE_URL` | Includes username + password |
| Auth signing secret / client secret | `AUTH_SECRET` | JWT key or OIDC client secret |
| Auth provider URL | `AUTH_PROVIDER_URL` | OIDC issuer URL |
| Auth client ID | `AUTH_CLIENT_ID` | OIDC application client ID |
| SMTP credentials | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | Email relay |
| Redis URL | `REDIS_URL` | If Redis rate limiting is used |

**SEC-08 compliance checklist:**
- [ ] `.env` is in `.gitignore`
- [ ] `.env.example` has only placeholder values (e.g., `REPLACE_ME`)
- [ ] No secrets in `Dockerfile` or `docker-compose.yml`
- [ ] No secrets in CI/CD pipeline YAML committed to version control
- [ ] Deployment documentation specifies how each secret is provided in each environment

---

*TechArch-TechSurHub.md — assembled from TechArch/ chunk files.*
*Chunk files: 00-overview.md, 01-components.md, 02-data-model.md, 03-api.md, 04-security.md, 05-tech-stack.md, 06-integrations.md*
