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
        'Judiciary courtroom audio systems lack defense-in-depth security controls, failing to protect sensitive in-camera proceedings from unauthorized recording or interception.',
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
        problem_statement = EXCLUDED.problem_statement,
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

    // ─── Seed Record 3: Audio Security POC — F5 full content model ─────────
    // slug: audio-security-poc (canonical F5 record exercising all findings dimensions)
    // Upsert: ON CONFLICT (slug) DO UPDATE enriches data on each seed run (idempotent).
    // source_basis is a plain-text reference (internal doc, not a URL) — exercises
    // SourceBasisBanner's plain-text rendering path (F5.1, F5.4).
    await client.query(`
      INSERT INTO innovation_records (
        id, slug, publication_state,
        created_by, updated_by,
        title, summary, problem_statement,
        affected_users, current_workflow, why_experimentation,
        mission_areas, problem_type_tags,
        hypothesis_or_objective, scope_description,
        technology_areas, technologies_used,
        outcome_summary, what_worked, what_did_not_work,
        uncertainty_reduced, decision_enabled, evidence_summary,
        source_basis,
        findings_architectural, findings_security, findings_cloud_platform,
        findings_performance, findings_testing, findings_operational,
        findings_data,
        maturity, review_statuses,
        ready_for, not_ready_for, next_stage_requirements,
        last_reviewed_date, next_review_date,
        reuse_potential,
        what_can_be_reused, what_should_be_adapted, what_not_to_copy,
        environment_assumptions, required_skills, required_services,
        production_readiness_gaps,
        engagement_indicator,
        contributing_offices, contributor_names, ir_contribution,
        owner_steward, owner_contact,
        attribution_statement, applicable_disclaimer,
        tags
      ) VALUES (
        gen_random_uuid(),
        'audio-security-poc',
        'published',
        '00000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000001',
        'Audio Security in Courtroom Environments — POC',
        'A proof of concept exploring defense-in-depth approaches to courtroom audio security, demonstrating GPU/CPU service separation on Azure Government Cloud.',
        'Courtroom audio systems must protect privileged communications while remaining accessible for proceedings. Existing configurations lack defense-in-depth controls appropriate for sensitive judicial proceedings, creating risk of unauthorized audio access.',
        'Court clerks, judges, court security officers, and IT administrators managing courtroom AV systems.',
        'Audio systems are currently configured with flat network access and limited access controls. Audio capture and processing share compute resources with general court applications.',
        'A POC was appropriate to evaluate whether GPU/CPU service separation and defense-in-depth audio controls are technically feasible in an Azure Government Cloud environment before committing to a production deployment.',
        ARRAY['Court Operations', 'Security'],
        ARRAY['Audio Security', 'Cloud Infrastructure'],
        'A defense-in-depth courtroom audio architecture with separated GPU/CPU services on Azure Government Cloud would provide meaningful security improvement over the current configuration while remaining operationally feasible.',
        'Azure Government Cloud deployment with two courtrooms. Did not include integration with existing case management systems. Limited to audio capture and processing — video was out of scope.',
        ARRAY['Cloud', 'Security', 'AI/ML'],
        'Azure Government Cloud (Azure Cognitive Services for transcription), GPU-accelerated audio processing nodes, CPU-only management plane, Azure Key Vault for secrets management, Azure Monitor for observability.',
        'The POC successfully demonstrated GPU/CPU service separation on Azure Government Cloud. Real-time audio processing latency remained under 200ms for a single courtroom stream. Defense-in-depth controls (network isolation, managed identities, Key Vault integration) functioned as designed in the Government Cloud environment.',
        'GPU/CPU separation is technically feasible in Azure Government Cloud. Managed identities eliminate the need for long-lived credentials. Network isolation between audio processing and general court systems is achievable with Azure VNet segmentation.',
        'Multi-stream processing exceeded GPU capacity at 3+ simultaneous courtroom feeds. Azure Government Cloud GPU availability varies by region and must be confirmed before production planning. Infrastructure state management (Bicep) requires additional maturity for operational handoff.',
        'The POC reduced uncertainty about whether defense-in-depth audio controls are feasible in Azure Government Cloud. The feasibility decision is now evidence-based.',
        'The POC evidence supports a go/no-go decision on whether to invest in a production architecture design for courtroom audio security on Azure Government Cloud.',
        'Defense-in-depth courtroom audio architecture is technically feasible in Azure Government Cloud with GPU/CPU service separation. Latency is acceptable for a single courtroom stream.',
        'Lessons Learned Report: Audio Security POC — TSIO Innovation & Research, 2026. Contact I&R for access to the full report.',
        'Defense-in-depth architecture with GPU/CPU service separation is viable. Network isolation between audio processing and general court systems should be implemented from the start, not retrofitted. Azure VNet segmentation with Azure Firewall provides sufficient isolation for the POC scope.',
        'Managed identity eliminates credential risk for GPU-to-storage communication. Key Vault integration adds ~50ms latency per secret retrieval — cache secrets in-process. Network flow logs must be enabled for SEC-07 compliance. Audio data must not leave the Government Cloud boundary during processing.',
        'Azure Government Cloud GPU availability varies by region. Infrastructure Bicep templates were functional but not idempotent — required manual state reconciliation after failed deployments. Multi-region deployment was not tested.',
        'Processing 3+ simultaneous courtroom audio streams exceeded the test GPU SKU capacity. Real-time latency for a single stream: <200ms. Batch processing for transcript review: acceptable. Production would require capacity planning per-courthouse.',
        'Unit testing covered audio processing logic. Integration testing was limited — courtroom audio hardware was not available in the test environment. Simulated audio streams were used, which may not capture real-world noise characteristics.',
        'Operational runbooks do not exist. Monitoring was ad-hoc (Azure Monitor dashboards, no alerting). Incident response for GPU node failure was not tested.',
        'Audio data was not persisted beyond the POC test window. A production system would require data classification, retention policy, and deletion controls consistent with Judiciary data governance.',
        'experiment_poc',
        ARRAY['technically_reviewed', 'security_reviewed'],
        'Feasibility evaluation for production architecture design; technical due diligence for procurement decisions; reference architecture for audio security in Government Cloud environments.',
        'Production deployment; multi-courthouse scale without additional capacity planning; systems requiring real-time processing of 3+ simultaneous streams on the tested GPU SKU; environments where Azure Government Cloud GPU availability cannot be confirmed.',
        'Complete production architecture design; capacity planning per courthouse; operational runbooks; integration testing with real courtroom hardware; data governance and retention policy design; security assessment of the full production design.',
        CURRENT_DATE,
        CURRENT_DATE + INTERVAL '1 year',
        'high',
        'Defense-in-depth network isolation pattern (Azure VNet segmentation with Azure Firewall). Managed identity pattern for GPU-to-storage communication. GPU/CPU service separation architecture.',
        'The architecture should be adapted for production-scale capacity (GPU SKU selection must be right-sized per courthouse). State management tooling (Bicep) needs maturity before operational handoff.',
        'Do not copy the Bicep infrastructure templates directly — they were not idempotent and require revision before production use.',
        'Assumes Azure Government Cloud with available GPU quota in the target region. Assumes network segmentation authority to create VNets and configure Azure Firewall rules. Assumes managed identity is approved for the production workload.',
        'Azure cloud architecture, Bicep/ARM infrastructure as code, Azure networking and security services, audio processing fundamentals.',
        'Azure Government Cloud subscription with GPU quota, Azure Cognitive Services (Government), Azure Key Vault, Azure Monitor.',
        'GPU capacity planning for target courthouse count; operational runbook development; integration testing with real courtroom AV hardware; data governance policy for audio data; full security assessment of production design.',
        'demo_available',
        ARRAY['TSIO Innovation & Research'],
        ARRAY['TSIO I&R Technical Team'],
        'TSIO I&R designed and executed the POC, authored the lessons-learned report, and maintains the reference architecture.',
        'TSIO Innovation & Research',
        'AOml_TSO_IRB_Team@ao.uscourts.gov',
        'Work product of TSIO Innovation & Research, Administrative Office of US Courts. POC executed 2025-2026. Contributing team: TSIO I&R Technical Team.',
        'This record describes a Proof of Concept (POC). POC status does not indicate production readiness. The Hub presents the findings for discovery and reuse evaluation — it does not constitute technical approval, security clearance, or endorsement for production adoption without independent review.',
        ARRAY['audio security', 'courtroom', 'Azure Government Cloud', 'GPU', 'defense in depth', 'managed identity', 'network isolation']
      )
      ON CONFLICT (slug) DO UPDATE SET
        summary = EXCLUDED.summary,
        problem_statement = EXCLUDED.problem_statement,
        affected_users = EXCLUDED.affected_users,
        source_basis = EXCLUDED.source_basis,
        findings_architectural = EXCLUDED.findings_architectural,
        findings_security = EXCLUDED.findings_security,
        findings_cloud_platform = EXCLUDED.findings_cloud_platform,
        findings_performance = EXCLUDED.findings_performance,
        findings_testing = EXCLUDED.findings_testing,
        findings_operational = EXCLUDED.findings_operational,
        findings_data = EXCLUDED.findings_data,
        maturity = EXCLUDED.maturity,
        review_statuses = EXCLUDED.review_statuses,
        ready_for = EXCLUDED.ready_for,
        not_ready_for = EXCLUDED.not_ready_for,
        next_stage_requirements = EXCLUDED.next_stage_requirements,
        last_reviewed_date = EXCLUDED.last_reviewed_date,
        reuse_potential = EXCLUDED.reuse_potential,
        what_can_be_reused = EXCLUDED.what_can_be_reused,
        what_should_be_adapted = EXCLUDED.what_should_be_adapted,
        what_not_to_copy = EXCLUDED.what_not_to_copy,
        environment_assumptions = EXCLUDED.environment_assumptions,
        required_skills = EXCLUDED.required_skills,
        required_services = EXCLUDED.required_services,
        production_readiness_gaps = EXCLUDED.production_readiness_gaps,
        engagement_indicator = EXCLUDED.engagement_indicator,
        applicable_disclaimer = EXCLUDED.applicable_disclaimer,
        tags = EXCLUDED.tags,
        updated_by = EXCLUDED.updated_by
    `);

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
