---

## Y0a: Database Schema — Core Entities

**Scope:** Logical schema for the primary domain entities: `innovation_records`, `artifacts`, and `record_next_actions`. Physical implementation details (indexes, partitioning, specific database engine constraints) belong in the Technical Architecture specification. Foreign key notation uses `REFERENCES table(column)`.

---

### Table: `innovation_records`

Central entity. One row per innovation effort represented in the Hub.

```sql
CREATE TABLE innovation_records (
  -- Identity and system fields (Group 0)
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                        VARCHAR(128) NOT NULL UNIQUE,
  publication_state           VARCHAR(32) NOT NULL DEFAULT 'draft'
                                CHECK (publication_state IN (
                                  'draft', 'submitted_for_review', 'published',
                                  'superseded', 'archived', 'retired'
                                )),
  created_at                  TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by                  UUID NOT NULL,              -- FK to users table (identity system TBD)
  updated_at                  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by                  UUID NOT NULL,
  published_at                TIMESTAMPTZ,               -- null until first publication
  version                     INTEGER NOT NULL DEFAULT 1, -- optimistic concurrency

  -- F3.1: Problem and Context
  title                       VARCHAR(200) NOT NULL DEFAULT '',
  summary                     VARCHAR(500) NOT NULL DEFAULT '',
  problem_statement           TEXT NOT NULL DEFAULT '',
  affected_users              TEXT,
  current_workflow            TEXT,
  why_experimentation         TEXT,
  mission_areas               TEXT[] NOT NULL DEFAULT '{}',  -- controlled vocabulary array
  problem_type_tags           TEXT[] NOT NULL DEFAULT '{}',  -- controlled vocabulary array

  -- F3.2: What Was Explored
  hypothesis_or_objective     TEXT NOT NULL DEFAULT '',
  scope_description           TEXT,
  technology_areas            TEXT[] NOT NULL DEFAULT '{}',  -- controlled vocabulary array
  technologies_used           TEXT,
  methods_used                TEXT,
  tags                        TEXT[] NOT NULL DEFAULT '{}',  -- free-form keyword array

  -- F3.3: Outcome and Evidence
  outcome_summary             TEXT NOT NULL DEFAULT '',
  what_worked                 TEXT,
  what_did_not_work           TEXT,
  uncertainty_reduced         TEXT,
  decision_enabled            TEXT,
  evidence_summary            TEXT,
  source_basis                VARCHAR(500) NOT NULL DEFAULT '',

  -- F3.4: Key Findings
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

  -- F3.5: Maturity and Readiness
  maturity                    VARCHAR(32)
                                CHECK (maturity IN (
                                  'idea', 'evaluated_idea', 'experiment_poc',
                                  'prototype_pilot', 'production_validated',
                                  'archived_retired'
                                )),
  review_statuses             TEXT[] NOT NULL DEFAULT '{}',  -- multi-value; controlled vocab array
  ready_for                   TEXT,
  not_ready_for               TEXT,
  next_stage_requirements     TEXT,
  last_reviewed_date          DATE,
  next_review_date            DATE,
  maturity_change_reason      VARCHAR(500),

  -- F3.6: Reuse Guidance
  reuse_potential             VARCHAR(16)
                                CHECK (reuse_potential IN (
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
                                  'technical_playbook_available', 'reference_pattern_available',
                                  'monitoring_only', 'archived', 'none'
                                )),

  -- F3.7: Ownership and Attribution
  opportunity_source          VARCHAR(500),
  contributing_offices        TEXT[] NOT NULL DEFAULT '{}',
  contributor_names           TEXT[] NOT NULL DEFAULT '{}',
  ir_contribution             TEXT,
  owner_steward               VARCHAR(200) NOT NULL DEFAULT '',
  owner_contact               VARCHAR(254),
  operational_owner           VARCHAR(200),
  production_owner            VARCHAR(200),
  attribution_statement       TEXT NOT NULL DEFAULT '',
  source_contribution_id      UUID REFERENCES innovation_contributions(id),  -- set if created from contribution

  -- F3.8b: Governance and Trust
  applicable_disclaimer       TEXT NOT NULL DEFAULT '',
  superseded_by_record_id     UUID REFERENCES innovation_records(id),        -- set when superseded
  supersession_reason         TEXT,
  retirement_reason           TEXT,

  -- F3.9: Next Action prose
  next_action_description     TEXT,

  CONSTRAINT chk_supersede_requires_reason
    CHECK (
      (publication_state <> 'superseded') OR
      (supersession_reason IS NOT NULL AND supersession_reason <> '')
    ),
  CONSTRAINT chk_retire_requires_reason
    CHECK (
      (publication_state NOT IN ('retired')) OR
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

CREATE INDEX idx_ir_publication_state ON innovation_records(publication_state);
CREATE INDEX idx_ir_maturity ON innovation_records(maturity);
CREATE INDEX idx_ir_last_reviewed ON innovation_records(last_reviewed_date);
CREATE INDEX idx_ir_updated_at ON innovation_records(updated_at DESC);
CREATE INDEX idx_ir_slug ON innovation_records(slug);
CREATE INDEX idx_ir_source_contribution ON innovation_records(source_contribution_id)
  WHERE source_contribution_id IS NOT NULL;
```

**Full-text search index (application-level or DB-native):**

The following fields must be included in the search index (see F02 §Search Index for weights):
`title`, `summary`, `problem_statement`, `hypothesis_or_objective`, `outcome_summary`, `key_findings_*` (all findings fields), `tags`, `mission_areas`, `technology_areas`, `reuse_guidance fields`, `production_readiness_gaps`, `next_action_description`, `contributing_offices`, `contributor_names`.

