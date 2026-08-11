---

## Y0b: Database Schema — Submissions, Engagement, Audit, Settings

**Scope:** Logical schema for: `opportunity_submissions`, `innovation_contributions`, `engagement_requests`, `audit_events`, and `hub_settings`. Physical implementation details belong in the Technical Architecture specification.

---

### Table: `opportunity_submissions`

One row per F6 Opportunity Submission received.

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

  -- Disposition fields
  status                      VARCHAR(32) NOT NULL DEFAULT 'pending'
                                CHECK (status IN (
                                  'pending', 'accepted', 'declined',
                                  'needs_more_information', 'duplicate'
                                )),
  dispositioned_at            TIMESTAMPTZ,
  dispositioned_by            UUID,                       -- FK to users (curator who dispositioned)
  curator_notes               TEXT,                       -- internal only; not shown to submitter

  CONSTRAINT chk_opportunity_consents
    CHECK (consent_to_contact = true AND non_acceptance_acknowledged = true)
);

CREATE INDEX idx_opp_status ON opportunity_submissions(status);
CREATE INDEX idx_opp_submission_date ON opportunity_submissions(submission_date DESC);
CREATE INDEX idx_opp_submitting_office ON opportunity_submissions(submitting_office);
```

---

### Table: `innovation_contributions`

One row per F7 Innovation Contribution received.

```sql
CREATE TABLE innovation_contributions (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contribution_title          VARCHAR(200) NOT NULL,
  problem_addressed           TEXT NOT NULL,
  work_description            TEXT NOT NULL,
  contributing_office         VARCHAR(200) NOT NULL,
  contributor_names           TEXT NOT NULL,
  current_maturity            VARCHAR(32) NOT NULL
                                CHECK (current_maturity IN (
                                  'idea', 'evaluated_idea', 'experiment_poc',
                                  'prototype_pilot', 'production_validated',
                                  'archived_retired'
                                )),
  current_owner               VARCHAR(200) NOT NULL,
  owner_contact_email         VARCHAR(254) NOT NULL,
  artifact_links              TEXT,
  known_limitations           TEXT,
  collaboration_preference    VARCHAR(32) NOT NULL
                                CHECK (collaboration_preference IN (
                                  'open_for_reuse', 'seeking_collaborator',
                                  'informational_only', 'seeking_adopter', 'discuss_with_ir'
                                )),
  additional_context          TEXT,
  submitter_name              VARCHAR(200) NOT NULL,
  submitter_email             VARCHAR(254) NOT NULL,
  non_endorsement_acknowledged BOOLEAN NOT NULL,
  consent_to_contact          BOOLEAN NOT NULL,
  submission_date             TIMESTAMPTZ NOT NULL DEFAULT now(),
  submission_ip               INET,

  -- Disposition fields
  status                      VARCHAR(32) NOT NULL DEFAULT 'pending'
                                CHECK (status IN (
                                  'pending', 'accepted_for_curation', 'declined',
                                  'needs_more_information', 'duplicate', 'curated'
                                )),
  dispositioned_at            TIMESTAMPTZ,
  dispositioned_by            UUID,
  curator_notes               TEXT,

  -- Link to created record (set when a record is created from this contribution)
  created_record_id           UUID REFERENCES innovation_records(id),

  CONSTRAINT chk_contribution_consents
    CHECK (non_endorsement_acknowledged = true AND consent_to_contact = true)
);

CREATE INDEX idx_contrib_status ON innovation_contributions(status);
CREATE INDEX idx_contrib_submission_date ON innovation_contributions(submission_date DESC);
CREATE INDEX idx_contrib_office ON innovation_contributions(contributing_office);
CREATE INDEX idx_contrib_created_record ON innovation_contributions(created_record_id)
  WHERE created_record_id IS NOT NULL;
