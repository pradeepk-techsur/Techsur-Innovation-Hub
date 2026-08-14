/**
 * Next.js instrumentation hook — swaps pg Pool with pg-mem in development
 * when DATABASE_URL is not reachable. Enables fully functional E2E testing
 * without an external database.
 *
 * Activated by NEXT_PUBLIC_USE_PGMEM=true
 */
export async function register() {
  if (
    process.env.NODE_ENV === 'development' &&
    process.env.USE_PGMEM === 'true' &&
    typeof process === 'object'
  ) {
    const { newDb } = await import('pg-mem');
    const pgModule = await import('pg');

    const db = newDb();
    
    // Expose db globally so migrate.ts and seed.ts can use it
    (globalThis as Record<string, unknown>).__pgmem_db__ = db;

    // Create pg-mem backed Pool
    const { Pool: MemPool, Client: MemClient } = db.adapters.createPg();

    // Patch pg module exports
    (pgModule as Record<string, unknown>).Pool = MemPool;
    (pgModule as Record<string, unknown>).Client = MemClient;

    console.log('[instrumentation] pg-mem activated — in-memory PostgreSQL running');
  }
}
