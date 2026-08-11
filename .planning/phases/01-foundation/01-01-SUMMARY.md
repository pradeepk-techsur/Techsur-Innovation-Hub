---
phase: 01-foundation
plan: "01"
subsystem: infra
tags: [nextjs, postgresql, docker, kysely, typescript, migrations, auth-stub]

# Dependency graph
requires: []
provides:
  - "Next.js 15 App Router TypeScript project with Docker Compose dev stack"
  - "PostgreSQL 16 database with all 8 application tables and full DDL per TechArch §3.2"
  - "Idempotent SQL migration runner (tsx-based, tracks applied files)"
  - "Typed Kysely database client (db) and raw Pool (pool) exports"
  - "dev-stub.ts: AUTH-07/SEC-09 production guard + dev session management"
  - "hub_settings seeded with 9 rows including engagement routing address"
  - "audit_events INSERT-only enforcement at DB role level"
affects:
  - "01-02 (Innovation Catalog — requires running DB + Kysely client)"
  - "01-03 (Record Display — requires running DB + schema)"
  - "All Phase 1 plans — all depend on postgres connection and schema"

# Tech tracking
tech-stack:
  added:
    - "next@15.5.23 (App Router)"
    - "react@18 + react-dom@18"
    - "kysely@0.27 (typed SQL query builder)"
    - "pg@8.12 (node-postgres)"
    - "tailwindcss@3.4 + autoprefixer + postcss"
    - "@radix-ui/react-tabs@1.1"
    - "zod@3.23"
    - "tsx@4.7 (TypeScript ESM executor for migrate script)"
    - "typescript@5.4 (strict mode)"
    - "postgres:16 (pinned Docker image)"
  patterns:
    - "Docker Compose: postgres superuser creates schema; tsio_hub_app is app-level role (enables REVOKE on audit_events)"
    - "migrate → seed → serve ordering via compose app service command"
    - "tsx for running TypeScript migration scripts (ESM-compatible alternative to ts-node)"
    - "Kysely<Database> typed interface with all 8 tables in src/lib/db/types.ts"
    - "Production guard pattern: process.exit(1) on dangerous env var combo"

key-files:
  created:
    - "docker-compose.yml"
    - "Dockerfile"
    - ".env.example"
    - "package.json"
    - "tsconfig.json"
    - "next.config.mjs"
    - "tailwind.config.ts"
    - "postcss.config.js"
    - "src/app/layout.tsx"
    - "src/app/page.tsx"
    - "src/lib/db/migrations/001_initial_schema.sql"
    - "src/lib/db/migrate.ts"
    - "src/lib/db/client.ts"
    - "src/lib/db/types.ts"
    - "src/lib/auth/dev-stub.ts"
    - "src/middleware.ts"
  modified:
    - ".gitignore (added .env exclusion rules)"

key-decisions:
  - "Used tsx instead of ts-node for migrate script: ESM-compatible, no tsconfig conflicts with Next.js bundler module resolution"
  - "Postgres superuser (postgres) creates schema and grants to tsio_hub_app app role: enables REVOKE UPDATE/DELETE on audit_events, which cannot be revoked from table owner"
  - "DATABASE_ADMIN_URL separate from DATABASE_URL: migrate.ts uses admin URL for DDL; app runtime uses app-user URL with least privilege"
  - "next.config.mjs (not .ts): Next.js 14/15 cannot read next.config.ts directly"
  - "No X-Frame-Options DENY: Hub must be embeddable in Pivota preview iframe"

patterns-established:
  - "Migration pattern: tsx src/lib/db/migrate.ts; idempotent via schema_migrations table"
  - "DB client pattern: import { db } from '@/lib/db/client' for Kysely queries"
  - "Auth pattern: ENABLE_DEV_AUTH_BYPASS=true enables dev sessions; production guard prevents accidental activation"

# Metrics
duration: 13min
completed: 2026-08-11
---

# Phase 1 Plan 01: Application Bootstrap Summary

**Next.js 15 App Router + PostgreSQL 16 dev stack with all 8 TechArch tables, Kysely typed client, idempotent migration runner, and AUTH-07 production guard for dev auth bypass**

## Performance

- **Duration:** 13 min
- **Started:** 2026-08-11T14:12:20Z
- **Completed:** 2026-08-11T14:25:56Z
- **Tasks:** 2
- **Files modified:** 17

## Accomplishments

- Docker Compose stack starts cleanly: postgres:16 db with healthcheck, Next.js app waits for `service_healthy`, migrate runs before serve
- All 8 application tables created per TechArch §3.2 with full DDL, indexes, triggers (search_vector, updated_at, version increment)
- hub_settings seeded with 9 rows including `engagement_routing_address = AOml_TSO_IRB_Team@ao.uscourts.gov`
- audit_events is INSERT-only for `tsio_hub_app` at DB role level (REVOKE UPDATE/DELETE enforced)
- dev-stub.ts raises `process.exit(1)` with FATAL message if `NODE_ENV=production && ENABLE_DEV_AUTH_BYPASS=true` (AUTH-07/SEC-09)
- Migration runner is idempotent: re-running skips already-applied migrations

## Task Commits

Each task was committed atomically:

1. **Task 1: Next.js scaffolding, Docker stack, env vars** - `d61c386` (feat)
2. **Task 2: DB schema, migrate runner, Kysely client, dev auth stub** - `588dfbc` (feat)

**Plan metadata:** (docs commit — see below)

## Files Created/Modified