```

---

### Table: `engagement_requests`

One row per F8 Engagement Request submitted.

```sql
CREATE TABLE engagement_requests (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_type                VARCHAR(32) NOT NULL
                                CHECK (request_type IN (
                                  'request_demo', 'discuss_use_case', 'explore_adoption',
                                  'request_technical_guidance', 'share_related_work', 'contact_ir'
                                )),
  originating_record_id       UUID REFERENCES innovation_records(id),  -- null for general CTAs
  originating_record_title    VARCHAR(200),                             -- snapshot at submission time
  requester_name              VARCHAR(200) NOT NULL,
  requester_office            VARCHAR(200) NOT NULL,
  requester_email             VARCHAR(254) NOT NULL,
  need_description            TEXT NOT NULL,
  desired_next_step           TEXT,
  preferred_contact_method    VARCHAR(16) DEFAULT 'email'
                                CHECK (preferred_contact_method IN ('email', 'phone', 'no_preference')),
  consent_to_contact          BOOLEAN NOT NULL,
  submitted_at                TIMESTAMPTZ NOT NULL DEFAULT now(),
  submission_ip               INET,
  routing_address_at_submission VARCHAR(254) NOT NULL,   -- snapshot of routing address at submission time
  email_routing_initiated     BOOLEAN NOT NULL DEFAULT false,

  -- Follow-up tracking
  follow_up_status            VARCHAR(32) NOT NULL DEFAULT 'received'
                                CHECK (follow_up_status IN (
                                  'received', 'in_progress', 'completed', 'no_action_required'
                                )),
  follow_up_updated_at        TIMESTAMPTZ,
  follow_up_updated_by        UUID,
  curator_notes               TEXT,

  CONSTRAINT chk_engagement_consent
    CHECK (consent_to_contact = true)
);

CREATE INDEX idx_eng_follow_up_status ON engagement_requests(follow_up_status);
CREATE INDEX idx_eng_submitted_at ON engagement_requests(submitted_at DESC);
CREATE INDEX idx_eng_originating_record ON engagement_requests(originating_record_id)
  WHERE originating_record_id IS NOT NULL;
CREATE INDEX idx_eng_request_type ON engagement_requests(request_type);
```

---

### Table: `audit_events`

Immutable log of all material changes. Rows must never be deleted or updated.

```sql
CREATE TABLE audit_events (
  audit_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type        VARCHAR(64) NOT NULL
                      CHECK (event_type IN (
                        'record_created', 'record_updated', 'maturity_changed',
                        'review_status_changed', 'publication_state_changed',
                        'attribution_updated', 'artifact_added', 'artifact_updated',
                        'artifact_removed', 'submission_dispositioned',
                        'record_created_from_contribution', 'engagement_status_updated',
                        'settings_changed', 'user_role_changed'
                      )),
  actor_id          UUID NOT NULL,             -- FK to users
  actor_name        VARCHAR(200) NOT NULL,     -- snapshot
  target_type       VARCHAR(32) NOT NULL
                      CHECK (target_type IN (
                        'innovation_record', 'artifact', 'opportunity_submission',
                        'innovation_contribution', 'engagement_request',
                        'hub_settings', 'user_role'
                      )),
  target_id         UUID NOT NULL,
  target_title      VARCHAR(200),              -- snapshot of name/title at event time
  event_data        JSONB NOT NULL DEFAULT '{}', -- changed fields with before/after values
  occurred_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  notes             TEXT,
  ip_address        INET                       -- server-captured; restricted view

  -- No update or delete allowed on this table
  -- Enforce via DB role permissions: revoke UPDATE, DELETE from app role
);

CREATE INDEX idx_audit_target ON audit_events(target_type, target_id);
CREATE INDEX idx_audit_occurred_at ON audit_events(occurred_at DESC);
CREATE INDEX idx_audit_actor ON audit_events(actor_id);
CREATE INDEX idx_audit_event_type ON audit_events(event_type);
```

**Business rules:**
- Application DB role must have INSERT-only on `audit_events`. UPDATE and DELETE must be revoked.
- No application code path may update or delete audit events.
- `event_data` JSONB structure per event type (abbreviated examples):

```jsonb
-- record_updated
{
  "changed_fields": {
    "summary": { "before": "old text", "after": "new text" },
    "tags": { "before": ["a"], "after": ["a", "b"] }
  }
}

