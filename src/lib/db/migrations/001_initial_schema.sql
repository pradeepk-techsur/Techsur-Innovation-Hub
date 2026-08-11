-- TSIO Innovation Hub — Initial Schema Migration
-- Source: TechArch-TechSurHub.md §3.2

-- Enable uuid generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Table: innovation_contributions (defined first to resolve FK ordering)
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
  submission_ip                 INET,
  status                        VARCHAR(32) NOT NULL DEFAULT 'pending'
                                  CHECK (status IN (
                                    'pending', 'accepted_for_curation', 'declined',
                                    'needs_more_information', 'duplicate', 'curated'
                                  )),
  dispositioned_at              TIMESTAMPTZ,
  dispositioned_by              UUID,
  curator_notes                 TEXT,
  created_record_id             UUID,
  CONSTRAINT chk_contribution_consents
    CHECK (non_endorsement_acknowledged = TRUE AND consent_to_contact = TRUE)
);

CREATE INDEX idx_contrib_status        ON innovation_contributions(status);
CREATE INDEX idx_contrib_submission_date ON innovation_contributions(submission_date DESC);
CREATE INDEX idx_contrib_office        ON innovation_contributions(contributing_office);
CREATE INDEX idx_contrib_created_record ON innovation_contributions(created_record_id)
  WHERE created_record_id IS NOT NULL;

