---

## Y2: Cross-Feature Error Catalog

**Scope:** Consolidated catalog of all error codes, HTTP statuses, messages, and retry/recovery guidance across all MVP features. Feature-specific error tables in each F-series chunk reference this catalog. Errors are grouped by origin.

---

### Error Code Convention

All error codes are SCREAMING_SNAKE_CASE strings returned in the `error_code` field of the standard error response envelope. Error messages shown here are the canonical human-readable strings; frontends may supplement with additional contextual guidance.

---

### §Public API Errors (Anonymous Users)

#### Search and Catalog (F1, F2)

| HTTP Status | Error Code | User-Facing Message | Retry? | Notes |
|---|---|---|---|---|
| 400 | `QUERY_TOO_LONG` | "Your search query is too long. Please shorten it." | No | Query > 500 chars |
| 400 | `INVALID_FILTER` | "One or more filter values were not recognized." | No | Unknown filter value (API consumers) |
| 404 | `NOT_FOUND` | "The requested page could not be found." | No | Generic 404 for UI pages |
| 503 | `CATALOG_UNAVAILABLE` | "The catalog is temporarily unavailable. Please try again." | Yes (after delay) | Database unavailable |
| 503 | `SEARCH_UNAVAILABLE` | "Search is temporarily unavailable. You can browse the catalog instead." | Yes (after delay) | Search service down |

#### Innovation Record (F3)

| HTTP Status | Error Code | User-Facing Message | Retry? | Notes |
|---|---|---|---|---|
| 404 | `RECORD_NOT_FOUND` | "This record could not be found or may not be available." | No | Non-existent, non-published, or draft record accessed by anonymous user |

#### Engagement Requests (F8)

| HTTP Status | Error Code | User-Facing Message | Retry? | Notes |
|---|---|---|---|---|
| 422 | `VALIDATION_ERROR` | "[Field name] is required." / "[Field name] is not valid." | No — fix input | Per-field validation |
| 422 | `INVALID_EMAIL` | "Please enter a valid email address." | No — fix input | Invalid email format |
| 422 | `CONSENT_REQUIRED` | "You must consent to contact to submit this request." | No — fix input | Consent checkbox not checked |
| 429 | `RATE_LIMITED` | "Too many requests. Please try again later." | Yes (after 1 hour) | SEC-06 rate limit hit |
| 503 | `ROUTING_NOT_CONFIGURED` | "Engagement routing is not currently configured. Please contact I&R directly." | No — admin action required | No routing address in settings |
| 500 | `SUBMISSION_FAILED` | "We were unable to save your request. Please try again." | Yes (immediate retry) | Server error; engagement request must not be lost |

#### Opportunity Submissions (F6)

| HTTP Status | Error Code | User-Facing Message | Retry? | Notes |
|---|---|---|---|---|
| 422 | `VALIDATION_ERROR` | "[Field name] is required." | No | Per-field |
| 422 | `INVALID_EMAIL` | "Please enter a valid email address." | No | |
| 422 | `CONSENT_REQUIRED` | "You must acknowledge the non-acceptance statement to submit." | No | |
| 429 | `RATE_LIMITED` | "Too many submissions. Please try again later." | Yes (after 1 hour) | |
| 500 | `SUBMISSION_FAILED` | "We were unable to save your submission. Please try again." | Yes | Must not silently drop |

#### Contribution Submissions (F7)

| HTTP Status | Error Code | User-Facing Message | Retry? | Notes |
|---|---|---|---|---|
| 422 | `VALIDATION_ERROR` | "[Field name] is required." | No | |
| 422 | `INVALID_EMAIL` | "Please enter a valid email address." | No | |
| 422 | `CONSENT_REQUIRED` | "You must acknowledge the non-endorsement statement to submit." | No | |
| 429 | `RATE_LIMITED` | "Too many submissions. Please try again later." | Yes | |
| 500 | `SUBMISSION_FAILED` | "We were unable to save your contribution. Please try again." | Yes | |

---

### §Curator API Errors (Authenticated Users)

#### Authentication and Authorization

| HTTP Status | Error Code | Curator-Facing Message | Retry? | Notes |
|---|---|---|---|---|
| 401 | `UNAUTHORIZED` | "You must be logged in to access this area." | Yes (after login) | Not authenticated or token expired |
| 403 | `FORBIDDEN` | "You do not have permission to perform this action." | No | Authenticated but wrong role |

#### Record Lifecycle

