---
pivota_spec_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: completed
stopped_at: Completed 03-engagement-flows-02-PLAN.md
last_updated: "2026-08-11T18:28:19.442Z"
last_activity: "2026-08-11 — Completed 02-04 (F5 Lessons-Learned Content Model: SourceBasisBanner, audio-security-poc enriched seed with all 8 findings dimensions)"
progress:
  total_phases: 7
  completed_phases: 2
  total_plans: 18
  completed_plans: 9
  percent: 100
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-08-11)

**Core value:** A Judiciary stakeholder can arrive with a mission problem, discover relevant I&R innovation work, understand what was learned and how mature it is, and take a concrete next step — without needing to already know the project name, team, or file location.
**Current focus:** Phase 3 — Stakeholder Engagement (Phase 2 complete)

## Current Position

Phase: 2 of 5 (Discovery) — COMPLETE
Plan: 4 of 4 in phase 2 — Phase 2 COMPLETE
Status: Phase 2 complete; ready for Phase 3
Last activity: 2026-08-11 — Completed 02-04 (F5 Lessons-Learned Content Model: SourceBasisBanner, audio-security-poc enriched seed with all 8 findings dimensions)

Progress: [██████████] 100%

## Performance Metrics

**Velocity:**

- Total plans completed: 7
- Average duration: 7min
- Total execution time: ~53min

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-foundation | 2 | 20min | 10min |

**Recent Trend:**

- Last 5 plans: 13min, 7min
- Trend: improving

*Updated after each plan completion*
| Phase 01-foundation P01 | 13min | 2 tasks | 17 files |
| Phase 01-foundation P02 | 7min | 2 tasks | 14 files |
| Phase 01-foundation P03 | 11min | 2 tasks | 9 files |
| Phase 02-discovery P01 | 8min | 2 tasks | 6 files |
| Phase 02-discovery P02 | 5min | 1 tasks | 7 files |
| Phase 02-discovery P03 | 5min | 1 tasks | 6 files |
| Phase 02-discovery P04 | 4min | 1 tasks | 3 files |
| Phase 03-engagement-flows P01 | 4min | 2 tasks | 12 files |
| Phase 03-engagement-flows P02 | 8min | 2 tasks | 6 files |

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- Roadmap: AUTH split across phases — AUTH-01/07 (P1 anonymous), AUTH-08/09/10 (P3 stakeholder login), AUTH-02–06 (P4 RBAC/curator)
- Roadmap: SEED-01–12 and IA-01–05 are Phase 5 launch-acceptance conditions, not implementation tasks
- Roadmap: F3 (full record model) placed in Phase 1 so the primary journey is end-to-end before search is added
- Architecture: Next.js App Router + PostgreSQL + Docker; identity system TBD (auth stub in Phase 1)
- Blockers: Hosting environment and identity/access management TBD — both are operational blockers before non-development deployment
- [Phase 01-foundation]: tsx over ts-node for TypeScript ESM execution in Node.js 20 (ts-node --require incompatible with ESM module resolution)
- [Phase 01-foundation]: Separate postgres superuser and tsio_hub_app app role in Docker Compose: enables REVOKE UPDATE/DELETE on audit_events (table owner cannot lose own privileges)
- [Phase 01-foundation]: DATABASE_ADMIN_URL separate from DATABASE_URL: migrate.ts uses superuser for DDL; app runtime uses least-privilege tsio_hub_app
- [Phase 01-foundation]: SSR catalog page calls repository directly (not fetch('/api/v1/catalog')) to avoid loopback HTTP overhead in server components
- [Phase 01-foundation]: MaturityBadge (filled ▲ pill) vs ReviewStatusBadge (outlined ✓/🛡) — three-layer visual distinction (shape + icon + color) per F1.6 and SEC-11
- [Phase 01-foundation]: Kysely sql tagged template for CASE WHEN: db.raw() not a Kysely API; used sql<T>`...`.as() for SEC-04 URL redaction
- [Phase 01-foundation]: node-postgres DATE→Date coercion: formatReviewDate() guard in TrustBanner converts runtime Date objects to YYYY-MM-DD strings before React rendering
- [Phase 02-discovery]: Used direct pg Pool.query() instead of Kysely for tsvector+window function queries: Kysely type system cannot safely express ts_rank + @@ operator in a typed chain
- [Phase 02-discovery]: plainto_tsquery for natural-language search: treats all input as plain text, no tsquery injection possible, AND semantics match mission-problem search UX
- [Phase 02-discovery]: SSR search page calls /api/v1/search via fetch() rather than importing searchRecords() directly — keeps validation/response shape identical for external and internal callers
- [Phase 02-discovery]: PerspectiveToggle as 'use client' wrapper: toggle needs useState for active perspective; all other record components are server-friendly
- [Phase 02-discovery]: TrustBanner in each view (not above tabs): F4.4 requires TrustBanner visible in both perspectives; rendered inside each view ensures it appears regardless of active tab
- [Phase 02-discovery]: SourceBasisBanner placed in record page header (above perspective tabs) so source attribution is visible regardless of active perspective; source_basis for Audio Security POC uses plain-text reference to exercise text rendering path
- [Phase 03-engagement-flows]: AuthProvider interface abstraction: DevAuthProvider now, OidcAuthProvider wired in Phase 4 when identity system confirmed
- [Phase 03-engagement-flows]: JWT in HTTP-only cookie: middleware reads JWT via jose without DB round-trip; session payload carries name/office/email for AUTH-10 attribution
- [Phase 03-engagement-flows]: In-memory rate limiter for dev (production: Redis-backed Map replacement annotated in submissions.service.ts)

### Pending Todos

None yet.

### Blockers/Concerns

- [Pre-Phase 1]: Hosting environment unresolved — development deployment permitted; operational hosting blocks production release
- [Pre-Phase 4]: Identity and access management unresolved — dev auth stub covers Phase 1–3 work; real auth required before Phase 4 operational deployment
- [Pre-Phase 3]: SEC-06 CAPTCHA/rate-limiting mechanism TBD — dev bypass permitted; must be resolved before operational submission forms

## Session Continuity

Last session: 2026-08-11T18:28:19.441Z
Stopped at: Completed 03-engagement-flows-02-PLAN.md
Resume file: None
