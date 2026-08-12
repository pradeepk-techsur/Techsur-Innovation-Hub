/**
 * Launch artifact seed — artifact rows for the technical reuse example records.
 *
 * Links artifacts to the Audio Security POC (SEED-07, SEED-12) and other
 * key records seeded by seed-launch.ts.
 *
 * Idempotent: checks for existing artifacts before inserting; artifacts have
 * no natural unique key beyond their UUID, so idempotency is handled via
 * NOT EXISTS guards on (record_id, name).
 *
 * Run via: npm run db:seed-launch (executed after seed-launch.ts)
 */

import { Pool } from 'pg';

export async function seedLaunchArtifacts(): Promise<void> {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const SYSTEM_ACTOR_ID = '00000000-0000-0000-0000-000000000001';

  try {
    // Resolve record IDs by slug
    const records = await pool.query(
      `SELECT id, slug FROM innovation_records WHERE slug IN ($1, $2, $3)`,
      ['audio-security-poc', 'cloud-migration-reference-architecture', 'ecf-ai-document-classification']
    );
    const bySlug = Object.fromEntries(records.rows.map((r: { slug: string; id: string }) => [r.slug, r.id]));

    // ─── Audio Security POC artifacts (SEED-07 — must have artifact links) ───
    if (bySlug['audio-security-poc']) {
      // Insert each artifact with NOT EXISTS guard for idempotency
      await pool.query(`
        INSERT INTO artifacts (artifact_id, record_id, artifact_type, name, url, is_restricted, access_notes, display_order, added_by)
        SELECT
          gen_random_uuid(), $1, 'lessons_learned',
          'Audio Security POC — Lessons Learned Report',
          'https://placeholder.ao.uscourts.gov/tsio/audio-security-poc-lessons-learned.pdf',
          true,
          'Contact AOml_TSO_IRB_Team@ao.uscourts.gov to request access. Internal document.',
          1, $2
        WHERE NOT EXISTS (
          SELECT 1 FROM artifacts
          WHERE record_id = $1 AND name = 'Audio Security POC — Lessons Learned Report'
        )
      `, [bySlug['audio-security-poc'], SYSTEM_ACTOR_ID]);

      await pool.query(`
        INSERT INTO artifacts (artifact_id, record_id, artifact_type, name, url, is_restricted, display_order, added_by)
        SELECT
          gen_random_uuid(), $1, 'architecture_diagram',
          'Azure Government Cloud Defense-in-Depth Architecture',
          'https://placeholder.ao.uscourts.gov/tsio/audio-security-architecture.png',
          false, 2, $2
        WHERE NOT EXISTS (
          SELECT 1 FROM artifacts
          WHERE record_id = $1 AND name = 'Azure Government Cloud Defense-in-Depth Architecture'
        )
      `, [bySlug['audio-security-poc'], SYSTEM_ACTOR_ID]);

      await pool.query(`
        INSERT INTO artifacts (artifact_id, record_id, artifact_type, name, url, is_restricted, display_order, added_by)
        SELECT
          gen_random_uuid(), $1, 'poc_report',
          'Audio Security POC — Technical Findings Summary',
          'https://placeholder.ao.uscourts.gov/tsio/audio-security-poc-findings.pdf',
          false, 3, $2
        WHERE NOT EXISTS (
          SELECT 1 FROM artifacts
          WHERE record_id = $1 AND name = 'Audio Security POC — Technical Findings Summary'
        )
      `, [bySlug['audio-security-poc'], SYSTEM_ACTOR_ID]);
    }

    // ─── Cloud Migration Reference — technical playbook artifact ─────────────
    if (bySlug['cloud-migration-reference-architecture']) {
      await pool.query(`
        INSERT INTO artifacts (artifact_id, record_id, artifact_type, name, url, is_restricted, display_order, added_by)
        SELECT
          gen_random_uuid(), $1, 'technical_playbook',
          'Judiciary Cloud Migration Reference Playbook',
          'https://placeholder.ao.uscourts.gov/tsio/cloud-migration-reference-playbook.pdf',
          false, 1, $2
        WHERE NOT EXISTS (
          SELECT 1 FROM artifacts
          WHERE record_id = $1 AND name = 'Judiciary Cloud Migration Reference Playbook'
        )
      `, [bySlug['cloud-migration-reference-architecture'], SYSTEM_ACTOR_ID]);
    }

    // Verify what was seeded
    const artifactCount = await pool.query(`
      SELECT COUNT(*) as total FROM artifacts
      WHERE record_id IN (
        SELECT id FROM innovation_records
        WHERE slug IN ('audio-security-poc', 'cloud-migration-reference-architecture', 'ecf-ai-document-classification')
      )
    `);
    console.log(`[seed-launch-artifacts] Artifacts seeded: ${artifactCount.rows[0].total} total artifact rows ✓`);
  } finally {
    await pool.end();
  }
}

// Run if executed directly (after seed-launch.ts)
if (require.main === module) {
  seedLaunchArtifacts().catch(err => {
    console.error('[seed-launch-artifacts] Fatal error:', err);
    process.exit(1);
  });
}
