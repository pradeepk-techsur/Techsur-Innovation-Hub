/**
 * /records/[slug] — SSR Innovation Record Detail Page
 *
 * Displays all nine content sections for a published innovation record:
 *   F3.1 — Problem and Context
 *   F3.2 — What Was Explored
 *   F3.3 — Outcome and Evidence
 *   F3.4 — Key Findings
 *   F3.5 — Maturity and Readiness
 *   F3.6 — Reuse Guidance
 *   F3.7 — Ownership and Attribution
 *   F3.8 — Authoritative Artifacts (SEC-04: restricted URLs are null)
 *   F3.9 — Next Action CTAs
 *
 * Auth: AUTH-01 — anonymous access (no login required for Phase 1).
 * Security: Uses getRecordBySlug() which filters publication_state='published'.
 *   Draft records → notFound() → 404. No dangerouslySetInnerHTML — all values JSX-escaped (T-01-03-03).
 */

import { notFound } from 'next/navigation';
import { getRecordBySlug } from '@/lib/repositories/innovation-records.repository';
import { TrustBanner } from './TrustBanner';
import { RecordSection } from './RecordSection';
import { ArtifactList } from './ArtifactList';
import { NextActionCTAs } from './NextActionCTAs';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function RecordDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const result = await getRecordBySlug(slug);
  if (!result) notFound();

  const { record, artifacts, next_actions } = result;

  return (
    <main id="main-content">
      <article aria-label={`Innovation record: ${record.title}`} className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-2">
          <h1 className="text-2xl font-bold text-gray-900">{record.title}</h1>
          {record.summary && (
            <p className="mt-2 text-lg text-gray-600">{record.summary}</p>
          )}

          {/* Trust signals — prominent, above the fold (F3.5, SEC-11) */}
          {/* Note: node-postgres returns DATE columns as strings, but guard with String() for safety */}
          <TrustBanner
            maturity={record.maturity}
            reviewStatuses={record.review_statuses}
            lastReviewedDate={record.last_reviewed_date ? String(record.last_reviewed_date) : null}
            applicableDisclaimer={String(record.applicable_disclaimer ?? '')}
          />
        </header>

        {/* F3.1 — Problem and Context */}
        <RecordSection id="problem-context" title="Problem and Context">
          {record.problem_statement && (
            <div>
              <h3 className="font-semibold text-gray-800">The Problem</h3>
              <p className="mt-1 text-gray-700">{record.problem_statement}</p>
            </div>
          )}
          {record.affected_users && (
            <div>
              <h3 className="font-semibold text-gray-800">Who Is Affected</h3>
              <p className="mt-1 text-gray-700">{record.affected_users}</p>
            </div>
          )}
          {record.current_workflow && (
            <div>
              <h3 className="font-semibold text-gray-800">Current Workflow</h3>
              <p className="mt-1 text-gray-700">{record.current_workflow}</p>
            </div>
          )}
          {record.why_experimentation && (
            <div>
              <h3 className="font-semibold text-gray-800">Why Experimentation Was Appropriate</h3>
              <p className="mt-1 text-gray-700">{record.why_experimentation}</p>
            </div>
          )}
          {record.mission_areas.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-800">Mission Areas</h3>
              <ul className="mt-1 list-disc list-inside text-gray-700">
                {record.mission_areas.map(a => <li key={a}>{a}</li>)}
              </ul>
            </div>
          )}
        </RecordSection>

        {/* F3.2 — What Was Explored */}
        <RecordSection id="what-explored" title="What Was Explored">
          {record.hypothesis_or_objective && (
            <div>
              <h3 className="font-semibold text-gray-800">Hypothesis / Objective</h3>
              <p className="mt-1 text-gray-700">{record.hypothesis_or_objective}</p>
            </div>
          )}
          {record.scope_description && (
            <div>
              <h3 className="font-semibold text-gray-800">Scope</h3>
              <p className="mt-1 text-gray-700">{record.scope_description}</p>
            </div>
          )}
          {record.technologies_used && (
            <div>
              <h3 className="font-semibold text-gray-800">Technologies Used</h3>
              <p className="mt-1 text-gray-700">{record.technologies_used}</p>
            </div>
          )}
          {record.technology_areas.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-800">Technology Areas</h3>
              <ul className="mt-1 list-disc list-inside text-gray-700">
                {record.technology_areas.map(a => <li key={a}>{a}</li>)}
              </ul>
            </div>
          )}
        </RecordSection>

        {/* F3.3 — Outcome and Evidence */}
        <RecordSection id="outcome-evidence" title="Outcome and Evidence">
          {record.outcome_summary && (
            <div>
              <h3 className="font-semibold text-gray-800">What Was Demonstrated</h3>
              <p className="mt-1 text-gray-700">{record.outcome_summary}</p>
            </div>
          )}
          {record.what_worked && (
            <div>
              <h3 className="font-semibold text-gray-800">What Worked</h3>
              <p className="mt-1 text-gray-700">{record.what_worked}</p>
            </div>
          )}
          {record.what_did_not_work && (
            <div>
              <h3 className="font-semibold text-gray-800">What Did Not Work</h3>
              <p className="mt-1 text-gray-700">{record.what_did_not_work}</p>
            </div>
          )}
          {record.uncertainty_reduced && (
            <div>
              <h3 className="font-semibold text-gray-800">Uncertainty Reduced</h3>
              <p className="mt-1 text-gray-700">{record.uncertainty_reduced}</p>
            </div>
          )}
          {record.decision_enabled && (
            <div>
              <h3 className="font-semibold text-gray-800">Decision Enabled</h3>
              <p className="mt-1 text-gray-700">{record.decision_enabled}</p>
            </div>
          )}
          {record.source_basis && (
            <div>
              <h3 className="font-semibold text-gray-800">Source Basis</h3>
              <p className="mt-1 text-gray-700">{record.source_basis}</p>
            </div>
          )}
        </RecordSection>

        {/* F3.4 — Key Findings */}
        <RecordSection id="key-findings" title="Key Findings">
          {[
            { label: 'Architectural', value: record.findings_architectural },
            { label: 'Security', value: record.findings_security },
            { label: 'Cloud / Platform', value: record.findings_cloud_platform },
            { label: 'Performance', value: record.findings_performance },
            { label: 'User Experience', value: record.findings_ux },
            { label: 'Data', value: record.findings_data },
            { label: 'Testing', value: record.findings_testing },
            { label: 'Operational', value: record.findings_operational },
            { label: 'Cost', value: record.findings_cost },
            { label: 'Scalability', value: record.findings_scalability },
            { label: 'Other', value: record.findings_other },
          ].filter(f => f.value).map(f => (
            <div key={f.label}>
              <h3 className="font-semibold text-gray-800">{f.label} Findings</h3>
              <p className="mt-1 text-gray-700">{f.value}</p>
            </div>
          ))}
        </RecordSection>

        {/* F3.5 — Maturity and Readiness */}
        <RecordSection id="maturity-readiness" title="Maturity and Readiness">
          {record.ready_for && (
            <div>
              <h3 className="font-semibold text-gray-800">Ready For</h3>
              <p className="mt-1 text-gray-700">{record.ready_for}</p>
            </div>
          )}
          {record.not_ready_for && (
            <div>
              <h3 className="font-semibold text-gray-800">Not Ready For</h3>
              <p className="mt-1 text-gray-700">{record.not_ready_for}</p>
            </div>
          )}
          {record.next_stage_requirements && (
            <div>
              <h3 className="font-semibold text-gray-800">Requirements for Next Stage</h3>
              <p className="mt-1 text-gray-700">{record.next_stage_requirements}</p>
            </div>
          )}
        </RecordSection>

        {/* F3.6 — Reuse Guidance */}
        <RecordSection id="reuse-guidance" title="Reuse Guidance">
          {record.what_can_be_reused && (
            <div>
              <h3 className="font-semibold text-gray-800">What Can Be Reused</h3>
              <p className="mt-1 text-gray-700">{record.what_can_be_reused}</p>
            </div>
          )}
          {record.what_should_be_adapted && (
            <div>
              <h3 className="font-semibold text-gray-800">What Should Be Adapted</h3>
              <p className="mt-1 text-gray-700">{record.what_should_be_adapted}</p>
            </div>
          )}
          {record.what_not_to_copy && (
            <div>
              <h3 className="font-semibold text-gray-800">What Not to Copy Directly</h3>
              <p className="mt-1 text-gray-700">{record.what_not_to_copy}</p>
            </div>
          )}
          {record.environment_assumptions && (
            <div>
              <h3 className="font-semibold text-gray-800">Environment Assumptions</h3>
              <p className="mt-1 text-gray-700">{record.environment_assumptions}</p>
            </div>
          )}
          {record.production_readiness_gaps && (
            <div>
              <h3 className="font-semibold text-gray-800">Production Readiness Gaps</h3>
              <p className="mt-1 text-gray-700">{record.production_readiness_gaps}</p>
            </div>
          )}
        </RecordSection>

        {/* F3.7 — Ownership and Attribution */}
        <RecordSection id="ownership-attribution" title="Ownership and Attribution">
          {record.contributing_offices.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-800">Contributing Offices</h3>
              <ul className="mt-1 list-disc list-inside text-gray-700">
                {record.contributing_offices.map(o => <li key={o}>{o}</li>)}
              </ul>
            </div>
          )}
          {record.contributor_names.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-800">Contributors</h3>
              <ul className="mt-1 list-disc list-inside text-gray-700">
                {record.contributor_names.map(c => <li key={c}>{c}</li>)}
              </ul>
            </div>
          )}
          {record.ir_contribution && (
            <div>
              <h3 className="font-semibold text-gray-800">I&amp;R Contribution</h3>
              <p className="mt-1 text-gray-700">{record.ir_contribution}</p>
            </div>
          )}
          {record.owner_steward && (
            <div>
              <h3 className="font-semibold text-gray-800">Current Owner / Steward</h3>
              <p className="mt-1 text-gray-700">{record.owner_steward}</p>
            </div>
          )}
          {record.attribution_statement && (
            <div>
              <h3 className="font-semibold text-gray-800">Attribution</h3>
              <p className="mt-1 text-gray-700">{record.attribution_statement}</p>
            </div>
          )}
        </RecordSection>

        {/* F3.8 — Authoritative Artifacts (SEC-04: restricted URLs are null) */}
        <RecordSection id="artifacts" title="Authoritative Artifacts">
          <ArtifactList artifacts={artifacts} />
        </RecordSection>

        {/* F3.9 — Next Action */}
        <RecordSection id="next-action" title="Next Action">
          {record.next_action_description && (
            <p className="text-gray-700">{record.next_action_description}</p>
          )}
          <NextActionCTAs actions={next_actions} record={record} />
        </RecordSection>
      </article>
    </main>
  );
}
