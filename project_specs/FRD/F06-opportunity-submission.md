---

## F06: Opportunity Submission

**PRD Reference:** F6 (F6.1–F6.5) | **Priority:** P1 — High

**Description:** Opportunity Submission provides a structured flow for Judiciary stakeholders to bring mission problems, emerging questions, or workflow friction to I&R's attention — starting with the problem, not a requested solution. The flow captures the context I&R needs to assess relevance, research value, feasibility, and capacity. Submission does not imply acceptance into the I&R portfolio. The resulting record enters a curator-managed queue (F9.12) for review and disposition.

---

### Terminology

- **Opportunity Submission** — A structured record describing a mission problem, research question, emerging technology need, or collaboration opportunity submitted to I&R for consideration.
- **Submitter** — The Judiciary stakeholder (anonymous or self-identified) submitting the opportunity. May be any authorized user; no Curator role required.
- **Non-Acceptance Statement** — The required explicit disclosure that submission does not imply I&R acceptance into the portfolio.
- **Request Type** — The submitter's characterization of what kind of opportunity they are bringing (e.g., current mission problem, request for research, request for demo).
- **Disposition** — The I&R curator's recorded response to a submission (accepted, declined, needs more information, etc.).

---

### Sub-features

- **F6.1** — Problem-first submission flow (not solution/application request flow)
- **F6.2** — Capture full context: who is affected, current workflow, impact, desired outcome, constraints, related work, office, contacts
- **F6.3** — Request type characterization by submitter
- **F6.4** — Non-acceptance statement explicitly visible before and after submission
- **F6.5** — Submission recorded for I&R review and disposition queue (F9.12)

---

### Process

1. User navigates to the Opportunity Submission form (public-facing page).
2. **Non-acceptance statement is displayed prominently at the top of the form** — must be visible before the user begins filling in fields: *"Submitting an opportunity does not imply acceptance into the I&R portfolio. I&R will review submissions and reach out if the opportunity aligns with our current capacity and priorities."*
3. User selects a **Request Type** (F6.3) — framing their submission before describing the problem.
4. User completes the **Problem Description** (F6.1) — explains the mission problem or workflow friction, not a proposed application.
5. User completes **Context Fields** (F6.2) — captures who is affected, current workflow, impact, desired outcome, constraints, and related work.
6. User provides **Contact and Attribution** — office name, contact name, contact email, and availability for discovery sessions.
7. User reviews non-acceptance statement a second time (confirmation screen or inline before submit).
8. User submits the form.
9. System applies SEC-06 abuse protection (rate limiting / CAPTCHA or approved equivalent).
10. System validates all required fields.
11. System persists the submission to `opportunity_submissions` table with `status = pending`.
12. System displays a success confirmation page with:
    - Confirmation that the submission was received.
    - Re-statement of non-acceptance: *"Your submission has been received. Submission does not imply acceptance into the I&R portfolio. You will be contacted if I&R determines the opportunity aligns with current priorities."*
    - Reference number (submission ID) for follow-up.
13. Submission appears in I&R curator queue (F9.12) for review and disposition.

---

### Inputs — Opportunity Submission Fields

| Field | Type | Required | Constraints | Notes |
|---|---|---|---|---|
| `request_type` | enum | Yes | One of canonical Request Type values (see below) | Framing characterization |
| `problem_title` | string | Yes | Max 200 chars; min 5 chars | Short title for the submission |
| `problem_description` | text | Yes | Max 5,000 chars; min 50 chars | Narrative of the mission problem or workflow friction; must not be a solution request |
| `affected_users` | text | Yes | Max 1,000 chars; min 10 chars | Who is affected and how (roles, courts, offices) |
| `current_workflow` | text | No | Max 2,000 chars | How the work is done today; current pain points |
| `impact` | text | Yes | Max 1,000 chars; min 10 chars | What impact the problem has — operational, financial, user experience, compliance, etc. |
| `desired_outcome` | text | No | Max 1,000 chars | What a successful resolution would look like |
| `known_constraints` | text | No | Max 1,000 chars | Known technical, organizational, budgetary, or policy constraints |
| `related_work_attempted` | text | No | Max 1,000 chars | Prior attempts to address this problem; related efforts underway |
| `submitting_office` | string | Yes | Max 200 chars; min 2 chars | Name of the submitting court, AO office, or organizational unit |
| `submitter_name` | string | Yes | Max 200 chars; min 2 chars | Name of the submitter |
| `submitter_email` | string | Yes | Valid email format; max 254 chars | Contact email; handled per SEC-05 |
| `discovery_participants` | text | No | Max 500 chars | Names/roles of people available for I&R discovery conversations |
| `additional_context` | text | No | Max 2,000 chars | Any other information the submitter wants I&R to know |
| `consent_to_contact` | boolean | Yes | Must be true to submit | Submitter acknowledges that I&R may contact them about this submission |
| `non_acceptance_acknowledged` | boolean | Yes | Must be true to submit | Submitter acknowledges the non-acceptance statement |
| `submission_date` | timestamp | Yes (auto) | UTC; set by server | System-generated |
| `submission_ip` | string | No | Server-captured; not shown to submitter | Used for SEC-06 rate limiting |

