/**
 * Development seed script — idempotent fixture records for catalog testing.
 *
 * Produces 2 published innovation records with different maturities, review
 * statuses, and engagement indicators for F1.1–F1.6 development testing.
 *
 * Uses ON CONFLICT (slug) DO NOTHING for full idempotency.
 * Safe to run multiple times; compose volumes persist across restarts.
 *
 * Run via: node --import tsx/esm src/lib/db/seed.ts
 * Or inside Docker: npm run db:seed
 */

import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Placeholder system UUID used as created_by / updated_by for seed records
const SYSTEM_UUID = '00000000-0000-0000-0000-000000000001';

async function seed() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // ─── Seed Record 1: Audio Security POC ─────────────────────────────────
    // experiment_poc maturity, technically + security reviewed, demo_available
    // Uses ON CONFLICT DO UPDATE to ensure plan-03 fields (findings, maturity readiness)
    // are populated even when the record already exists in the persisted compose volume.
    await client.query(`
      INSERT INTO innovation_records (
        slug,
        publication_state,
        created_by,
        updated_by,
        published_at,
        title,
        summary,
        problem_statement,
        affected_users,
        why_experimentation,
        hypothesis_or_objective,
        scope_description,
        technologies_used,
        outcome_summary,
        what_worked,
        what_did_not_work,
        uncertainty_reduced,
        source_basis,
        findings_architectural,
        findings_security,
        findings_performance,
        technology_areas,
        mission_areas,
        problem_type_tags,
        tags,
        maturity,
        review_statuses,
        ready_for,
        not_ready_for,
        next_stage_requirements,
        contributing_offices,
        contributor_names,
        ir_contribution,
        engagement_indicator,
        last_reviewed_date,
        owner_steward,
        attribution_statement,
        applicable_disclaimer,
        reuse_potential,
        what_can_be_reused,
        what_should_be_adapted,
        production_readiness_gaps,
        next_action_description
      )
      VALUES (
        'audio-security-poc-2024',
        'published',
        $1, $1,
        now(),
        'Audio Security POC: Defense-in-Depth for Judiciary Courtroom Audio',
        'Evaluated GPU/CPU separation and Azure Government Cloud constraints for securing courtroom audio streams, identifying key production-readiness gaps and architecture recommendations.',
        'Judiciary courtroom audio systems lack defense-in-depth security controls, creating potential vectors for unauthorized recording or interception of sensitive in-camera proceedings.',
        'Court IT administrators and judicial security officers responsible for courtroom A/V infrastructure.',
        'Existing commercial courtroom audio systems lack government-grade encryption and network isolation controls; experimentation was needed to establish feasibility before committing to full deployment.',
        'GPU/CPU workload separation combined with Azure Government Cloud network isolation will provide sufficient defense-in-depth for courtroom audio security without unacceptable latency penalties.',
        'POC evaluated GPU/CPU separation on Azure Government Cloud for 3 representative courtroom audio configurations over 6 weeks.',
        'Azure Government Cloud (FedRAMP High), GPU-accelerated audio processing, Azure Private Link, Azure Defender for IoT',
        'GPU/CPU separation is technically viable and reduces attack surface; Azure Government Cloud meets FedRAMP High requirements but introduces 80–120ms latency overhead that requires architectural mitigation. Three production-readiness gaps remain: end-to-end encryption key management, audit logging for audio access events, and performance testing under peak concurrent load.',
        'GPU/CPU separation reduced attack surface by eliminating shared memory access between audio processing and general compute workloads. Azure Government Cloud FedRAMP High certification satisfies baseline compliance requirements.',
        'Azure Government Cloud introduced 80–120ms latency overhead above on-premises baseline. Real-time audio compression required additional GPU memory not accounted for in initial sizing.',
        'Demonstrated that GPU/CPU workload isolation is architecturally feasible for courtroom audio; reduced uncertainty about Azure Government Cloud compliance posture.',
        'TSIO I&R internal POC — internal evaluation only; not cleared for external distribution',
        'GPU/CPU isolation eliminates shared-memory attack vector; Azure Private Link prevents public internet exposure of audio streams; network segmentation architecture is reusable across courtroom A/V systems.',
        'Azure Government Cloud FedRAMP High certification satisfies baseline for sensitive court operations; end-to-end encryption key management requires court-specific PKI integration before production use.',
        'GPU memory must be sized at 1.5x the baseline estimate when real-time compression is enabled; latency budget must account for Azure Government regional routing overhead.',
        ARRAY['security', 'cloud', 'infrastructure'],
        ARRAY['court_operations', 'it_modernization'],
        ARRAY['security_risk', 'technology_evaluation'],
        ARRAY['audio', 'azure-government', 'gpu', 'defense-in-depth', 'poc'],
        'experiment_poc',
        ARRAY['technically_reviewed', 'security_reviewed'],
        'Proof-of-concept evaluation in a representative courtroom environment with controlled audio scenarios.',
        'Production deployment without resolving the three identified gaps: key management, audit logging, and peak-load performance validation.',
        'Requires end-to-end encryption key management integration with court PKI, audit logging for audio access events, and performance testing under peak concurrent load (target: 50 simultaneous courtrooms).',
        ARRAY['TSIO Innovation & Research'],
        ARRAY['I&R Engineering Team'],
        'I&R provided cloud architecture expertise, security review, and Azure Government Cloud evaluation environment.',
        'demo_available',
        '2024-11-15',
        'TSIO Innovation & Research',
        'Original research conducted by TSIO I&R Engineering Team. Audio architecture developed in collaboration with AO IT Security.',
        'This record documents a proof-of-concept evaluation. Results represent findings under controlled conditions and do not constitute an endorsement or approval for production deployment. Local review and validation is required before any adoption.',
        'moderate',
        'Azure Government Cloud network isolation configuration, GPU/CPU separation architecture pattern',
        'End-to-end encryption key management must be adapted to court-specific PKI; latency mitigation strategy must be validated against specific courtroom acoustic requirements',
        'Missing: end-to-end encryption key management (court PKI integration), audit logging for audio access events, peak-load performance validation (50+ simultaneous courtrooms).',
        'Contact I&R to discuss production readiness gaps or request a demonstration of the POC environment.'
      )
      ON CONFLICT (slug) DO UPDATE SET
        affected_users = EXCLUDED.affected_users,
        why_experimentation = EXCLUDED.why_experimentation,
        scope_description = EXCLUDED.scope_description,
        technologies_used = EXCLUDED.technologies_used,
        what_worked = EXCLUDED.what_worked,
        what_did_not_work = EXCLUDED.what_did_not_work,
        uncertainty_reduced = EXCLUDED.uncertainty_reduced,
        findings_architectural = EXCLUDED.findings_architectural,
        findings_security = EXCLUDED.findings_security,
        findings_performance = EXCLUDED.findings_performance,
        ready_for = EXCLUDED.ready_for,
        not_ready_for = EXCLUDED.not_ready_for,
        next_stage_requirements = EXCLUDED.next_stage_requirements,
        ir_contribution = EXCLUDED.ir_contribution,
        production_readiness_gaps = EXCLUDED.production_readiness_gaps,
        next_action_description = EXCLUDED.next_action_description
    `, [SYSTEM_UUID]);

    // ─── Seed Record 2: NLP Docket Analytics Pilot ─────────────────────────
    // prototype_pilot maturity, curated_for_completeness reviewed, seeking_adoption_partner
    await client.query(`
      INSERT INTO innovation_records (
        slug,
        publication_state,
        created_by,
        updated_by,
        published_at,
        title,
        summary,
        problem_statement,
        hypothesis_or_objective,
        outcome_summary,
        source_basis,
        technology_areas,
        mission_areas,
        problem_type_tags,
        tags,
        maturity,
        review_statuses,
        contributing_offices,
        contributor_names,
        engagement_indicator,
        last_reviewed_date,
        owner_steward,
        attribution_statement,
        applicable_disclaimer,
        reuse_potential,
        what_can_be_reused,
        what_should_be_adapted
      )
      VALUES (
        'nlp-docket-analytics-pilot-2024',
        'published',
        $1, $1,
        now(),
        'NLP Docket Analytics Pilot: Automated Case Complexity Classification',
        'Natural language processing pilot that classifies docket entries by case complexity and flags anomalies, enabling district courts to prioritize workload planning without manual review of thousands of entries.',
        'District court case managers spend significant time manually reviewing dockets to identify complex or anomalous cases requiring judicial attention, creating a bottleneck during high-volume periods.',
        'Fine-tuned NLP models trained on anonymized docket metadata will classify case complexity with sufficient accuracy (≥85% F1) to reduce manual review burden by 40% or more.',
        'Pilot achieved 87% F1 score on complexity classification across 3 district courts using anonymized docket data. Anomaly flagging reduced manual queue review time by 44% in a 90-day pilot. Model requires retraining on local docket vocabulary to maintain performance; central model generalizes poorly across districts with different filing cultures.',
        'District Court IT Office / TSIO I&R collaborative pilot — data use governed by MOU; results cleared for I&R internal sharing',
        ARRAY['data', 'user_experience', 'ai_ml'],
        ARRAY['case_management', 'workload_management'],
        ARRAY['workflow_friction', 'data_driven_decision'],
        ARRAY['nlp', 'machine-learning', 'docket', 'case-management', 'pilot'],
        'prototype_pilot',
        ARRAY['curated_for_completeness'],
        ARRAY['TSIO Innovation & Research', 'District Court IT Office'],
        ARRAY['I&R Data Science Team', 'Northern District Case Management'],
        'seeking_adoption_partner',
        '2024-10-03',
        'TSIO Innovation & Research',
        'Pilot conducted jointly by TSIO I&R Data Science Team and Northern District Case Management Office. Docket data use governed by MOU #AO-2024-017.',
        'This record documents a prototype pilot. Classification accuracy figures are from a controlled pilot environment and may vary in other courts. This record does not constitute approval for production use. Courts considering adoption must conduct independent validation and obtain appropriate approvals.',
        'high',
        'NLP classification pipeline architecture, fine-tuning methodology and training data schema, anomaly detection thresholds',
        'Model must be retrained on each adopting court''s docket vocabulary; data governance MOU must be updated for new participants; deployment infrastructure must match court IT constraints'
      )
      ON CONFLICT (slug) DO NOTHING
    `, [SYSTEM_UUID]);

    await client.query('COMMIT');

    // Verify what was seeded
    const result = await client.query(`
      SELECT slug, publication_state, maturity, engagement_indicator, array_length(review_statuses, 1) AS review_count
      FROM innovation_records
      WHERE publication_state = 'published'
      ORDER BY last_reviewed_date DESC
    `);

    console.log(`[seed] Seeded ${result.rows.length} published innovation records:`);
    for (const row of result.rows) {
      console.log(`  - ${row.slug}: maturity=${row.maturity}, engagement=${row.engagement_indicator}, reviews=${row.review_count}`);
    }

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[seed] Error during seed:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((err) => {
  console.error('[seed] Fatal error:', err);
  process.exit(1);
});
