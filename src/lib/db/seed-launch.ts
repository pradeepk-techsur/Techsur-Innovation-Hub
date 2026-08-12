/**
 * Launch content seed — 8 publication-gate-compliant innovation records.
 *
 * Covers all required SEED dimensions:
 *   SEED-01: ≥8 published/archived records
 *   SEED-02: ≥3 distinct mission areas
 *   SEED-03: ≥4 distinct technology areas
 *   SEED-04: All 6 maturity levels
 *   SEED-05: ≥3 distinct review statuses
 *   SEED-06: ≥2 distinct contributing offices
 *   SEED-07: Technical reuse example with artifact links
 *   SEED-08: Executive decision-support record
 *   SEED-09: Record seeking adopter/collaborator
 *   SEED-10: Archived/retired record
 *   SEED-11: All 15 publication gate checks satisfied
 *   SEED-12: Audio Security POC retained as technical reuse example
 *
 * Idempotent — uses ON CONFLICT (slug) DO NOTHING (or DO UPDATE where enrichment needed).
 * Run via: npm run db:seed-launch
 */

import { Pool } from 'pg';

const SYSTEM_ACTOR_ID = '00000000-0000-0000-0000-000000000001';

export async function seedLaunchContent(): Promise<void> {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    console.log('[seed-launch] Seeding 8 launch content records...');

    // ─── Record 1: Audio Security POC (SEED-07, SEED-12) ─────────────────────
    // Primary technical reuse example. ON CONFLICT DO UPDATE to ensure
    // gate-compliant fields are populated even when record exists.
    await pool.query(`
      INSERT INTO innovation_records (
        id, slug, publication_state,
        created_by, updated_by,
        title, summary, problem_statement,
        affected_users, current_workflow, why_experimentation,
        mission_areas, problem_type_tags,
        hypothesis_or_objective, scope_description,
        technology_areas, technologies_used,
        outcome_summary, what_worked, what_did_not_work,
        uncertainty_reduced, decision_enabled, source_basis,
        findings_architectural, findings_security, findings_cloud_platform,
        findings_performance, findings_testing, findings_operational,
        maturity, review_statuses,
        ready_for, not_ready_for, next_stage_requirements,
        last_reviewed_date, next_review_date,
        reuse_potential, what_can_be_reused, what_should_be_adapted, what_not_to_copy,
        environment_assumptions, required_skills, required_services,
        production_readiness_gaps,
        engagement_indicator,
        contributing_offices, contributor_names, ir_contribution,
        owner_steward, owner_contact,
        attribution_statement, applicable_disclaimer,
        tags
      ) VALUES (
        gen_random_uuid(), 'audio-security-poc', 'published',
        $1, $1,
        'Audio Security in Courtroom Environments — POC',
        'A proof of concept demonstrating defense-in-depth courtroom audio security with GPU/CPU service separation on Azure Government Cloud.',
        'Courtroom audio systems must protect privileged communications while remaining accessible. Existing configurations lack defense-in-depth controls, creating risk of unauthorized audio access during sensitive judicial proceedings.',
        'Court clerks, judges, court security officers, and IT administrators.',
        'Audio systems share compute resources with general court applications, with flat network access and limited access controls.',
        'A POC was appropriate to evaluate technical feasibility of GPU/CPU separation in Azure Government Cloud before committing to production.',
        ARRAY['Court Operations', 'Security'],
        ARRAY['Audio Security', 'Cloud Infrastructure'],
        'Defense-in-depth courtroom audio architecture with separated GPU/CPU services on Azure Government Cloud would provide meaningful security improvement while remaining operationally feasible.',
        'Azure Government Cloud deployment covering two courtrooms. Video was out of scope. Did not integrate with existing case management systems.',
        ARRAY['Cloud', 'Security'],
        'Azure Government Cloud (Cognitive Services), GPU-accelerated nodes, CPU management plane, Azure Key Vault, Azure Monitor.',
        'The POC successfully demonstrated GPU/CPU service separation. Real-time latency remained under 200ms for a single courtroom stream. Defense-in-depth controls functioned as designed in Government Cloud.',
        'GPU/CPU separation is technically feasible. Managed identities eliminate long-lived credentials. Network isolation is achievable with Azure VNet segmentation.',
        'Multi-stream processing exceeded GPU capacity at 3+ simultaneous feeds. Azure Government Cloud GPU availability varies by region.',
        'The POC reduced uncertainty about feasibility of defense-in-depth audio controls in Azure Government Cloud.',
        'Evidence supports a go/no-go decision on whether to invest in production architecture design.',
        'Lessons Learned Report: Audio Security POC — TSIO Innovation & Research, 2026. Contact I&R for access.',
        'Defense-in-depth architecture with GPU/CPU separation is viable. Network isolation should be designed in from the start, not retrofitted.',
        'Managed identity eliminates credential risk. Key Vault adds ~50ms latency per retrieval — cache in-process. Network flow logs must be enabled.',
        'Azure Government Cloud GPU availability varies by region. Infrastructure Bicep templates required manual state reconciliation after failed deployments.',
        'Processing 3+ simultaneous streams exceeded the test GPU SKU capacity. Single-stream latency acceptable for real-time use.',
        'Unit testing covered audio processing logic. Integration testing was limited — simulated audio streams used rather than real courtroom hardware.',
        'Operational runbooks do not exist. Monitoring was ad-hoc.',
        'experiment_poc', ARRAY['technically_reviewed', 'security_reviewed'],
        'Feasibility evaluation for production architecture; technical due diligence for procurement; reference for audio security in Government Cloud.',
        'Production deployment without additional capacity planning; 3+ simultaneous streams on tested GPU SKU; environments where GPU availability cannot be confirmed.',
        'Complete production architecture design; capacity planning per courthouse; operational runbooks; integration testing with real hardware; data governance policy.',
        CURRENT_DATE, CURRENT_DATE + INTERVAL '1 year',
        'high', 'Defense-in-depth network isolation pattern. Managed identity pattern for GPU-to-storage communication. GPU/CPU separation architecture.',
        'Architecture should be adapted for production-scale capacity.',
        'Do not copy Bicep templates directly — not idempotent, require revision.',
        'Assumes Azure Government Cloud with available GPU quota in target region.',
        'Azure cloud architecture, Bicep/ARM, Azure networking and security, audio processing.',
        'Azure Government Cloud subscription with GPU quota, Cognitive Services, Key Vault, Monitor.',
        'GPU capacity planning; operational runbook development; integration testing with real hardware; data governance policy.',
        'demo_available',
        ARRAY['TSIO Innovation & Research'], ARRAY['TSIO I&R Technical Team'], 'TSIO I&R designed and executed the POC.',
        'TSIO Innovation & Research', 'AOml_TSO_IRB_Team@ao.uscourts.gov',
        'Work product of TSIO Innovation & Research, Administrative Office of US Courts, 2025–2026.',
        'This record describes a Proof of Concept (POC). POC does not indicate production readiness. Independent review required before adoption.',
        ARRAY['audio security', 'courtroom', 'Azure Government Cloud', 'GPU', 'defense in depth', 'managed identity']
      )
      ON CONFLICT (slug) DO UPDATE SET
        publication_state = 'published',
        maturity = EXCLUDED.maturity,
        review_statuses = EXCLUDED.review_statuses,
        applicable_disclaimer = EXCLUDED.applicable_disclaimer,
        last_reviewed_date = EXCLUDED.last_reviewed_date,
        updated_by = EXCLUDED.updated_by
    `, [SYSTEM_ACTOR_ID]);
    console.log('[seed-launch] Record 1/8: audio-security-poc ✓');

    // ─── Record 2: AI Document Classification (SEED-08 executive, SEED-09 adopter) ──
    await pool.query(`
      INSERT INTO innovation_records (
        id, slug, publication_state, created_by, updated_by,
        title, summary, problem_statement,
        affected_users, current_workflow, why_experimentation,
        mission_areas, problem_type_tags, hypothesis_or_objective, scope_description,
        technology_areas, technologies_used,
        outcome_summary, what_worked, what_did_not_work, uncertainty_reduced, decision_enabled,
        source_basis, findings_architectural, findings_security, findings_data,
        maturity, review_statuses, ready_for, not_ready_for, next_stage_requirements,
        last_reviewed_date, reuse_potential, what_can_be_reused, what_should_be_adapted,
        environment_assumptions, production_readiness_gaps, engagement_indicator,
        contributing_offices, contributor_names, ir_contribution,
        owner_steward, attribution_statement, applicable_disclaimer, tags
      ) VALUES (
        gen_random_uuid(), 'ecf-ai-document-classification', 'published', $1, $1,
        'AI Document Classification for CM/ECF Filing',
        'A pilot exploring AI-assisted document classification to reduce manual triage burden for CM/ECF case filings across district courts.',
        'Court clerks manually review and classify thousands of incoming CM/ECF documents daily. Misclassification leads to rework, delays, and occasional case management errors.',
        'Court clerks, case managers, and docketing staff in district courts processing high-volume CM/ECF filings.',
        'Clerks manually review each incoming document, determine its type, and assign it to the correct case docket entry. Average 3–5 minutes per document for edge cases.',
        'The volume and variability of court documents made this an ideal candidate for ML-assisted classification as a targeted productivity tool.',
        ARRAY['Case Management', 'Court Operations'],
        ARRAY['Document Processing', 'AI Automation'],
        'An AI classification model trained on historical CM/ECF filings can correctly classify 85%+ of common document types, reducing manual review burden for routine filings.',
        'Tested on 18 months of historical filings from 3 district courts. Common document types only — complex motions and exhibits excluded from scope.',
        ARRAY['AI/ML', 'Data'],
        'Azure AI Document Intelligence, Python classification pipeline, PostgreSQL for training data management.',
        'The model achieved 89% classification accuracy on common document types in the test dataset. Rare document types remained difficult. Human-in-the-loop review for low-confidence predictions was accepted by clerk staff in user testing.',
        'High accuracy on common document types. Human-in-the-loop design was well-received. Training data pipeline is reusable across court jurisdictions.',
        'Accuracy dropped to 67% for complex motions and exhibits. Model requires retraining when new document types emerge. Data privacy review delayed the pilot by 6 weeks.',
        'Demonstrated that AI classification is technically feasible at court-relevant accuracy thresholds for common document types.',
        'Supports a decision about whether to invest in a production AI classification capability for high-volume district courts.',
        'Pilot report — AI Document Classification — TSIO I&R, 2026. Contact I&R for demonstration.',
        'Human-in-the-loop architecture prevents automated misclassification from reaching case records. Confidence scoring enables graceful fallback to manual review.',
        'Training data must be treated as court record data and handled per applicable data governance policies. Model outputs must not be treated as authoritative without human review.',
        'Training data pipeline architecture is reusable. Human-in-the-loop confidence threshold pattern is applicable to other AI-assisted court workflows.',
        'prototype_pilot', ARRAY['technically_reviewed'],
        'Pilot evaluation for high-volume district courts; training data and model pipeline for other AI classification problems.',
        'Fully automated case docketing without human review; courts with very low filing volume where AI investment is not cost-effective.',
        'Full production readiness assessment; security and data governance review; evaluation across additional court jurisdictions.',
        CURRENT_DATE, 'high',
        'Document classification model architecture. Human-in-the-loop confidence threshold pattern. Azure AI Document Intelligence integration patterns.',
        'The model must be retrained for each court jurisdiction''s filing patterns. Confidence thresholds should be tuned per court based on clerk capacity.',
        'Assumes access to 12+ months of labeled historical CM/ECF filings. Assumes Azure AI Document Intelligence is available in the deployment environment.',
        'Production security review; formal data governance policy for training data; performance benchmarking at production filing volumes.',
        'seeking_adoption_partner',
        ARRAY['TSIO Innovation & Research'], ARRAY['TSIO I&R Technical Team', 'AI Research Lead'],
        'TSIO I&R designed the classification pipeline and led the pilot evaluation.',
        'TSIO Innovation & Research', 'Work product of TSIO Innovation & Research, Administrative Office of US Courts, 2026.',
        'This record describes a Prototype / Pilot. Pilot results do not indicate production readiness or approval for deployment without independent review.',
        ARRAY['AI/ML', 'document classification', 'CM/ECF', 'court clerks', 'human-in-the-loop']
      )
      ON CONFLICT (slug) DO NOTHING
    `, [SYSTEM_ACTOR_ID]);
    console.log('[seed-launch] Record 2/8: ecf-ai-document-classification ✓');

    // ─── Record 3: Cloud Migration Reference Architecture (SEED-06 multi-office) ──
    await pool.query(`
      INSERT INTO innovation_records (
        id, slug, publication_state, created_by, updated_by,
        title, summary, problem_statement, affected_users, why_experimentation,
        mission_areas, problem_type_tags, hypothesis_or_objective,
        technology_areas, technologies_used,
        outcome_summary, what_worked, decision_enabled, source_basis,
        findings_architectural, findings_cloud_platform, findings_operational,
        maturity, review_statuses, ready_for, not_ready_for,
        last_reviewed_date, reuse_potential, what_can_be_reused, what_should_be_adapted,
        environment_assumptions, engagement_indicator,
        contributing_offices, contributor_names, ir_contribution,
        owner_steward, attribution_statement, applicable_disclaimer, tags
      ) VALUES (
        gen_random_uuid(), 'cloud-migration-reference-architecture', 'published', $1, $1,
        'Judiciary Cloud Migration Reference Architecture',
        'A validated reference architecture for migrating court applications to Azure Government Cloud, based on patterns derived from three successful district court migrations.',
        'District courts and AO offices face inconsistent, undocumented approaches to cloud migration, leading to repeated design decisions and increased risk.',
        'IT architects, cloud engineers, and project managers at district courts and AO offices planning cloud migrations.',
        'Three district courts independently migrated applications to Azure Government Cloud. Common patterns and decision points were extracted and documented as a reusable reference.',
        ARRAY['IT Modernization', 'Infrastructure'],
        ARRAY['Cloud Migration', 'Architecture Patterns'],
        'Common patterns from three district court cloud migrations can be codified into a reference architecture that reduces design time and risk for subsequent migrations.',
        ARRAY['Cloud', 'Infrastructure'],
        'Azure Government Cloud (App Service, Azure SQL, Azure Key Vault, Azure Active Directory), Bicep for infrastructure as code.',
        'Reference architecture documented from three production migrations. Covers network topology, identity and access patterns, secrets management, compliance boundaries, and operational monitoring.',
        'Network topology patterns, identity and access management templates, and secrets management patterns transferred directly to subsequent migrations with minimal adaptation.',
        'The reference architecture supports informed go/no-go decisions for new migration projects and reduces initial architecture design effort by an estimated 40–60%.',
        'Patterns synthesized from three production migrations by District Court IT teams, validated by TSIO I&R.',
        'Layered network topology with Hub-Spoke VNet pattern is directly reusable. Identity and access patterns using Azure AD Government groups reduce design risk. Bicep templates for standard workloads are reusable with configuration changes.',
        'Application-specific compliance requirements (e.g., case data classification) require per-migration review — the reference does not replace this assessment.',
        'Patterns should be adapted for each court''s existing on-premises infrastructure and compliance posture.',
        'production_validated', ARRAY['technically_reviewed', 'validated_for_reuse'],
        'New Judiciary cloud migration projects as a starting-point reference; reducing duplicated architecture decisions.',
        'Projects with non-standard compliance requirements that fall outside documented patterns.',
        CURRENT_DATE, 'high',
        'Hub-Spoke VNet topology, secrets management with Azure Key Vault, identity and access patterns using Azure AD Government groups, Bicep infrastructure templates.',
        'Pattern review required to confirm applicability for each migration scope and compliance context.',
        'Assumes Azure Government Cloud. Assumes Azure AD Government for identity. On-premises infrastructure connectivity requirements vary by court.',
        'reference_pattern_available',
        ARRAY['TSIO Innovation & Research', 'District Court IT Office'], ARRAY['TSIO I&R Technical Team', 'District Court IT Architects'],
        'TSIO I&R synthesized and documented the patterns from three court migrations.',
        'TSIO Innovation & Research', 'Patterns contributed by TSIO I&R and participating District Court IT teams. Work product of TSIO Innovation & Research, Administrative Office of US Courts.',
        'This record describes a Production / Validated Pattern derived from three live migrations. Validated for reuse does not eliminate per-project compliance and security review.',
        ARRAY['cloud migration', 'Azure Government Cloud', 'reference architecture', 'network topology', 'Bicep']
      )
      ON CONFLICT (slug) DO NOTHING
    `, [SYSTEM_ACTOR_ID]);
    console.log('[seed-launch] Record 3/8: cloud-migration-reference-architecture ✓');

    // ─── Record 4: Remote Proceedings UX Research (SEED-02, evaluated_idea) ──────
    await pool.query(`
      INSERT INTO innovation_records (
        id, slug, publication_state, created_by, updated_by,
        title, summary, problem_statement, affected_users, current_workflow, why_experimentation,
        mission_areas, problem_type_tags, hypothesis_or_objective,
        technology_areas, outcome_summary, what_worked, uncertainty_reduced, decision_enabled,
        source_basis, findings_ux,
        maturity, review_statuses, ready_for, not_ready_for,
        last_reviewed_date, reuse_potential, what_can_be_reused,
        environment_assumptions, engagement_indicator,
        contributing_offices, contributor_names, ir_contribution,
        owner_steward, attribution_statement, applicable_disclaimer, tags
      ) VALUES (
        gen_random_uuid(), 'remote-proceedings-ux-research', 'published', $1, $1,
        'Remote Proceedings Accessibility Research',
        'User research evaluating accessibility barriers in remote court proceedings for participants with disabilities, identifying priority improvements for AV systems and case management interfaces.',
        'Remote court proceedings conducted during and after the pandemic introduced accessibility barriers for participants who rely on screen readers, hearing aids, and assistive technologies.',
        'Litigants, attorneys, court reporters, and interpreters who rely on assistive technologies in remote proceedings.',
        'Remote proceedings use commercial video conferencing tools not designed for court-specific accessibility requirements. Participants with screen readers or hearing impairments face significant friction.',
        'User research was appropriate to identify and prioritize accessibility barriers before committing to technology investment.',
        ARRAY['Accessibility', 'Court Operations'],
        ARRAY['Accessibility', 'User Research', 'Remote Proceedings'],
        'Structured user research with assistive technology users can identify the highest-priority accessibility barriers in remote court proceedings and inform targeted technology investment decisions.',
        ARRAY['User Experience'],
        'Research identified 12 distinct accessibility barriers across three technology categories (video conferencing, document sharing, and court record access). Caption quality and screen reader compatibility with court-specific interfaces were the highest-priority barriers.',
        'Participants clearly articulated specific barriers. The research produced a prioritized barrier list accepted by the sponsoring committee as the basis for a technology evaluation.',
        'Research confirmed that commercial video tools alone are insufficient for court-specific accessibility requirements — targeted investment in court-specific configuration and potentially custom tooling is needed.',
        'Research findings support an informed investment decision on whether to pursue targeted accessibility improvements vs. broader platform replacement.',
        'User research report — Remote Proceedings Accessibility — TSIO I&R, 2025.',
        'Caption quality was the highest-priority barrier. Screen reader compatibility varied significantly by tool. Participants preferred real-time access to court documents over email delivery.',
        'evaluated_idea', ARRAY['curated_for_completeness'],
        'Informing technology evaluation and investment decisions for remote proceedings accessibility; design input for court-specific accessibility requirements.',
        'Direct technology procurement decisions — additional evaluation is required before any procurement.',
        CURRENT_DATE, 'moderate',
        'Research methodology (barrier identification + priority ranking with assistive technology users) is transferable to other court technology UX research efforts.',
        'Courts must replicate research with local participant populations — accessibility needs and technology configurations vary.',
        'seeking_adoption_partner',
        ARRAY['TSIO Innovation & Research'], ARRAY['TSIO I&R UX Research Team'],
        'TSIO I&R designed and conducted the user research.',
        'TSIO Innovation & Research', 'Work product of TSIO Innovation & Research, Administrative Office of US Courts, 2025.',
        'This record describes user research findings (Evaluated Idea). Research findings do not constitute a technology recommendation or procurement approval.',
        ARRAY['accessibility', 'remote proceedings', 'UX research', 'assistive technology', 'WCAG']
      )
      ON CONFLICT (slug) DO NOTHING
    `, [SYSTEM_ACTOR_ID]);
    console.log('[seed-launch] Record 4/8: remote-proceedings-ux-research ✓');

    // ─── Record 5: Data Governance Framework POC (SEED-03 tech area diversity) ──
    await pool.query(`
      INSERT INTO innovation_records (
        id, slug, publication_state, created_by, updated_by,
        title, summary, problem_statement, affected_users, why_experimentation,
        mission_areas, problem_type_tags, hypothesis_or_objective,
        technology_areas, technologies_used, outcome_summary, what_worked, what_did_not_work,
        source_basis, findings_data, findings_security, findings_operational,
        maturity, review_statuses, ready_for, not_ready_for,
        last_reviewed_date, reuse_potential, what_can_be_reused, what_should_be_adapted,
        environment_assumptions, production_readiness_gaps, engagement_indicator,
        contributing_offices, contributor_names, ir_contribution,
        owner_steward, attribution_statement, applicable_disclaimer, tags
      ) VALUES (
        gen_random_uuid(), 'data-governance-framework-poc', 'published', $1, $1,
        'Judiciary Data Governance Framework — POC',
        'A proof of concept for a Judiciary-wide data governance framework covering data classification, lineage tracking, and access control for court case data.',
        'Court case data is managed inconsistently across district and appellate courts, with no unified classification scheme, lineage tracking, or access control framework.',
        'Data stewards, IT security officers, compliance staff, and court administrators responsible for case data management.',
        'Standardized data governance would need to span diverse court systems — a POC was the appropriate way to test feasibility before a broader initiative.',
        ARRAY['Data Governance', 'Security'],
        ARRAY['Data Classification', 'Access Control', 'Compliance'],
        'A reference data governance framework covering classification, lineage, and access control for court case data can be implemented in a pilot court environment within 6 months.',
        ARRAY['Data', 'Security'],
        'Apache Atlas for data lineage and catalog, Azure Policy for access control enforcement, PostgreSQL for classification metadata.',
        'The POC implemented a data classification scheme and lineage tracking system in a single district court environment. Classification coverage reached 78% of structured case data.',
        'Data classification scheme and taxonomy were accepted by the pilot court''s data stewards. Lineage tracking worked for structured data sources.',
        'Unstructured data (PDFs, scanned documents) was difficult to classify automatically. Policy enforcement across legacy systems required significant custom integration work.',
        'Data governance pilot report — TSIO I&R, 2026.',
        'Classification scheme covers 6 data sensitivity levels appropriate for court case data. Lineage tracking provides audit evidence for data access decisions.',
        'Access control enforcement requires integration with existing identity systems — this proved complex in legacy environments.',
        'Governance processes need designated data steward roles at each court — technology alone is insufficient without organizational change.',
        'experiment_poc', ARRAY['technically_reviewed', 'policy_reviewed'],
        'Data classification taxonomy as a starting point for new data governance initiatives; lineage tracking architecture patterns.',
        'Full production deployment without dedicated data steward roles at each court.',
        CURRENT_DATE, 'moderate',
        'Data classification taxonomy (6 sensitivity levels) is reusable. Apache Atlas integration patterns for court data systems.',
        'Classification taxonomy should be reviewed with each court''s data stewards and compliance officers — court-specific sensitivity requirements vary.',
        'Assumes dedicated data steward roles at each court. Assumes modern cloud infrastructure (legacy systems require additional integration work).',
        'Data steward program design; unstructured data classification approach; legacy system integration patterns.',
        'technical_playbook_available',
        ARRAY['TSIO Innovation & Research'], ARRAY['TSIO I&R Technical Team', 'Data Governance Lead'],
        'TSIO I&R designed the framework and led the POC implementation.',
        'TSIO Innovation & Research', 'Work product of TSIO Innovation & Research, Administrative Office of US Courts, 2026.',
        'This record describes a Proof of Concept. POC does not indicate production readiness or organizational readiness for a Judiciary-wide deployment.',
        ARRAY['data governance', 'data classification', 'lineage tracking', 'access control', 'Apache Atlas']
      )
      ON CONFLICT (slug) DO NOTHING
    `, [SYSTEM_ACTOR_ID]);
    console.log('[seed-launch] Record 5/8: data-governance-framework-poc ✓');

    // ─── Record 6: Legacy System Modernization Patterns (SEED-04 idea maturity) ──
    await pool.query(`
      INSERT INTO innovation_records (
        id, slug, publication_state, created_by, updated_by,
        title, summary, problem_statement, affected_users, why_experimentation,
        mission_areas, problem_type_tags, hypothesis_or_objective,
        technology_areas, outcome_summary, source_basis, findings_architectural,
        maturity, review_statuses, ready_for,
        last_reviewed_date, reuse_potential, engagement_indicator,
        contributing_offices, contributor_names, ir_contribution,
        owner_steward, attribution_statement, applicable_disclaimer, tags
      ) VALUES (
        gen_random_uuid(), 'legacy-system-modernization-patterns', 'published', $1, $1,
        'Legacy System Modernization Patterns',
        'An emerging collection of patterns and considerations for modernizing legacy court systems, based on I&R interviews with court IT teams.',
        'Legacy court systems (COBOL mainframes, early-generation web applications) create operational risk as support diminishes and integration with modern tools becomes more difficult.',
        'Court IT directors, application owners, and technology planners evaluating modernization paths for legacy systems.',
        'Pattern collection is appropriate at this stage — individual courts have attempted modernization with varied success, and documented patterns have not been shared broadly.',
        ARRAY['IT Modernization', 'Infrastructure'],
        ARRAY['Legacy Systems', 'Application Modernization'],
        'Collecting and documenting modernization patterns from court IT teams will reveal common approaches and pitfalls applicable to future modernization efforts.',
        ARRAY['Infrastructure', 'Cloud'],
        'Early pattern collection identified 5 recurring modernization approaches: strangler fig API wrapping, database migration with schema translation, UI replacement with shared backend, full replacement with parallel operation, and deferred modernization with targeted integration.',
        'Preliminary patterns from I&R interviews with 8 court IT teams, 2026.',
        'Strangler fig pattern (API wrapper around legacy system, incremental replacement) is the most common and most successful pattern cited. Full replacement projects with parallel operation had the highest schedule risk.',
        'idea', ARRAY['submitted'],
        'Informing early-stage modernization planning conversations; identifying which patterns to research more deeply.',
        CURRENT_DATE, 'low',
        'none',
        ARRAY['District Court IT Office'], ARRAY['District Court IT Directors'],
        'TSIO I&R facilitated the interview series and synthesized patterns.',
        'TSIO Innovation & Research', 'Patterns contributed by District Court IT teams. Synthesized by TSIO I&R, 2026. Individual courts retain attribution for their contributed approaches.',
        'This record describes an Idea — an emerging pattern collection at an early stage. No patterns have been formally evaluated or validated. Treat as informational only.',
        ARRAY['legacy modernization', 'strangler fig', 'COBOL', 'application modernization', 'court IT']
      )
      ON CONFLICT (slug) DO NOTHING
    `, [SYSTEM_ACTOR_ID]);
    console.log('[seed-launch] Record 6/8: legacy-system-modernization-patterns ✓');

    // ─── Record 7: Interpreter Scheduling POC — archived (SEED-10) ───────────
    await pool.query(`
      INSERT INTO innovation_records (
        id, slug, publication_state, created_by, updated_by,
        title, summary, problem_statement, affected_users, why_experimentation,
        mission_areas, problem_type_tags, hypothesis_or_objective,
        technology_areas, technologies_used, outcome_summary, what_worked, what_did_not_work,
        uncertainty_reduced, decision_enabled, source_basis,
        findings_architectural, findings_operational,
        maturity, review_statuses, ready_for, not_ready_for,
        last_reviewed_date, reuse_potential, engagement_indicator,
        contributing_offices, contributor_names, ir_contribution,
        owner_steward, attribution_statement, applicable_disclaimer,
        retirement_reason, tags
      ) VALUES (
        gen_random_uuid(), 'interpreter-scheduling-poc', 'archived', $1, $1,
        'Court Interpreter Scheduling Automation — POC (Archived)',
        'A proof of concept for automating court interpreter scheduling, archived after a commercial vendor solution was adopted that covers the same need.',
        'Scheduling court interpreters manually requires significant coordination effort and leads to last-minute conflicts when interpreter availability changes.',
        'Court clerks responsible for interpreter scheduling and court interpreters managing their availability.',
        'A POC was initiated before evaluating commercial solutions; a commercial solution was subsequently identified and procured, making further POC development unnecessary.',
        ARRAY['Court Operations'],
        ARRAY['Scheduling Automation', 'Interpreter Services'],
        'An automated scheduling system could reduce interpreter scheduling conflicts by 60% compared to manual processes.',
        ARRAY['AI/ML'],
        'Python scheduling optimization, calendar API integration.',
        'The POC reduced scheduling conflicts in a limited test environment. However, a commercial vendor solution was identified that provides equivalent functionality with lower implementation risk.',
        'Automated conflict detection reduced scheduling errors in test scenarios.',
        'The POC was superseded by a commercial solution before reaching production readiness. The custom development path was abandoned.',
        'Confirmed that automated scheduling is technically feasible and demand exists.',
        'The POC evidence supported the decision to evaluate commercial solutions rather than continue custom development.',
        'POC lessons-learned notes — TSIO I&R, 2024.',
        'Scheduling optimization algorithm can serve as a baseline for evaluating commercial solutions.',
        'Custom development is higher-risk than commercial solutions for scheduling automation at this scale.',
        'archived_retired', ARRAY['technically_reviewed'],
        'Reference for evaluating commercial scheduling solutions.',
        'Active development — a commercial solution has been adopted.',
        CURRENT_DATE, 'low',
        'archived',
        ARRAY['TSIO Innovation & Research'], ARRAY['TSIO I&R Technical Team'],
        'TSIO I&R initiated and archived the POC.',
        'TSIO Innovation & Research', 'Work product of TSIO Innovation & Research. Archived 2024.',
        'This record is archived. The work it describes has been superseded by a commercial vendor solution. Retained for institutional learning — do not treat as a current pattern or active recommendation.',
        'A commercial interpreter scheduling solution was adopted. This POC is retained as an institutional learning record only.',
        ARRAY['interpreter scheduling', 'scheduling automation', 'archived', 'POC', 'court operations']
      )
      ON CONFLICT (slug) DO NOTHING
    `, [SYSTEM_ACTOR_ID]);
    console.log('[seed-launch] Record 7/8: interpreter-scheduling-poc (archived) ✓');

    // ─── Record 8: Courtroom AV Management (SEED-05 review status diversity) ──
    await pool.query(`
      INSERT INTO innovation_records (
        id, slug, publication_state, created_by, updated_by,
        title, summary, problem_statement, affected_users, current_workflow, why_experimentation,
        mission_areas, problem_type_tags, hypothesis_or_objective,
        technology_areas, technologies_used,
        outcome_summary, what_worked, uncertainty_reduced, source_basis,
        findings_architectural, findings_security, findings_operational,
        maturity, review_statuses, ready_for, not_ready_for,
        last_reviewed_date, reuse_potential, what_can_be_reused, what_should_be_adapted,
        environment_assumptions, production_readiness_gaps, engagement_indicator,
        contributing_offices, contributor_names, ir_contribution,
        owner_steward, attribution_statement, applicable_disclaimer, tags
      ) VALUES (
        gen_random_uuid(), 'courtroom-av-management', 'published', $1, $1,
        'Courtroom AV System Management — Production Pilot',
        'A production pilot of centralized AV system management for 12 courtrooms across two district courts, demonstrating remote diagnostics, configuration management, and scheduled maintenance.',
        'Court AV systems in multi-courtroom buildings require manual, room-by-room management, leading to deferred maintenance and delayed issue resolution.',
        'Court IT staff, facilities managers, and AV technicians managing courtroom technology.',
        'IT staff walk each courtroom to diagnose and resolve AV issues. No centralized visibility into system health or configuration state.',
        'A pilot was appropriate to validate that centralized management is feasible before committing to a multi-court deployment.',
        ARRAY['Court Operations', 'Infrastructure'],
        ARRAY['AV Management', 'Remote Diagnostics', 'Facilities Technology'],
        'Centralized AV management with remote diagnostics will reduce mean-time-to-resolution for AV issues by 50% compared to manual room-by-room management.',
        ARRAY['Infrastructure', 'Security'],
        'Crestron control system, Azure IoT Hub for telemetry, Azure Monitor for alerting, Ansible for configuration management.',
        'Pilot achieved 47% reduction in mean-time-to-resolution across 12 courtrooms. 94% of AV issues were diagnosed remotely without staff entering the courtroom. Configuration management reduced configuration drift.',
        'Remote diagnostics proved highly effective. Configuration management via Ansible eliminated configuration drift that had caused recurring issues.',
        'Confirmed that centralized AV management is operationally feasible and measurably reduces IT burden.',
        'Pilot report — Courtroom AV Management — District Court IT, validated by TSIO I&R, 2026.',
        'Hub-spoke architecture with court-local control system and cloud telemetry is the appropriate pattern for multi-courtroom buildings.',
        'AV system network must be segmented from court case management networks. IoT device management requires a dedicated security review per deployment.',
        'Operational runbooks developed during the pilot are directly reusable. Alert thresholds require per-court tuning.',
        'prototype_pilot', ARRAY['technically_reviewed', 'security_reviewed', 'policy_reviewed'],
        'Multi-court deployment planning; IT staff time reduction estimation; AV system procurement decisions.',
        'Courts with fewer than 4 courtrooms where centralized management ROI may not justify implementation cost.',
        CURRENT_DATE, 'high',
        'Hub-spoke AV management architecture. Ansible configuration management templates. Azure Monitor alert configurations.',
        'Alert thresholds and AV system models require per-court review and adaptation.',
        'Assumes Crestron control system compatibility. Assumes Azure cloud connectivity from court facility.',
        'Security review per deployment; integration with court-specific network segmentation requirements.',
        'monitoring_only',
        ARRAY['TSIO Innovation & Research', 'District Court IT Office'], ARRAY['TSIO I&R Technical Team', 'District Court AV Engineers'],
        'TSIO I&R provided technical oversight and documented the pilot outcomes.',
        'TSIO Innovation & Research', 'Pilot conducted by District Court IT with TSIO I&R technical oversight. Work product of TSIO Innovation & Research and contributing district courts, 2026.',
        'This record describes a Prototype / Pilot. Pilot outcomes reflect conditions at two specific district courts. Independent assessment required before adoption at other courts.',
        ARRAY['AV management', 'courtroom technology', 'remote diagnostics', 'Crestron', 'Azure IoT', 'configuration management']
      )
      ON CONFLICT (slug) DO NOTHING
    `, [SYSTEM_ACTOR_ID]);
    console.log('[seed-launch] Record 8/8: courtroom-av-management ✓');

    console.log('[seed-launch] All 8 records seeded successfully.');
  } finally {
    await pool.end();
  }
}

// Run if executed directly
if (require.main === module) {
  seedLaunchContent().catch(err => {
    console.error('[seed-launch] Fatal error:', err);
    process.exit(1);
  });
}