---

### Table: `artifacts`

Child table. Each row is one authoritative artifact link associated with one innovation record.

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
  added_by          UUID NOT NULL,  -- FK to users

  CONSTRAINT chk_artifact_url_https
    CHECK (url LIKE 'https://%' OR url LIKE 'http://%')
    -- Note: HTTPS preferred; HTTP allowed for intranet/internal URLs
);

CREATE INDEX idx_artifacts_record ON artifacts(record_id);
CREATE INDEX idx_artifacts_restricted ON artifacts(record_id, is_restricted);
```

---

### Table: `record_next_actions`

Child table. Each row is one configured CTA action for an innovation record.

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
  display_order     INTEGER NOT NULL DEFAULT 0,

  CONSTRAINT chk_max_actions_per_record
    -- Enforced at application layer: max 6 actions per record_id
    CHECK (true)
);

CREATE INDEX idx_rna_record ON record_next_actions(record_id);
CREATE INDEX idx_rna_enabled ON record_next_actions(record_id, is_enabled);
```

---

### TypeScript Interfaces — Core Entities

```typescript
// Canonical enum types
type MaturityValue =
  | 'idea' | 'evaluated_idea' | 'experiment_poc'
  | 'prototype_pilot' | 'production_validated' | 'archived_retired';

type ReviewStatusValue =
  | 'submitted' | 'curated' | 'technically_reviewed'
  | 'security_reviewed' | 'policy_reviewed' | 'validated_for_reuse'
  | 'superseded' | 'retired';

type PublicationState =
  | 'draft' | 'submitted_for_review' | 'published'
  | 'superseded' | 'archived' | 'retired';

type EngagementIndicator =
  | 'demo_available' | 'seeking_adoption_partner'
  | 'technical_playbook_available' | 'reference_pattern_available'
  | 'monitoring_only' | 'archived' | 'none';

type ArtifactType =
  | 'lessons_learned' | 'poc_report' | 'decision_brief'
  | 'architecture_diagram' | 'demo_video' | 'repository'
  | 'infrastructure_definition' | 'test_results'
  | 'security_findings' | 'technical_playbook' | 'other';

type NextActionType =
  | 'request_demo' | 'discuss_use_case' | 'explore_adoption'
  | 'request_technical_guidance' | 'share_related_work' | 'contact_ir';

type ReusePotential = 'high' | 'moderate' | 'low' | 'not_assessed';

// Innovation Record (full — curator view)
interface InnovationRecord {
  id: string;                        // UUID
  slug: string;
  publicationState: PublicationState;
  createdAt: string;                 // ISO 8601
  createdBy: string;                 // UUID
  updatedAt: string;
  updatedBy: string;
  publishedAt: string | null;
  version: number;

  // F3.1
  title: string;
  summary: string;
  problemStatement: string;
  affectedUsers?: string;
  currentWorkflow?: string;
  whyExperimentation?: string;
  missionAreas: string[];
  problemTypeTags: string[];

  // F3.2
  hypothesisOrObjective: string;
  scopeDescription?: string;
  technologyAreas: string[];
  technologiesUsed?: string;
  methodsUsed?: string;
  tags: string[];

  // F3.3
  outcomeSummary: string;
  whatWorked?: string;
  whatDidNotWork?: string;
  uncertaintyReduced?: string;
  decisionEnabled?: string;
  evidenceSummary?: string;
  sourceBasis: string;

  // F3.4
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

  // F3.5
  maturity: MaturityValue | null;
  reviewStatuses: ReviewStatusValue[];
  readyFor?: string;
  notReadyFor?: string;
  nextStageRequirements?: string;
  lastReviewedDate: string | null;   // ISO date YYYY-MM-DD
  nextReviewDate?: string | null;
  maturityChangeReason?: string;

  // F3.6
  reusePotential: ReusePotential;
  whatCanBeReused?: string;
  whatShouldBeAdapted?: string;
  whatNotToCopy?: string;
  environmentAssumptions?: string;
  requiredSkills?: string;
  requiredServices?: string;
  productionReadinessGaps?: string;
  engagementIndicator: EngagementIndicator;

  // F3.7
  opportunitySource?: string;
  contributingOffices: string[];
  contributorNames: string[];
  irContribution?: string;
  ownerSteward: string;
  ownerContact?: string;
  operationalOwner?: string;
  productionOwner?: string;
  attributionStatement: string;
  sourceContributionId?: string | null; // UUID ref

  // F3.8b
  applicableDisclaimer: string;
  supersededByRecordId?: string | null;
  supersessionReason?: string;
  retirementReason?: string;

  // F3.9
  nextActionDescription?: string;
}

// Innovation Record — public catalog card
interface CatalogCard {
  id: string;
  slug: string;
  title: string;
  summary: string;
  technologyAreas: string[];
  maturity: MaturityValue | null;
  reviewStatuses: ReviewStatusValue[];
  contributingOffices: string[];
  engagementIndicator: EngagementIndicator;
  lastReviewedDate: string | null;
  publicationState: PublicationState;
}

// Artifact (public view — restricted artifacts omit url)
interface PublicArtifact {
  artifactId: string;
  artifactType: ArtifactType;
  name: string;
  url?: string;          // omitted when is_restricted = true for non-curators
  accessNotes?: string;
  isRestricted: boolean;
  displayOrder: number;
}

// Next Action CTA
interface RecordNextAction {
  actionId: string;
  actionType: NextActionType;
  customLabel?: string;
  isEnabled: boolean;
  displayOrder: number;
  defaultLabel: string;  // computed from actionType
}
```
