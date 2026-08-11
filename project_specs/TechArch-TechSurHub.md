# Technical Architecture — TSIO Innovation Hub MVP
# TechArch-TechSurHub

**Project:** TechSur Innovation Hub (TSIO Innovation Hub MVP)
**Organization:** TSIO Innovation & Research (I&R), Administrative Office of US Courts
**Document Type:** Technical Architecture Specification
**Version:** 1.0
**Date:** 2026-08-11
**Source Documents:** PRD-TechSurHub.md v1.0, FRD-TechSurHub.md v1.0
**Status:** Working Draft

> This document is the technical blueprint for the TSIO Innovation Hub MVP. It translates product and functional requirements into architecture patterns, data models, API design, and security controls. All implementation decisions must conform to this document. Conflicts must be escalated to the technical lead before implementation proceeds.

---

## Table of Contents

1. [Architectural Overview](#1-architectural-overview)
2. [Component Architecture](#2-component-architecture) — see `01-components.md`
3. [Data Model](#3-data-model) — see `02-data-model.md`
4. [API Design](#4-api-design) — see `03-api.md`
5. [Security Architecture](#5-security-architecture) — see `04-security.md`
6. [Technology Stack](#6-technology-stack) — see `05-tech-stack.md`
7. [Integration Points](#7-integration-points) — see `06-integrations.md`

---

## 1. Architectural Overview

### 1.1 Architecture Pattern

The TSIO Innovation Hub is a **server-rendered monolithic web application** following the **Model-View-Controller (MVC)** pattern with a REST API layer. This pattern was chosen over a decoupled SPA architecture for the following reasons:

| Decision | Rationale |
|---|---|
| Server-Side Rendering (SSR) | Required for WCAG 2.1 AA accessibility compliance — SSR ensures content is available without JavaScript, supports semantic HTML landmarks, and ensures screen readers receive fully-rendered content. SSR also improves initial page load performance on government network environments. |
| Monolithic deployment | Hosting environment is TBD (likely Azure Government Cloud). A single containerized application is simpler to deploy, operate, and hand off to a receiving technical team than a distributed microservices architecture. |
| REST API over GraphQL | REST is simpler, easier to document, audit, and rate-limit at the infrastructure level. All FRD endpoints are resource-oriented and map naturally to REST. |
| PostgreSQL full-text search | Eliminates the need for a dedicated search service (Elasticsearch, etc.) for MVP scale. PostgreSQL `tsvector`/`tsquery` supports weighted full-text search, prefix matching, and ranking — sufficient for the anticipated catalog size at launch (≥3 records). |
| Next.js | Provides SSR + API routes in a single framework, mature government/enterprise adoption, excellent accessibility tooling, and a clear deployment path to containerized hosting or Azure Static Web Apps / App Service. |

### 1.2 Architecture Diagram

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                          Judiciary Network / Internet                         │
└───────────────────────┬──────────────────────────────┬───────────────────────┘
                        │                              │
              Anonymous Stakeholders           Curators / Admins
              (public catalog, search,         (protected /curator routes,
               record viewing, submissions)     content governance)
                        │                              │
                        ▼                              ▼
┌───────────────────────────────────────────────────────────────────────────────┐
│                         Load Balancer / Reverse Proxy                         │
│                    (TLS termination, security headers, rate limiting)          │
└───────────────────────────────────────┬───────────────────────────────────────┘
                                        │
                        ┌───────────────▼───────────────┐
                        │       Next.js Application     │
                        │   ┌───────────────────────┐   │
                        │   │   SSR Page Routes     │   │  ← Public pages (catalog,
                        │   │   /app or /pages      │   │    search, record detail,
                        │   └───────────────────────┘   │    submission forms)
                        │   ┌───────────────────────┐   │
                        │   │   REST API Routes     │   │  ← /api/v1/* endpoints
                        │   │   /api/v1/...         │   │    (public + curator)
                        │   └───────────────────────┘   │
                        │   ┌───────────────────────┐   │
                        │   │   Curator Interface   │   │  ← Protected /curator/*
                        │   │   /curator/...        │   │    SSR pages
                        │   └───────────────────────┘   │
                        │   ┌───────────────────────┐   │
                        │   │   Service Layer       │   │  ← Business logic,
                        │   │   (domain services)   │   │    publication gate,
                        │   └───────────────────────┘   │    audit logging
                        │   ┌───────────────────────┐   │
                        │   │   Data Access Layer   │   │  ← Repository pattern,
                        │   │   (repositories)      │   │    query builders
                        │   └───────────────────────┘   │
                        └───────────────┬───────────────┘
                                        │
                        ┌───────────────▼───────────────┐
                        │         PostgreSQL             │
                        │  ┌─────────────────────────┐  │
                        │  │  innovation_records      │  │
                        │  │  artifacts               │  │
                        │  │  record_next_actions     │  │
                        │  │  opportunity_submissions  │  │
                        │  │  innovation_contributions │  │
                        │  │  engagement_requests      │  │
                        │  │  audit_events (append-only)│ │
                        │  │  hub_settings             │  │
                        │  └─────────────────────────┘  │
                        └───────────────────────────────┘
                                        │
                               ┌────────▼────────┐
                               │  External Systems│
                               │  (linked only)  │
                               │  SharePoint      │
                               │  Git Repositories│
                               │  SMTP / Mailto   │
                               └─────────────────┘
```

### 1.3 Deployment Topology

```
┌──────────────────────────────────────────────────────────────────┐
│                    Container Runtime                             │
│  ┌──────────────────────────────────┐                           │
│  │    tsio-hub-app                  │  ← Next.js application    │
│  │    Image: node:20-alpine         │    Port 3000 (internal)   │
│  │    ENV: DATABASE_URL             │    Secrets via env vars   │
│  │         AUTH_SECRET              │    (SEC-08)               │
│  │         SMTP_HOST / SMTP_PORT    │                           │
│  │         EMAIL_ROUTING_MODE       │                           │
│  │         ENABLE_DEV_AUTH_BYPASS   │                           │
│  │         NODE_ENV                 │                           │
│  └──────────────────────────────────┘                           │
│  ┌──────────────────────────────────┐                           │
│  │    tsio-hub-db                   │  ← PostgreSQL 15+         │
│  │    Image: postgres:15-alpine     │    Port 5432 (internal)   │
│  │    Data volume: /var/lib/...     │    Not exposed externally │
│  └──────────────────────────────────┘                           │
└──────────────────────────────────────────────────────────────────┘

Environment Variables (never in source code — SEC-08):
  DATABASE_URL           postgresql://user:pass@db:5432/tsio_hub
  AUTH_SECRET            [JWT signing secret or OIDC client secret]
  AUTH_PROVIDER_URL      [OIDC provider URL — TBD identity system]
  SMTP_HOST              [email relay host]
  SMTP_PORT              [email relay port]
  SMTP_USER              [email credentials]
  SMTP_PASS              [email credentials]
  EMAIL_ROUTING_MODE     smtp | mailto
  ENABLE_DEV_AUTH_BYPASS false (must be false in production)
  ENABLE_CAPTCHA_BYPASS  false (must be false in production)
  NODE_ENV               production | development
  NEXT_PUBLIC_APP_URL    https://[deployment-url]
  RATE_LIMIT_STORE       memory | redis
  REDIS_URL              [if redis rate limiting]
```

### 1.4 Key Architectural Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Framework | Next.js 14+ (App Router) | SSR required for accessibility; single framework for pages + API; mature government adoption |
| Language | TypeScript | Type safety; FRD specifies TypeScript interfaces; reduces runtime errors |
| Database | PostgreSQL 15+ | JSONB for audit event data; `text[]` array types; `tsvector` full-text search; referential integrity |
| Full-text search | PostgreSQL `tsvector` | Eliminates dedicated search service; sufficient for MVP scale; weighted search via `ts_rank` |
| ORM / Query layer | Kysely or Drizzle ORM | Type-safe SQL; supports PostgreSQL-specific types; no ORM magic that obscures audit logic |
| Authentication | JWT (RS256) or session-based | TBD pending identity system discovery; architecture must support both OIDC and local auth stub |
| Rate limiting | IP-based via middleware | Configurable per hub_settings; Redis-backed for multi-instance; in-memory fallback for dev |
| CSS / UI | Tailwind CSS + Radix UI primitives | Accessible component primitives (WCAG 2.1 AA); government-neutral design |
| Containerization | Docker + docker-compose | Consistent dev/prod environments; deployment-agnostic |
| Secrets | Environment variables only | SEC-08 compliance; `.env.example` committed, `.env` gitignored |

### 1.5 Deployment Constraints and Blockers

The following items are operational blockers that must be resolved before non-development deployment. Architecture decisions documented here account for these pending decisions.

| Blocker | Status | Architecture Impact |
|---|---|---|
| Hosting environment (INT-02) | TBD — likely Azure Government Cloud | Application is containerized and hosting-agnostic; Azure App Service, AKS, or Azure Container Apps are all compatible |
| Identity and access management (INT-01) | TBD — likely Azure AD / Entra ID Government or Judiciary SSO | Auth middleware is abstracted behind an `AuthProvider` interface; OIDC and JWT implementations are swappable |
| Security baseline for CAPTCHA (INT-05) | TBD | Rate limiting is implemented; CAPTCHA is wired but bypassable via env var in dev (SEC-09) |
| Browser compatibility list | TBD — confirmed during discovery | Next.js supports modern browser targets; legacy IE is not supported |

---
---

## 2. Component Architecture

### 2.1 Application Layer Structure

```
tsio-hub/
├── src/
│   ├── app/                          ← Next.js App Router (SSR pages)
│   │   ├── (public)/                 ← Public-facing routes (no auth)
│   │   │   ├── page.tsx              ← Home / catalog
│   │   │   ├── search/page.tsx       ← Search and discovery
│   │   │   ├── records/[slug]/page.tsx ← Innovation record detail
│   │   │   ├── submit/
│   │   │   │   ├── opportunity/page.tsx ← F6 opportunity form
│   │   │   │   └── contribution/page.tsx ← F7 contribution form
│   │   │   └── engage/page.tsx       ← F8 engagement form
│   │   ├── curator/                  ← Protected curator routes (auth required)
│   │   │   ├── layout.tsx            ← Auth guard + curator navigation
│   │   │   ├── page.tsx              ← F9.1 Curator dashboard
│   │   │   ├── records/
│   │   │   │   ├── page.tsx          ← F9.2 Record management list
│   │   │   │   ├── new/page.tsx      ← F9.3 Record creation
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx      ← F9.4 Record edit view
│   │   │   │       └── audit/page.tsx ← F9.11 Record audit history
│   │   │   ├── submissions/
│   │   │   │   ├── opportunity/page.tsx ← F9.12 Opportunity queue
│   │   │   │   └── contribution/page.tsx ← F9.13 Contribution queue
│   │   │   ├── engagement/page.tsx   ← F9.14 Engagement activity
│   │   │   ├── settings/page.tsx     ← F9.15 Settings management
│   │   │   ├── reference/page.tsx    ← F9.16 Content model reference
│   │   │   └── audit/page.tsx        ← F9.11 System audit log (admin)
│   │   └── api/
│   │       └── v1/                   ← REST API routes
│   │           ├── catalog/route.ts
│   │           ├── search/route.ts
│   │           ├── search/facets/route.ts
│   │           ├── records/[idOrSlug]/route.ts
│   │           ├── records/[id]/artifacts/route.ts
│   │           ├── engagement/route.ts
│   │           ├── submissions/opportunity/route.ts
│   │           ├── submissions/contribution/route.ts
│   │           └── curator/          ← Protected API routes
│   │               ├── dashboard/route.ts
│   │               ├── records/[id]/
│   │               │   ├── route.ts
│   │               │   ├── publish/route.ts
│   │               │   ├── unpublish/route.ts
│   │               │   ├── supersede/route.ts
│   │               │   ├── archive/route.ts
│   │               │   ├── retire/route.ts
│   │               │   ├── reactivate/route.ts
│   │               │   ├── submit-for-review/route.ts
│   │               │   ├── artifacts/route.ts
│   │               │   ├── artifacts/[artifactId]/route.ts
│   │               │   └── audit/route.ts
│   │               ├── submissions/opportunity/[id]/
│   │               │   ├── route.ts
│   │               │   └── disposition/route.ts
│   │               ├── submissions/contribution/[id]/
│   │               │   ├── route.ts
│   │               │   ├── disposition/route.ts
│   │               │   └── create-record/route.ts
│   │               ├── engagement/[id]/status/route.ts
│   │               ├── settings/route.ts
│   │               ├── settings/[key]/route.ts
│   │               ├── audit/route.ts
│   │               └── reference/route.ts
│   ├── lib/
│   │   ├── auth/                     ← Authentication layer
│   │   │   ├── provider.ts           ← AuthProvider interface
│   │   │   ├── jwt.ts                ← JWT validation
│   │   │   ├── session.ts            ← Session management
│   │   │   └── dev-stub.ts           ← DEV ONLY — bypassed by NODE_ENV
│   │   ├── db/                       ← Data access layer
│   │   │   ├── client.ts             ← PostgreSQL connection pool
│   │   │   ├── repositories/
│   │   │   │   ├── innovation-records.ts
│   │   │   │   ├── artifacts.ts
│   │   │   │   ├── record-next-actions.ts
│   │   │   │   ├── opportunity-submissions.ts
│   │   │   │   ├── innovation-contributions.ts
│   │   │   │   ├── engagement-requests.ts
│   │   │   │   ├── audit-events.ts   ← INSERT-only; no update/delete methods
│   │   │   │   └── hub-settings.ts
│   │   │   └── migrations/           ← SQL migration files
│   │   ├── services/                 ← Domain business logic
│   │   │   ├── catalog.service.ts
│   │   │   ├── search.service.ts     ← tsvector search + ranking
│   │   │   ├── records.service.ts    ← Publication gate, lifecycle
│   │   │   ├── artifacts.service.ts
│   │   │   ├── submissions.service.ts
│   │   │   ├── engagement.service.ts ← Email routing + DB recording
│   │   │   ├── audit.service.ts      ← Audit event creation
│   │   │   └── settings.service.ts
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts    ← Route protection
│   │   │   ├── rate-limit.middleware.ts ← IP-based rate limiting
│   │   │   ├── security-headers.ts  ← HTTP security headers
│   │   │   └── csrf.middleware.ts    ← CSRF protection for mutations
│   │   ├── validation/
│   │   │   ├── records.schema.ts     ← Zod schemas for record fields
│   │   │   ├── submissions.schema.ts
│   │   │   ├── engagement.schema.ts
│   │   │   └── settings.schema.ts
│   │   └── email/
│   │       ├── router.ts             ← Email routing (SMTP or mailto)
│   │       └── templates.ts          ← Email body templates
│   ├── components/                   ← React UI components
│   │   ├── catalog/
│   │   │   ├── CatalogCard.tsx       ← F1 catalog card
│   │   │   └── CatalogGrid.tsx
│   │   ├── record/
│   │   │   ├── RecordDetail.tsx      ← F3 record detail
│   │   │   ├── PerspectiveToggle.tsx ← F4 executive/technical toggle
│   │   │   ├── ExecutiveView.tsx     ← F4.2 executive perspective
│   │   │   ├── TechnicalView.tsx     ← F4.3 technical perspective
│   │   │   ├── MaturityBadge.tsx     ← Accessible maturity badge
│   │   │   ├── ReviewStatusBadge.tsx ← SEC-11: distinct from maturity
│   │   │   ├── ArtifactList.tsx      ← F3.8 artifact links
│   │   │   └── CTAPanel.tsx          ← F3.9 contextual next actions
│   │   ├── search/
│   │   │   ├── SearchBar.tsx
│   │   │   ├── FilterPanel.tsx
│   │   │   └── FacetCount.tsx
│   │   ├── forms/
│   │   │   ├── OpportunityForm.tsx   ← F6
│   │   │   ├── ContributionForm.tsx  ← F7
│   │   │   └── EngagementForm.tsx    ← F8
│   │   ├── curator/
│   │   │   ├── RecordEditor.tsx      ← F9.3/9.4
│   │   │   ├── PublicationGate.tsx   ← F9.10 gate status display
│   │   │   ├── AuditHistory.tsx      ← F9.11
│   │   │   ├── SubmissionQueue.tsx   ← F9.12/9.13
│   │   │   └── SettingsPanel.tsx     ← F9.15
│   │   └── shared/
│   │       ├── TrustBanner.tsx       ← Trust model disclaimers
│   │       ├── ErrorBoundary.tsx
│   │       └── SkipNav.tsx           ← WCAG 2.1 AA skip navigation
│   └── types/
│       └── index.ts                  ← All TypeScript interfaces (from FRD Y0a/Y0b)
├── public/                           ← Static assets
├── migrations/                       ← SQL migration scripts (numbered)
├── docker-compose.yml                ← Dev environment
├── Dockerfile
├── .env.example                      ← Placeholder env vars (no real credentials)
└── next.config.ts
```

### 2.2 Backend Components and Responsibilities

#### 2.2.1 API Route Handlers

Each API route handler is responsible for:
1. Parsing and validating request input (using Zod schemas)
2. Enforcing authentication/authorization middleware
3. Calling the appropriate service method
4. Returning the standard response envelope

Route handlers must not contain business logic — they delegate to the service layer.

#### 2.2.2 Service Layer

The service layer contains all domain business logic:

| Service | Responsibilities |
|---|---|
| `catalog.service.ts` | Retrieve published records for catalog display; apply sort/pagination; suppress incomplete records |
| `search.service.ts` | Build and execute PostgreSQL `tsvector` queries; apply weighted ranking; apply facet filters; compute facet counts |
| `records.service.ts` | Create/update records; enforce publication gate (F9.10); manage lifecycle transitions; trigger audit events via audit.service |
| `artifacts.service.ts` | Add/update/remove artifacts; enforce is_restricted URL suppression for public responses |
| `submissions.service.ts` | Persist opportunity and contribution submissions; manage disposition workflow |
| `engagement.service.ts` | Persist engagement requests; trigger email routing; manage follow-up status |
| `audit.service.ts` | Create audit events (INSERT-only); never update or delete; structure event_data JSONB |
| `settings.service.ts` | Read/write hub_settings; invalidate any in-memory caches; trigger settings_changed audit |

#### 2.2.3 Data Access Layer (Repositories)

Repositories provide typed access to PostgreSQL using parameterized queries. They map database snake_case columns to TypeScript camelCase interfaces.

**Audit Events Repository — Special Rules:**
- `AuditEventsRepository` exposes only an `insert()` method.
- There are no `update()` or `delete()` methods — this is enforced both at the application layer and at the PostgreSQL role level (INSERT-only grant on `audit_events`).

#### 2.2.4 Authentication Middleware

The authentication middleware:
1. Extracts the token from the `Authorization: Bearer <token>` header or an HTTP-only session cookie
2. Validates the token signature and expiry
3. Resolves the user's role (`curator` | `admin`)
4. Attaches the authenticated user context to the request
5. Returns 401 if no valid token; 403 if valid token but insufficient role

**Dev Auth Stub (SEC-09):**
- When `ENABLE_DEV_AUTH_BYPASS=true` AND `NODE_ENV=development`: a fixed dev credential bypasses real authentication
- If `ENABLE_DEV_AUTH_BYPASS=true` AND `NODE_ENV=production`: application throws a startup error and refuses to start
- The dev stub code path is removed from production builds via tree-shaking or build-time conditional

#### 2.2.5 Rate Limiting Middleware

- Applied to all public mutation endpoints: `POST /api/v1/engagement`, `POST /api/v1/submissions/*`
- Limits read from `hub_settings` table at startup (cached for 60s)
- IP extraction via `X-Forwarded-For` header (trusted from load balancer only) or `req.ip`
- Redis-backed store when `RATE_LIMIT_STORE=redis`; in-memory store for development
- If rate limit store is unavailable: default to deny (SEC-07)

### 2.3 Frontend Components and Responsibilities

#### 2.3.1 Accessibility Requirements (WCAG 2.1 AA)

Every UI component must:
- Use semantic HTML elements (`<main>`, `<nav>`, `<article>`, `<section>`, landmarks)
- Provide keyboard-navigable focus order for all interactive elements
- Include appropriate ARIA labels for interactive controls, badges, and form inputs
- Ensure color contrast ratio ≥ 4.5:1 for normal text, ≥ 3:1 for large text
- Provide visible focus indicators on all focusable elements
- Not rely on color alone to convey maturity or review status distinctions (use text labels + color)

**Specific WCAG obligations:**
- `MaturityBadge` and `ReviewStatusBadge`: distinct visual treatment that does not rely on color alone (SEC-11); include text labels
- `PerspectiveToggle` (F4): keyboard-accessible tab/toggle control; ARIA `role="tablist"` or equivalent
- CTAs (F3.9/F8): keyboard-reachable buttons; accessible names that include record context
- Search/filter forms: all filters labeled; result count announced via live region
- Forms (F6/F7/F8): server-side error messages displayed with `role="alert"` or linked to invalid fields via `aria-describedby`
- Skip navigation link (`SkipNav.tsx`) as first focusable element on every page

#### 2.3.2 Trust Model Components

`TrustBanner.tsx` renders the required trust statements:
- POC ≠ production-ready
- Published ≠ approved for adoption
- Community-submitted ≠ centrally endorsed
- Validated for reuse ≠ eliminates local review requirements

Trust statements are rendered based on the record's `maturity` and `review_statuses` values. The applicable disclaimer is always rendered — it cannot be suppressed by the frontend.

### 2.4 Search Architecture

Full-text search is implemented using PostgreSQL native `tsvector` and `tsquery`:

```sql
-- Search vector column (maintained by trigger or computed at query time)
-- Weighted per FRD F02 §Search Index:
ALTER TABLE innovation_records
  ADD COLUMN search_vector tsvector
    GENERATED ALWAYS AS (
      setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
      setweight(to_tsvector('english', coalesce(summary, '')), 'A') ||
      setweight(to_tsvector('english', coalesce(problem_statement, '')), 'A') ||
      setweight(to_tsvector('english', coalesce(key_findings_concatenated, '')), 'A') ||
      setweight(to_tsvector('english', coalesce(array_to_string(tags, ' '), '')), 'A') ||
      setweight(to_tsvector('english', coalesce(array_to_string(mission_areas, ' '), '')), 'A') ||
      setweight(to_tsvector('english', coalesce(array_to_string(technology_areas, ' '), '')), 'A') ||
      setweight(to_tsvector('english', coalesce(hypothesis_or_objective, '')), 'B') ||
      setweight(to_tsvector('english', coalesce(outcome_summary, '')), 'B') ||
      setweight(to_tsvector('english', coalesce(what_can_be_reused, '')), 'B') ||
      setweight(to_tsvector('english', coalesce(production_readiness_gaps, '')), 'B') ||
      setweight(to_tsvector('english', coalesce(array_to_string(contributing_offices, ' '), '')), 'D') ||
      setweight(to_tsvector('english', coalesce(array_to_string(contributor_names, ' '), '')), 'D')
    ) STORED;

CREATE INDEX idx_ir_search_vector ON innovation_records USING GIN(search_vector);
```

**Search query execution:**
```sql
-- Full-text search with weighted ranking + filter pushdown
SELECT ir.*, ts_rank(ir.search_vector, query) AS rank
FROM innovation_records ir,
     plainto_tsquery('english', $1) AS query
WHERE ir.publication_state = 'published'
  AND ir.search_vector @@ query
  AND ($2::text[] IS NULL OR ir.maturity = ANY($2))   -- maturity filter
  AND ($3::text[] IS NULL OR ir.mission_areas && $3)  -- mission area filter
ORDER BY rank DESC, ir.last_reviewed_date DESC
LIMIT $4 OFFSET $5;
```

**Prefix/partial matching:** Use `to_tsquery` with `:*` suffix for prefix search on user input.

### 2.5 Audit Logging Architecture

Audit events are appended synchronously within the same database transaction as the action that triggers them. This guarantees that no material change can succeed without a corresponding audit entry.

```typescript
// Pattern used in every service method that generates audit events:
await db.transaction(async (trx) => {
  await recordsRepo.update(trx, recordId, changes);
  await auditRepo.insert(trx, {
    eventType: 'record_updated',
    actorId: currentUser.id,
    actorName: currentUser.displayName,
    targetType: 'innovation_record',
    targetId: recordId,
    targetTitle: record.title,
    eventData: { changedFields: computeDiff(before, after) },
    occurredAt: new Date(),
  });
});
```

The `audit_events` table has no `updated_at` trigger because rows are never updated. The PostgreSQL application role is granted `INSERT` on `audit_events` only — `UPDATE` and `DELETE` are revoked.

---
---

## 3. Data Model

### 3.1 Entity Relationship Diagram

```
┌──────────────────────────────────────┐
│         innovation_records           │◄──────────────────────────────┐
│  id (PK)                             │                                │
│  slug                                │     ┌────────────────────────┐ │
│  publication_state                   │     │      artifacts          │ │
│  maturity                            │     │  artifact_id (PK)      │ │
│  review_statuses[]                   │     │  record_id (FK) ───────┼─┤
│  contributing_offices[]              │     │  artifact_type         │ │
│  technology_areas[]                  │     │  name                  │ │
│  mission_areas[]                     │     │  url                   │ │
│  tags[]                              │     │  is_restricted         │ │
│  source_contribution_id (FK) ─────┐  │     │  display_order         │ │
│  superseded_by_record_id (FK) ─┐  │  │     └────────────────────────┘ │
│  [all 60+ fields...]           │  │  │                                │
└──────────────────────────────────┘  │  │     ┌────────────────────────┐ │
         │ (self-ref)                 │  │     │   record_next_actions   │ │
         └────────────────────────────┘  │     │  action_id (PK)        │ │
                                         │     │  record_id (FK) ───────┼─┘
                                         │     │  action_type           │
                                         │     │  is_enabled            │
                                         │     └────────────────────────┘
                                         │
                                         │     ┌────────────────────────┐
                                         └────►│  innovation_contributions│
                                               │  id (PK)               │
                                               │  status                │
                                               │  contributing_office   │
                                               │  created_record_id(FK)─┼──►innovation_records
                                               └────────────────────────┘

┌─────────────────────────┐       ┌─────────────────────────┐
│  opportunity_submissions│       │   engagement_requests    │
│  id (PK)                │       │  id (PK)                │
│  request_type           │       │  request_type           │
│  status                 │       │  originating_record_id  │
│  submitter_email        │       │    (FK, nullable)       │
│  submission_date        │       │  follow_up_status       │
│  dispositioned_by       │       │  routing_address_at_sub │
└─────────────────────────┘       └─────────────────────────┘

┌──────────────────────────┐      ┌──────────────────────────┐
│      audit_events        │      │       hub_settings        │
│  audit_id (PK)           │      │  setting_key (PK)        │
│  event_type              │      │  setting_value           │
│  actor_id                │      │  setting_type            │
│  target_type             │      │  updated_at              │
│  target_id               │      └──────────────────────────┘
│  event_data (jsonb)      │
│  occurred_at             │
│  (INSERT ONLY — no updates)│
└──────────────────────────┘
```

### 3.2 Complete DDL

> **Implementation note:** The DDL below is for PostgreSQL 15+. The `innovation_contributions` table is defined first because `innovation_records` has a foreign key reference to it. The `innovation_records` table self-references via `superseded_by_record_id` — use `DEFERRABLE INITIALLY DEFERRED` or insert with null and update after.

---

#### 3.2.1 Table: `innovation_contributions`

Defined before `innovation_records` to resolve the forward FK reference.

```sql
CREATE TABLE innovation_contributions (
  id                            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contribution_title            VARCHAR(200) NOT NULL,
  problem_addressed             TEXT NOT NULL,
  work_description              TEXT NOT NULL,
  contributing_office           VARCHAR(200) NOT NULL,
  contributor_names             TEXT NOT NULL,
  current_maturity              VARCHAR(32) NOT NULL
                                  CHECK (current_maturity IN (
                                    'idea', 'evaluated_idea', 'experiment_poc',
                                    'prototype_pilot', 'production_validated',
                                    'archived_retired'
                                  )),
  current_owner                 VARCHAR(200) NOT NULL,
  owner_contact_email           VARCHAR(254) NOT NULL,
  artifact_links                TEXT,
  known_limitations             TEXT,
  collaboration_preference      VARCHAR(32) NOT NULL
                                  CHECK (collaboration_preference IN (
                                    'open_for_reuse', 'seeking_collaborator',
                                    'informational_only', 'seeking_adopter',
                                    'discuss_with_ir'
                                  )),
  additional_context            TEXT,
  submitter_name                VARCHAR(200) NOT NULL,
  submitter_email               VARCHAR(254) NOT NULL,
  non_endorsement_acknowledged  BOOLEAN NOT NULL,
  consent_to_contact            BOOLEAN NOT NULL,
  submission_date               TIMESTAMPTZ NOT NULL DEFAULT now(),
  submission_ip                 INET,                        -- server-captured; internal only

  -- Disposition fields
  status                        VARCHAR(32) NOT NULL DEFAULT 'pending'
                                  CHECK (status IN (
                                    'pending', 'accepted_for_curation', 'declined',
                                    'needs_more_information', 'duplicate', 'curated'
                                  )),
  dispositioned_at              TIMESTAMPTZ,
  dispositioned_by              UUID,                        -- ref users table (TBD identity)
  curator_notes                 TEXT,                        -- internal; not shown to submitter

  -- Link to created record (set when record is created from this contribution)
  created_record_id             UUID,                        -- FK to innovation_records (deferred)

  CONSTRAINT chk_contribution_consents
    CHECK (non_endorsement_acknowledged = TRUE AND consent_to_contact = TRUE)
);

CREATE INDEX idx_contrib_status        ON innovation_contributions(status);
CREATE INDEX idx_contrib_submission_date ON innovation_contributions(submission_date DESC);
CREATE INDEX idx_contrib_office        ON innovation_contributions(contributing_office);
CREATE INDEX idx_contrib_created_record ON innovation_contributions(created_record_id)
  WHERE created_record_id IS NOT NULL;
```

---

#### 3.2.2 Table: `innovation_records`

Central entity. One row per innovation effort.

```sql
CREATE TABLE innovation_records (
  -- Group 0: Identity and system fields
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                        VARCHAR(128) NOT NULL UNIQUE,
  publication_state           VARCHAR(32) NOT NULL DEFAULT 'draft'
                                CHECK (publication_state IN (
                                  'draft', 'submitted_for_review', 'published',
                                  'superseded', 'archived', 'retired'
                                )),
  created_at                  TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by                  UUID NOT NULL,                 -- ref users (identity TBD)
  updated_at                  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by                  UUID NOT NULL,
  published_at                TIMESTAMPTZ,                   -- null until first publication
  version                     INTEGER NOT NULL DEFAULT 1,    -- optimistic concurrency

  -- Group 1: F3.1 — Problem and Context
  title                       VARCHAR(200) NOT NULL DEFAULT '',
  summary                     VARCHAR(500) NOT NULL DEFAULT '',
  problem_statement           TEXT NOT NULL DEFAULT '',
  affected_users              TEXT,
  current_workflow            TEXT,
  why_experimentation         TEXT,
  mission_areas               TEXT[] NOT NULL DEFAULT '{}',  -- controlled vocabulary
  problem_type_tags           TEXT[] NOT NULL DEFAULT '{}',  -- controlled vocabulary

  -- Group 2: F3.2 — What Was Explored
  hypothesis_or_objective     TEXT NOT NULL DEFAULT '',
  scope_description           TEXT,
  technology_areas            TEXT[] NOT NULL DEFAULT '{}',  -- controlled vocabulary
  technologies_used           TEXT,
  methods_used                TEXT,
  tags                        TEXT[] NOT NULL DEFAULT '{}',  -- free-form keywords

  -- Group 3: F3.3 — Outcome and Evidence
  outcome_summary             TEXT NOT NULL DEFAULT '',
  what_worked                 TEXT,
  what_did_not_work           TEXT,
  uncertainty_reduced         TEXT,
  decision_enabled            TEXT,
  evidence_summary            TEXT,
  source_basis                VARCHAR(500) NOT NULL DEFAULT '',

  -- Group 4: F3.4 — Key Findings (at least one required at publication)
  findings_architectural      TEXT,
  findings_security           TEXT,
  findings_cloud_platform     TEXT,
  findings_performance        TEXT,
  findings_ux                 TEXT,
  findings_data               TEXT,
  findings_testing            TEXT,
  findings_operational        TEXT,
  findings_cost               TEXT,
  findings_scalability        TEXT,
  findings_other              TEXT,

  -- Group 5: F3.5 — Maturity and Readiness
  maturity                    VARCHAR(32)
                                CHECK (maturity IS NULL OR maturity IN (
                                  'idea', 'evaluated_idea', 'experiment_poc',
                                  'prototype_pilot', 'production_validated',
                                  'archived_retired'
                                )),
  review_statuses             TEXT[] NOT NULL DEFAULT '{}',  -- multi-value array
  ready_for                   TEXT,
  not_ready_for               TEXT,
  next_stage_requirements     TEXT,
  last_reviewed_date          DATE,
  next_review_date            DATE,
  maturity_change_reason      VARCHAR(500),

  -- Group 6: F3.6 — Reuse Guidance
  reuse_potential             VARCHAR(16)
                                CHECK (reuse_potential IS NULL OR reuse_potential IN (
                                  'high', 'moderate', 'low', 'not_assessed'
                                )),
  what_can_be_reused          TEXT,
  what_should_be_adapted      TEXT,
  what_not_to_copy            TEXT,
  environment_assumptions     TEXT,
  required_skills             TEXT,
  required_services           TEXT,
  production_readiness_gaps   TEXT,
  engagement_indicator        VARCHAR(32) NOT NULL DEFAULT 'none'
                                CHECK (engagement_indicator IN (
                                  'demo_available', 'seeking_adoption_partner',
                                  'technical_playbook_available',
                                  'reference_pattern_available',
                                  'monitoring_only', 'archived', 'none'
                                )),

  -- Group 7: F3.7 — Ownership and Attribution
  opportunity_source          VARCHAR(500),
  contributing_offices        TEXT[] NOT NULL DEFAULT '{}',
  contributor_names           TEXT[] NOT NULL DEFAULT '{}',
  ir_contribution             TEXT,
  owner_steward               VARCHAR(200) NOT NULL DEFAULT '',
  owner_contact               VARCHAR(254),
  operational_owner           VARCHAR(200),
  production_owner            VARCHAR(200),
  attribution_statement       TEXT NOT NULL DEFAULT '',
  source_contribution_id      UUID REFERENCES innovation_contributions(id)
                                ON DELETE SET NULL,

  -- Group 8b: F3.8 — Governance and Trust
  applicable_disclaimer       TEXT NOT NULL DEFAULT '',
  superseded_by_record_id     UUID REFERENCES innovation_records(id)
                                ON DELETE SET NULL
                                DEFERRABLE INITIALLY DEFERRED,  -- self-ref
  supersession_reason         TEXT,
  retirement_reason           TEXT,

  -- Group 9: F3.9 — Next Action prose
  next_action_description     TEXT,

  -- Full-text search vector (weighted, maintained by generated column or trigger)
  search_vector               TSVECTOR,

  -- Database constraints
  CONSTRAINT chk_supersede_requires_reason
    CHECK (
      (publication_state <> 'superseded') OR
      (supersession_reason IS NOT NULL AND supersession_reason <> '')
    ),
  CONSTRAINT chk_retire_requires_reason
    CHECK (
      (publication_state <> 'retired') OR
      (retirement_reason IS NOT NULL AND retirement_reason <> '')
    ),
  CONSTRAINT chk_last_reviewed_not_future
    CHECK (last_reviewed_date IS NULL OR last_reviewed_date <= CURRENT_DATE),
  CONSTRAINT chk_next_review_after_last
    CHECK (
      next_review_date IS NULL OR last_reviewed_date IS NULL OR
      next_review_date > last_reviewed_date
    )
);

-- Deferred FK: contribution's created_record_id → innovation_records
ALTER TABLE innovation_contributions
  ADD CONSTRAINT fk_contrib_created_record
    FOREIGN KEY (created_record_id) REFERENCES innovation_records(id)
    ON DELETE SET NULL
    DEFERRABLE INITIALLY DEFERRED;

-- Core indexes
CREATE INDEX idx_ir_publication_state  ON innovation_records(publication_state);
CREATE INDEX idx_ir_maturity           ON innovation_records(maturity);
CREATE INDEX idx_ir_last_reviewed      ON innovation_records(last_reviewed_date);
CREATE INDEX idx_ir_updated_at         ON innovation_records(updated_at DESC);
CREATE INDEX idx_ir_slug               ON innovation_records(slug);
CREATE INDEX idx_ir_source_contribution ON innovation_records(source_contribution_id)
  WHERE source_contribution_id IS NOT NULL;
CREATE INDEX idx_ir_engagement_indicator ON innovation_records(engagement_indicator);
CREATE INDEX idx_ir_search_vector      ON innovation_records USING GIN(search_vector);

-- GIN indexes for array fields (enable && and @> operators in filters)
CREATE INDEX idx_ir_mission_areas      ON innovation_records USING GIN(mission_areas);
CREATE INDEX idx_ir_technology_areas   ON innovation_records USING GIN(technology_areas);
CREATE INDEX idx_ir_review_statuses    ON innovation_records USING GIN(review_statuses);
CREATE INDEX idx_ir_contributing_offices ON innovation_records USING GIN(contributing_offices);
CREATE INDEX idx_ir_tags               ON innovation_records USING GIN(tags);

-- Trigger to maintain search_vector
CREATE OR REPLACE FUNCTION update_search_vector()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.summary, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.problem_statement, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(
      NEW.findings_architectural || ' ' ||
      NEW.findings_security || ' ' ||
      NEW.findings_cloud_platform || ' ' ||
      NEW.findings_performance || ' ' ||
      NEW.findings_ux || ' ' ||
      NEW.findings_data || ' ' ||
      NEW.findings_testing || ' ' ||
      NEW.findings_operational || ' ' ||
      NEW.findings_cost || ' ' ||
      NEW.findings_scalability || ' ' ||
      coalesce(NEW.findings_other, ''), '')), 'A') ||
    setweight(to_tsvector('english', coalesce(array_to_string(NEW.tags, ' '), '')), 'A') ||
    setweight(to_tsvector('english', coalesce(array_to_string(NEW.mission_areas, ' '), '')), 'A') ||
    setweight(to_tsvector('english', coalesce(array_to_string(NEW.technology_areas, ' '), '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.hypothesis_or_objective, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.outcome_summary, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.what_can_be_reused, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.reuse_guidance_concat, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.production_readiness_gaps, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.next_action_description, '')), 'D') ||
    setweight(to_tsvector('english', coalesce(array_to_string(NEW.contributing_offices, ' '), '')), 'D') ||
    setweight(to_tsvector('english', coalesce(array_to_string(NEW.contributor_names, ' '), '')), 'D');
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_ir_search_vector
  BEFORE INSERT OR UPDATE ON innovation_records
  FOR EACH ROW EXECUTE FUNCTION update_search_vector();

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_ir_updated_at
  BEFORE UPDATE ON innovation_records
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Trigger to increment version on update
CREATE OR REPLACE FUNCTION increment_version()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.version := OLD.version + 1;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_ir_version
  BEFORE UPDATE ON innovation_records
  FOR EACH ROW EXECUTE FUNCTION increment_version();
```

---

#### 3.2.3 Table: `artifacts`

```sql
CREATE TABLE artifacts (
  artifact_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  record_id         UUID NOT NULL REFERENCES innovation_records(id) ON DELETE CASCADE,
  artifact_type     VARCHAR(32) NOT NULL
                      CHECK (artifact_type IN (
                        'lessons_learned', 'poc_report', 'decision_brief',
                        'architecture_diagram', 'demo_video', 'repository',
                        'infrastructure_definition', 'test_results',
                        'security_findings', 'technical_playbook', 'other'
                      )),
  name              VARCHAR(200) NOT NULL,
  url               VARCHAR(2048) NOT NULL,
  access_notes      VARCHAR(500),
  is_restricted     BOOLEAN NOT NULL DEFAULT false,
  display_order     INTEGER NOT NULL DEFAULT 0,
  added_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  added_by          UUID NOT NULL,                  -- ref users (identity TBD)

  CONSTRAINT chk_artifact_name_min
    CHECK (length(name) >= 3),
  CONSTRAINT chk_artifact_url_format
    CHECK (url LIKE 'https://%' OR url LIKE 'http://%')
    -- HTTPS strongly preferred; HTTP allowed for internal/intranet URLs per business rules
);

CREATE INDEX idx_artifacts_record      ON artifacts(record_id);
CREATE INDEX idx_artifacts_restricted  ON artifacts(record_id, is_restricted);
CREATE INDEX idx_artifacts_order       ON artifacts(record_id, display_order);
```

---

#### 3.2.4 Table: `record_next_actions`

```sql
CREATE TABLE record_next_actions (
  action_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  record_id         UUID NOT NULL REFERENCES innovation_records(id) ON DELETE CASCADE,
  action_type       VARCHAR(32) NOT NULL
                      CHECK (action_type IN (
                        'request_demo', 'discuss_use_case', 'explore_adoption',
                        'request_technical_guidance', 'share_related_work', 'contact_ir'
                      )),
  custom_label      VARCHAR(100),
  is_enabled        BOOLEAN NOT NULL DEFAULT true,
  display_order     INTEGER NOT NULL DEFAULT 0
  -- Application enforces max 6 actions per record_id
);

CREATE INDEX idx_rna_record   ON record_next_actions(record_id);
CREATE INDEX idx_rna_enabled  ON record_next_actions(record_id, is_enabled);
CREATE INDEX idx_rna_order    ON record_next_actions(record_id, display_order);
```

---

#### 3.2.5 Table: `opportunity_submissions`

```sql
CREATE TABLE opportunity_submissions (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_type                VARCHAR(32) NOT NULL
                                CHECK (request_type IN (
                                  'current_mission_problem', 'emerging_tech_question',
                                  'request_for_research', 'potential_poc',
                                  'request_for_demo', 'collaboration_opportunity',
                                  'share_existing_work', 'other'
                                )),
  problem_title               VARCHAR(200) NOT NULL,
  problem_description         TEXT NOT NULL,
  affected_users              TEXT NOT NULL,
  current_workflow            TEXT,
  impact                      TEXT NOT NULL,
  desired_outcome             TEXT,
  known_constraints           TEXT,
  related_work_attempted      TEXT,
  submitting_office           VARCHAR(200) NOT NULL,
  submitter_name              VARCHAR(200) NOT NULL,
  submitter_email             VARCHAR(254) NOT NULL,
  discovery_participants      VARCHAR(500),
  additional_context          TEXT,
  consent_to_contact          BOOLEAN NOT NULL,
  non_acceptance_acknowledged BOOLEAN NOT NULL,
  submission_date             TIMESTAMPTZ NOT NULL DEFAULT now(),
  submission_ip               INET,                       -- server-captured; internal only

  -- Disposition
  status                      VARCHAR(32) NOT NULL DEFAULT 'pending'
                                CHECK (status IN (
                                  'pending', 'accepted', 'declined',
                                  'needs_more_information', 'duplicate'
                                )),
  dispositioned_at            TIMESTAMPTZ,
  dispositioned_by            UUID,                       -- ref users
  curator_notes               TEXT,                       -- internal; not shown to submitter

  CONSTRAINT chk_opportunity_consents
    CHECK (consent_to_contact = TRUE AND non_acceptance_acknowledged = TRUE)
);

CREATE INDEX idx_opp_status           ON opportunity_submissions(status);
CREATE INDEX idx_opp_submission_date  ON opportunity_submissions(submission_date DESC);
CREATE INDEX idx_opp_submitting_office ON opportunity_submissions(submitting_office);
CREATE INDEX idx_opp_request_type     ON opportunity_submissions(request_type);
```

---

#### 3.2.6 Table: `engagement_requests`

```sql
CREATE TABLE engagement_requests (
  id                              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_type                    VARCHAR(32) NOT NULL
                                    CHECK (request_type IN (
                                      'request_demo', 'discuss_use_case',
                                      'explore_adoption', 'request_technical_guidance',
                                      'share_related_work', 'contact_ir'
                                    )),
  originating_record_id           UUID REFERENCES innovation_records(id)
                                    ON DELETE SET NULL,    -- null for general CTAs
  originating_record_title        VARCHAR(200),            -- snapshot at submission time
  requester_name                  VARCHAR(200) NOT NULL,
  requester_office                VARCHAR(200) NOT NULL,
  requester_email                 VARCHAR(254) NOT NULL,
  need_description                TEXT NOT NULL,
  desired_next_step               TEXT,
  preferred_contact_method        VARCHAR(16) DEFAULT 'email'
                                    CHECK (preferred_contact_method IN (
                                      'email', 'phone', 'no_preference'
                                    )),
  consent_to_contact              BOOLEAN NOT NULL,
  submitted_at                    TIMESTAMPTZ NOT NULL DEFAULT now(),
  submission_ip                   INET,
  routing_address_at_submission   VARCHAR(254) NOT NULL,   -- audit snapshot
  email_routing_initiated         BOOLEAN NOT NULL DEFAULT false,

  -- Follow-up tracking
  follow_up_status                VARCHAR(32) NOT NULL DEFAULT 'received'
                                    CHECK (follow_up_status IN (
                                      'received', 'in_progress',
                                      'completed', 'no_action_required'
                                    )),
  follow_up_updated_at            TIMESTAMPTZ,
  follow_up_updated_by            UUID,                    -- ref users
  curator_notes                   TEXT,                    -- internal only

  CONSTRAINT chk_engagement_consent
    CHECK (consent_to_contact = TRUE)
);

CREATE INDEX idx_eng_follow_up_status  ON engagement_requests(follow_up_status);
CREATE INDEX idx_eng_submitted_at      ON engagement_requests(submitted_at DESC);
CREATE INDEX idx_eng_originating_record ON engagement_requests(originating_record_id)
  WHERE originating_record_id IS NOT NULL;
CREATE INDEX idx_eng_request_type      ON engagement_requests(request_type);
```

---

#### 3.2.7 Table: `audit_events`

```sql
-- IMPORTANT: Revoke UPDATE and DELETE on this table from the application DB role.
-- Only INSERT is permitted. See §3.3 Database Roles.

CREATE TABLE audit_events (
  audit_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type        VARCHAR(64) NOT NULL
                      CHECK (event_type IN (
                        'record_created', 'record_updated',
                        'maturity_changed', 'review_status_changed',
                        'publication_state_changed', 'attribution_updated',
                        'artifact_added', 'artifact_updated', 'artifact_removed',
                        'submission_dispositioned', 'record_created_from_contribution',
                        'engagement_status_updated', 'settings_changed',
                        'user_role_changed'
                      )),
  actor_id          UUID NOT NULL,             -- ref users
  actor_name        VARCHAR(200) NOT NULL,     -- snapshot of name at event time
  target_type       VARCHAR(32) NOT NULL
                      CHECK (target_type IN (
                        'innovation_record', 'artifact', 'opportunity_submission',
                        'innovation_contribution', 'engagement_request',
                        'hub_settings', 'user_role'
                      )),
  target_id         UUID NOT NULL,
  target_title      VARCHAR(200),              -- snapshot of entity name at event time
  event_data        JSONB NOT NULL DEFAULT '{}', -- before/after values by field
  occurred_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  notes             TEXT,                      -- optional curator note
  ip_address        INET                       -- server-captured; restricted view
  -- No updated_at: rows are never updated
);

CREATE INDEX idx_audit_target       ON audit_events(target_type, target_id);
CREATE INDEX idx_audit_occurred_at  ON audit_events(occurred_at DESC);
CREATE INDEX idx_audit_actor        ON audit_events(actor_id);
CREATE INDEX idx_audit_event_type   ON audit_events(event_type);
```

---

#### 3.2.8 Table: `hub_settings`

```sql
CREATE TABLE hub_settings (
  setting_key       VARCHAR(100) PRIMARY KEY,
  setting_value     TEXT NOT NULL,
  setting_type      VARCHAR(16) NOT NULL
                      CHECK (setting_type IN ('string', 'integer', 'boolean', 'json')),
  description       TEXT,
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by        UUID                        -- ref users (admin who changed it)
);

-- Initial seed data
INSERT INTO hub_settings (setting_key, setting_value, setting_type, description) VALUES
  ('engagement_routing_address',
    'AOml_TSO_IRB_Team@ao.uscourts.gov',
    'string',
    'Email address to which all engagement requests are routed (F8.4)'),
  ('engagement_routing_display_name',
    'TSIO Innovation & Research',
    'string',
    'Display name for routing destination shown in CTAs'),
  ('submission_rate_limit_per_hour',
    '5',
    'integer',
    'Max opportunity/contribution submissions per IP per hour (F6/F7, SEC-06)'),
  ('engagement_rate_limit_per_hour',
    '10',
    'integer',
    'Max engagement requests per IP per hour (F8, SEC-06)'),
  ('hub_display_name',
    'TSIO Innovation Hub',
    'string',
    'Hub display name used in headings and titles'),
  ('default_applicable_disclaimer',
    '',
    'string',
    'Default disclaimer template offered in the record editor (F9.16)'),
  ('taxonomy_mission_areas',
    '[]',
    'json',
    'Ordered list of Mission Area taxonomy values (configured during discovery)'),
  ('taxonomy_technology_areas',
    '[]',
    'json',
    'Ordered list of Technology Area taxonomy values'),
  ('taxonomy_problem_types',
    '[]',
    'json',
    'Ordered list of Problem Type taxonomy values');
```

---

### 3.3 Database Roles and Security

```sql
-- Application role: read/write on most tables; INSERT-only on audit_events
CREATE ROLE tsio_hub_app LOGIN PASSWORD '[env-injected]';

GRANT SELECT, INSERT, UPDATE, DELETE ON innovation_records TO tsio_hub_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON artifacts TO tsio_hub_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON record_next_actions TO tsio_hub_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON opportunity_submissions TO tsio_hub_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON innovation_contributions TO tsio_hub_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON engagement_requests TO tsio_hub_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON hub_settings TO tsio_hub_app;

-- AUDIT EVENTS: INSERT ONLY — no updates or deletes allowed
GRANT SELECT, INSERT ON audit_events TO tsio_hub_app;
REVOKE UPDATE, DELETE ON audit_events FROM tsio_hub_app;

-- Sequence grants
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO tsio_hub_app;
```

### 3.4 Data Retention

- `audit_events`: retained for the operational lifetime of the system. No TTL. No archival in MVP.
- `innovation_records` in `retired` state: retained for audit completeness.
- `opportunity_submissions`, `innovation_contributions`, `engagement_requests`: retained indefinitely. No automated deletion. Curator notes are internal.
- `submission_ip` and `ip_address` fields: captured for SEC-06 rate limiting and SEC-03 audit; not exposed in public API responses; accessible to Admins in audit view only.

---
---

## 4. API Design

### 4.1 API Conventions

- **Base path:** `/api/v1`
- **Format:** JSON (`Content-Type: application/json`)
- **Auth header:** `Authorization: Bearer <token>` for all `/api/v1/curator/*` routes
- **Dates:** ISO 8601 strings (`2026-06-15` for dates, `2026-08-11T14:00:00Z` for timestamps)
- **UUIDs:** lowercase hyphenated strings
- **Pagination:** `?page=1&page_size=20`; default `page_size=20`, max `100`
- **Naming convention:** camelCase in JSON request/response bodies; snake_case in DB

#### 4.1.1 Standard Response Envelope

```typescript
// Success
interface ApiSuccess<T> {
  status: 'ok';
  data: T;
  meta?: PaginationMeta;
}

interface PaginationMeta {
  page: number;
  page_size: number;
  total: number;
}

// Error
interface ApiError {
  status: 'error';
  error_code: string;
  message: string;
  fields?: Record<string, string>;  // field-level messages for 422
}
```

#### 4.1.2 HTTP Security Headers (SEC-10)

All responses include:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Strict-Transport-Security: max-age=63072000; includeSubDomains   (HTTPS deployments)
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; frame-ancestors 'none'
```

CSP is configured per deployment and must prevent inline script injection.

### 4.2 TypeScript Interfaces

```typescript
// ── Canonical Enum Types ──────────────────────────────────────────────────

type MaturityValue =
  | 'idea'
  | 'evaluated_idea'
  | 'experiment_poc'
  | 'prototype_pilot'
  | 'production_validated'
  | 'archived_retired';

type ReviewStatusValue =
  | 'submitted'
  | 'curated'
  | 'technically_reviewed'
  | 'security_reviewed'     // SEC-11: visually distinct from technically_reviewed
  | 'policy_reviewed'
  | 'validated_for_reuse'
  | 'superseded'
  | 'retired';

type PublicationState =
  | 'draft'
  | 'submitted_for_review'
  | 'published'
  | 'superseded'
  | 'archived'
  | 'retired';

type EngagementIndicator =
  | 'demo_available'
  | 'seeking_adoption_partner'
  | 'technical_playbook_available'
  | 'reference_pattern_available'
  | 'monitoring_only'
  | 'archived'
  | 'none';

type ArtifactType =
  | 'lessons_learned'
  | 'poc_report'
  | 'decision_brief'
  | 'architecture_diagram'
  | 'demo_video'
  | 'repository'
  | 'infrastructure_definition'
  | 'test_results'
  | 'security_findings'
  | 'technical_playbook'
  | 'other';

type NextActionType =
  | 'request_demo'
  | 'discuss_use_case'
  | 'explore_adoption'
  | 'request_technical_guidance'
  | 'share_related_work'
  | 'contact_ir';

type ReusePotential = 'high' | 'moderate' | 'low' | 'not_assessed';

type OpportunityRequestType =
  | 'current_mission_problem'
  | 'emerging_tech_question'
  | 'request_for_research'
  | 'potential_poc'
  | 'request_for_demo'
  | 'collaboration_opportunity'
  | 'share_existing_work'
  | 'other';

type EngagementRequestType =
  | 'request_demo'
  | 'discuss_use_case'
  | 'explore_adoption'
  | 'request_technical_guidance'
  | 'share_related_work'
  | 'contact_ir';

type CollaborationPreference =
  | 'open_for_reuse'
  | 'seeking_collaborator'
  | 'informational_only'
  | 'seeking_adopter'
  | 'discuss_with_ir';

type OpportunityStatus = 'pending' | 'accepted' | 'declined' | 'needs_more_information' | 'duplicate';
type ContributionStatus = 'pending' | 'accepted_for_curation' | 'declined' | 'needs_more_information' | 'duplicate' | 'curated';
type EngagementFollowUpStatus = 'received' | 'in_progress' | 'completed' | 'no_action_required';

type AuditEventType =
  | 'record_created' | 'record_updated' | 'maturity_changed'
  | 'review_status_changed' | 'publication_state_changed'
  | 'attribution_updated' | 'artifact_added' | 'artifact_updated'
  | 'artifact_removed' | 'submission_dispositioned'
  | 'record_created_from_contribution' | 'engagement_status_updated'
  | 'settings_changed' | 'user_role_changed';

// ── Public Record Interfaces ──────────────────────────────────────────────

/** Catalog card — used in /api/v1/catalog and /api/v1/search responses */
interface CatalogCard {
  id: string;
  slug: string;
  title: string;
  summary: string;                      // truncated to 280 chars for card display
  technologyAreas: string[];
  maturity: MaturityValue | null;
  reviewStatuses: ReviewStatusValue[];
  contributingOffices: string[];
  engagementIndicator: EngagementIndicator;
  lastReviewedDate: string | null;      // YYYY-MM-DD
  publicationState: PublicationState;   // only non-published when curator-scoped
}

/** Full public record — returned by /api/v1/records/:idOrSlug */
interface PublicInnovationRecord {
  id: string;
  slug: string;
  publicationState: PublicationState;
  publishedAt: string | null;

  // F3.1 — Problem and Context
  title: string;
  summary: string;
  problemStatement: string;
  affectedUsers?: string;
  currentWorkflow?: string;
  whyExperimentation?: string;
  missionAreas: string[];
  problemTypeTags: string[];

  // F3.2 — What Was Explored
  hypothesisOrObjective: string;
  scopeDescription?: string;
  technologyAreas: string[];
  technologiesUsed?: string;
  methodsUsed?: string;
  tags: string[];

  // F3.3 — Outcome and Evidence
  outcomeSummary: string;
  whatWorked?: string;
  whatDidNotWork?: string;
  uncertaintyReduced?: string;
  decisionEnabled?: string;
  evidenceSummary?: string;
  sourceBasis: string;

  // F3.4 — Key Findings
  findingsArchitectural?: string;
  findingsSecurity?: string;
  findingsCloudPlatform?: string;
  findingsPerformance?: string;
  findingsUx?: string;
  findingsData?: string;
  findingsTesting?: string;
  findingsOperational?: string;
  findingsCost?: string;
  findingsScalability?: string;
  findingsOther?: string;

  // F3.5 — Maturity and Readiness
  maturity: MaturityValue | null;
  reviewStatuses: ReviewStatusValue[];
  readyFor?: string;
  notReadyFor?: string;
  nextStageRequirements?: string;
  lastReviewedDate: string | null;
  nextReviewDate?: string | null;

  // F3.6 — Reuse Guidance
  reusePotential: ReusePotential;
  whatCanBeReused?: string;
  whatShouldBeAdapted?: string;
  whatNotToCopy?: string;
  environmentAssumptions?: string;
  requiredSkills?: string;
  requiredServices?: string;
  productionReadinessGaps?: string;
  engagementIndicator: EngagementIndicator;

  // F3.7 — Ownership and Attribution
  opportunitySource?: string;
  contributingOffices: string[];
  contributorNames: string[];
  irContribution?: string;
  ownerSteward: string;
  ownerContact?: string;              // may be omitted per privacy policy
  operationalOwner?: string;
  productionOwner?: string;
  attributionStatement: string;

  // F3.8 — Governance and Trust (always rendered)
  applicableDisclaimer: string;
  supersededByRecordId?: string | null;
  supersessionReason?: string;
  retirementReason?: string;

  // F3.9 — Next Actions
  nextActionDescription?: string;

  // Relations
  artifacts: PublicArtifact[];
  nextActions: RecordNextAction[];
}

/** Artifact (public — restricted artifacts omit url) */
interface PublicArtifact {
  artifactId: string;
  artifactType: ArtifactType;
  name: string;
  url?: string;                        // omitted when isRestricted = true for non-curators
  accessNotes?: string;
  isRestricted: boolean;
  displayOrder: number;
}

/** Next Action CTA */
interface RecordNextAction {
  actionId: string;
  actionType: NextActionType;
  customLabel?: string;
  isEnabled: boolean;
  displayOrder: number;
  defaultLabel: string;               // computed from actionType
}

// ── Curator-Only Interfaces ───────────────────────────────────────────────

/** Full record — curator view (adds system fields + restricted artifact URLs) */
interface CuratorInnovationRecord extends PublicInnovationRecord {
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  version: number;                    // for optimistic concurrency
  sourceContributionId?: string | null;
  maturityChangeReason?: string;

  // Curator-only: full artifact URLs regardless of is_restricted
  artifacts: CuratorArtifact[];
}

interface CuratorArtifact extends PublicArtifact {
  url: string;                        // always present for curators
  addedAt: string;
  addedBy: string;
}

// ── Submission Interfaces ─────────────────────────────────────────────────

interface OpportunitySubmission {
  id: string;
  requestType: OpportunityRequestType;
  problemTitle: string;
  problemDescription: string;
  affectedUsers: string;
  currentWorkflow?: string;
  impact: string;
  desiredOutcome?: string;
  knownConstraints?: string;
  relatedWorkAttempted?: string;
  submittingOffice: string;
  submitterName: string;
  submitterEmail: string;             // SEC-05: handled per privacy policy
  discoveryParticipants?: string;
  additionalContext?: string;
  submissionDate: string;
  status: OpportunityStatus;
  dispositionedAt?: string;
  dispositionedBy?: string;
  curatorNotes?: string;              // curator-only
}

interface InnovationContribution {
  id: string;
  contributionTitle: string;
  problemAddressed: string;
  workDescription: string;
  contributingOffice: string;
  contributorNames: string;
  currentMaturity: MaturityValue;
  currentOwner: string;
  ownerContactEmail: string;
  artifactLinks?: string;
  knownLimitations?: string;
  collaborationPreference: CollaborationPreference;
  additionalContext?: string;
  submitterName: string;
  submitterEmail: string;
  submissionDate: string;
  status: ContributionStatus;
  dispositionedAt?: string;
  dispositionedBy?: string;
  curatorNotes?: string;
  createdRecordId?: string;
}

interface EngagementRequest {
  id: string;
  requestType: EngagementRequestType;
  originatingRecordId?: string;
  originatingRecordTitle?: string;
  requesterName: string;
  requesterOffice: string;
  requesterEmail: string;             // SEC-05
  needDescription: string;
  desiredNextStep?: string;
  preferredContactMethod: 'email' | 'phone' | 'no_preference';
  submittedAt: string;
  routingAddressAtSubmission: string;
  emailRoutingInitiated: boolean;
  followUpStatus: EngagementFollowUpStatus;
  followUpUpdatedAt?: string;
  curatorNotes?: string;
}

interface AuditEvent {
  auditId: string;
  eventType: AuditEventType;
  actorId: string;
  actorName: string;
  targetType: string;
  targetId: string;
  targetTitle?: string;
  eventData: Record<string, unknown>;
  occurredAt: string;
  notes?: string;
  // ipAddress: omitted from standard curator view; admin-only
}

interface HubSetting {
  settingKey: string;
  settingValue: string;
  settingType: 'string' | 'integer' | 'boolean' | 'json';
  description?: string;
  updatedAt: string;
  updatedBy?: string;
}
```

### 4.3 Public API Endpoints (Y1a)

| Method | Path | Auth | Rate Limit | Description |
|---|---|---|---|---|
| GET | `/api/v1/catalog` | None | — | Paginated published catalog cards |
| GET | `/api/v1/search` | None | — | Full-text search + faceted filter |
| GET | `/api/v1/search/facets` | None | — | Facet values and counts |
| GET | `/api/v1/records/:idOrSlug` | None | — | Full public record by ID or slug |
| GET | `/api/v1/records/:id/artifacts` | None | — | Artifact list (restricted URLs omitted) |
| POST | `/api/v1/engagement` | None | 10/IP/hr | Submit engagement request (F8) |
| POST | `/api/v1/submissions/opportunity` | None | 5/IP/hr | Submit opportunity (F6) |
| POST | `/api/v1/submissions/contribution` | None | 5/IP/hr | Submit innovation contribution (F7) |

#### GET /api/v1/catalog

**Query params:** `page` (default 1), `page_size` (default 20, max 100), `sort` (`last_reviewed_desc` | `title_asc` | `updated_desc`)

**Response 200:** `ApiSuccess<CatalogCard[]>` with `PaginationMeta`

**Errors:**

| HTTP | Code | Condition |
|---|---|---|
| 503 | `CATALOG_UNAVAILABLE` | Database unavailable |

---

#### GET /api/v1/search

**Query params:** `q` (min 2, max 500 chars), `mission_areas[]`, `technology_areas[]`, `problem_type_tags[]`, `maturity[]`, `review_statuses[]`, `contributing_offices[]`, `reuse_potential`, `has_artifacts` (boolean), `publication_state[]` (public: only `published`), `page`, `page_size`, `sort` (`relevance` | `last_reviewed_desc` | `title_asc`)

**Response 200:** `ApiSuccess<CatalogCard[]>` with `PaginationMeta` + `query` + `active_filters` echoed in meta

**Errors:**

| HTTP | Code | Condition |
|---|---|---|
| 400 | `QUERY_TOO_LONG` | `q` > 500 chars |
| 400 | `INVALID_FILTER` | Filter value not in canonical vocabulary |
| 503 | `SEARCH_UNAVAILABLE` | Search unavailable |

---

#### GET /api/v1/records/:idOrSlug

**Query params:** `view` (`executive` | `technical`, default `executive`) — client rendering hint

**Response 200:** `ApiSuccess<PublicInnovationRecord>`

**Logic:**
- Accepts both UUID and slug in the path parameter
- Returns 404 for draft, submitted_for_review, and retired records accessed by anonymous users
- Returns superseded/archived records with full data + state indicator
- Restricted artifact URLs (`is_restricted = true`) are omitted from `artifacts[]`

**Errors:**

| HTTP | Code | Condition |
|---|---|---|
| 404 | `RECORD_NOT_FOUND` | Not found, not published, or access denied |

---

#### POST /api/v1/engagement

**Request body:**
```typescript
interface EngagementRequestBody {
  requestType: EngagementRequestType;        // required
  originatingRecordId?: string;              // UUID; required for record-level CTAs
  requesterName: string;                     // min 2, max 200 chars
  requesterOffice: string;                   // min 2, max 200 chars
  requesterEmail: string;                    // RFC 5321 email
  needDescription: string;                   // min 20, max 3000 chars
  desiredNextStep?: string;                  // max 500 chars
  preferredContactMethod?: 'email' | 'phone' | 'no_preference';
  consentToContact: true;                    // must be true
}
```

**Response 201:**
```typescript
interface EngagementRequestResponse {
  id: string;
  referenceNumber: string;                   // e.g., "ENG-2026-001"
  message: string;
}
```

**Errors:**

| HTTP | Code | Condition |
|---|---|---|
| 422 | `VALIDATION_ERROR` | Missing or invalid field |
| 422 | `CONSENT_REQUIRED` | `consentToContact` not true |
| 429 | `RATE_LIMITED` | Rate limit exceeded (SEC-06) |
| 503 | `ROUTING_NOT_CONFIGURED` | No routing address in settings (SEC-07) |
| 500 | `SUBMISSION_FAILED` | Server error |

---

#### POST /api/v1/submissions/opportunity

**Request body:**
```typescript
interface OpportunitySubmissionBody {
  requestType: OpportunityRequestType;       // required
  problemTitle: string;                      // min 5, max 200 chars
  problemDescription: string;               // min 50, max 5000 chars
  affectedUsers: string;                     // min 10, max 1000 chars
  impact: string;                            // min 10, max 1000 chars
  submittingOffice: string;                  // min 2, max 200 chars
  submitterName: string;                     // min 2, max 200 chars
  submitterEmail: string;                    // RFC 5321
  currentWorkflow?: string;
  desiredOutcome?: string;
  knownConstraints?: string;
  relatedWorkAttempted?: string;
  discoveryParticipants?: string;
  additionalContext?: string;
  consentToContact: true;
  nonAcceptanceAcknowledged: true;
}
```

**Response 201:**
```typescript
interface SubmissionResponse {
  id: string;
  referenceNumber: string;                   // e.g., "OPP-2026-001"
  message: string;
}
```

**Errors:** 422 `VALIDATION_ERROR`, 422 `CONSENT_REQUIRED`, 429 `RATE_LIMITED`, 500 `SUBMISSION_FAILED`

---

#### POST /api/v1/submissions/contribution

**Request body:**
```typescript
interface ContributionSubmissionBody {
  contributionTitle: string;                 // min 5, max 200 chars
  problemAddressed: string;                  // min 30, max 3000 chars
  workDescription: string;                   // min 50, max 5000 chars
  contributingOffice: string;                // min 2, max 200 chars
  contributorNames: string;                  // min 2, max 500 chars
  currentMaturity: MaturityValue;            // canonical value
  currentOwner: string;                      // min 2, max 200 chars
  ownerContactEmail: string;                 // RFC 5321
  collaborationPreference: CollaborationPreference;
  artifactLinks?: string;
  knownLimitations?: string;
  additionalContext?: string;
  submitterName: string;
  submitterEmail: string;
  nonEndorsementAcknowledged: true;
  consentToContact: true;
}
```

**Response 201:** `SubmissionResponse` (referenceNumber format: `CONTRIB-2026-001`)

---

### 4.4 Curator API Endpoints (Y1b)

All `/api/v1/curator/*` endpoints require `Authorization: Bearer <token>` with role `curator` or `admin`.

| Method | Path | Role | Description |
|---|---|---|---|
| GET | `/api/v1/curator/dashboard` | Curator | Dashboard summary counts (F9.1) |
| GET | `/api/v1/curator/records` | Curator | All records all states (F9.2) |
| POST | `/api/v1/curator/records` | Curator | Create new draft record (F9.3) |
| GET | `/api/v1/curator/records/:id` | Curator | Full record edit view (F9.4) |
| PATCH | `/api/v1/curator/records/:id` | Curator | Edit record fields; requires `version` |
| DELETE | `/api/v1/curator/records/:id` | Curator | Soft-delete draft record only |
| POST | `/api/v1/curator/records/:id/submit-for-review` | Curator | Advance to submitted_for_review |
| POST | `/api/v1/curator/records/:id/publish` | Curator | Publish (gate enforced — F9.10) |
| POST | `/api/v1/curator/records/:id/unpublish` | Curator | Return to draft |
| POST | `/api/v1/curator/records/:id/supersede` | Curator | Supersede (reason required) |
| POST | `/api/v1/curator/records/:id/archive` | Curator | Archive record |
| POST | `/api/v1/curator/records/:id/retire` | Curator | Retire (reason required) |
| POST | `/api/v1/curator/records/:id/reactivate` | Curator | Re-activate to draft (note required) |
| GET | `/api/v1/curator/records/:id/artifacts` | Curator | All artifacts incl. restricted URLs |
| POST | `/api/v1/curator/records/:id/artifacts` | Curator | Add artifact (F9.5) |
| PATCH | `/api/v1/curator/records/:id/artifacts/:aid` | Curator | Edit artifact |
| DELETE | `/api/v1/curator/records/:id/artifacts/:aid` | Curator | Remove artifact |
| GET | `/api/v1/curator/records/:id/audit` | Curator | Record audit history (F9.11) |
| GET | `/api/v1/curator/audit` | **Admin** | System-wide audit log |
| GET | `/api/v1/curator/submissions/opportunity` | Curator | Opportunity queue (F9.12) |
| GET | `/api/v1/curator/submissions/opportunity/:id` | Curator | Single submission |
| PATCH | `/api/v1/curator/submissions/opportunity/:id/disposition` | Curator | Record disposition |
| GET | `/api/v1/curator/submissions/contribution` | Curator | Contribution queue (F9.13) |
| GET | `/api/v1/curator/submissions/contribution/:id` | Curator | Single contribution |
| PATCH | `/api/v1/curator/submissions/contribution/:id/disposition` | Curator | Record disposition |
| POST | `/api/v1/curator/submissions/contribution/:id/create-record` | Curator | Create draft from contribution |
| GET | `/api/v1/curator/engagement` | Curator | Engagement activity (F9.14) |
| GET | `/api/v1/curator/engagement/:id` | Curator | Single engagement request |
| PATCH | `/api/v1/curator/engagement/:id/status` | Curator | Update follow-up status |
| GET | `/api/v1/curator/settings` | **Admin** | View all hub settings |
| PUT | `/api/v1/curator/settings/:key` | **Admin** | Update single setting |
| GET | `/api/v1/curator/reference` | Curator | Content model reference (F9.16) |

#### PATCH /api/v1/curator/records/:id (record edit)

Must include `version` field for optimistic concurrency:

```typescript
interface RecordEditBody {
  version: number;                    // current version — if mismatch, returns 409
  // Any subset of CuratorInnovationRecord fields
  title?: string;
  summary?: string;
  maturity?: MaturityValue;
  maturityChangeReason?: string;
  reviewStatuses?: ReviewStatusValue[];
  // ... all other record fields
}
```

**Errors:**

| HTTP | Code | Condition |
|---|---|---|
| 409 | `VERSION_CONFLICT` | Submitted version ≠ current DB version |
| 400 | `INVALID_MATURITY` | Unrecognized maturity value |
| 400 | `INVALID_REVIEW_STATUS` | Unrecognized review status value |

#### POST /api/v1/curator/records/:id/publish (publication gate)

Server runs all 15 publication gate checks (F9.10). Returns 422 with `fields` listing all missing requirements:

```json
{
  "status": "error",
  "error_code": "PUBLICATION_GATE_FAILED",
  "message": "Cannot publish. Required fields are missing.",
  "fields": {
    "applicableDisclaimer": "Applicable Disclaimer is required before publishing.",
    "lastReviewedDate": "Last Reviewed Date is required before publishing.",
    "keyFindingsGateCheck": "At least one Key Findings field must be non-empty."
  }
}
```

#### Publication Gate — All 15 Checks (F9.10)

| # | Field / Condition | Error Key |
|---|---|---|
| 1 | `title` ≥ 5 chars | `title` |
| 2 | `summary` ≥ 20 chars | `summary` |
| 3 | `problem_statement` ≥ 50 chars | `problemStatement` |
| 4 | `mission_areas` ≥ 1 value | `missionAreas` |
| 5 | `hypothesis_or_objective` ≥ 20 chars | `hypothesisOrObjective` |
| 6 | `technology_areas` ≥ 1 value | `technologyAreas` |
| 7 | `outcome_summary` ≥ 50 chars | `outcomeSummary` |
| 8 | `source_basis` ≥ 10 chars | `sourceBasis` |
| 9 | At least 1 `findings_*` field non-empty | `keyFindingsGateCheck` |
| 10 | `maturity` is valid non-null canonical value | `maturity` |
| 11 | `review_statuses` ≥ 1 valid canonical value | `reviewStatuses` |
| 12 | `last_reviewed_date` valid, ≤ today | `lastReviewedDate` |
| 13 | `owner_steward` ≥ 3 chars | `ownerSteward` |
| 14 | `attribution_statement` ≥ 10 chars | `attributionStatement` |
| 15 | `applicable_disclaimer` ≥ 10 chars | `applicableDisclaimer` |

#### POST /api/v1/curator/submissions/contribution/:id/create-record

Creates a Draft Innovation Record pre-populated from the contribution. Side effects:
- Sets `innovation_contributions.created_record_id` to new record ID
- Sets `innovation_contributions.status = curated`
- Sets `innovation_records.source_contribution_id` to contribution ID
- Pre-populates: `contributing_offices`, `contributor_names`, `owner_steward`, `source_contribution_id`
- Generates `record_created_from_contribution` audit event

**Response 201:**
```json
{
  "status": "ok",
  "data": {
    "recordId": "uuid",
    "message": "Draft record created from contribution. Attribution fields pre-populated."
  }
}
```

**Errors:**

| HTTP | Code | Condition |
|---|---|---|
| 409 | `RECORD_ALREADY_CREATED` | Record already created from this contribution |

#### GET /api/v1/curator/dashboard

**Response 200:**
```typescript
interface DashboardData {
  recordCounts: {
    draft: number;
    submittedForReview: number;
    published: number;
    superseded: number;
    archived: number;
    retired: number;
  };
  recordsNeedingReview: number;           // next_review_date ≤ today + 30 days
  incompletePublishedRecords: number;     // published records missing trust fields
  pendingOpportunitySubmissions: number;
  pendingContributions: number;
  recentEngagementCount: number;          // last 7 days
  recentAuditEvents: Array<{
    auditId: string;
    eventType: AuditEventType;
    actorName: string;
    targetTitle?: string;
    occurredAt: string;
  }>;
}
```

### 4.5 Cross-Feature Error Catalog

| HTTP | Error Code | When |
|---|---|---|
| 400 | `QUERY_TOO_LONG` | Search query > 500 chars |
| 400 | `INVALID_FILTER` | Filter value not in canonical vocabulary |
| 400 | `INVALID_MATURITY` | Unrecognized maturity value |
| 400 | `INVALID_REVIEW_STATUS` | Unrecognized review status value |
| 401 | `UNAUTHORIZED` | Not authenticated or token expired |
| 403 | `FORBIDDEN` | Authenticated but insufficient role |
| 404 | `NOT_FOUND` | General not found |
| 404 | `RECORD_NOT_FOUND` | Record not found or not published |
| 404 | `ARTIFACT_NOT_FOUND` | Artifact not found |
| 404 | `SUBMISSION_NOT_FOUND` | Submission not found |
| 404 | `SETTING_NOT_FOUND` | Unknown setting key |
| 409 | `VERSION_CONFLICT` | Optimistic concurrency violation |
| 409 | `CANNOT_DELETE_PUBLISHED` | Attempt to delete non-draft record |
| 409 | `RECORD_ALREADY_CREATED` | Record already created from contribution |
| 422 | `VALIDATION_ERROR` | Field-level validation failure |
| 422 | `PUBLICATION_GATE_FAILED` | Publication gate check failed |
| 422 | `SUPERSESSION_REASON_REQUIRED` | Supersede without reason |
| 422 | `RETIREMENT_REASON_REQUIRED` | Retire without reason |
| 422 | `REACTIVATION_NOTE_REQUIRED` | Re-activate without note |
| 422 | `CONSENT_REQUIRED` | Required consent not acknowledged |
| 422 | `INVALID_EMAIL` | Invalid email format |
| 422 | `INVALID_URL` | Artifact URL invalid |
| 422 | `ATTRIBUTION_REMOVAL_WARNING` | Attribution preservation warning (soft block) |
| 429 | `RATE_LIMITED` | Rate limit exceeded (SEC-06) |
| 500 | `INTERNAL_ERROR` | Unhandled server error |
| 500 | `SUBMISSION_FAILED` | Submission persistence failure |
| 503 | `CATALOG_UNAVAILABLE` | Database unavailable for catalog |
| 503 | `SEARCH_UNAVAILABLE` | Search service unavailable |
| 503 | `ROUTING_NOT_CONFIGURED` | No routing address in settings (SEC-07) |
| 503 | `SERVICE_UNAVAILABLE` | General dependency unavailable |
| 504 | `GATEWAY_TIMEOUT` | Request exceeded timeout |

---
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
---

## 6. Technology Stack

### 6.1 Framework and Runtime

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| Runtime | Node.js | 20 LTS | Server-side JavaScript runtime; LTS for stability |
| Language | TypeScript | 5.x | Type safety; matches FRD interface definitions |
| Framework | Next.js | 14+ (App Router) | SSR + API routes; WCAG-friendly server rendering; single deployment unit |
| React | React | 18+ | UI component library (bundled with Next.js) |

### 6.2 Database

| Component | Technology | Version | Purpose |
|---|---|---|---|
| Database engine | PostgreSQL | 15+ | Relational DB with JSONB, arrays, tsvector; referential integrity |
| ORM / Query builder | Kysely | Latest | Type-safe SQL queries; no ORM magic; explicit PostgreSQL types |
| Migrations | Custom SQL files | — | Numbered SQL migration scripts in `/migrations/`; run via Kysely migrator or `psql` |
| Connection pooling | node-postgres (pg) | 8+ | PostgreSQL driver; connection pool management |

**Rationale for Kysely over alternatives:**
- Drizzle ORM: also a strong alternative; both provide type-safe SQL without hiding query semantics
- Prisma: avoids Prisma because it obscures raw SQL operations needed for audit event patterns, `tsvector` updates, and PostgreSQL-specific constraints
- Raw pg: too verbose; Kysely provides type safety without abstraction overhead

### 6.3 Authentication

| Component | Technology | Version | Purpose |
|---|---|---|---|
| Auth framework | NextAuth.js (Auth.js) | 5.x | OIDC/OAuth2 integration; session management; pluggable providers |
| JWT validation | jose | Latest | RS256 JWT verification; used when identity system issues JWTs |
| Session cookies | HTTP-only, SameSite=Strict | — | Secure session cookies for browser auth |
| Dev auth stub | Custom (env-gated) | — | Fixed credentials for development; disabled in production |

**Anticipated operational provider (INT-01 — TBD):** Azure Entra ID Government (OIDC) or Judiciary SSO.

### 6.4 UI and Accessibility

| Component | Technology | Version | Purpose |
|---|---|---|---|
| CSS framework | Tailwind CSS | 3.x | Utility-first CSS; WCAG-friendly with proper usage |
| UI primitives | Radix UI | Latest | Accessible, unstyled component primitives (dialogs, tabs, badges) meeting WCAG 2.1 AA |
| Icon library | Heroicons or Lucide | Latest | SVG icons with accessible title/aria-label support |
| Accessibility testing | axe-core (jest-axe) | Latest | Automated WCAG 2.1 AA testing in CI |
| Focus management | Radix UI / native | — | Keyboard navigation; focus trapping in modals |

### 6.5 Security and Middleware

| Component | Technology | Version | Purpose |
|---|---|---|---|
| Input validation | Zod | 3.x | Schema-based validation for all API inputs |
| XSS sanitization | isomorphic-dompurify | Latest | Server-side HTML sanitization of text fields |
| Rate limiting | @upstash/ratelimit or custom | Latest | IP-based rate limiting; Redis or in-memory store |
| CSRF | built-in Next.js / custom token | — | CSRF protection for mutations |
| Security headers | Next.js middleware | — | Applied globally via `next.config.ts` headers |
| Password hashing | N/A | — | Hub does not manage passwords; delegated to identity provider |

### 6.6 Email Routing

| Component | Technology | Version | Purpose |
|---|---|---|---|
| SMTP email | Nodemailer | Latest | Server-side email send for engagement routing (INT-03) |
| Mailto fallback | Native `mailto:` URI | — | Client-side email trigger when server-side SMTP not available |
| Mode control | `EMAIL_ROUTING_MODE` env var | — | `smtp` | `mailto`; controls routing approach |

### 6.7 Infrastructure and DevOps

| Component | Technology | Version | Purpose |
|---|---|---|---|
| Containerization | Docker | 24+ | Application packaging; consistent environments |
| Local orchestration | docker-compose | 2.x | Dev environment (app + PostgreSQL) |
| CI/CD | TBD (GitHub Actions or Azure Pipelines) | — | Confirmed during discovery/hosting decision |
| Static analysis | ESLint + TypeScript strict mode | — | Code quality; type safety enforcement |
| Testing | Jest + React Testing Library | — | Unit and integration tests |
| Accessibility testing | jest-axe + Playwright (a11y) | — | Automated WCAG 2.1 AA validation |
| Environment config | `.env` + dotenv | — | Development config; `.env.example` committed |

### 6.8 Key Dependencies Summary

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "next-auth": "^5.0.0",
    "kysely": "^0.27.0",
    "pg": "^8.0.0",
    "zod": "^3.0.0",
    "nodemailer": "^6.0.0",
    "isomorphic-dompurify": "^2.0.0",
    "@radix-ui/react-tabs": "latest",
    "@radix-ui/react-dialog": "latest",
    "@radix-ui/react-badge": "latest",
    "tailwindcss": "^3.0.0",
    "jose": "^5.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/pg": "^8.0.0",
    "jest": "^29.0.0",
    "@testing-library/react": "^14.0.0",
    "jest-axe": "^8.0.0",
    "playwright": "^1.40.0",
    "eslint": "^8.0.0"
  }
}
```

### 6.9 Not Included (Explicit Exclusions)

| Technology | Reason Not Included |
|---|---|
| Elasticsearch / Algolia | PostgreSQL tsvector sufficient for MVP scale; eliminates operational dependency |
| GraphQL | REST is simpler, easier to rate-limit and audit; all FRD endpoints are resource-oriented |
| Redis (required) | Optional for rate limiting; in-memory fallback for development; Redis added when multi-instance is needed |
| AI/ML inference | Not in scope per PRD §14; no autonomous decisions |
| Social features / WebSockets | Not in scope per PRD §14 |
| External CDN | Not required for MVP; static assets served by Next.js |
| File storage (S3, Azure Blob) | Hub links to external sources; does not host artifact content (PRD design principle) |

---
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