| HTTP Status | Error Code | Curator-Facing Message | Retry? | Notes |
|---|---|---|---|---|
| 404 | `RECORD_NOT_FOUND` | "The record could not be found." | No | Record ID not found |
| 409 | `VERSION_CONFLICT` | "This record was updated by another user. Reload and reapply your changes." | Yes (after reload) | Optimistic concurrency |
| 409 | `CANNOT_DELETE_PUBLISHED` | "Only draft records can be deleted. Use Archive or Retire for published records." | No | Attempted delete on non-draft |
| 422 | `PUBLICATION_GATE_FAILED` | "Cannot publish. Required fields are missing: [list]" | No — fill missing fields | Full gate check failed; `fields` object lists missing fields |
| 422 | `SUPERSESSION_REASON_REQUIRED` | "A reason is required when superseding a record." | No | Missing `supersessionReason` |
| 422 | `RETIREMENT_REASON_REQUIRED` | "A retirement reason is required." | No | Missing `retirementReason` |
| 422 | `REACTIVATION_NOTE_REQUIRED` | "A note is required when re-activating a record." | No | Missing `notes` on re-activate |
| 422 | `ATTRIBUTION_REMOVAL_WARNING` | "Removing the original contributing office or contributors requires confirmation for contributed records." | No — curator must confirm | Soft-block warning for attribution preservation |

#### Record Field Validation

| HTTP Status | Error Code | Curator-Facing Message | Retry? | Notes |
|---|---|---|---|---|
| 400 | `INVALID_MATURITY` | "The maturity value provided is not recognized." | No | Not in canonical vocabulary |
| 400 | `INVALID_REVIEW_STATUS` | "One or more review status values are not recognized." | No | Not in canonical vocabulary |
| 422 | `INVALID_URL` | "Artifact URL must be a valid URL." | No | |
| 422 | `VALIDATION_ERROR` | "[Field] [message]" | No — fix input | Generic field-level validation |

#### Artifact Management

| HTTP Status | Error Code | Curator-Facing Message | Retry? | Notes |
|---|---|---|---|---|
| 404 | `ARTIFACT_NOT_FOUND` | "The artifact could not be found." | No | |
| 422 | `INVALID_URL` | "Artifact URL must be a valid HTTPS URL." | No | |

#### Submission Queue Errors

| HTTP Status | Error Code | Curator-Facing Message | Retry? | Notes |
|---|---|---|---|---|
| 404 | `SUBMISSION_NOT_FOUND` | "Submission not found." | No | |
| 409 | `RECORD_ALREADY_CREATED` | "A record has already been created from this contribution." | No | Attempt to create record twice from same contribution |

#### Settings Errors

| HTTP Status | Error Code | Curator-Facing Message | Retry? | Notes |
|---|---|---|---|---|
| 404 | `SETTING_NOT_FOUND` | "The setting key was not found." | No | |
| 422 | `INVALID_EMAIL` | "The routing address must be a valid email address." | No | |
| 422 | `VALIDATION_ERROR` | "The value is not valid for this setting." | No | General setting validation |

---

### §Server and Infrastructure Errors

| HTTP Status | Error Code | Message | Retry? | Notes |
|---|---|---|---|---|
| 500 | `INTERNAL_ERROR` | "An unexpected error occurred. Please try again. If the problem persists, contact the system administrator." | Yes | Unhandled server exception |
| 503 | `SERVICE_UNAVAILABLE` | "The service is temporarily unavailable. Please try again shortly." | Yes | Database or external dependency down |
| 504 | `GATEWAY_TIMEOUT` | "The request timed out. Please try again." | Yes | Request exceeded timeout |

---

### §Security-Failure Defaults (SEC-07)

When a required security control is unavailable, the system must default to the protected state:

| Scenario | Default Behavior | Error Code |
|---|---|---|
| Authentication service unavailable | Return 503; deny all protected route access | `SERVICE_UNAVAILABLE` |
| Rate-limiting service unavailable | Deny all form submissions (conservative) | `SERVICE_UNAVAILABLE` |
| No routing address configured | Deny engagement requests; show `ROUTING_NOT_CONFIGURED` | `ROUTING_NOT_CONFIGURED` |
| Session/token validation fails | Treat as unauthenticated; return 401 | `UNAUTHORIZED` |
| Required security header cannot be set | Log server error; do not serve response without headers in operational environments | N/A — operational safeguard |

---

### §Email Routing Failure Handling

When server-side email routing fails (F8):

| Failure Scenario | System Behavior | User Impact | Curator Alert |
|---|---|---|---|
| Email send fails (server error) | Engagement request already persisted to DB; `email_routing_initiated = false` | No error shown to user (request confirmed as received) | Flagged in curator engagement queue; curator must manually follow up |
| No routing address configured | 503 returned to user before form submission completes | Error shown: routing not configured | Curator/admin must configure routing address in settings |
| Email server returns bounce | Not detectable at MVP send-time | None | Out of scope for MVP — curator monitors inbox |

---

### §Validation Error Response Format

All 422 `VALIDATION_ERROR` responses include a `fields` object mapping field names to error messages:

```json
{
  "status": "error",
  "error_code": "VALIDATION_ERROR",
  "message": "One or more fields are invalid.",
  "fields": {
    "submitterEmail": "Please enter a valid email address.",
    "problemDescription": "Problem Description must be at least 50 characters.",
    "consentToContact": "You must consent to contact to submit this request."
  }
}
```

Field names in the `fields` object use camelCase matching the request body field names.
