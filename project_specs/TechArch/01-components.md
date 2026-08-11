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