- `docker-compose.yml` - postgres:16 + Next.js app services with healthcheck and depends_on
- `Dockerfile` - node:20-alpine with npm ci for reproducible builds
- `.env.example` - All required env vars with placeholder values only (no real secrets)
- `package.json` - Next.js 15 + Kysely + pg + Tailwind + tsx devDep
- `tsconfig.json` - Strict TypeScript with path aliases (@/*)
- `next.config.mjs` - No X-Frame-Options, security headers, no CSP frame-ancestors
- `src/app/layout.tsx` + `src/app/page.tsx` - Minimal App Router scaffold
- `src/lib/db/migrations/001_initial_schema.sql` - Complete DDL for all 8 tables, triggers, roles, seed
- `src/lib/db/migrate.ts` - Idempotent migration runner using tsx and DATABASE_ADMIN_URL
- `src/lib/db/client.ts` - Kysely<Database> client + Pool exports
- `src/lib/db/types.ts` - Full Kysely Database interface for all 8 tables
- `src/lib/auth/dev-stub.ts` - AUTH-07 production guard + dev session management
- `src/middleware.ts` - Next.js middleware placeholder for Phase 4 RBAC
- `.gitignore` - Added .env exclusion rules

## Decisions Made

- **tsx over ts-node**: ts-node's `--require` flag is incompatible with Node.js 20 ESM module resolution. tsx handles both CJS and ESM TypeScript transparently.
- **Separate postgres superuser and tsio_hub_app role**: The plan's SQL note acknowledged that REVOKE on audit_events has no effect if tsio_hub_app is the table owner. Restructured docker-compose to use `postgres` as POSTGRES_USER for schema creation; `tsio_hub_app` is created as an application role with explicit GRANT/REVOKE — audit_events INSERT-only constraint is enforced correctly.
- **DATABASE_ADMIN_URL**: Separate env var for the superuser connection used by migrate.ts. Fallback to DATABASE_URL if not set (for simpler environments).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Replaced ts-node with tsx for ESM-compatible TypeScript execution**
- **Found during:** Task 1 (Docker compose up verification — app container restarting)
- **Issue:** `node --require ts-node/register` fails with `TypeError: Unknown file extension ".ts"` in Node.js 20 ESM mode. Next.js 15 configures the project with `moduleResolution: "bundler"` and ESM semantics that conflict with ts-node's CommonJS --require hook.
- **Fix:** Replaced `ts-node` devDependency with `tsx@4.7`. Changed `db:migrate` script from `node --require ts-node/register src/lib/db/migrate.ts` to `tsx src/lib/db/migrate.ts`.
- **Files modified:** `package.json`
- **Verification:** `npm run db:migrate` inside Docker container runs successfully; migration log shows `[migrate] Applied: 001_initial_schema.sql`
- **Committed in:** d61c386 (Task 1 commit)

**2. [Rule 1 - Bug] Restructured DB user model to enable audit_events INSERT-only constraint**
- **Found during:** Task 2 verification of audit_events permissions
- **Issue:** When `tsio_hub_app` is the PostgreSQL `POSTGRES_USER` (table creator), `REVOKE UPDATE, DELETE ON audit_events FROM tsio_hub_app` has no effect — a table owner cannot be revoked their own object privileges. `UPDATE audit_events` returned `0 rows` instead of `permission denied`.
- **Fix:** Changed docker-compose to use `postgres` as POSTGRES_USER (superuser for schema creation). Migration SQL creates `tsio_hub_app` role via `DO $$ ... IF NOT EXISTS $$` block, then GRANTs specific privileges and REVOKEs UPDATE/DELETE on audit_events. Added `DATABASE_ADMIN_URL` for migrate.ts to connect as superuser.
- **Files modified:** `docker-compose.yml`, `src/lib/db/migrations/001_initial_schema.sql`, `src/lib/db/migrate.ts`, `.env.example`
- **Verification:** `docker compose exec db psql -U tsio_hub_app -d tsio_hub -c "UPDATE audit_events SET notes='test' WHERE 1=0;"` returns `ERROR: permission denied for table audit_events`
- **Committed in:** 588dfbc (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (2 Rule 1 bugs)
**Impact on plan:** Both fixes were necessary for correctness. The tsx fix resolves a Node.js 20 ESM compatibility issue. The DB user restructuring ensures the audit immutability security control actually works. No scope creep.

## Known Stubs

- `src/middleware.ts:11` - Curator route pass-through in Phase 1: `// Phase 1: placeholder — curator routes are accessible in dev` — **Cosmetic** — intentional per plan; Phase 4 implements full RBAC enforcement.

## Issues Encountered

None beyond the deviations documented above.

## User Setup Required

None - no external service configuration required. Dev credentials in docker-compose.yml are intentionally hardcoded for local development. Production credentials are always env-injected.

## Next Phase Readiness

- Foundation complete: `docker compose up -d` starts the full stack on port 3000
- Database schema established with all 8 tables, triggers, and seed data
- Kysely typed client ready for use: `import { db } from '@/lib/db/client'`
- Dev auth bypass operational: `ENABLE_DEV_AUTH_BYPASS=true` (set in docker-compose.yml)
- Ready for Plan 02: Innovation Catalog (F1 browse/list features)
- Ready for Plan 03: Innovation Record Display (F3 full record model)

## Self-Check: PASSED

- All 16 key files found on disk ✓
- 2 task commits present (d61c386, 588dfbc) ✓
- TypeScript: `tsc --noEmit` exits 0, no errors ✓
- No blocking stubs found ✓
- Build check: `npx tsc --noEmit` → exit 0 (Next.js dev mode; full build via docker compose up validated) ✓

---
*Phase: 01-foundation*
*Completed: 2026-08-11*