-- maturity_changed
{
  "before": "experiment_poc",
  "after": "prototype_pilot",
  "reason": "Completed limited pilot with three courts"
}

-- review_status_changed
{
  "before": ["submitted", "technically_reviewed"],
  "after": ["submitted", "technically_reviewed", "security_reviewed"]
}

-- publication_state_changed
{
  "before": "draft",
  "after": "published",
  "gate_check_passed": true
}

-- settings_changed
{
  "setting_key": "engagement_routing_address",
  "before": "old@example.gov",
  "after": "new@example.gov"
}
```

---

### Table: `hub_settings`

Key-value store for configurable Hub settings managed through F9.15.

```sql
CREATE TABLE hub_settings (
  setting_key       VARCHAR(100) PRIMARY KEY,
  setting_value     TEXT NOT NULL,
  setting_type      VARCHAR(16) NOT NULL
                      CHECK (setting_type IN ('string', 'integer', 'boolean', 'json')),
  description       TEXT,
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by        UUID                               -- FK to users (admin who changed it)
);

-- Seed data (initial values)
INSERT INTO hub_settings (setting_key, setting_value, setting_type, description) VALUES
  ('engagement_routing_address',  'AOml_TSO_IRB_Team@ao.uscourts.gov', 'string',  'Email address for engagement routing'),
  ('engagement_routing_display_name', 'TSIO Innovation & Research',    'string',  'Display name for routing destination'),
  ('submission_rate_limit_per_hour',  '5',                              'integer', 'Max submissions (F6/F7) per IP per hour'),
  ('engagement_rate_limit_per_hour',  '10',                             'integer', 'Max engagement requests (F8) per IP per hour'),
  ('hub_display_name',            'TSIO Innovation Hub',                'string',  'Hub display name in headings'),
  ('default_applicable_disclaimer', '',                                 'string',  'Default disclaimer template for curators'),
  ('taxonomy_mission_areas',      '[]',                                 'json',    'Ordered mission area taxonomy values'),
  ('taxonomy_technology_areas',   '[]',                                 'json',    'Ordered technology area taxonomy values'),
  ('taxonomy_problem_types',      '[]',                                 'json',    'Ordered problem type taxonomy values');
```

---

### TypeScript Interfaces — Submissions, Engagement, Audit

```typescript
type OpportunityStatus = 'pending' | 'accepted' | 'declined' | 'needs_more_information' | 'duplicate';
type ContributionStatus = 'pending' | 'accepted_for_curation' | 'declined' | 'needs_more_information' | 'duplicate' | 'curated';
type EngagementFollowUpStatus = 'received' | 'in_progress' | 'completed' | 'no_action_required';

type OpportunityRequestType =
  | 'current_mission_problem' | 'emerging_tech_question' | 'request_for_research'
  | 'potential_poc' | 'request_for_demo' | 'collaboration_opportunity'
  | 'share_existing_work' | 'other';

type EngagementRequestType =
  | 'request_demo' | 'discuss_use_case' | 'explore_adoption'
  | 'request_technical_guidance' | 'share_related_work' | 'contact_ir';

type CollaborationPreference =
  | 'open_for_reuse' | 'seeking_collaborator' | 'informational_only'
  | 'seeking_adopter' | 'discuss_with_ir';

type AuditEventType =
  | 'record_created' | 'record_updated' | 'maturity_changed'
  | 'review_status_changed' | 'publication_state_changed'
  | 'attribution_updated' | 'artifact_added' | 'artifact_updated'
  | 'artifact_removed' | 'submission_dispositioned'
  | 'record_created_from_contribution' | 'engagement_status_updated'
  | 'settings_changed' | 'user_role_changed';

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
  submitterEmail: string;
  discoveryParticipants?: string;
  additionalContext?: string;
  submissionDate: string;
  status: OpportunityStatus;
  dispositionedAt?: string;
  dispositionedBy?: string;
  curatorNotes?: string;
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
  requesterEmail: string;
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
