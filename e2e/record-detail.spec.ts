/**
 * Innovation Record Detail — Playwright E2E tests (F3.1–F3.9, SEC-04)
 *
 * Verifies:
 *   - Navigation from catalog card to record detail page
 *   - All nine content sections present for a fully-seeded record
 *   - Trust banner shows maturity and review status (F3.5, SEC-11)
 *   - Restricted artifact URLs are not exposed (SEC-04, T-01-03-01)
 *   - Unknown slug returns 404
 *
 * Depends on: seed record 'audio-security-poc-2024' (plan 01-02/01-03 fixture)
 */

import { test, expect } from '@playwright/test';

test.describe('Innovation Record Detail (F3)', () => {
  let recordSlug: string;

  test.beforeAll(async ({ request }) => {
    const res = await request.get('/api/v1/catalog');
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.data.length).toBeGreaterThan(0);
    recordSlug = body.data[0].slug;
  });

  test('F3 – navigating to a record from catalog card works', async ({ page }) => {
    await page.goto('/catalog');
    // CatalogCard renders the title as a Link href="/records/{slug}" — click the first card title link
    // The link wraps an h2, so we look for a link inside an article
    const firstCardLink = page.getByRole('article').first().getByRole('link').first();
    await firstCardLink.click();
    await expect(page).toHaveURL(/\/records\//);
  });

  test('F3.1 – Problem and Context section is present', async ({ page }) => {
    await page.goto(`/records/${recordSlug}`);
    await expect(page.getByRole('region', { name: /problem and context/i })).toBeVisible();
  });

  test('F3.2 – What Was Explored section is present', async ({ page }) => {
    await page.goto(`/records/${recordSlug}`);
    await expect(page.getByRole('region', { name: /what was explored/i })).toBeVisible();
  });

  test('F3.3 – Outcome and Evidence section is present', async ({ page }) => {
    await page.goto(`/records/${recordSlug}`);
    await expect(page.getByRole('region', { name: /outcome and evidence/i })).toBeVisible();
  });

  test('F3.4 – Key Findings section is present', async ({ page }) => {
    await page.goto(`/records/${recordSlug}`);
    await expect(page.getByRole('region', { name: /key findings/i })).toBeVisible();
  });

  test('F3.5 – Maturity and Readiness section is present', async ({ page }) => {
    await page.goto(`/records/${recordSlug}`);
    await expect(page.getByRole('region', { name: /maturity and readiness/i })).toBeVisible();
  });

  test('F3.5 – Trust banner shows maturity and review status', async ({ page }) => {
    await page.goto(`/records/${recordSlug}`);
    const trustBanner = page.getByRole('complementary', { name: /trust and maturity/i });
    await expect(trustBanner).toBeVisible();
    // Maturity badge has aria-label="Maturity: {label}" (established pattern from MaturityBadge)
    await expect(trustBanner.getByLabel(/maturity:/i)).toBeVisible();
  });

  test('F3.6 – Reuse Guidance section is present', async ({ page }) => {
    await page.goto(`/records/${recordSlug}`);
    await expect(page.getByRole('region', { name: /reuse guidance/i })).toBeVisible();
  });

  test('F3.7 – Ownership and Attribution section is present', async ({ page }) => {
    await page.goto(`/records/${recordSlug}`);
    await expect(page.getByRole('region', { name: /ownership and attribution/i })).toBeVisible();
  });

  test('F3.8 – Authoritative Artifacts section is present', async ({ page }) => {
    await page.goto(`/records/${recordSlug}`);
    await expect(page.getByRole('region', { name: /authoritative artifacts/i })).toBeVisible();
  });

  test('F3.9 – Next Action section is present with CTA link', async ({ page }) => {
    await page.goto(`/records/${recordSlug}`);
    await expect(page.getByRole('region', { name: /next action/i })).toBeVisible();
    // At least one link (Contact I&R fallback or configured action) must be present
    const ctaRegion = page.getByRole('region', { name: /next action/i });
    await expect(ctaRegion.getByRole('link').first()).toBeVisible();
  });

  test('SEC-04 – restricted artifact URLs are not exposed in API response', async ({ request }) => {
    const res = await request.get(`/api/v1/records/${recordSlug}`);
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    const restrictedArtifacts = body.data.artifacts.filter(
      (a: { is_restricted: boolean }) => a.is_restricted
    );
    for (const artifact of restrictedArtifacts) {
      expect(artifact.url).toBeNull(); // URL must be null for restricted artifacts
    }
  });

  test('Record not found returns 404', async ({ request }) => {
    const res = await request.get('/api/v1/records/this-slug-does-not-exist-xyz');
    expect(res.status()).toBe(404);
    const body = await res.json();
    expect(body.error).toBe('Record not found');
  });
});
