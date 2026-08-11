import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

async function migrate() {
  // Use admin URL for running migrations (needs superuser to create roles and grant permissions)
  // Falls back to DATABASE_URL if DATABASE_ADMIN_URL is not set (for environments without a separate admin user)
  const connectionString = process.env.DATABASE_ADMIN_URL ?? process.env.DATABASE_URL;
  const pool = new Pool({ connectionString });
  
  try {
    // Create migrations tracking table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        migration_name VARCHAR(255) PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);
    
    const migrationsDir = path.join(
      // In Node.js with tsx, __dirname may not be available in ESM mode
      // Use import.meta.url when available, otherwise fall back to process.cwd()
      typeof __dirname !== 'undefined' ? __dirname : process.cwd() + '/src/lib/db',
      'migrations'
    );
    const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
    
    for (const file of files) {
      const { rows } = await pool.query(
        'SELECT 1 FROM schema_migrations WHERE migration_name = $1',
        [file]
      );
      if (rows.length > 0) {
        console.log(`[migrate] Skipping already-applied: ${file}`);
        continue;
      }
      
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      console.log(`[migrate] Applying: ${file}`);
      await pool.query(sql);
      await pool.query(
        'INSERT INTO schema_migrations (migration_name) VALUES ($1)',
        [file]
      );
      console.log(`[migrate] Applied: ${file}`);
    }
    
    console.log('[migrate] All migrations applied successfully');
  } finally {
    await pool.end();
  }
}

migrate().catch(err => {
  console.error('[migrate] Fatal error:', err);
  process.exit(1);
});
