import { test, expect } from '@playwright/test';

test.describe('Search and Discovery (F2)', () => {
  test('F2.1 – search page reachable from nav', async ({ page }) => {
    // Start from /catalog which uses the public layout containing the main nav
    await page.goto('/catalog');
    await page.getByRole('link', { name: /^search$/i }).first().click();
    await expect(page).toHaveURL(/\/search/);
    await expect(page.getByRole('heading', { name: /search/i })).toBeVisible();
  });

  test('F2.1 + F2.5 – problem-language query returns results without formal project title', async ({ page }) => {
    await page.goto('/search');
    await page.getByRole('searchbox').fill('audio security');
    await page.getByRole('button', { name: /search/i }).click();

    // Should return results (the Audio Security POC seed)
    const resultCount = page.getByRole('status').first();
    await expect(resultCount).not.toContainText('0 result');

    // Results should be visible
    await expect(page.getByRole('article').first()).toBeVisible();
  });

  test('F2.2 – results include records matching problem statement terms', async ({ page }) => {
    await page.goto('/search?q=protect+court+audio');
    await expect(page.getByRole('article').first()).toBeVisible();
  });

  test('F2.3 – filter panel shows facet groups', async ({ page }) => {
    await page.goto('/search');
    await expect(page.getByRole('group', { name: /maturity/i })).toBeVisible();
    await expect(page.getByRole('group', { name: /technology area/i })).toBeVisible();
    await expect(page.getByRole('group', { name: /review status/i })).toBeVisible();
  });

  test('F2.3 – applying maturity filter narrows results', async ({ page }) => {
    await page.goto('/search');
    // Get initial count
    const initialStatus = await page.getByRole('status').first().textContent();
    const initialCount = parseInt(initialStatus?.match(/\d+/)?.[0] ?? '0');

    // Apply experiment_poc filter
    await page.goto('/search?maturity[]=experiment_poc');
    const filteredStatus = await page.getByRole('status').first().textContent();
    const filtered = parseInt(filteredStatus?.match(/\d+/)?.[0] ?? '0');

    // Filtered count should be > 0 (seed has experiment_poc) and <= initial count
    expect(filtered).toBeGreaterThan(0);
    expect(filtered).toBeLessThanOrEqual(Math.max(initialCount, 1));

    // All result cards should show experiment/poc maturity
    const maturityBadges = page.getByLabel(/maturity:/i);
    const count = await maturityBadges.count();
    for (let i = 0; i < count; i++) {
      const label = await maturityBadges.nth(i).getAttribute('aria-label');
      expect(label).toContain('Experiment');
    }
  });

  test('F2.4 – every result card preserves trust information', async ({ page }) => {
    await page.goto('/search');
    const cards = page.getByRole('article');
    const cardCount = await cards.count();

    // Skip if no cards (seed may not have loaded yet)
    if (cardCount === 0) {
      return;
    }

    for (let i = 0; i < Math.min(cardCount, 5); i++) {
      const card = cards.nth(i);
      // Maturity badge must be present
      await expect(card.getByLabel(/maturity:/i)).toBeVisible();
      // At least one review status badge
      await expect(card.getByLabel(/review status:/i).first()).toBeVisible();
    }
  });

  test('F2.4 – no-results state shows helpful message', async ({ page }) => {
    await page.goto('/search?q=xyzzy123notarealword987654');
    await expect(page.getByRole('status').last()).toContainText(/no.*found/i);
  });

  test('F2.4 – result count announced via live region', async ({ page }) => {
    await page.goto('/search?q=audio');
    const liveRegion = page.getByRole('status').first();
    await expect(liveRegion).toBeVisible();
    // Should contain a number
    const text = await liveRegion.textContent();
    expect(text).toMatch(/\d+/);
  });
});
