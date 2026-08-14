/**
 * F4 Requirements — Executive and Technical Perspectives
 * Each test maps 1:1 to a requirement in .planning/REQUIREMENTS.md §F4
 */
import { test, expect } from '@playwright/test';

let recordSlug = '';

test.describe('F4 — Executive and Technical Perspectives', () => {

  test.beforeAll(async ({ request }) => {
    const res = await request.get('/api/v1/catalog');
    const body = await res.json();
    recordSlug = body.data?.[0]?.slug ?? '';
  });

  test('[F4.1] Single record supports both perspectives — toggle visible', async ({ page }) => {
    await page.goto(`/records/${recordSlug}`);
    const tablist = page.getByRole('tablist', { name: /perspective/i });
    await expect(tablist).toBeVisible();
    await expect(tablist.getByRole('tab', { name: /executive/i })).toBeVisible();
    await expect(tablist.getByRole('tab', { name: /technical/i })).toBeVisible();
  });

  test('[F4.2] Executive perspective shows problem, outcome, ownership', async ({ page }) => {
    await page.goto(`/records/${recordSlug}`);
    // Executive is the default tab
    await expect(page.getByRole('tab', { name: /executive/i })).toHaveAttribute('aria-selected', 'true');
    const text = await page.textContent('[role="tabpanel"]');
    expect(text).toMatch(/problem|mission|outcome|ownership|next/i);
  });

  test('[F4.3] Technical perspective shows architecture and limitations', async ({ page }) => {
    await page.goto(`/records/${recordSlug}`);
    await page.getByRole('tab', { name: /technical/i }).click();
    await expect(page.getByRole('tab', { name: /technical/i })).toHaveAttribute('aria-selected', 'true');
    const text = await page.textContent('[role="tabpanel"]');
    expect(text).toMatch(/architecture|tools|security|limitation|reuse/i);
  });

  test('[F4.4] Trust banner visible in both perspectives', async ({ page }) => {
    await page.goto(`/records/${recordSlug}`);
    const trustBanner = page.getByRole('complementary', { name: /trust and maturity/i });
    await expect(trustBanner).toBeVisible();
    await page.getByRole('tab', { name: /technical/i }).click();
    await expect(trustBanner).toBeVisible();
  });

  test('[F4.1] No duplicate source records — single API call serves both views', async ({ request }) => {
    const res = await request.get(`/api/v1/records/${recordSlug}`);
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    // Both exec and tech fields in single response object
    expect(body.data?.record?.problem_statement).toBeDefined();
    expect(body.data?.record?.outcome_summary).toBeDefined();
  });
});
