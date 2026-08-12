import { test, expect } from '@playwright/test';

test.describe('Curator settings RBAC redirect (gap closure — UAT test 9)', () => {

  test('unauthenticated /curator/settings redirect stays on internal hostname (no proxy leak)', async ({ page }) => {
    // No login — cold browser (no session cookie)
    const res = await page.request.get('/curator/settings', { maxRedirects: 0 });
    // Should 307 to /login
    expect([307, 308]).toContain(res.status());
    const location = res.headers()['location'] ?? '';
    expect(location).toContain('/login');
    // CRITICAL: location must NOT contain external preview proxy hostname pattern
    expect(location).not.toMatch(/\d{4}-pivota-sandbox/);
    expect(location).not.toMatch(/preview\.pivota-ng/);
  });

  test('curator visiting /curator/settings → redirected to /unauthorized', async ({ page }) => {
    // Authenticate as curator
    await page.request.post('/api/auth/login', { data: { role: 'curator' } });
    // Navigate to settings (follows redirects)
    await page.goto('/curator/settings');
    // Should end up on /unauthorized — not /login, not settings
    await expect(page).toHaveURL(/\/unauthorized/);
    await expect(page.getByRole('heading', { name: /access restricted/i })).toBeVisible();
  });

  test('admin visiting /curator/settings → settings page loads (regression)', async ({ page }) => {
    // Authenticate as admin
    await page.request.post('/api/auth/login', { data: { role: 'admin' } });
    await page.goto('/curator/settings');
    // Should NOT be redirected away
    await expect(page).toHaveURL(/\/curator\/settings/);
    await expect(page.getByRole('heading', { name: /hub settings/i })).toBeVisible();
  });

  test('curator settings API returns 403 for curator role', async ({ page }) => {
    await page.request.post('/api/auth/login', { data: { role: 'curator' } });
    const res = await page.request.get('/api/v1/curator/settings');
    expect(res.status()).toBe(403);
  });
});
