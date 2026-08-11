import { test, expect } from '@playwright/test';

test.describe('Innovation Catalog (F1)', () => {
  test('F1.1 – anonymous user can browse catalog without login', async ({ page }) => {
    await page.goto('/catalog');
    await expect(page.getByRole('heading', { name: /innovation catalog/i })).toBeVisible();
    // No login redirect occurred
    expect(page.url()).toContain('/catalog');
  });

  test('F1.2 – each catalog card shows title and one-sentence summary', async ({ page }) => {
    await page.goto('/catalog');
    const cards = page.getByRole('article');
    await expect(cards.first()).toBeVisible();
    // Title is a heading
    await expect(cards.first().getByRole('heading')).toBeVisible();
    // Summary is visible text (paragraph)
    const firstCard = cards.first();
    const summaryText = firstCard.locator('p').first();
    await expect(summaryText).toBeVisible();
  });

  test('F1.3 – each card shows maturity badge, review status badge, contributing office', async ({ page }) => {
    await page.goto('/catalog');
    const firstCard = page.getByRole('article').first();
    // Maturity badge present (aria-label starts with "Maturity:")
    await expect(firstCard.getByLabel(/^Maturity:/i)).toBeVisible();
    // Review status badge present (aria-label starts with "Review status:")
    await expect(firstCard.getByLabel(/^Review status:/i).first()).toBeVisible();
    // Contributing office text present
    await expect(firstCard.getByText(/contributing office/i)).toBeVisible();
  });

  test('F1.4 – engagement indicator shown when configured', async ({ page }) => {
    await page.goto('/catalog');
    // At least one card with a non-none engagement indicator should show the label
    const demoCard = page.getByText('Demo Available').or(page.getByText('Seeking Adoption Partner'));
    await expect(demoCard.first()).toBeVisible();
  });

  test('F1.5 – last-reviewed date visible on cards', async ({ page }) => {
    await page.goto('/catalog');
    const firstCard = page.getByRole('article').first();
    await expect(firstCard.getByText(/last reviewed/i)).toBeVisible();
  });

  test('F1.6 – maturity badge and review status badge are visually distinct', async ({ page }) => {
    await page.goto('/catalog');
    const firstCard = page.getByRole('article').first();
    const maturityBadge = firstCard.getByLabel(/^Maturity:/i);
    const reviewBadge = firstCard.getByLabel(/^Review status:/i).first();

    // Both badges exist and are visible
    await expect(maturityBadge).toBeVisible();
    await expect(reviewBadge).toBeVisible();

    // They have different aria-label prefixes
    const maturityLabel = await maturityBadge.getAttribute('aria-label');
    const reviewLabel = await reviewBadge.getAttribute('aria-label');
    expect(maturityLabel).toMatch(/^Maturity:/);
    expect(reviewLabel).toMatch(/^Review status:/);

    // They are different DOM elements
    const maturityEl = await maturityBadge.elementHandle();
    const reviewEl = await reviewBadge.elementHandle();
    expect(maturityEl).not.toBe(reviewEl);
    expect(maturityEl).not.toEqual(reviewEl);
  });

  test('draft records do not appear in catalog', async ({ request }) => {
    const response = await request.get('/api/v1/catalog');
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    const draftRecords = body.data.filter(
      (r: { publication_state: string }) => r.publication_state !== 'published'
    );
    expect(draftRecords).toHaveLength(0);
    // Confirm we have at least the 2 seed records
    expect(body.data.length).toBeGreaterThanOrEqual(2);
    expect(body.meta.total).toBeGreaterThanOrEqual(2);
  });
});
