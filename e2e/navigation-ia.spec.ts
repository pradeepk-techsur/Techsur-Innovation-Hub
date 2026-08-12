import { test, expect } from '@playwright/test';

const PUBLIC_ROUTES = [
  '/',
  '/catalog',
  '/search',
  '/login',
];

const AUTHENTICATED_ROUTES = [
  '/submit-opportunity',
  '/submit-contribution',
];

const CURATOR_ROUTES = [
  '/curator',
  '/curator/records',
  '/curator/records/new',
  '/curator/submissions/opportunity',
  '/curator/submissions/contribution',
  '/curator/engagement',
  '/curator/reference',
];

test.describe('Navigation and Information Architecture (IA)', () => {
  test('IA-01 – all public nav links resolve without 404', async ({ page }) => {
    for (const route of PUBLIC_ROUTES) {
      const res = await page.goto(route);
      expect(res?.status(), `${route} returned ${res?.status()}`).not.toBe(404);
      expect(res?.status(), `${route} returned ${res?.status()}`).not.toBe(500);
    }
  });

  test('IA-01 – public nav header links are all functional', async ({ page }) => {
    await page.goto('/');
    const navLinks = page.getByRole('navigation', { name: /main navigation/i }).getByRole('link');
    const count = await navLinks.count();
    for (let i = 0; i < count; i++) {
      const href = await navLinks.nth(i).getAttribute('href');
      if (href && !href.startsWith('http')) {
        const res = await page.goto(href);
        expect(res?.status(), `Nav link ${href} returned ${res?.status()}`).not.toBe(404);
      }
    }
  });

  test('IA-02 – no page in navigation returns 404', async ({ page }) => {
    // Check all routes in the nav map
    for (const route of PUBLIC_ROUTES) {
      const res = await page.goto(route);
      expect(res?.status()).not.toBe(404);
    }
  });

  test('IA-04 – breadcrumbs present on catalog page', async ({ page }) => {
    await page.goto('/catalog');
    await expect(page.getByRole('navigation', { name: /breadcrumb/i })).toBeVisible();
  });

  test('IA-04 – breadcrumbs present on record detail page', async ({ page }) => {
    const res = await page.goto('/catalog');
    await expect(res?.status()).not.toBe(404);
    // Click first record card
    const firstLink = page.getByRole('article').first().getByRole('link').first();
    await firstLink.click();
    await expect(page.getByRole('navigation', { name: /breadcrumb/i })).toBeVisible();
    // Breadcrumb includes "Browse" link back to catalog
    await expect(page.getByRole('navigation', { name: /breadcrumb/i }).getByRole('link', { name: /browse/i })).toBeVisible();
  });

  test('IA-04 – breadcrumbs present on search page', async ({ page }) => {
    await page.goto('/search');
    await expect(page.getByRole('navigation', { name: /breadcrumb/i })).toBeVisible();
  });

  test('IA-05 – logged-out header shows Sign In link', async ({ page }) => {
    await page.goto('/');
    const signInLink = page.getByRole('link', { name: /sign in/i });
    await expect(signInLink).toBeVisible();
    await expect(signInLink).toHaveAttribute('href', '/login');
  });

  test('IA-05 – logged-in header shows user name and Sign Out', async ({ page }) => {
    // Login as stakeholder
    await page.request.post('/api/auth/login', { data: { role: 'stakeholder' } });
    await page.goto('/');
    // User name should appear in header
    await expect(page.getByText('Dev Stakeholder')).toBeVisible();
    // Sign Out button present
    await expect(page.getByRole('button', { name: /sign out/i })).toBeVisible();
  });

  test('IA-05 – curator sees Curator link in header', async ({ page }) => {
    await page.request.post('/api/auth/login', { data: { role: 'curator' } });
    await page.goto('/');
    await expect(page.getByRole('link', { name: /curator/i })).toBeVisible();
  });

  test('IA-01 – footer links are all functional', async ({ page }) => {
    await page.goto('/');
    const footerLinks = page.getByRole('contentinfo').getByRole('link');
    const count = await footerLinks.count();
    for (let i = 0; i < count; i++) {
      const href = await footerLinks.nth(i).getAttribute('href');
      if (href && !href.startsWith('http')) {
        const res = await page.goto(href);
        // Footer links to auth-protected pages should redirect (302), not 404
        expect(res?.status(), `Footer link ${href} returned ${res?.status()}`).not.toBe(404);
        expect(res?.status(), `Footer link ${href} returned ${res?.status()}`).not.toBe(500);
      }
    }
  });

  test('IA-02 – curator routes accessible to curator', async ({ page }) => {
    await page.request.post('/api/auth/login', { data: { role: 'curator' } });
    for (const route of CURATOR_ROUTES) {
      const res = await page.goto(route);
      expect(res?.status(), `${route} returned ${res?.status()} for curator`).not.toBe(404);
      expect(res?.status(), `${route} returned ${res?.status()} for curator`).not.toBe(500);
    }
  });
});
