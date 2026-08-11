---

## Y3: External Integrations and Dependencies

**Scope:** External system dependencies, integration contracts, and blocker/assumption classifications for all MVP features. See PRD §15 for the authoritative dependency register. This document adds functional detail: what each integration must do, what behavior is required, and what constitutes a development stub versus an operational implementation.

---

### Stub and Blocker Governance

Per PRD §15.1:
- A temporary development stub must have explicit acceptance criteria and an explicit condition describing where it may not be used.
- A production blocker must remain visible in the decision register until resolved.
- A stub must not silently become the operational implementation because the feature appears functional in development.
- SEC-09: development-only mechanisms must not be active in operational environments.

---

### §INT-01: Identity and Access Management

**MVP Need:** Required for all protected Curator and Admin routes (F9, all curator API endpoints).

**Required Behavior:**
- The system must authenticate users before granting access to any `/api/v1/curator/*` endpoint.
- Authenticated users must carry a role claim of `curator` or `admin`.
- The authentication token must be verifiable by the Hub application without calling back to the identity provider on every request (e.g., JWT with signature verification, or session with server-side validation).
- Failed authentication must return 401. Insufficient role must return 403.
- Authentication events material to governance must be auditable (SEC-03).

**Development Stub (permitted until operational identity is confirmed):**
- A development-only authentication mechanism (e.g., fixed test credentials, header bypass, or mock JWT) may be used during development if explicitly approved by the technical authority.
- SEC-09: the stub must be disabled by a configuration flag in operational environments. It must not be deployable to operational environments without explicit removal or override.
- Acceptance criteria for stub: stub is behind a `ENABLE_DEV_AUTH_BYPASS=true` environment variable; attempting to enable this variable in a non-development environment triggers a startup error.

**Operational Blocker:** Yes — identity and access approach must be resolved and implemented before non-development deployment. (PRD §15 confirms this as a blocker.)

**Current State:** TBD during discovery. Likely candidates include Azure AD (government cloud), Judiciary SSO, or a locally managed identity store.

---

### §INT-02: Hosting Environment

**MVP Need:** Required before operational deployment.

**Required Behavior:**
- The application must be deployable to the approved hosting environment.
- The hosting environment must support: HTTPS with a valid certificate, appropriate network access controls, secrets management (SEC-08), and the approved application runtime.
- The hosting environment determines the operational deployment architecture (containerized, VM-based, PaaS, etc.).

**Development Stub:** Local/development deployment is permitted during development phase.

**Operational Blocker:** Yes — hosting environment must be resolved before operational deployment. (PRD §15.)

**Current State:** TBD during discovery.

---

### §INT-03: Engagement Email Routing

**MVP Need:** Required for MVP engagement actions (F8). The initial routing address `AOml_TSO_IRB_Team@ao.uscourts.gov` has been confirmed.

**Required Behavior (MVP — Email-First):**
- The system must route engagement requests to the configured email address (stored in `hub_settings.engagement_routing_address`).
- For MVP, email-first routing via `mailto:` client-side link OR server-side email send is acceptable provided the engagement request is separately recorded in the database before the email action is triggered.
- The routing address must be configurable without code change or redeployment (F9.15, F8.4).
- The `routing_address_at_submission` field on each engagement request records the address in use at submission time (audit trail).

