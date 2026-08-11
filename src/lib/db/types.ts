import type { Generated, Insertable, Selectable, Updateable } from 'kysely';

// ─── Column type aliases ───────────────────────────────────────────────────
type Timestamp = Date;
type UUID = string;

// ─── Enum value types ──────────────────────────────────────────────────────
export type MaturityValue =
  | 'idea'
  | 'evaluated_idea'
  | 'experiment_poc'
  | 'prototype_pilot'
  | 'production_validated'
  | 'archived_retired';

export type PublicationState =
  | 'draft'
  | 'submitted_for_review'
  | 'published'
  | 'superseded'
  | 'archived'
  | 'retired';

export type EngagementIndicator =
  | 'demo_available'
  | 'seeking_adoption_partner'
  | 'technical_playbook_available'
  | 'reference_pattern_available'
  | 'monitoring_only'
  | 'archived'
  | 'none';

// ─── innovation_contributions ─────────────────────────────────────────────
export interface InnovationContributionsTable {
  id: Generated<UUID>;
  contribution_title: string;
  problem_addressed: string;
  work_description: string;
  contributing_office: string;
  contributor_names: string;
  current_maturity: 'idea' | 'evaluated_idea' | 'experiment_poc' | 'prototype_pilot' | 'production_validated' | 'archived_retired';
  current_owner: string;
  owner_contact_email: string;
  artifact_links: string | null;
  known_limitations: string | null;
  collaboration_preference: 'open_for_reuse' | 'seeking_collaborator' | 'informational_only' | 'seeking_adopter' | 'discuss_with_ir';
  additional_context: string | null;
  submitter_name: string;
  submitter_email: string;
  non_endorsement_acknowledged: boolean;
  consent_to_contact: boolean;
  submission_date: Generated<Timestamp>;
  submission_ip: string | null;
  status: Generated<'pending' | 'accepted_for_curation' | 'declined' | 'needs_more_information' | 'duplicate' | 'curated'>;
  dispositioned_at: Timestamp | null;
  dispositioned_by: UUID | null;
  curator_notes: string | null;
  created_record_id: UUID | null;
}

// ─── innovation_records ────────────────────────────────────────────────────
export interface InnovationRecordsTable {
  id: Generated<UUID>;
  slug: string;
  publication_state: Generated<PublicationState>;
  created_at: Generated<Timestamp>;
  created_by: UUID;
  updated_at: Generated<Timestamp>;
  updated_by: UUID;
  published_at: Timestamp | null;
  version: Generated<number>;
  title: Generated<string>;
  summary: Generated<string>;
  problem_statement: Generated<string>;
  affected_users: string | null;
  current_workflow: string | null;
  why_experimentation: string | null;
  mission_areas: Generated<string[]>;
  problem_type_tags: Generated<string[]>;
  hypothesis_or_objective: Generated<string>;
  scope_description: string | null;
  technology_areas: Generated<string[]>;
  technologies_used: string | null;
  methods_used: string | null;
  tags: Generated<string[]>;
  outcome_summary: Generated<string>;
  what_worked: string | null;
  what_did_not_work: string | null;
  uncertainty_reduced: string | null;
  decision_enabled: string | null;
  evidence_summary: string | null;
  source_basis: Generated<string>;
  findings_architectural: string | null;
  findings_security: string | null;
  findings_cloud_platform: string | null;
  findings_performance: string | null;
  findings_ux: string | null;
  findings_data: string | null;
  findings_testing: string | null;
  findings_operational: string | null;
  findings_cost: string | null;
  findings_scalability: string | null;
  findings_other: string | null;
  maturity: MaturityValue | null;
  review_statuses: Generated<string[]>;
  ready_for: string | null;
  not_ready_for: string | null;
  next_stage_requirements: string | null;
  last_reviewed_date: string | null;
  next_review_date: string | null;
  maturity_change_reason: string | null;
  reuse_potential: 'high' | 'moderate' | 'low' | 'not_assessed' | null;
  what_can_be_reused: string | null;
  what_should_be_adapted: string | null;
  what_not_to_copy: string | null;
  environment_assumptions: string | null;
  required_skills: string | null;
  required_services: string | null;
  production_readiness_gaps: string | null;
  engagement_indicator: Generated<EngagementIndicator>;
  opportunity_source: string | null;
  contributing_offices: Generated<string[]>;
  contributor_names: Generated<string[]>;
  ir_contribution: string | null;
  owner_steward: Generated<string>;
  owner_contact: string | null;
  operational_owner: string | null;
  production_owner: string | null;
  attribution_statement: Generated<string>;
  source_contribution_id: UUID | null;
  applicable_disclaimer: Generated<string>;
  superseded_by_record_id: UUID | null;
  supersession_reason: string | null;
  retirement_reason: string | null;
  next_action_description: string | null;
  search_vector: string | null;
}

// ─── artifacts ────────────────────────────────────────────────────────────
export interface ArtifactsTable {
  artifact_id: Generated<UUID>;
  record_id: UUID;
  artifact_type: 'lessons_learned' | 'poc_report' | 'decision_brief' | 'architecture_diagram' | 'demo_video' | 'repository' | 'infrastructure_definition' | 'test_results' | 'security_findings' | 'technical_playbook' | 'other';
  name: string;
  url: string;
  access_notes: string | null;
  is_restricted: Generated<boolean>;
  display_order: Generated<number>;
  added_at: Generated<Timestamp>;
  added_by: UUID;
}