---

### Request Type — Canonical Values (F6.3)

| Value | Display Label | Description |
|---|---|---|
| `current_mission_problem` | Current Mission Problem | An active operational or mission problem I&R should consider exploring |
| `emerging_tech_question` | Emerging Technology Question | A question about whether a specific technology could address a mission area |
| `request_for_research` | Request for Research | A request for I&R to research or evaluate a topic |
| `potential_poc` | Potential POC | A problem the submitter believes warrants a proof-of-concept effort |
| `request_for_demo` | Request for Demonstration | A request to see existing I&R work demonstrated |
| `collaboration_opportunity` | Collaboration Opportunity | A proposal to collaborate on innovation work |
| `share_existing_work` | Share Existing Innovation Work | If the submitter has existing work to share, they should use the contribution flow (F7); selecting this value redirects to F7 with an explanation |
| `other` | Other | Does not fit above categories; requires description |

**Note on `share_existing_work` request type:** When selected, the system must display an in-line message explaining the distinction and provide a direct link to the F7 Contribution Submission form: *"If you have existing innovation work to share — not a problem for I&R to investigate — please use our Innovation Contribution form instead. [Link to F7]"* The submitter may continue with the opportunity form if they choose.

---

### Outputs

- Persisted `opportunity_submissions` record with `status = pending`.
- Success confirmation page with submission reference number and non-acceptance re-statement.
- Entry in I&R curator queue (F9.12).
- No automated email to submitter for MVP. (Email routing is for curator-reviewed engagement requests per F8; opportunity submissions enter the curator queue.)

---

### Validation

- All required fields must be non-empty before submission is accepted.
- `submitter_email`: must be valid RFC 5321 email format.
- `problem_description`: must be ≥ 50 characters. If it appears to be a solution request (heuristic: starts with "Build me" / "Create an app" — informational hint only, not a hard block): display inline guidance: *"We focus on mission problems first. Describe the problem you're facing, and I&R will explore whether a solution approach is appropriate."*
- `consent_to_contact` and `non_acceptance_acknowledged`: both must be `true`; unchecked checkbox blocks submission with validation message.
- Rate limiting (SEC-06): maximum 5 submissions per IP address per hour. Exceeding limit returns 429 with message: *"Too many submissions. Please try again later."*
- All text fields: sanitize for XSS before storage.
- `request_type`: must be one of the canonical values; unknown value returns 400.

---

### Error States

| Scenario | HTTP Status | Error Code | User-Facing Message | Notes |
|---|---|---|---|---|
| Required field missing | 422 | `VALIDATION_ERROR` | "[Field name] is required." | Per-field validation messages |
| Invalid email format | 422 | `INVALID_EMAIL` | "Please enter a valid email address." | |
| Rate limit exceeded | 429 | `RATE_LIMITED` | "Too many submissions. Please try again later." | SEC-06 |
| Non-acceptance not acknowledged | 422 | `CONSENT_REQUIRED` | "You must acknowledge the non-acceptance statement to submit." | |
| Server error during save | 500 | `SUBMISSION_FAILED` | "We were unable to save your submission. Please try again. If the problem persists, contact I&R directly at [engagement address]." | Must not silently lose the submission |
| `share_existing_work` request type selected | 200 (inline) | — | Redirect guidance to F7 form | Not an error; informational routing |

---

### API Surface (this feature)

See `Y1a-api-public.md` §Submissions and `Y1b-api-curator.md` §Submission Queue.

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/submissions/opportunity` | None (rate-limited) | Create new opportunity submission |
| GET | `/api/v1/curator/submissions/opportunity` | Curator | List opportunity submissions queue |
| GET | `/api/v1/curator/submissions/opportunity/:id` | Curator | View single opportunity submission |
| PATCH | `/api/v1/curator/submissions/opportunity/:id/disposition` | Curator | Record disposition for a submission |

---

### Schema Surface (this feature)

Uses table `opportunity_submissions`. See `Y0b-schema-submissions.md §opportunity_submissions`.
