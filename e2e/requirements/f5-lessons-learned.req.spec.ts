/**
 * F5 Requirements — Existing Lessons-Learned Content
 * Each test maps 1:1 to a requirement in .planning/REQUIREMENTS.md §F5
 */
import { test, expect } from '@playwright/test';

test.describe('F5 — Existing Lessons-Learned Content', () => {

  test('[F5.1] Lessons-learned source is linked, not migrated — source_basis field present', async ({ request }) => {
    const res = await request.get('/api/v1/records/audio-security-poc');
    if (res.status() === 404) {
      test.skip(true, 'Audio Security POC not yet seeded');
      return;
    }
    const body = await res.json();
    expect(body.data?.record?.source_basis).toBeTruthy();
  });

  test('[F5.2] Structured record wraps the source and extracts findings', async ({ request }) => {
    const res = await request.get('/api/v1/records/audio-security-poc');
    if (res.status() === 404) { test.skip(true, 'Not seeded'); return; }
    const body = await res.json();
    const record = body.data?.record;
    const hasFindings = [
      record?.findings_architectural,
      record?.findings_security,
      record?.findings_performance,
    ].some(f => f && f.length > 0);
    expect(hasFindings).toBe(true);
  });

  test('[F5.3] Metadata applied — maturity, review status, last_reviewed_date present', async ({ request }) => {
    const res = await request.get('/api/v1/records/audio-security-poc');
    if (res.status() === 404) { test.skip(true, 'Not seeded'); return; }
    const body = await res.json();
    expect(body.data?.record?.maturity).toBeTruthy();
    expect(body.data?.record?.review_statuses?.length).toBeGreaterThan(0);
    expect(body.data?.record?.last_reviewed_date).toBeTruthy();
  });

  test('[F5.4] Record is discoverable via problem-oriented search', async ({ request }) => {
    const res = await request.get('/api/v1/search?q=protect+court+audio');
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.meta?.total ?? 0).toBeGreaterThan(0);
  });

  test('[F5.5] Source basis banner visible on record page', async ({ page }) => {
    await page.goto('/records/audio-security-poc');
    if (page.url().includes('not-found') || page.url().includes('404')) {
      test.skip(true, 'Audio Security POC not seeded');
      return;
    }
    const text = await page.textContent('body');
    expect(text).toMatch(/source of record|authoritative source|source basis/i);
  });
});