// ─── record_next_actions ──────────────────────────────────────────────────
export interface RecordNextActionsTable {
  action_id: Generated<UUID>;
  record_id: UUID;
  action_type: 'request_demo' | 'discuss_use_case' | 'explore_adoption' | 'request_technical_guidance' | 'share_related_work' | 'contact_ir';
  custom_label: string | null;
  is_enabled: Generated<boolean>;
  display_order: Generated<number>;
}

// ─── opportunity_submissions ──────────────────────────────────────────────
export interface OpportunitySubmissionsTable {
  id: Generated<UUID>;
  request_type: 'current_mission_problem' | 'emerging_tech_question' | 'request_for_research' | 'potential_poc' | 'request_for_demo' | 'collaboration_opportunity' | 'share_existing_work' | 'other';
  problem_title: string;
  problem_description: string;
  affected_users: string;
  current_workflow: string | null;
  impact: string;
  desired_outcome: string | null;
  known_constraints: string | null;
  related_work_attempted: string | null;
  submitting_office: string;
  submitter_name: string;
  submitter_email: string;
  discovery_participants: string | null;
  additional_context: string | null;
  consent_to_contact: boolean;
  non_acceptance_acknowledged: boolean;
  submission_date: Generated<Timestamp>;
  submission_ip: string | null;
  status: Generated<'pending' | 'accepted' | 'declined' | 'needs_more_information' | 'duplicate'>;
  dispositioned_at: Timestamp | null;
  dispositioned_by: UUID | null;
  curator_notes: string | null;
}

// ─── engagement_requests ──────────────────────────────────────────────────
export interface EngagementRequestsTable {
  id: Generated<UUID>;
  request_type: 'request_demo' | 'discuss_use_case' | 'explore_adoption' | 'request_technical_guidance' | 'share_related_work' | 'contact_ir';
  originating_record_id: UUID | null;
  originating_record_title: string | null;
  requester_name: string;
  requester_office: string;
  requester_email: string;
  need_description: string;
  desired_next_step: string | null;
  preferred_contact_method: Generated<'email' | 'phone' | 'no_preference'>;
  consent_to_contact: boolean;
  submitted_at: Generated<Timestamp>;
  submission_ip: string | null;
  routing_address_at_submission: string;
  email_routing_initiated: Generated<boolean>;
  follow_up_status: Generated<'received' | 'in_progress' | 'completed' | 'no_action_required'>;
  follow_up_updated_at: Timestamp | null;
  follow_up_updated_by: UUID | null;
  curator_notes: string | null;
}

// ─── audit_events ─────────────────────────────────────────────────────────
export interface AuditEventsTable {
  audit_id: Generated<UUID>;
  event_type: 'record_created' | 'record_updated' | 'maturity_changed' | 'review_status_changed' | 'publication_state_changed' | 'attribution_updated' | 'artifact_added' | 'artifact_updated' | 'artifact_removed' | 'submission_dispositioned' | 'record_created_from_contribution' | 'engagement_status_updated' | 'settings_changed' | 'user_role_changed';
  actor_id: UUID;
  actor_name: string;
  target_type: 'innovation_record' | 'artifact' | 'opportunity_submission' | 'innovation_contribution' | 'engagement_request' | 'hub_settings' | 'user_role';
  target_id: UUID;
  target_title: string | null;
  event_data: Generated<Record<string, unknown>>;
  occurred_at: Generated<Timestamp>;
  notes: string | null;
  ip_address: string | null;
}

// ─── hub_settings ─────────────────────────────────────────────────────────
export interface HubSettingsTable {
  setting_key: string;
  setting_value: string;
  setting_type: 'string' | 'integer' | 'boolean' | 'json';
  description: string | null;
  updated_at: Generated<Timestamp>;
  updated_by: UUID | null;
}

// ─── Database interface ────────────────────────────────────────────────────
export interface Database {
  innovation_contributions: InnovationContributionsTable;
  innovation_records: InnovationRecordsTable;
  artifacts: ArtifactsTable;
  record_next_actions: RecordNextActionsTable;
  opportunity_submissions: OpportunitySubmissionsTable;
  engagement_requests: EngagementRequestsTable;
  audit_events: AuditEventsTable;
  hub_settings: HubSettingsTable;
}

// ─── Convenience type exports ──────────────────────────────────────────────
export type InnovationRecord = Selectable<InnovationRecordsTable>;
// Alias for plan 01-02 contract compatibility
export type InnovationRecordRow = Selectable<InnovationRecordsTable>;
export type NewInnovationRecord = Insertable<InnovationRecordsTable>;
export type InnovationRecordUpdate = Updateable<InnovationRecordsTable>;

export type InnovationContribution = Selectable<InnovationContributionsTable>;
export type NewInnovationContribution = Insertable<InnovationContributionsTable>;

export type Artifact = Selectable<ArtifactsTable>;
export type NewArtifact = Insertable<ArtifactsTable>;

export type HubSetting = Selectable<HubSettingsTable>;
export type AuditEvent = Selectable<AuditEventsTable>;
export type NewAuditEvent = Insertable<AuditEventsTable>;

// ─── Projected types for catalog display (F1.2–F1.5) ─────────────────────
export type CatalogCardData = Pick<InnovationRecordRow,
  | 'id'
  | 'slug'
  | 'title'
  | 'summary'
  | 'maturity'
  | 'review_statuses'
  | 'contributing_offices'
  | 'last_reviewed_date'
  | 'engagement_indicator'
  | 'publication_state'
  | 'technology_areas'
  | 'mission_areas'
>;
