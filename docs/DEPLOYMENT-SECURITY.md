# TSIO Innovation Hub — Deployment Security Verification

**Purpose:** Pre-deployment security checklist per PRD §10 and TechArch §5.
**Reference:** SEC-08 (no secrets in source), SEC-09 (dev mechanisms not in production), SEC-10 (HTTP security headers)

## SEC-08: No Credentials in Committed Source Code

Verification command:
```bash
git grep -r "devpassword\|AUTH_SECRET=\|SMTP_PASS=\|password123" \
  -- ':(exclude).env*' ':(exclude)*.md' ':(exclude)*.example' | \
  grep -v "placeholder\|REPLACE_WITH\|example\|# " && \
  echo "POTENTIAL SECRETS FOUND" || echo "CLEAN"
```

Expected result: `CLEAN`

Files that legitimately contain credential-shaped strings:
- `.env.example` — placeholder values only; all values contain "REPLACE_WITH" or are clearly non-secret
- `docker-compose.yml` — contains `devpassword` for dev DB; this is acceptable for development-only configuration. Production credentials are always injected via environment variables.
- `src/lib/db/migrations/001_initial_schema.sql` — contains `CREATE ROLE tsio_hub_app LOGIN PASSWORD 'devpassword'`; this is the dev role password for local Docker. Production DB roles use credentials injected via DATABASE_URL environment variable.

**Confirmed by:** [Name] on [Date]

## SEC-09: Development-Only Auth Bypass Guard

The `src/lib/auth/dev-stub.ts` module (plan 03-01) contains:

```typescript
if (process.env.NODE_ENV === 'production' && process.env.ENABLE_DEV_AUTH_BYPASS === 'true') {
  console.error('[FATAL] ENABLE_DEV_AUTH_BYPASS=true in production. Refusing to start.');
  process.exit(1);
}
```

Verification:
```bash
NODE_ENV=production ENABLE_DEV_AUTH_BYPASS=true node -e "require('./src/lib/auth/dev-stub.ts')" 2>&1 | \
  grep -q "FATAL\|Refusing to start" && echo "PRODUCTION GUARD ACTIVE" || echo "GUARD MISSING — FIX BEFORE DEPLOY"
```

**Confirmed by:** [Name] on [Date]

## SEC-10: HTTP Security Headers

Verification:
```bash
curl -sI https://[deployment-url]/ | grep -iE \
  "x-content-type|referrer-policy|strict-transport|x-frame|content-security"
```

Required headers on all responses:
- `X-Content-Type-Options: nosniff` — set in next.config.mjs
- `Referrer-Policy: strict-origin-when-cross-origin` — set in next.config.mjs
- `Strict-Transport-Security: max-age=63072000; includeSubDomains` — set at load balancer (HTTPS deployments)
- `X-Frame-Options` or `Content-Security-Policy frame-ancestors` — set at load balancer

Note: `X-Frame-Options: DENY` is NOT set at the application level — the Hub must be embeddable in the Pivota preview iframe. This is intentional per TechArch §1.4 (issue #79).

**Confirmed by:** [Name] on [Date]

## Launch Deployment Pre-Checklist

Before deploying to any non-development environment:

- [ ] `ENABLE_DEV_AUTH_BYPASS=false` confirmed in deployment environment variables
- [ ] `ENABLE_CAPTCHA_BYPASS=false` confirmed in deployment environment variables  
- [ ] `NODE_ENV=production` confirmed
- [ ] `AUTH_SECRET` is a random string ≥32 characters (not the dev placeholder)
- [ ] `DATABASE_URL` points to the production database (not dev/docker)
- [ ] `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` configured with real email relay
- [ ] `EMAIL_ROUTING_MODE=smtp` (not mailto)
- [ ] TLS/HTTPS enabled at load balancer or reverse proxy
- [ ] Security headers configured at load balancer
- [ ] Identity provider (OIDC/SSO) configured and tested
- [ ] Database migrations applied to production database
- [ ] Launch content seeded (`npm run db:seed-launch`)
- [ ] All PRD §12 launch conditions verified in the deployment environment
