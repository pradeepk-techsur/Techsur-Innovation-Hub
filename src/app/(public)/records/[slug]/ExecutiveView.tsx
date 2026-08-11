/**
 * ExecutiveView — executive perspective for an innovation record (F4.2).
 *
 * Displays mission-problem framing, strategic outcome, evidence, maturity,
 * ownership, and recommended next step. Always shows the TrustBanner (F4.4).
 *
 * Rendered by PerspectiveToggle inside the "executive" tabpanel.
 * All data comes from the same InnovationRecordRow passed by the SSR page —
 * no additional API calls (F4.1, F4.4).
 */

import { TrustBanner } from './TrustBanner';
import { NextActionCTAs } from './NextActionCTAs';
import { RecordSection } from './RecordSection';
import type { InnovationRecordRow } from '@/lib/db/types';

interface ArtifactRow {
  artifact_id: string;
  name: string;
  url: string | null;
  is_restricted: boolean;
  artifact_type: string;
  access_notes: string | null;
  display_order: number;
}

interface NextActionRow {
  action_id: string;
  record_id: string;
  action_type: string;
  custom_label: string | null;
  is_enabled: boolean;
  display_order: number;
}

interface Props {
  record: InnovationRecordRow;
  artifacts: ArtifactRow[];
  next_actions: NextActionRow[];
}

export function ExecutiveView({ record, next_actions }: Props) {
  return (
    <div id="executive-panel" role="tabpanel" aria-labelledby="executive-tab">
      {/* Trust banner always shown (F4.4) */}
      <TrustBanner
        maturity={record.maturity}
        reviewStatuses={record.review_statuses}
        lastReviewedDate={record.last_reviewed_date ? String(record.last_reviewed_date) : null}
        applicableDisclaimer={String(record.applicable_disclaimer ?? '')}
      />

      {/* F4.2 — Mission problem and why it matters */}
      <RecordSection id="exec-problem" title="The Problem">
        {record.problem_statement && (
          <p className="text-gray-700">{record.problem_statement}</p>
        )}
        {record.affected_users && (
          <p className="text-gray-700">
            <strong>Who is affected:</strong> {record.affected_users}
          </p>
        )}
        {record.mission_areas.length > 0 && (
          <p className="text-gray-700">
            <strong>Mission areas:</strong> {record.mission_areas.join(', ')}
          </p>
        )}
      </RecordSection>

      {/* F4.2 — Strategic relevance and outcome */}
      <RecordSection id="exec-outcome" title="What Was Demonstrated">
        {record.outcome_summary && (
          <p className="text-gray-700">{record.outcome_summary}</p>
        )}
        {record.what_worked && (
          <p className="text-gray-700">
            <strong>What worked:</strong> {record.what_worked}
          </p>
        )}
        {record.decision_enabled && (
          <p className="text-gray-700">
            <strong>Decision enabled:</strong> {record.decision_enabled}
          </p>
        )}
        {record.uncertainty_reduced && (
          <p className="text-gray-700">
            <strong>Uncertainty reduced:</strong> {record.uncertainty_reduced}
          </p>
        )}
      </RecordSection>

      {/* F4.2 — Maturity and decision recommendation */}
      <RecordSection id="exec-maturity" title="Maturity and Readiness">
        {record.ready_for && (
          <p className="text-gray-700">
            <strong>Ready for:</strong> {record.ready_for}
          </p>
        )}
        {record.not_ready_for && (
          <p className="text-gray-700">
            <strong>Not ready for:</strong> {record.not_ready_for}
          </p>
        )}
        {record.next_stage_requirements && (
          <p className="text-gray-700">
            <strong>Requirements for next stage:</strong> {record.next_stage_requirements}
          </p>
        )}
      </RecordSection>

      {/* F4.2 — Ownership and sponsorship */}
      <RecordSection id="exec-ownership" title="Ownership">
        {record.owner_steward && (
          <p className="text-gray-700">
            <strong>Current owner / steward:</strong> {record.owner_steward}
          </p>
        )}
        {record.contributing_offices.length > 0 && (
          <p className="text-gray-700">
            <strong>Contributing offices:</strong>{' '}
            {record.contributing_offices.join(', ')}
          </p>
        )}
        {record.opportunity_source && (
          <p className="text-gray-700">
            <strong>Opportunity source:</strong> {record.opportunity_source}
          </p>
        )}
      </RecordSection>

      {/* F8.1 — Next actions CTAs (seeded from record_next_actions) */}
      <RecordSection id="exec-next" title="Next Actions">
        {record.next_action_description && (
          <p className="text-gray-700">{record.next_action_description}</p>
        )}
        <NextActionCTAs actions={next_actions} record={record} />
      </RecordSection>
    </div>
  );
}
