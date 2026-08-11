/**
 * TechnicalView — technical perspective for an innovation record (F4.3).
 *
 * Displays architecture findings, tools/services, security considerations,
 * known limitations, production-readiness gaps, reuse guidance, and
 * authoritative source artifacts. Always shows the TrustBanner (F4.4).
 *
 * Rendered by PerspectiveToggle inside the "technical" tabpanel.
 * All data comes from the same InnovationRecordRow passed by the SSR page —
 * no additional API calls (F4.1, F4.4).
 */

import { TrustBanner } from './TrustBanner';
import { ArtifactList } from './ArtifactList';
import { NextActionCTAs } from './NextActionCTAs';
import { RecordSection } from './RecordSection';
import type { InnovationRecordRow } from '@/lib/db/types';

// Match ArtifactList's own ArtifactRow interface shape
interface ArtifactRow {
  artifact_id: string;
  artifact_type: string;
  name: string;
  url: string | null;
  is_restricted: boolean;
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

export function TechnicalView({ record, artifacts, next_actions }: Props) {
  return (
    <div id="technical-panel" role="tabpanel" aria-labelledby="technical-tab">
      {/* Trust banner always shown (F4.4) */}
      <TrustBanner
        maturity={record.maturity}
        reviewStatuses={record.review_statuses}
        lastReviewedDate={record.last_reviewed_date ? String(record.last_reviewed_date) : null}
        applicableDisclaimer={String(record.applicable_disclaimer ?? '')}
      />

      {/* F4.3 — Architecture findings */}
      <RecordSection id="tech-architecture" title="Architecture">
        {record.findings_architectural && (
          <p className="text-gray-700">{record.findings_architectural}</p>
        )}
        {record.findings_cloud_platform && (
          <p className="text-gray-700">
            <strong>Cloud / Platform:</strong> {record.findings_cloud_platform}
          </p>
        )}
      </RecordSection>

      {/* F4.3 — Tools and services used */}
      <RecordSection id="tech-tools" title="Tools and Services">
        {record.technologies_used && (
          <p className="text-gray-700">{record.technologies_used}</p>
        )}
        {record.methods_used && (
          <p className="text-gray-700">
            <strong>Methods:</strong> {record.methods_used}
          </p>
        )}
        {record.technology_areas.length > 0 && (
          <p className="text-gray-700">
            <strong>Technology areas:</strong> {record.technology_areas.join(', ')}
          </p>
        )}
      </RecordSection>

      {/* F4.3 — Security considerations */}
      <RecordSection id="tech-security" title="Security Considerations">
        {record.findings_security && (
          <p className="text-gray-700">{record.findings_security}</p>
        )}
      </RecordSection>

      {/* F4.3 — Known limitations */}
      <RecordSection id="tech-limitations" title="Known Limitations">
        {record.what_did_not_work && (
          <p className="text-gray-700">{record.what_did_not_work}</p>
        )}
        {record.findings_performance && (
          <p className="text-gray-700">
            <strong>Performance:</strong> {record.findings_performance}
          </p>
        )}
        {record.findings_testing && (
          <p className="text-gray-700">
            <strong>Testing:</strong> {record.findings_testing}
          </p>
        )}
      </RecordSection>

      {/* F4.3 — Production-readiness gaps */}
      <RecordSection id="tech-readiness" title="Production-Readiness Gaps">
        {record.production_readiness_gaps && (
          <p className="text-gray-700">{record.production_readiness_gaps}</p>
        )}
        {record.not_ready_for && (
          <p className="text-gray-700">
            <strong>Not ready for:</strong> {record.not_ready_for}
          </p>
        )}
      </RecordSection>

      {/* F4.3 — Reuse guidance */}
      <RecordSection id="tech-reuse" title="Reuse Guidance">
        {record.what_can_be_reused && (
          <p className="text-gray-700">
            <strong>What can be reused:</strong> {record.what_can_be_reused}
          </p>
        )}
        {record.what_should_be_adapted && (
          <p className="text-gray-700">
            <strong>What to adapt:</strong> {record.what_should_be_adapted}
          </p>
        )}
        {record.what_not_to_copy && (
          <p className="text-gray-700">
            <strong>What not to copy:</strong> {record.what_not_to_copy}
          </p>
        )}
        {record.environment_assumptions && (
          <p className="text-gray-700">
            <strong>Environment assumptions:</strong> {record.environment_assumptions}
          </p>
        )}
        {record.required_skills && (
          <p className="text-gray-700">
            <strong>Required skills:</strong> {record.required_skills}
          </p>
        )}
        {record.required_services && (
          <p className="text-gray-700">
            <strong>Required services / dependencies:</strong> {record.required_services}
          </p>
        )}
      </RecordSection>

      {/* F4.3 — Authoritative source artifacts (SEC-04 via ArtifactList) */}
      <RecordSection id="tech-artifacts" title="Authoritative Source Artifacts">
        <ArtifactList artifacts={artifacts} />
      </RecordSection>

      {/* F4.3 — Technical contact and next steps */}
      <RecordSection id="tech-next" title="Technical Contact and Next Steps">
        <NextActionCTAs actions={next_actions} record={record} />
      </RecordSection>
    </div>
  );
}
