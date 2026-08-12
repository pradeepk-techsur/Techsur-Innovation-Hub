import { db } from '@/lib/db/client';
import { appendAuditEvent } from '@/lib/services/audit.service';
import type { InnovationRecordRow } from '@/lib/db/types';

export interface GateResult {
  passed: boolean;
  errors: Record<string, string>;    // all failed checks (field key → error message)
  warnings: Record<string, string>;  // non-blocking curator alerts
}

/**
 * runPublicationGate — executes all 15 publication checks from TechArch §4.4 / FRD F9.10.
 * Returns { passed: true } if all checks pass; { passed: false, errors } otherwise.
 * Also returns { warnings } for non-blocking issues (e.g., maturity/disclaimer mismatch).
 *
 * All 15 checks per TechArch:
 *  1. title ≥ 5 chars
 *  2. summary ≥ 20 chars
 *  3. problem_statement ≥ 50 chars
 *  4. mission_areas ≥ 1 value
 *  5. hypothesis_or_objective ≥ 20 chars
 *  6. technology_areas ≥ 1 value
 *  7. outcome_summary ≥ 50 chars
 *  8. source_basis ≥ 10 chars
 *  9. at least 1 findings_* field non-empty
 * 10. maturity is valid non-null value
 * 11. review_statuses ≥ 1 valid value
 * 12. last_reviewed_date valid, ≤ today
 * 13. owner_steward ≥ 3 chars
 * 14. attribution_statement ≥ 10 chars
 * 15. applicable_disclaimer ≥ 10 chars
 */
export async function runPublicationGate(record: InnovationRecordRow): Promise<GateResult> {
  const errors: Record<string, string> = {};
  const warnings: Record<string, string> = {};

  const VALID_MATURITY = [
    'idea', 'evaluated_idea', 'experiment_poc', 'prototype_pilot',
    'production_validated', 'archived_retired',
  ];
  const VALID_REVIEW_STATUSES = [
    'submitted', 'curated_for_completeness', 'technically_reviewed',
    'security_reviewed', 'policy_reviewed', 'validated_for_reuse',
    'superseded', 'retired',
    // Also include values that may be used in practice from the editor
    'legal_reviewed', 'privacy_reviewed', 'architecture_reviewed', 'accessibility_reviewed',
  ];

  // Check 1: title ≥ 5 chars
  if (!record.title || record.title.trim().length < 5) {
    errors.title = 'Title must be at least 5 characters.';
  }
  // Check 2: summary ≥ 20 chars
  if (!record.summary || record.summary.trim().length < 20) {
    errors.summary = 'Summary must be at least 20 characters.';
  }
  // Check 3: problem_statement ≥ 50 chars
  if (!record.problem_statement || record.problem_statement.trim().length < 50) {
    errors.problemStatement = 'Problem Statement must be at least 50 characters.';
  }
  // Check 4: mission_areas ≥ 1
  if (!record.mission_areas || record.mission_areas.length === 0) {
    errors.missionAreas = 'At least one Mission Area is required.';
  }
  // Check 5: hypothesis_or_objective ≥ 20 chars
  if (!record.hypothesis_or_objective || record.hypothesis_or_objective.trim().length < 20) {
    errors.hypothesisOrObjective = 'Hypothesis or Objective must be at least 20 characters.';
  }
  // Check 6: technology_areas ≥ 1
  if (!record.technology_areas || record.technology_areas.length === 0) {
    errors.technologyAreas = 'At least one Technology Area is required.';
  }
  // Check 7: outcome_summary ≥ 50 chars
  if (!record.outcome_summary || record.outcome_summary.trim().length < 50) {
    errors.outcomeSummary = 'Outcome Summary must be at least 50 characters.';
  }
  // Check 8: source_basis ≥ 10 chars
  if (!record.source_basis || record.source_basis.trim().length < 10) {
    errors.sourceBasis = 'Source Basis must be at least 10 characters.';
  }
  // Check 9: at least 1 findings_* field non-empty
  const findingsFields = [
    record.findings_architectural, record.findings_security, record.findings_cloud_platform,
    record.findings_performance, record.findings_ux, record.findings_data,
    record.findings_testing, record.findings_operational, record.findings_cost,
    record.findings_scalability, record.findings_other,
  ];
  const hasFindings = findingsFields.some(f => f && f.trim().length > 0);
  if (!hasFindings) {
    errors.keyFindingsGateCheck = 'At least one Key Findings field must be non-empty.';
  }
  // Check 10: maturity is valid non-null
  if (!record.maturity || !VALID_MATURITY.includes(record.maturity)) {
    errors.maturity = 'A valid Maturity value is required.';
  }
  // Check 11: review_statuses ≥ 1 valid value
  if (
    !record.review_statuses ||
    record.review_statuses.length === 0 ||
    !record.review_statuses.some(s => VALID_REVIEW_STATUSES.includes(s))
  ) {
    errors.reviewStatuses = 'At least one valid Review Status is required.';
  }
  // Check 12: last_reviewed_date valid and ≤ today
  if (!record.last_reviewed_date) {
    errors.lastReviewedDate = 'Last Reviewed Date is required.';
  } else {
    const reviewDate = new Date(record.last_reviewed_date);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (isNaN(reviewDate.getTime()) || reviewDate > today) {
      errors.lastReviewedDate = 'Last Reviewed Date must be today or earlier.';
    }
  }
  // Check 13: owner_steward ≥ 3 chars
  if (!record.owner_steward || record.owner_steward.trim().length < 3) {
    errors.ownerSteward = 'Owner / Steward must be at least 3 characters.';
  }
  // Check 14: attribution_statement ≥ 10 chars
  if (!record.attribution_statement || record.attribution_statement.trim().length < 10) {
    errors.attributionStatement = 'Attribution Statement must be at least 10 characters.';
  }
  // Check 15: applicable_disclaimer ≥ 10 chars
  if (!record.applicable_disclaimer || record.applicable_disclaimer.trim().length < 10) {
    errors.applicableDisclaimer = 'Applicable Disclaimer must be at least 10 characters.';
  }

  // Non-blocking warning: maturity/disclaimer mismatch (FRD F9.10)
  // A Production/Validated record with POC/Experiment language in its disclaimer
  const HIGH_MATURITY = ['production_validated'];
  const disclaimerLower = record.applicable_disclaimer?.toLowerCase() ?? '';
  if (
    record.maturity &&
    HIGH_MATURITY.includes(record.maturity) &&
    (disclaimerLower.includes('poc') || disclaimerLower.includes('experiment'))
  ) {
    warnings.disclaimerMaturityMismatch =
      'Disclaimer language references POC/Experiment maturity but the record is set to Production / Validated. Please confirm the disclaimer is accurate.';
  }

  return {
    passed: Object.keys(errors).length === 0,
    errors,
    warnings,
  };
}

