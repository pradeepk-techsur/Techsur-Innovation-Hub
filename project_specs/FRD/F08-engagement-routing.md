---

## F08: Engagement Routing

**PRD Reference:** F8 (F8.1–F8.6) | **Priority:** P0 — Critical

**Description:** Engagement Routing converts user interest into traceable, routed action. Every innovation record and the Hub generally must provide contextual calls to action allowing users to request a demonstration, discuss a use case, explore adoption, request technical guidance, share related work, or contact I&R. Routing destinations are configurable without code deployment. For MVP, email-first routing is acceptable provided engagement actions are separately recorded. The initial routing address is AOml_TSO_IRB_Team@ao.uscourts.gov.

---

### Terminology

- **Engagement Request** — A user's expression of interest in an innovation record or in I&R generally, captured as a structured record with context and routed to I&R.
- **CTA (Call to Action)** — A button or link on a record detail page or Hub-wide page that initiates an engagement request flow.
- **Record-Level CTA** — A CTA on a specific Innovation Record detail page, associated with that record's context.
- **General CTA** — A CTA available site-wide (e.g., "Contact I&R", "Submit an Opportunity") not tied to a specific record.
- **Routing Destination** — The I&R channel (email address) to which engagement notifications are sent. Configurable without code change (F9.15).
- **Email-First Routing** — MVP engagement routing approach: the system generates and initiates an email (via `mailto:` link or server-sent email) to the configured routing address; the engagement request is also separately recorded in the database.
- **Suggested Subject Pattern** — A pre-filled or suggested email subject line for the routed email.

---

### Sub-features

- **F8.1** — Record-level and general CTAs for demo, use case discussion, adoption, technical guidance, related work sharing, and I&R contact
- **F8.2** — Capture: request type, originating record (if applicable), user name, office, contact information, need description, desired next step
- **F8.3** — Email-first routing with separate database recording of engagement action (MVP)
- **F8.4** — Routing destination configurable without code change or redeployment (F9.15)
- **F8.5** — Display language directed to TSIO Innovation & Research; initial address AOml_TSO_IRB_Team@ao.uscourts.gov
- **F8.6** — Suggested email subject patterns

---

### Process

**Initiating an Engagement Request:**

1. User clicks a CTA on a record detail page or general Hub page.
2. System renders an Engagement Request form pre-populated with:
   - Request type (from the CTA type clicked).
   - Originating record ID and title (if record-level CTA).
   - Suggested email subject (F8.6).
3. User completes the form (see §Inputs).
4. User submits the form.
5. System applies SEC-06 abuse protection.
6. System validates all required fields.
7. System persists the engagement request to `engagement_requests` table with `status = received`.
8. **MVP Email Routing:** System initiates email routing to the configured routing destination (F9.15):
   - If server-side email is available: sends a notification email to the configured address containing the engagement request details.
   - If only `mailto:` client-side routing is available for MVP: opens the user's email client pre-populated with the routing address, suggested subject, and request context. **The engagement request is still separately recorded in the database before this action.**
9. System displays success confirmation to user:
   - Confirmation of receipt.
   - Next step: "I&R will review your request and reach out using the contact information you provided."
   - Reference number (engagement request ID).

**Curator reviewing engagement:**

10. Curator reviews engagement requests in the Engagement Activity queue (F9.14).
11. Curator records a follow-up status on each request.

---

### Inputs — Engagement Request Fields

| Field | Type | Required | Constraints | Notes |
|---|---|---|---|---|
| `request_type` | enum | Yes | One of canonical Engagement Request Type values (see below) | Determines routing context and subject pattern |
| `originating_record_id` | UUID | Conditional | Required for record-level CTAs; null for general CTAs | References `innovation_records.id` |
| `originating_record_title` | string | Conditional | Populated automatically from record when present; max 200 chars | Stored in the engagement request for audit; not editable by user |
| `requester_name` | string | Yes | Max 200 chars; min 2 chars | User's name |
| `requester_office` | string | Yes | Max 200 chars; min 2 chars | User's court, AO office, or organizational unit |
| `requester_email` | string | Yes | Valid email format; max 254 chars | SEC-05 applies |
| `need_description` | text | Yes | Max 3,000 chars; min 20 chars | User's description of the need, question, or context |
| `desired_next_step` | text | No | Max 500 chars | What the user hopes will happen next |
| `preferred_contact_method` | enum | No | One of: `email`, `phone`, `no_preference`; default `email` | |
| `consent_to_contact` | boolean | Yes | Must be true | User acknowledges I&R may contact them |
| `submitted_at` | timestamp | Yes (auto) | UTC | System-generated |
| `submission_ip` | string | No | Server-captured | SEC-06 rate limiting |
| `routing_address_at_submission` | string | Yes (auto) | Populated from configured routing address at time of submission; max 254 chars | Preserved for audit — captures what address was in use when the engagement was sent |
| `email_routing_initiated` | boolean | Yes (auto) | System sets to true after email routing is triggered | |

---

### Engagement Request Type — Canonical Values (F8.1)