-- Table: innovation_records (central entity)
CREATE TABLE innovation_records (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                        VARCHAR(128) NOT NULL UNIQUE,
  publication_state           VARCHAR(32) NOT NULL DEFAULT 'draft'
                                CHECK (publication_state IN (
                                  'draft', 'submitted_for_review', 'published',
                                  'superseded', 'archived', 'retired'
                                )),
  created_at                  TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by                  UUID NOT NULL,
  updated_at                  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by                  UUID NOT NULL,
  published_at                TIMESTAMPTZ,
  version                     INTEGER NOT NULL DEFAULT 1,
  title                       VARCHAR(200) NOT NULL DEFAULT '',
  summary                     VARCHAR(500) NOT NULL DEFAULT '',
  problem_statement           TEXT NOT NULL DEFAULT '',
  affected_users              TEXT,
  current_workflow            TEXT,
  why_experimentation         TEXT,
  mission_areas               TEXT[] NOT NULL DEFAULT '{}',
  problem_type_tags           TEXT[] NOT NULL DEFAULT '{}',
  hypothesis_or_objective     TEXT NOT NULL DEFAULT '',
  scope_description           TEXT,
  technology_areas            TEXT[] NOT NULL DEFAULT '{}',
  technologies_used           TEXT,
  methods_used                TEXT,
  tags                        TEXT[] NOT NULL DEFAULT '{}',
  outcome_summary             TEXT NOT NULL DEFAULT '',
  what_worked                 TEXT,
  what_did_not_work           TEXT,
  uncertainty_reduced         TEXT,
  decision_enabled            TEXT,
  evidence_summary            TEXT,
  source_basis                VARCHAR(500) NOT NULL DEFAULT '',
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
  maturity                    VARCHAR(32)
                                CHECK (maturity IS NULL OR maturity IN (
                                  'idea', 'evaluated_idea', 'experiment_poc',
                                  'prototype_pilot', 'production_validated',
                                  'archived_retired'
                                )),
  review_statuses             TEXT[] NOT NULL DEFAULT '{}',
  ready_for                   TEXT,
  not_ready_for               TEXT,
  next_stage_requirements     TEXT,
  last_reviewed_date          DATE,
  next_review_date            DATE,
  maturity_change_reason      VARCHAR(500),
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
  applicable_disclaimer       TEXT NOT NULL DEFAULT '',
  superseded_by_record_id     UUID REFERENCES innovation_records(id)
                                ON DELETE SET NULL
                                DEFERRABLE INITIALLY DEFERRED,
  supersession_reason         TEXT,
  retirement_reason           TEXT,
  next_action_description     TEXT,
  search_vector               TSVECTOR,
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

-- Deferred FK: innovation_contributions.created_record_id → innovation_records
ALTER TABLE innovation_contributions
  ADD CONSTRAINT fk_contrib_created_record
    FOREIGN KEY (created_record_id) REFERENCES innovation_records(id)
    ON DELETE SET NULL
    DEFERRABLE INITIALLY DEFERRED;

-- Indexes
CREATE INDEX idx_ir_publication_state  ON innovation_records(publication_state);
CREATE INDEX idx_ir_maturity           ON innovation_records(maturity);
CREATE INDEX idx_ir_last_reviewed      ON innovation_records(last_reviewed_date);
CREATE INDEX idx_ir_updated_at         ON innovation_records(updated_at DESC);
CREATE INDEX idx_ir_slug               ON innovation_records(slug);
CREATE INDEX idx_ir_source_contribution ON innovation_records(source_contribution_id)
  WHERE source_contribution_id IS NOT NULL;
CREATE INDEX idx_ir_engagement_indicator ON innovation_records(engagement_indicator);
CREATE INDEX idx_ir_search_vector      ON innovation_records USING GIN(search_vector);
CREATE INDEX idx_ir_mission_areas      ON innovation_records USING GIN(mission_areas);
CREATE INDEX idx_ir_technology_areas   ON innovation_records USING GIN(technology_areas);
CREATE INDEX idx_ir_review_statuses    ON innovation_records USING GIN(review_statuses);
CREATE INDEX idx_ir_contributing_offices ON innovation_records USING GIN(contributing_offices);
CREATE INDEX idx_ir_tags               ON innovation_records USING GIN(tags);

-- Search vector maintenance trigger
CREATE OR REPLACE FUNCTION update_search_vector()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.summary, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.problem_statement, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(
      coalesce(NEW.findings_architectural, '') || ' ' ||
      coalesce(NEW.findings_security, '') || ' ' ||
      coalesce(NEW.findings_cloud_platform, '') || ' ' ||
      coalesce(NEW.findings_performance, '') || ' ' ||
      coalesce(NEW.findings_ux, '') || ' ' ||
      coalesce(NEW.findings_data, '') || ' ' ||
      coalesce(NEW.findings_testing, '') || ' ' ||
      coalesce(NEW.findings_operational, '') || ' ' ||
      coalesce(NEW.findings_cost, '') || ' ' ||
      coalesce(NEW.findings_scalability, '') || ' ' ||
      coalesce(NEW.findings_other, ''), '')), 'A') ||
    setweight(to_tsvector('english', coalesce(array_to_string(NEW.tags, ' '), '')), 'A') ||
    setweight(to_tsvector('english', coalesce(array_to_string(NEW.mission_areas, ' '), '')), 'A') ||
    setweight(to_tsvector('english', coalesce(array_to_string(NEW.technology_areas, ' '), '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.hypothesis_or_objective, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.outcome_summary, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.what_can_be_reused, '')), 'B') ||
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

-- updated_at trigger
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

-- version increment trigger
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

-- Table: artifacts
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
  added_by          UUID NOT NULL,
  CONSTRAINT chk_artifact_name_min CHECK (length(name) >= 3),
  CONSTRAINT chk_artifact_url_format CHECK (url LIKE 'https://%' OR url LIKE 'http://%')
);

CREATE INDEX idx_artifacts_record     ON artifacts(record_id);
CREATE INDEX idx_artifacts_restricted ON artifacts(record_id, is_restricted);
CREATE INDEX idx_artifacts_order      ON artifacts(record_id, display_order);

-- Table: record_next_actions
CREATE TABLE record_next_actions (
  action_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  record_id     UUID NOT NULL REFERENCES innovation_records(id) ON DELETE CASCADE,
  action_type   VARCHAR(32) NOT NULL
                  CHECK (action_type IN (
                    'request_demo', 'discuss_use_case', 'explore_adoption',
                    'request_technical_guidance', 'share_related_work', 'contact_ir'
                  )),
  custom_label  VARCHAR(100),
  is_enabled    BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_rna_record  ON record_next_actions(record_id);
CREATE INDEX idx_rna_enabled ON record_next_actions(record_id, is_enabled);
CREATE INDEX idx_rna_order   ON record_next_actions(record_id, display_order);

-- Table: opportunity_submissions
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
  submission_ip               INET,
  status                      VARCHAR(32) NOT NULL DEFAULT 'pending'
                                CHECK (status IN (
                                  'pending', 'accepted', 'declined',
                                  'needs_more_information', 'duplicate'
                                )),
  dispositioned_at            TIMESTAMPTZ,
  dispositioned_by            UUID,
  curator_notes               TEXT,
  CONSTRAINT chk_opportunity_consents
    CHECK (consent_to_contact = TRUE AND non_acceptance_acknowledged = TRUE)
);

CREATE INDEX idx_opp_status           ON opportunity_submissions(status);
CREATE INDEX idx_opp_submission_date  ON opportunity_submissions(submission_date DESC);
CREATE INDEX idx_opp_submitting_office ON opportunity_submissions(submitting_office);
CREATE INDEX idx_opp_request_type     ON opportunity_submissions(request_type);

-- Table: engagement_requests
CREATE TABLE engagement_requests (
  id                              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_type                    VARCHAR(32) NOT NULL
                                    CHECK (request_type IN (
                                      'request_demo', 'discuss_use_case',
                                      'explore_adoption', 'request_technical_guidance',
                                      'share_related_work', 'contact_ir'
                                    )),
  originating_record_id           UUID REFERENCES innovation_records(id) ON DELETE SET NULL,
  originating_record_title        VARCHAR(200),
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
  routing_address_at_submission   VARCHAR(254) NOT NULL,
  email_routing_initiated         BOOLEAN NOT NULL DEFAULT false,
  follow_up_status                VARCHAR(32) NOT NULL DEFAULT 'received'
                                    CHECK (follow_up_status IN (
                                      'received', 'in_progress',
                                      'completed', 'no_action_required'
                                    )),
  follow_up_updated_at            TIMESTAMPTZ,
  follow_up_updated_by            UUID,
  curator_notes                   TEXT,
  CONSTRAINT chk_engagement_consent CHECK (consent_to_contact = TRUE)
);

CREATE INDEX idx_eng_follow_up_status  ON engagement_requests(follow_up_status);
CREATE INDEX idx_eng_submitted_at      ON engagement_requests(submitted_at DESC);
CREATE INDEX idx_eng_originating_record ON engagement_requests(originating_record_id)
  WHERE originating_record_id IS NOT NULL;
CREATE INDEX idx_eng_request_type      ON engagement_requests(request_type);

-- Table: audit_events (INSERT ONLY)
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
  actor_id          UUID NOT NULL,
  actor_name        VARCHAR(200) NOT NULL,
  target_type       VARCHAR(32) NOT NULL
                      CHECK (target_type IN (
                        'innovation_record', 'artifact', 'opportunity_submission',
                        'innovation_contribution', 'engagement_request',
                        'hub_settings', 'user_role'
                      )),
  target_id         UUID NOT NULL,
  target_title      VARCHAR(200),
  event_data        JSONB NOT NULL DEFAULT '{}',
  occurred_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  notes             TEXT,
  ip_address        INET
);

CREATE INDEX idx_audit_target      ON audit_events(target_type, target_id);
CREATE INDEX idx_audit_occurred_at ON audit_events(occurred_at DESC);
CREATE INDEX idx_audit_actor       ON audit_events(actor_id);
CREATE INDEX idx_audit_event_type  ON audit_events(event_type);

-- Table: hub_settings
CREATE TABLE hub_settings (
  setting_key   VARCHAR(100) PRIMARY KEY,
  setting_value TEXT NOT NULL,
  setting_type  VARCHAR(16) NOT NULL
                  CHECK (setting_type IN ('string', 'integer', 'boolean', 'json')),
  description   TEXT,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by    UUID
);

-- Seed hub_settings
INSERT INTO hub_settings (setting_key, setting_value, setting_type, description) VALUES
  ('engagement_routing_address',
    'AOml_TSO_IRB_Team@ao.uscourts.gov', 'string',
    'Email address to which all engagement requests are routed (F8.4)'),
  ('engagement_routing_display_name',
    'TSIO Innovation & Research', 'string',
    'Display name for routing destination shown in CTAs'),
  ('submission_rate_limit_per_hour',
    '5', 'integer',
    'Max opportunity/contribution submissions per IP per hour (F6/F7, SEC-06)'),
  ('engagement_rate_limit_per_hour',
    '10', 'integer',
    'Max engagement requests per IP per hour (F8, SEC-06)'),
  ('hub_display_name',
    'TSIO Innovation Hub', 'string',
    'Hub display name used in headings and titles'),
  ('default_applicable_disclaimer',
    '', 'string',
    'Default disclaimer template offered in the record editor (F9.16)'),
  ('taxonomy_mission_areas',    '[]', 'json', 'Ordered list of Mission Area taxonomy values'),
  ('taxonomy_technology_areas', '[]', 'json', 'Ordered list of Technology Area taxonomy values'),
  ('taxonomy_problem_types',    '[]', 'json', 'Ordered list of Problem Type taxonomy values');

-- DB Roles and security
-- Application role: full CRUD on most tables; INSERT-only on audit_events
-- Run as superuser (postgres). Creates the app role if it doesn't exist.
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'tsio_hub_app') THEN
    CREATE ROLE tsio_hub_app LOGIN PASSWORD 'devpassword';
    RAISE NOTICE 'Role tsio_hub_app created';
  ELSE
    RAISE NOTICE 'Role tsio_hub_app already exists';
  END IF;
END
$$;

GRANT SELECT, INSERT, UPDATE, DELETE ON innovation_records TO tsio_hub_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON artifacts TO tsio_hub_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON record_next_actions TO tsio_hub_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON opportunity_submissions TO tsio_hub_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON innovation_contributions TO tsio_hub_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON engagement_requests TO tsio_hub_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON hub_settings TO tsio_hub_app;
GRANT SELECT, INSERT ON audit_events TO tsio_hub_app;
REVOKE UPDATE, DELETE ON audit_events FROM tsio_hub_app;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO tsio_hub_app;
GRANT CONNECT ON DATABASE tsio_hub TO tsio_hub_app;
