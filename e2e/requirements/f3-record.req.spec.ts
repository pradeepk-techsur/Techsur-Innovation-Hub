/**
 * F3 Requirements — Innovation Record
 * Each test maps 1:1 to a requirement in .planning/REQUIREMENTS.md §F3
 */
import { test, expect } from '@playwright/test';

let recordSlug = '';

test.describe('F3 — Innovation Record', () => {

  test.beforeAll(async ({ request }) => {
    const res = await request.get('/api/v1/catalog');
    const body = await res.json();
    recordSlug = body.data?.[0]?.slug ?? '';
  });

  test('[F3.1] Record explains problem and context', async ({ page }) => {
    await page.goto(`/records/${recordSlug}`);
    await expect(page.getByRole('region', { name: /problem/i }).first()).toBeVisible();
  });

  test('[F3.2] Record explains what was explored', async ({ page }) => {
    await page.goto(`/records/${recordSlug}`);
    const text = await page.textContent('body');
    expect(text).toMatch(/explored|hypothesis|approach|tested|technologies/i);
  });

  test('[F3.3] Record explains outcome and evidence', async ({ page }) => {
    await page.goto(`/records/${recordSlug}`);
    const text = await page.textContent('body');
    expect(text).toMatch(/outcome|demonstrated|evidence|worked/i);
  });

  test('[F3.4] Record surfaces key findings', async ({ page }) => {
    await page.goto(`/records/${recordSlug}`);
    const text = await page.textContent('body');
    expect(text).toMatch(/finding|architectural|security|performance|technical/i);
  });

  test('[F3.5] Record shows maturity and readiness with trust banner', async ({ page }) => {
    await page.goto(`/records/${recordSlug}`);
    const trustBanner = page.getByRole('complementary', { name: /trust and maturity/i });
    await expect(trustBanner).toBeVisible();
    await expect(trustBanner.getByLabel(/^Maturity:/i)).toBeVisible();
  });

  test('[F3.6] Record provides reuse guidance', async ({ page }) => {
    await page.goto(`/records/${recordSlug}`);
    const text = await page.textContent('body');
    expect(text).toMatch(/reuse|adapt|copy|environment/i);
  });

  test('[F3.7] Record identifies ownership and attribution', async ({ page }) => {
    await page.goto(`/records/${recordSlug}`);
    const text = await page.textContent('body');
    expect(text).toMatch(/owner|contributing|attribution|i&r|tsio/i);
  });

  test('[F3.8] Artifacts section is present', async ({ page }) => {
    await page.goto(`/records/${recordSlug}`);
    const text = await page.textContent('body');
    expect(text).toMatch(/artifact|source|report|document/i);
  });

  test('[F3.9] Record provides next action CTAs', async ({ page }) => {
    await page.goto(`/records/${recordSlug}`);
    // At least one action button/link in the record
    const ctaRegion = page.getByLabel(/next action options/i);
    await expect(ctaRegion).toBeVisible();
    await expect(ctaRegion.getByRole('button').first().or(ctaRegion.getByRole('link').first())).toBeVisible();
  });

  test('[F3.8] Restricted artifact URLs not exposed in API', async ({ request }) => {
    const res = await request.get(`/api/v1/records/${recordSlug}`);
    const body = await res.json();
    const restrictedWithUrl = body.data?.artifacts?.filter(
      (a: { is_restricted: boolean; url: string | null }) => a.is_restricted && a.url !== null
    );
    expect(restrictedWithUrl?.length ?? 0).toBe(0);
  });
});