| Value | Display Label | Default Subject Pattern (F8.6) |
|---|---|---|
| `request_demo` | Request a Demonstration | `Demo Request – [Innovation Record Title]` |
| `discuss_use_case` | Discuss a Related Use Case | `Innovation Opportunity – [Office] – [Topic]` |
| `explore_adoption` | Explore Adoption | `Adoption Discussion – [Innovation Record Title]` |
| `request_technical_guidance` | Request Technical Guidance | `Technical Guidance – [Innovation Record Title]` |
| `share_related_work` | Share Related Work | `Innovation Opportunity – [Office] – [Topic]` |
| `contact_ir` | Contact I&R | `Innovation Opportunity – [Office] – [Topic]` |

Subject patterns must be pre-populated in the form's suggested subject field. For MVP `mailto:` routing, the subject is set as the `?subject=` parameter. For server-side email, the configured subject pattern is used in the email subject header.

---

### Routing Behavior (F8.3, F8.4, F8.5)

**MVP Routing Model:**

The system must route engagement requests to the configured routing address AND separately record the request in the database. Both must occur. The routing is not considered complete if only one of these actions succeeds.

**If server-side email routing is implemented:**
- System sends an email to `routing_address` with:
  - Subject: formatted subject pattern (F8.6).
  - Body: engagement request details (request type, originating record, user name, office, email, need description, desired next step, reference number).
- On successful email send: set `email_routing_initiated = true` on the engagement request record.
- On email send failure: set `email_routing_initiated = false`; flag in curator admin view for manual follow-up; do not show an error to the user (the request is still recorded).

**If `mailto:` client-side routing is used (MVP fallback):**
- System first saves the engagement request to the database (persistence before email trigger).
- System opens the user's mail client via `mailto:` with pre-filled: `to=routing_address`, `subject=subject_pattern`, `body=formatted_context`.
- After the mailto link is activated, show a confirmation: "Your request has been recorded. If your email client opened, please send the pre-filled email to complete your request."
- `email_routing_initiated` is set based on whether the mailto link was triggered (best-effort for MVP).

**Routing Address Configuration (F8.4, F9.15):**
- The routing address is stored in the Hub settings table (F9.15), not in application code.
- Default value: `AOml_TSO_IRB_Team@ao.uscourts.gov`.
- Only Admin-role users may change the routing address via the Settings Management interface (F9.15).
- Every routing address change must generate an audit event (SEC-03).
- The `routing_address_at_submission` field on each engagement request captures what address was active at the moment of submission — for audit purposes even if the address later changes.

---

### CTA Configuration Rules (F8.1)

- Each Innovation Record has 0–6 enabled next actions configured by a Curator (see F03b §Group 9).
- A record with no configured next actions must still show a default "Contact I&R" CTA.
- General CTAs (not tied to a specific record) are available from the Hub navigation and dedicated engagement pages.
- CTAs must be accessible by keyboard and meet WCAG 2.1 AA requirements.
- The display text for the configured routing destination must say "TSIO Innovation & Research" (or the approved equivalent display name) — not the raw email address — in public-facing text. The email address itself may be shown in the `mailto:` link href.

---

### Outputs

- Persisted `engagement_requests` record.
- Email notification sent or initiated to the configured routing address.
- User confirmation page with reference number.
- Entry in Engagement Activity queue (F9.14).

---

### Validation

- `requester_email`: valid RFC 5321 email format.
- `consent_to_contact`: must be true.
- `need_description`: minimum 20 characters; maximum 3,000.
- `request_type`: must be one of canonical values.
- `originating_record_id`: if provided, must reference an existing, published record; unknown IDs return 404.
- Rate limiting: maximum 10 engagement requests per IP per hour; returns 429 on excess (SEC-06).
- All text fields: sanitize for XSS.

---

### Error States

| Scenario | HTTP Status | Error Code | User-Facing Message | Notes |
|---|---|---|---|---|
| Required field missing | 422 | `VALIDATION_ERROR` | "[Field name] is required." | Per-field |
| Invalid email format | 422 | `INVALID_EMAIL` | "Please enter a valid email address." | |
| Rate limit exceeded | 429 | `RATE_LIMITED` | "Too many requests. Please try again later." | SEC-06 |
| Consent not given | 422 | `CONSENT_REQUIRED` | "You must consent to contact to submit this request." | |
| Server email send failure | 500 (internal) | `EMAIL_ROUTING_FAILED` | Not shown to user — request still recorded; curator admin flag | Must not result in lost engagement record |
| Referenced record not found | 404 | `RECORD_NOT_FOUND` | "The innovation record referenced by this request could not be found." | API error; UI prevents this with pre-validated CTA links |
| No routing address configured | 503 | `ROUTING_NOT_CONFIGURED` | "Engagement routing is not currently configured. Please contact I&R directly." | Fallback when address not set; SEC-07 |

---

### API Surface (this feature)

See `Y1a-api-public.md` §Engagement and `Y1b-api-curator.md` §Engagement.

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/engagement` | None (rate-limited) | Submit engagement request |
| GET | `/api/v1/curator/engagement` | Curator | List engagement requests |
| GET | `/api/v1/curator/engagement/:id` | Curator | View single engagement request |
| PATCH | `/api/v1/curator/engagement/:id/status` | Curator | Update follow-up status |
| GET | `/api/v1/curator/settings/routing` | Admin | View current routing configuration |
| PUT | `/api/v1/curator/settings/routing` | Admin | Update routing address |

---

### Schema Surface (this feature)

Uses table `engagement_requests`. See `Y0b-schema-submissions.md §engagement_requests`.
Uses table `hub_settings` (for routing address). See `Y0b-schema-submissions.md §hub_settings`.
