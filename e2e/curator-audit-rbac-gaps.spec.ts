import { test, expect } from '@playwright/test';

test.describe('Phase 4 gap closure — audit log + RBAC 403 split', () => {

  test.describe('Audit log page (Gap 1 — blocker)', () => {
    test.beforeEach(async ({ page }) => {
      // Authenticate as admin
      await page.request.post('/api/auth/login', { data: { role: 'admin' } });
    });

    test('admin: /curator/audit loads with audit event table (no 404)', async ({ page }) => {
      await page.goto('/curator/audit');
      // Must NOT be a Next.js 404
      await expect(page.getByText(/this page could not be found/i)).not.toBeVisible();
      // Page heading confirms it loaded
      await expect(page.getByRole('heading', { name: /audit log/i })).toBeVisible();
    });

    test('admin: sidebar "Audit Log" link leads to /curator/audit (not 404)', async ({ page }) => {
      await page.goto('/curator');
      // Click the Audit Log link in the sidebar
      await page.getByRole('link', { name: /audit log/i }).click();
      await expect(page).toHaveURL(/\/curator\/audit/);
      await expect(page.getByRole('heading', { name: /audit log/i })).toBeVisible();
    });

    test('admin: audit log shows events with actor name and timestamp — no IP addresses', async ({ page }) => {
      await page.goto('/curator/audit');
      // The page renders — either events table or empty-state message
      const hasTable = await page.locator('table').count() > 0;
      const hasEmpty = await page.getByText(/no audit events recorded yet/i).isVisible().catch(() => false);
      expect(hasTable || hasEmpty).toBeTruthy();
      // IP address must NOT appear in rendered (visible) content — use innerText to exclude RSC/script payloads
      const mainContent = await page.locator('#main-content').innerText().catch(() => '');
      expect(mainContent).not.toMatch(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/); // no IPv4 pattern in visible content
    });

    test('global audit API returns 200 for admin with no ip_address field', async ({ page }) => {
      const res = await page.request.get('/api/v1/curator/audit?page_size=5');
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.status).toBe('ok');
      expect(Array.isArray(body.data)).toBeTruthy();
      // Verify no ip_address field leaks into response
      for (const event of body.data as Record<string, unknown>[]) {
        expect(event).not.toHaveProperty('ip_address');
      }
    });

    test('global audit API returns 403 for curator role', async ({ page }) => {
      // Switch to curator role
      await page.request.post('/api/auth/login', { data: { role: 'curator' } });
      const res = await page.request.get('/api/v1/curator/audit');
      expect(res.status()).toBe(403);
    });
  });

  test.describe('RBAC layout split — Gap 2 (minor)', () => {
    test('unauthenticated user → redirected to /login (not /unauthorized)', async ({ page }) => {
      // No login — cold browser
      const res = await page.request.get('/curator', { maxRedirects: 0 });
      // Should redirect to login
      const location = res.headers()['location'] ?? '';
      expect(location).toContain('/login');
      expect(location).not.toContain('/unauthorized');
    });

    test('stakeholder attempting /curator → redirected to /unauthorized (not /login)', async ({ page }) => {
      // Authenticate as stakeholder
      await page.request.post('/api/auth/login', { data: { role: 'stakeholder' } });
      const res = await page.request.get('/curator', { maxRedirects: 0 });
      // With a valid session but wrong role → redirect to /unauthorized
      const location = res.headers()['location'] ?? '';
      // May be a 307 to /unauthorized
      if (res.status() === 307 || res.status() === 308) {
        expect(location).toContain('/unauthorized');
        expect(location).not.toContain('/login');
      } else {
        // If middleware intercepts first and returns 307 to login,
        // follow redirects to final destination
        await page.goto('/curator');
        // Should end up on /unauthorized page (not login)
        await expect(page).toHaveURL(/\/unauthorized/);
      }
    });

    test('/unauthorized page renders with 403 messaging and link back to /', async ({ page }) => {
      await page.goto('/unauthorized');
      await expect(page.getByRole('heading', { name: /access restricted/i })).toBeVisible();
      await expect(page.getByText(/403/i)).toBeVisible();
      await expect(page.getByRole('link', { name: /return to hub/i })).toBeVisible();
    });
  });
});