**Server-Side Email Integration (if implemented above `mailto:`):**
- SMTP server or email API (e.g., SendGrid, Azure Communication Services, or AO's approved SMTP relay) must be configured via environment variables (SEC-08).
- On send failure: the engagement request is already persisted; `email_routing_initiated = false`; curator is alerted in the engagement queue.

**Development Stub:**
- `mailto:` client-side routing is acceptable as a development stub.
- A server-side email stub (log to console or local mailbox) is permitted in development if explicitly approved.
- Stub acceptance criteria: `EMAIL_ROUTING_MODE=mailto` environment variable selects mailto mode; `EMAIL_ROUTING_MODE=smtp` configures server-side routing. `mailto` mode must not be used in operational environments without product owner approval.

**Operational Blocker:** No — email-first routing with separate database recording is approved for MVP if the routing address is confirmed. (PRD §15.)

---

### §INT-04: Authoritative Artifact Repositories

**MVP Need:** Required to link evidence artifacts from Innovation Records.

**Required Behavior:**
- The Hub links to artifacts stored in authoritative source systems (SharePoint, Git repositories, network file locations, etc.). The Hub does not host, copy, or migrate artifact content.
- Artifact URLs point to the authoritative source system. Access to the artifact is governed by the source system's permissions (SEC-04).
- The Hub stores the URL and metadata (`name`, `artifact_type`, `access_notes`, `is_restricted`) but does not validate reachability at storage time.
- Restricted artifacts (`is_restricted = true`): the URL is returned only in curator API responses; public responses return only the name and access notes.

**Integration Requirements:**
- No API integration with source systems is required for MVP. Artifact links are plain URLs provided by curators.
- Curators are responsible for providing valid, current URLs. Broken link detection is out of MVP scope.

**Development Stub:** No stub required — artifact links are plain URL strings. No integration library needed.

**Operational Blocker:** No — but initial artifact URLs must be confirmed by content curators before records are published. (PRD §15.)

---

### §INT-05: Automated Submission Protection (Rate Limiting / CAPTCHA)

**MVP Need:** Required where public-facing forms are exposed (F6, F7, F8 — SEC-06).

**Required Behavior:**
- Public submission endpoints must be rate-limited per IP address.
- Rate limits are configurable via `hub_settings` (see F9.15 and Y0b §hub_settings).
- A CAPTCHA or equivalent challenge mechanism may be required in operational environments depending on the approved security baseline (TBD during discovery).

**Development Stub:**
- IP-based rate limiting may be implemented via in-memory store (e.g., Redis or application-level counter) during development.
- CAPTCHA challenge may be bypassed in development if `ENABLE_CAPTCHA_BYPASS=true` environment variable is set — SEC-06 and SEC-09 require this bypass to be disabled in operational environments.
- Acceptance criteria: CAPTCHA bypass flag triggers a startup warning log in non-development environments and a startup error if `NODE_ENV=production`.

**Operational Blocker:** Yes where the approved operational security baseline requires it. Mechanism TBD during discovery. (PRD §15.)

---

### §INT-06: Usage and Engagement Analytics

**MVP Need:** Metrics collection is required to validate product hypothesis measures (PRD §11). Collection method TBD.

**Required Behavior:**
- Basic approved event tracking may be sufficient for MVP.
- Events of interest: catalog page views, record detail page views, search queries (no PII), filter usage, CTA clicks, engagement requests submitted, opportunity submissions, contribution submissions.
- Analytics must not collect PII without explicit Judiciary privacy approval.
- Analytics must not use third-party tracking services without appropriate review.

**Development Stub:**
- Server-side event logging (structured JSON to application logs) is acceptable as a development stub.
- No third-party analytics SDK integration is required until method is decided.

**Operational Blocker:** No — analytics are not required for launch but are required before metric collection for product hypothesis validation. Decision required before implementation. (PRD §15.)

---

### §INT-07: Database

**MVP Need:** Required for all persistence (records, submissions, engagement, audit, settings).

**Required Behavior:**
- The Hub requires a relational database supporting JSONB (for `audit_events.event_data` and settings), array types (for `text[]` fields), and standard SQL with referential integrity.
- PostgreSQL (or compatible) is the strongly recommended engine given the schema requirements.
- The application DB role must have INSERT-only on `audit_events` (no UPDATE or DELETE) — enforced at database role level.
- Secrets (database credentials) must not appear in committed code (SEC-08).

**Development Stub:** Local PostgreSQL or containerized PostgreSQL is permitted for development.

**Operational Blocker:** Yes — database hosting must be confirmed as part of the overall hosting environment decision (§INT-02).

---

### §INT-08: Secrets Management

**MVP Need:** Required before any credential, API key, or sensitive configuration is used (SEC-08).

**Required Behavior:**
- All secrets (database credentials, SMTP credentials, authentication secrets, API keys) must be injected via environment variables or an approved secrets management system.
- No secret may appear in committed source code, Docker images, or configuration files committed to version control.
- The deployment documentation must specify how each secret is provided in development and operational environments.

**Development Stub:** `.env` file (gitignored) is acceptable for local development. `.env.example` with placeholder values (no real credentials) must be committed.

**Operational Blocker:** Yes — must be resolved before operational deployment. Required for SEC-08 compliance.

---

### Integration Summary Table

| ID | Integration | Operational Blocker? | MVP Stub Permitted? | Current State |
|---|---|---|---|---|
| INT-01 | Identity and Access Management | Yes | Yes (dev-only auth bypass) | TBD — discovery |
| INT-02 | Hosting Environment | Yes | Yes (local dev) | TBD — discovery |
| INT-03 | Engagement Email Routing | No (if email-first approved) | Yes (mailto or log) | Address confirmed; mechanism TBD |
| INT-04 | Authoritative Artifact Repositories | No | No (plain URLs) | URLs confirmed per record |
| INT-05 | Automated Submission Protection | Yes (if baseline requires) | Yes (in-memory rate limit) | TBD — security baseline |
| INT-06 | Usage Analytics | No (pre-launch metric collection) | Yes (structured logs) | Method TBD |
| INT-07 | Database | Yes (part of hosting) | Yes (local PostgreSQL) | TBD — hosting |
| INT-08 | Secrets Management | Yes | Yes (.env for dev) | Required before operational |
