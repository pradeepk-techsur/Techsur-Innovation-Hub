import { test, expect } from '@playwright/test';

test.describe('Curator SSR cookie forwarding (gap closure)', () => {
  test.beforeEach(async ({ page }) => {
    // Authenticate as curator using dev auth stub
    await page.request.post('/api/auth/login', { data: { role: 'curator' } });
  });

  test('dashboard loads with live record counts — not the unavailable fallback', async ({ page }) => {
    await page.goto('/curator');
    // Must NOT show the degraded fallback text
    await expect(page.getByText(/dashboard data unavailable/i)).not.toBeVisible();
    // The records table is visible (Innovation Records heading)
    await expect(page.getByRole('heading', { name: /innovation records/i })).toBeVisible();
    // At least one state row is rendered (Published row is always present from seeded data)
    await expect(page.getByText(/published/i).first()).toBeVisible();
  });

  test('record list loads — not the failed-to-load fallback', async ({ page }) => {
    await page.goto('/curator/records');
    // Must NOT show the degraded fallback text
    await expect(page.getByText(/failed to load records/i)).not.toBeVisible();
    // The records table heading is visible
    await expect(page.getByRole('heading', { name: /innovation records/i })).toBeVisible();
    // State filter tabs are rendered
    await expect(page.getByRole('link', { name: /^all$/i })).toBeVisible();
  });

  test('record editor loads for a seeded record — not a 404', async ({ page }) => {
    // Get a record ID via the API
    const response = await page.request.get('/api/v1/curator/records?page_size=1');
    const body = await response.json();
    const records = body.data as Array<{ id: string }>;
    expect(records.length).toBeGreaterThan(0);
    const recordId = records[0].id;

    await page.goto(`/curator/records/${recordId}`);
    // Must NOT be a Next.js 404 page
    await expect(page.getByText(/this page could not be found/i)).not.toBeVisible();
    // RecordEditor renders a form (Back to Records link visible)
    await expect(page.getByRole('link', { name: /back to records/i })).toBeVisible();
    // LifecycleActionsPanel is visible
    await expect(page.getByText(/lifecycle/i).first()).toBeVisible();
  });

  test('new record form has a problem_statement textarea', async ({ page }) => {
    await page.goto('/curator/records/new');
    // Title field exists
    await expect(page.getByLabel(/title/i)).toBeVisible();
    // Problem statement textarea exists (UAT gap — was missing)
    await expect(page.getByLabel(/problem statement/i)).toBeVisible();
  });
});