// Valid lifecycle state transitions
const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  draft: ['submitted_for_review'],
  submitted_for_review: ['draft', 'published'],
  published: ['draft', 'superseded', 'archived', 'retired'],
  superseded: ['archived'],
  archived: [],
  retired: [],
};

export async function transitionState(params: {
  id: string;
  to: string;
  reason?: string;
  actorId: string;
  actorName: string;
  targetTitle: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const record = await db
    .selectFrom('innovation_records')
    .select(['publication_state', 'version'])
    .where('id', '=', params.id)
    .executeTakeFirst();

  if (!record) return { ok: false, error: 'Record not found' };

  const allowed = ALLOWED_TRANSITIONS[record.publication_state] ?? [];
  if (!allowed.includes(params.to)) {
    return {
      ok: false,
      error: `Cannot transition from ${record.publication_state} to ${params.to}.`,
    };
  }

  const updateData: Record<string, unknown> = {
    publication_state: params.to,
  };
  if (params.to === 'published') {
    updateData.published_at = new Date().toISOString();
  }
  if (params.reason) {
    // Store reason in supersession_reason for supersede, retirement_reason for retire
    if (params.to === 'superseded') {
      updateData.supersession_reason = params.reason;
    } else if (params.to === 'retired') {
      updateData.retirement_reason = params.reason;
    }
  }

  await db
    .updateTable('innovation_records')
    .set(updateData as Partial<InnovationRecordRow>)
    .where('id', '=', params.id)
    .execute();

  await appendAuditEvent({
    eventType: 'publication_state_changed',
    actorId: params.actorId,
    actorName: params.actorName,
    targetType: 'innovation_record',
    targetId: params.id,
    targetTitle: params.targetTitle,
    eventData: {
      from: record.publication_state,
      to: params.to,
      reason: params.reason,
    },
  });

  return { ok: true };
}
