import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth/middleware';

// F9.16 — content model reference (curator-accessible, not admin-only)
// Read-only static data — no DB query needed; content model is defined by the FRD/TechArch
export async function GET(request: Request) {
  const auth = await requireRole(request, 'curator');
  if (auth instanceof Response) return auth;

  const CONTENT_MODEL = {
    maturityValues: [
      {
        value: 'idea',
        label: 'Idea',
        description: 'A problem, opportunity, or concept that has not yet been validated.',
      },
      {
        value: 'evaluated_idea',
        label: 'Evaluated Idea',
        description: 'An idea reviewed for relevance, feasibility, and potential value.',
      },
      {
        value: 'experiment_poc',
        label: 'Experiment / POC',
        description:
          'A controlled effort that produced evidence and findings, but is not production-ready.',
      },
      {
        value: 'prototype_pilot',
        label: 'Prototype / Pilot',
        description:
          'A capability tested with representative users, workflows, integrations, or environments.',
      },
      {
        value: 'production_validated',
        label: 'Production / Validated Pattern',
        description:
          'A deployed capability or reviewed approach with sufficient evidence to serve as a reference for reuse.',
      },
      {
        value: 'archived_retired',
        label: 'Archived / Retired',
        description:
          'Work retained for institutional learning but no longer active or recommended.',
      },
    ],
    reviewStatusValues: [
      {
        value: 'submitted',
        label: 'Submitted',
        description: 'Submitted for curation but not yet reviewed.',
      },
      {
        value: 'curated_for_completeness',
        label: 'Curated for Completeness',
        description: 'Record has been reviewed for completeness by an I&R curator.',
      },
      {
        value: 'technically_reviewed',
        label: 'Technically Reviewed',
        description: 'Technical content has been reviewed by I&R technical staff.',
      },
      {
        value: 'security_reviewed',
        label: 'Security Reviewed',
        description:
          'Security implications have been reviewed. Visually distinct from technical review (SEC-11).',
      },
      {
        value: 'policy_reviewed',
        label: 'Policy Reviewed',
        description: 'Policy implications have been reviewed and cleared.',
      },
      {
        value: 'validated_for_reuse',
        label: 'Validated for Reuse',
        description:
          'Work has been validated as suitable for reuse by another office. Does not eliminate local review requirements.',
      },
      {
        value: 'superseded',
        label: 'Superseded',
        description:
          'This review status has been superseded by a successor record or artifact.',
      },
      {
        value: 'retired',
        label: 'Retired',
        description: 'This review status is retired and no longer applies.',
      },
    ],
    // Independence rule: maturity and review status are separate governance axes
    independenceRule:
      'Maturity and review status are independent governance fields. Changing one MUST NOT automatically change the other.',
    trustAxioms: [
      'POC does not mean production-ready.',
      'Published does not mean approved for adoption.',
      'Community-submitted does not mean centrally endorsed.',
      'Validated for reuse does not eliminate local review requirements.',
    ],
    publicationGateFields: [
      { field: 'title', requirement: 'At least 5 characters.' },
      { field: 'summary', requirement: 'At least 20 characters.' },
      { field: 'problem_statement', requirement: 'At least 50 characters.' },
      { field: 'mission_areas', requirement: 'At least 1 value.' },
      { field: 'hypothesis_or_objective', requirement: 'At least 20 characters.' },
      { field: 'technology_areas', requirement: 'At least 1 value.' },
      { field: 'outcome_summary', requirement: 'At least 50 characters.' },
      { field: 'source_basis', requirement: 'At least 10 characters.' },
      { field: 'key_findings (any findings_* field)', requirement: 'At least 1 findings field non-empty.' },
      { field: 'maturity', requirement: 'Valid non-null canonical value.' },
      { field: 'review_statuses', requirement: 'At least 1 valid canonical value.' },
      { field: 'last_reviewed_date', requirement: 'Valid date, today or earlier.' },
      { field: 'owner_steward', requirement: 'At least 3 characters.' },
      { field: 'attribution_statement', requirement: 'At least 10 characters.' },
      { field: 'applicable_disclaimer', requirement: 'At least 10 characters.' },
    ],
    lifecycleStates: [
      {
        state: 'draft',
        description: 'In preparation. Not visible to stakeholders.',
        allowedTransitionsTo: ['submitted_for_review'],
      },
      {
        state: 'submitted_for_review',
        description: 'Submitted for publication review. Not visible to stakeholders.',
        allowedTransitionsTo: ['draft', 'published'],
      },
      {
        state: 'published',
        description: 'Visible to all stakeholders. Must pass publication gate.',
        allowedTransitionsTo: ['superseded', 'archived', 'retired'],
      },
      {
        state: 'superseded',
        description:
          'Replaced by a newer record. Discoverable but clearly marked superseded.',
        allowedTransitionsTo: ['archived', 'retired'],
      },
      {
        state: 'archived',
        description:
          'Retained for institutional learning but not presented as a current pattern.',
        allowedTransitionsTo: ['retired'],
      },
      {
        state: 'retired',
        description:
          'Work no longer active or recommended. Must not be presented as current.',
        allowedTransitionsTo: [],
      },
    ],
  };

  return NextResponse.json({ status: 'ok', data: CONTENT_MODEL });
}
