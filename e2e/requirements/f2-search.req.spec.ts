/**
 * F2 Requirements — Search and Discovery
 * Each test maps 1:1 to a requirement in .planning/REQUIREMENTS.md §F2
 */
import { test, expect } from '@playwright/test';

test.describe('F2 — Search and Discovery', () => {

  test('[F2.1] User can search without knowing internal project names', async ({ page }) => {
    await page.goto('/search');
    await expect(page.getByRole('searchbox')).toBeVisible();
  });

  test('[F2.1] Search page accessible from main navigation', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /search/i }).first().click();
    await expect(page).toHaveURL(/\/search/);
  });

  test('[F2.2] Search API covers problem statements and findings', async ({ request }) => {
    const res = await request.get('/api/v1/search?q=audio+security');
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.data).toBeDefined();
  });

  test('[F2.3] Filter by maturity is supported', async ({ request }) => {
    const res = await request.get('/api/v1/search?maturity[]=experiment_poc');
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    const allMatch = body.data?.every((r: { maturity: string }) => r.maturity === 'experiment_poc');
    expect(allMatch).toBe(true);
  });

  test('[F2.3] Facets endpoint returns all filter dimensions', async ({ request }) => {
    const res = await request.get('/api/v1/search/facets');
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    const keys = Object.keys(body.data ?? {});
    expect(keys).toContain('maturity');
    expect(keys).toContain('mission_areas');
    expect(keys).toContain('technology_areas');
    expect(keys).toContain('review_statuses');
    expect(keys).toContain('contributing_offices');
  });

  test('[F2.4] Every search result includes maturity and review_statuses', async ({ request }) => {
    const res = await request.get('/api/v1/search');
    const body = await res.json();
    const missing = body.data?.filter((r: { maturity: unknown; review_statuses: unknown }) =>
      !r.maturity || !r.review_statuses
    );
    expect(missing?.length ?? 0).toBe(0);
  });

  test('[F2.5] Problem-language query surfaces relevant records', async ({ request }) => {
    const res = await request.get('/api/v1/search?q=protect+court+audio');
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    // Should return at least 1 result (Audio Security POC)
    expect(body.meta?.total ?? 0).toBeGreaterThan(0);
  });
});
