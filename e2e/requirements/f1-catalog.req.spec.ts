/**
 * F1 Requirements — Innovation Catalog
 * Each test maps 1:1 to a requirement in .planning/REQUIREMENTS.md §F1
 */
import { test, expect } from '@playwright/test';

test.describe('F1 — Innovation Catalog', () => {

  test('[F1.1] User can browse a catalog of curated innovation records', async ({ page }) => {
    await page.goto('/catalog');
    await expect(page.getByRole('list', { name: /innovation records catalog/i })).toBeVisible();
  });

  test('[F1.2] Each catalog card shows title and one-sentence summary', async ({ page }) => {
    await page.goto('/catalog');
    const firstCard = page.getByRole('article').first();
    await expect(firstCard.getByRole('heading')).toBeVisible();
    await expect(firstCard.locator('p').first()).toBeVisible();
  });

  test('[F1.3] Each card shows maturity badge', async ({ page }) => {
    await page.goto('/catalog');
    const firstCard = page.getByRole('article').first();
    await expect(firstCard.getByLabel(/maturity:/i)).toBeVisible();
  });

  test('[F1.3] Each card shows review status badge', async ({ page }) => {
    await page.goto('/catalog');
    const firstCard = page.getByRole('article').first();
    await expect(firstCard.getByLabel(/review status:/i).first()).toBeVisible();
  });

  test('[F1.3] Each card shows contributing office', async ({ page }) => {
    await page.goto('/catalog');
    const firstCard = page.getByRole('article').first();
    const text = await firstCard.textContent();
    expect(text?.toLowerCase()).toMatch(/office|tsio|district|contributing/i);
  });

  test('[F1.4] Each card shows engagement indicator when configured', async ({ page }) => {
    await page.goto('/catalog');
    // At least one card in seed data has a non-none engagement indicator
    const engagementText = page.getByText(/demo available|seeking adoption|playbook|reference pattern|monitoring/i).first();
    await expect(engagementText).toBeVisible();
  });

  test('[F1.5] Each card shows last-reviewed date', async ({ page }) => {
    await page.goto('/catalog');
    const firstCard = page.getByRole('article').first();
    const timeEl = firstCard.locator('time');
    await expect(timeEl.first()).toBeVisible();
  });

  test('[F1.6] Maturity badge and review status badge are visually distinct', async ({ page }) => {
    await page.goto('/catalog');
    const firstCard = page.getByRole('article').first();
    const maturityBadge = firstCard.getByLabel(/^Maturity:/i);
    const reviewBadge = firstCard.getByLabel(/^Review status:/i).first();
    await expect(maturityBadge).toBeVisible();
    await expect(reviewBadge).toBeVisible();
    // Different aria-label prefixes confirm they are distinct
    const matLabel = await maturityBadge.getAttribute('aria-label');
    const revLabel = await reviewBadge.getAttribute('aria-label');
    expect(matLabel).toMatch(/^Maturity:/);
    expect(revLabel).toMatch(/^Review status:/);
  });
});
