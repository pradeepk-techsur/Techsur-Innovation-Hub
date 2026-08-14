/**
 * run-all.ts — Requirement test runner.
 *
 * Executes all *.req.spec.ts files and produces:
 *   requirements-results.json — { reqId, description, status, evidence, error }[]
 *
 * Usage: npx tsx e2e/requirements/run-all.ts
 * Or:    node --import tsx/esm e2e/requirements/run-all.ts
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const SPEC_DIR = path.join(__dirname);
const OUTPUT = path.join(process.cwd(), 'requirements-results.json');

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(' TSIO Innovation Hub — Requirement Verification Run');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Run Playwright with JSON reporter on all req spec files
const specFiles = fs.readdirSync(SPEC_DIR)
  .filter(f => f.endsWith('.req.spec.ts'))
  .map(f => path.join(SPEC_DIR, f))
  .join(' ');

let playwrightOutput = '';
let exitCode = 0;

try {
  playwrightOutput = execSync(
    `npx playwright test ${specFiles} --reporter=json`,
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], cwd: process.cwd() }
  );
} catch (err: unknown) {
  exitCode = 1;
  if (err && typeof err === 'object' && 'stdout' in err) {
    playwrightOutput = (err as { stdout: string }).stdout ?? '';
  }
}

// Parse Playwright JSON output and map to requirement results
interface RequirementResult {
  reqId: string;
  description: string;
  status: 'pass' | 'fail' | 'skip';
  evidence: string;
  error?: string;
}

const results: RequirementResult[] = [];

try {
  const jsonStart = playwrightOutput.indexOf('{');
  if (jsonStart >= 0) {
    const pwResults = JSON.parse(playwrightOutput.slice(jsonStart));
    for (const suite of pwResults.suites ?? []) {
      for (const spec of suite.specs ?? []) {
        // Extract REQ-ID from test title (e.g., "[AUTH-01] ...")
        const reqMatch = spec.title.match(/^\[([A-Z0-9.-]+)\]/);
        const reqId = reqMatch?.[1] ?? 'UNKNOWN';
        const description = spec.title.replace(/^\[[A-Z0-9.-]+\]\s*/, '');

        const testResult = spec.tests?.[0];
        const status: 'pass' | 'fail' | 'skip' =
          testResult?.status === 'expected' ? 'pass' :
          testResult?.status === 'skipped' ? 'skip' : 'fail';

        const error = testResult?.results?.[0]?.error?.message;

        results.push({
          reqId,
          description,
          status,
          evidence: status === 'pass' ? `Test passed: ${spec.title}` : '',
          error: status === 'fail' ? error : undefined,
        });
      }
    }
  }
} catch {
  console.error('Failed to parse Playwright JSON output');
}

// Write results file
fs.writeFileSync(OUTPUT, JSON.stringify(results, null, 2));

// Print summary
const passed = results.filter(r => r.status === 'pass').length;
const failed = results.filter(r => r.status === 'fail').length;
const skipped = results.filter(r => r.status === 'skip').length;

console.log(`Results: ${passed} passed | ${failed} failed | ${skipped} skipped`);
console.log(`\nOutput: ${OUTPUT}`);

if (failed > 0) {
  console.log('\nFailed requirements:');
  results.filter(r => r.status === 'fail').forEach(r => {
    console.log(`  ✗ [${r.reqId}] ${r.description}`);
    if (r.error) console.log(`    Error: ${r.error.slice(0, 120)}`);
  });
}

process.exit(exitCode);
