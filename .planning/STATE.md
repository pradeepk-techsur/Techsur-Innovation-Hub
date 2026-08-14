---
pivota_spec_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: executing
stopped_at: Completed 06-02-PLAN.md
last_updated: "2026-08-14T02:30:13.173Z"
last_activity: 2026-08-12 — Completed 05-02 launch content seed (8 records, all SEED dimensions covered)
progress:
  total_phases: 11
  completed_phases: 4
  total_plans: 27
  completed_plans: 24
  percent: 87
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-08-11)

**Core value:** A Judiciary stakeholder can arrive with a mission problem, discover relevant I&R innovation work, understand what was learned and how mature it is, and take a concrete next step — without needing to already know the project name, team, or file location.
**Current focus:** Phase 5 — Launch Acceptance (Phase 4 complete)

## Current Position

Phase: 5 of 8 (Launch Readiness) — In progress
Plan: 2 of ? in phase 5 — 20 of 23 plans done
Status: Phase 5 in progress; 05-01 and 05-02 complete; launch seed (SEED-01–12) done
Last activity: 2026-08-12 — Completed 05-02 launch content seed (8 records, all SEED dimensions covered)

Progress: [█████████░] 87%

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
| Phase 03-engagement-flows P03 | 3min | 1 tasks | 5 files |
| Phase 03-engagement-flows P04 | 4min | 2 tasks | 6 files |
| Phase 04-curation-and-administration P01 | 4min | 1 tasks | 5 files |
| Phase 04-curation-and-administration P02 | 6min | 2 tasks | 12 files |
| Phase 04-curation-and-administration P03 | 3min | 1 tasks | 8 files |
| Phase 04-curation-and-administration P04 | 6min | 2 tasks | 16 files |
| Phase 04-curation-and-administration P05 | 3min | 2 tasks | 7 files |
| Phase 04-curation-and-administration P06 | 8min | 2 tasks | 5 files |
| Phase 04-curation-and-administration P07 | 6min | 2 tasks | 4 files |
| Phase 05-launch-readiness P02 | 7min | 1 tasks | 4 files |
| Phase 05-launch-readiness P01 | 10min | 1 tasks | 6 files |
| Phase 05-launch-readiness P03 | 7min | 2 tasks | 8 files |
| Phase 06-end-to-end-verification P01 | 5min | 2 tasks | 13 files |
| Phase 06-end-to-end-verification P02 | 5min | 1 tasks | 2 files |

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
- [Phase 03-engagement-flows]: Two-step contribution form: Step 1 (about the work) → Step 2 (attribution + contact) — simpler than F6 3-step, appropriate for contribution detail level
- [Phase 03-engagement-flows]: DB-first engagement: INSERT to engagement_requests before sendEmail(); email failure sets email_routing_initiated=false but record always persisted (F8.3)
- [Phase 03-engagement-flows]: routing_address_at_submission snapshot: audit field captured at INSERT time from hub_settings; past records retain routing address in effect at submission (F8.4 + T-03-04-03)
- [Phase 04-curation-and-administration]: user_role_changed event_type for auth denials: DB CHECK constraint incompatible with 'unauthorized_access_attempt'; event_data.reason distinguishes denial categories
- [Phase 04-curation-and-administration]: requireRole() returns { session } or Response (not throw): callers use instanceof Response guard — consistent with Next.js Route Handler idiom
- [Phase 04-curation-and-administration]: Optimistic concurrency double-check: updateRecord() checks version at service AND DB WHERE clause; PostgreSQL trg_ir_version trigger makes stale writes 0-row no-ops
- [Phase 04-curation-and-administration]: params as Promise in Next.js 15: dynamic route params are Promise<{id}> — handlers must await params before destructuring
- [Phase 04-curation-and-administration]: ALLOWED_TRANSITIONS map in transitionState() enforces valid lifecycle sequence; VALID_REVIEW_STATUSES expanded to match editor values so Check 11 correctly validates curator-set statuses
- [Phase 04-curation-and-administration]: Content model reference as static code: governance definitions are canonical FRD values versioned with the application
- [Phase 04-curation-and-administration]: Dual-layer admin enforcement for settings: API returns 403 for curator role; UI detects 403 and redirects
- [Phase 04-curation-and-administration]: Applied cookies() from next/headers SSR cookie forwarding pattern to dashboard, record list, and record editor pages (same pattern as reference/page.tsx)
- [Phase 04-curation-and-administration]: problem_statement added as optional field at record creation (not required); reduces friction while ensuring field is available for publication gate
- [Phase 04-curation-and-administration]: Unauthorized page at /unauthorized (top-level, outside /curator route tree) — avoids infinite redirect loop; curator layout fires for all /curator/* children
- [Phase 04-curation-and-administration]: Two-branch RBAC layout: !session→/login, wrong-role→/unauthorized — not collapsed into single redirect (AUTH-04 gap closure)
- [Phase 04-curation-and-administration]: nextUrl.clone() in middleware redirect — eliminates proxy hostname leak in Location header
- [Phase 04-curation-and-administration]: SameSite=None; Secure unconditionally for session cookie — cross-origin preview proxy compatibility
- [Phase 05-launch-readiness]: Artifact idempotency via NOT EXISTS guard on (record_id, name) — artifacts table has no unique key
- [Phase 05-launch-readiness]: Placeholder artifact URLs (placeholder.ao.uscourts.gov) are intentional per T-05-02-01 threat model — replaced with real URLs before launch
- [Phase 05-launch-readiness]: Home page moved from src/app/page.tsx to src/app/(public)/page.tsx so all public pages including home have auth-state nav (IA-05)
- [Phase 05-launch-readiness]: Skip link target requires tabIndex={-1} on div#main-content for programmatic focus (WCAG 2.4.1)
- [Phase 05-launch-readiness]: X-Frame-Options DENY intentionally omitted at app level — Pivota preview iframe must embed the app; CSP frame-ancestors set at load balancer
- [Phase 06-end-to-end-verification]: Test titles begin with [REQ-ID] in brackets for machine-readable parsing by run-all.ts runner
- [Phase 06-end-to-end-verification]: 11 spec files organized by category matching REQUIREMENTS.md structure; run-all.ts produces requirements-results.json for triage phase
- [Phase 06-end-to-end-verification]: Cookie-transfer pattern: APIRequestContext cookies don't transfer to browser page in Playwright test specs
- [Phase 06-end-to-end-verification]: F8.4/F8.5 gap: settings GET restricted to admin role; response is object not array with setting_key property
- [Phase 06-end-to-end-verification]: F9.9 gap: POST /curator/records response omits state field; test expects {state:'draft'}

### Pending Todos

None yet.

### Blockers/Concerns

- [Pre-Phase 1]: Hosting environment unresolved — development deployment permitted; operational hosting blocks production release
- [Pre-Phase 4]: Identity and access management unresolved — dev auth stub covers Phase 1–3 work; real auth required before Phase 4 operational deployment
- [Pre-Phase 3]: SEC-06 CAPTCHA/rate-limiting mechanism TBD — dev bypass permitted; must be resolved before operational submission forms

## Session Continuity

Last session: 2026-08-14T02:30:13.172Z
Stopped at: Completed 06-02-PLAN.md
Resume file: None
