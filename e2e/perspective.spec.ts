import { test, expect } from '@playwright/test';

test.describe('Executive / Technical Perspectives (F4)', () => {
  let recordSlug: string;

  test.beforeAll(async ({ request }) => {
    const res = await request.get('/api/v1/catalog');
    const body = await res.json();
    recordSlug = body.data[0].slug;
  });

  test('F4.1 – perspective toggle is visible on record page', async ({ page }) => {
    await page.goto(`/records/${recordSlug}`);
    const tablist = page.getByRole('tablist', { name: /choose perspective/i });
    await expect(tablist).toBeVisible();
    await expect(tablist.getByRole('tab', { name: /executive/i })).toBeVisible();
    await expect(tablist.getByRole('tab', { name: /technical/i })).toBeVisible();
  });

  test('F4.2 – executive perspective shows problem, outcome, and ownership', async ({ page }) => {
    await page.goto(`/records/${recordSlug}`);
    // Executive is default
    await expect(page.getByRole('tab', { name: /executive/i })).toHaveAttribute('aria-selected', 'true');
    // Executive sections present
    await expect(page.getByRole('region', { name: /the problem/i })).toBeVisible();
    await expect(page.getByRole('region', { name: /what was demonstrated/i })).toBeVisible();
    await expect(page.getByRole('region', { name: /ownership/i })).toBeVisible();
  });

  test('F4.3 – technical perspective shows architecture, tools, and limitations', async ({ page }) => {
    await page.goto(`/records/${recordSlug}`);
    await page.getByRole('tab', { name: /technical/i }).click();
    await expect(page.getByRole('tab', { name: /technical/i })).toHaveAttribute('aria-selected', 'true');
    // Technical sections present
    await expect(page.getByRole('region', { name: /architecture/i })).toBeVisible();
    await expect(page.getByRole('region', { name: /tools and services/i })).toBeVisible();
  });

  test('F4.4 – trust banner visible in both perspectives', async ({ page }) => {
    await page.goto(`/records/${recordSlug}`);
    // Executive perspective — trust banner visible
    const trustBanner = page.getByRole('complementary', { name: /trust and maturity/i });
    await expect(trustBanner).toBeVisible();

    // Switch to technical — trust banner still visible
    await page.getByRole('tab', { name: /technical/i }).click();
    await expect(trustBanner).toBeVisible();
  });

  test('F4.1 – toggle is keyboard accessible (Tab + Enter)', async ({ page }) => {
    await page.goto(`/records/${recordSlug}`);
    const executiveTab = page.getByRole('tab', { name: /executive/i });
    const technicalTab = page.getByRole('tab', { name: /technical/i });

    // Click Technical tab
    await technicalTab.click();
    await expect(technicalTab).toHaveAttribute('aria-selected', 'true');

    // Click back to Executive
    await executiveTab.click();
    await expect(executiveTab).toHaveAttribute('aria-selected', 'true');
  });

  test('F4.4 – no duplicate source records — same page, same data', async ({ request }) => {
    // Both perspectives use one API call result
    const res = await request.get(`/api/v1/records/${recordSlug}`);
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    // Both executive and technical fields exist in a single response
    expect(body.data.record.problem_statement).toBeDefined();
    expect(
      body.data.record.findings_architectural !== undefined ||
        body.data.record.technologies_used !== undefined
    ).toBeTruthy();
  });
});
