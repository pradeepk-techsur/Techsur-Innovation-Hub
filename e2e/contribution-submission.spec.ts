import { test, expect } from '@playwright/test';

test.describe('Innovation Contribution (F7)', () => {
  test.beforeEach(async ({ page }) => {
    await page.request.post('/api/auth/login', { data: { role: 'stakeholder' } });
  });

  test('F7.1 – contribution flow is separate from opportunity submission', async ({ page }) => {
    await page.goto('/submit-contribution');
    await expect(page.getByRole('heading', { name: /share existing/i })).toBeVisible();
    // Should mention this is for existing work, not a new problem
    const text = await page.textContent('main');
    expect(text).toMatch(/existing.*work|share.*innovation/i);
    // Should distinguish itself from the opportunity form
    expect(text).toMatch(/separate|different from/i);
  });

  test('F7.3 – attribution fields are required', async ({ page }) => {
    await page.goto('/submit-contribution');
    // Navigate to Step 2 where attribution fields are
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    // Contributing office and contributor names should be visible and required
    await expect(page.getByLabel(/contributing office/i)).toBeVisible();
    await expect(page.getByLabel(/contributor.*name/i)).toBeVisible();
  });

  test('F7.4 – non-endorsement notice visible on form', async ({ page }) => {
    await page.goto('/submit-contribution');
    await expect(page.getByRole('note')).toContainText(/does not imply.*endorsement/i);
  });

  test('AUTH-09 – unauthenticated user redirected', async ({ page: _ }) => {
    const context = await _.context().browser()!.newContext();
    const anonPage = await context.newPage();
    await anonPage.goto('/submit-contribution');
    await expect(anonPage).toHaveURL(/\/login/);
    await context.close();
  });

  test('F7.5 – API validates required attribution fields', async ({ request }) => {
    // Missing contributingOffice should return 422
    const res = await request.post('/api/v1/submissions/contribution', {
      data: {
        contributionTitle: 'Test Contribution',
        problemAddressed: 'A problem that was solved and needs to be shared with others',
        workDescription: 'This is a description of the work that was completed and the outcomes that were achieved during the innovation effort',
        // contributingOffice MISSING — should fail
        contributorNames: 'Jane Doe',
        currentMaturity: 'experiment_poc',
        currentOwner: 'Jane Doe',
        ownerContactEmail: 'jane@example.com',
        collaborationPreference: 'open_for_reuse',
        submitterName: 'Jane Doe',
        submitterEmail: 'jane@example.com',
        nonEndorsementAcknowledged: true,
        consentToContact: true,
      },
    });
    expect(res.status()).toBe(422);
    const body = await res.json();
    expect(body.error_code).toBe('VALIDATION_ERROR');
  });
});
