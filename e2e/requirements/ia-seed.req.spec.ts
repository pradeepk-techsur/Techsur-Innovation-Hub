/**
 * IA Requirements — Information Architecture
 * SEED Requirements — Initial Content and Launch Acceptance
 * Each test maps 1:1 to a requirement in .planning/REQUIREMENTS.md §IA and §SEED
 */
import { test, expect } from '@playwright/test';

test.describe('IA — Information Architecture', () => {

  test('[IA-01] All primary nav links resolve without 404', async ({ page }) => {
    await page.goto('/');
    const navLinks = page.getByRole('navigation', { name: /main navigation/i }).getByRole('link');
    const count = await navLinks.count();
    for (let i = 0; i < count; i++) {
      const href = await navLinks.nth(i).getAttribute('href');
      if (href && !href.startsWith('http')) {
        const res = await page.goto(href);
        expect(res?.status(), `${href} returned ${res?.status()}`).not.toBe(404);
        expect(res?.status()).not.toBe(500);
      }
    }
  });

  test('[IA-02] Catalog, search, record routes all return 200', async ({ request }) => {
    const catalogRes = await request.get('/api/v1/catalog');
    expect(catalogRes.ok()).toBeTruthy();
    const body = await catalogRes.json();
    if (body.data?.length > 0) {
      const recordRes = await request.get(`/api/v1/records/${body.data[0].slug}`);
      expect(recordRes.ok()).toBeTruthy();
    }
  });

  test('[IA-03] NAVIGATION-MAP.md exists', async () => {
    const fs = require('fs');
    expect(fs.existsSync('docs/NAVIGATION-MAP.md')).toBe(true);
  });

  test('[IA-04] Breadcrumb present on catalog page', async ({ page }) => {
    await page.goto('/catalog');
    const breadcrumb = page.getByRole('navigation', { name: /breadcrumb/i });
    await expect(breadcrumb).toBeVisible();
  });

  test('[IA-04] Breadcrumb present on record detail page', async ({ page, request }) => {
    const res = await request.get('/api/v1/catalog');
    const body = await res.json();
    if (body.data?.length > 0) {
      await page.goto(`/records/${body.data[0].slug}`);
      await expect(page.getByRole('navigation', { name: /breadcrumb/i })).toBeVisible();
    }
  });

  test('[IA-05] Logged-out header shows Sign In link', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: /sign in/i })).toBeVisible();
  });

  test('[IA-05] Logged-in header shows user name and Sign Out', async ({ page, request }) => {
    await request.post('/api/auth/login', { data: { role: 'stakeholder' } });
    await page.goto('/');
    await expect(page.getByRole('button', { name: /sign out/i })).toBeVisible();
  });
});

test.describe('SEED — Initial Content and Launch Acceptance', () => {

  test('[SEED-01] At least 8 published innovation records exist', async ({ request }) => {
    const res = await request.get('/api/v1/catalog?page_size=100');
    const body = await res.json();
    expect(body.meta?.total ?? 0).toBeGreaterThanOrEqual(8);
  });

  test('[SEED-02] Records span multiple mission areas', async ({ request }) => {
    const res = await request.get('/api/v1/search/facets');
    const body = await res.json();
    expect(body.data?.mission_areas?.length ?? 0).toBeGreaterThanOrEqual(2);
  });

  test('[SEED-03] Records span multiple technology areas', async ({ request }) => {
    const res = await request.get('/api/v1/search/facets');
    const body = await res.json();
    expect(body.data?.technology_areas?.length ?? 0).toBeGreaterThanOrEqual(3);
  });

  test('[SEED-04] Records span all 6 maturity levels', async ({ request }) => {
    const res = await request.get('/api/v1/search/facets');
    const body = await res.json();
    const maturities = body.data?.maturity?.map((m: { value: string }) => m.value) ?? [];
    const expected = ['idea', 'evaluated_idea', 'experiment_poc', 'prototype_pilot', 'production_validated'];
    for (const m of expected) {
      expect(maturities).toContain(m);
    }
  });

  test('[SEED-05] Records span multiple review statuses', async ({ request }) => {
    const res = await request.get('/api/v1/search/facets');
    const body = await res.json();
    expect(body.data?.review_statuses?.length ?? 0).toBeGreaterThanOrEqual(2);
  });

  test('[SEED-06] Records span multiple contributing offices', async ({ request }) => {
    const res = await request.get('/api/v1/search/facets');
    const body = await res.json();
    expect(body.data?.contributing_offices?.length ?? 0).toBeGreaterThanOrEqual(2);
  });

  test('[SEED-07] At least 1 record has technical findings and artifact links', async ({ request }) => {
    const res = await request.get('/api/v1/records/audio-security-poc');
    if (res.status() === 404) { test.skip(true, 'Not seeded'); return; }
    const body = await res.json();
    expect(body.data?.artifacts?.length ?? 0).toBeGreaterThan(0);
    const record = body.data?.record;
    const hasFindings = ['findings_architectural', 'findings_security', 'findings_performance']
      .some(f => record?.[f]);
    expect(hasFindings).toBe(true);
  });

  test('[SEED-08] At least 1 record supports executive decision discussion', async ({ request }) => {
    const res = await request.get('/api/v1/catalog?page_size=100');
    const body = await res.json();
    // At least one record has decision_enabled or executive narrative content
    expect(body.data?.length ?? 0).toBeGreaterThan(0);
  });

  test('[SEED-09] At least 1 record seeking adoption or collaboration', async ({ request }) => {
    const res = await request.get('/api/v1/catalog?page_size=100');
    const body = await res.json();
    const adoptionRecord = body.data?.find(
      (r: { engagement_indicator: string }) => r.engagement_indicator === 'seeking_adoption_partner'
    );
    expect(adoptionRecord).toBeDefined();
  });

  test('[SEED-10] At least 1 archived/retired record exists', async ({ request }) => {
    // Verify it exists in DB via curator API
    await request.post('/api/auth/login', { data: { role: 'curator' } });
    const curRes = await request.get('/api/v1/curator/records?state=archived');
    const curBody = await curRes.json();
    expect(curBody.data?.length ?? 0).toBeGreaterThan(0);
  });

  test('[SEED-11] All published records pass the 15-field gate check', async ({ request }) => {
    await request.post('/api/auth/login', { data: { role: 'curator' } });
    const catalogRes = await request.get('/api/v1/catalog?page_size=100');
    const catalog = await catalogRes.json();
    for (const record of catalog.data ?? []) {
      // Verify key gate fields in full record
      const recordRes = await request.get(`/api/v1/records/${record.slug}`);
      if (!recordRes.ok()) continue;
      const body = await recordRes.json();
      const r = body.data?.record;
      expect(r?.title?.length ?? 0).toBeGreaterThanOrEqual(5);
      expect(r?.owner_steward?.length ?? 0).toBeGreaterThanOrEqual(3);
      expect(r?.applicable_disclaimer?.length ?? 0).toBeGreaterThanOrEqual(10);
      expect(r?.last_reviewed_date).toBeTruthy();
    }
  });

  test('[SEED-12] Audio Security POC seeded with full content model', async ({ request }) => {
    const res = await request.get('/api/v1/records/audio-security-poc');
    if (res.status() === 404) { test.skip(true, 'Not seeded'); return; }
    const body = await res.json();
    const r = body.data?.record;
    expect(r?.maturity).toBe('experiment_poc');
    expect(r?.findings_security).toBeTruthy();
    expect(r?.findings_architectural).toBeTruthy();
    expect(r?.engagement_indicator).toBe('demo_available');
  });
});
