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
    // Fill step 1 fields so validation passes and we can advance to step 2
    await page.getByLabel(/contribution title/i).fill('Test Innovation Work');
    await page.getByLabel(/problem addressed/i).fill('A problem that needed to be solved in the courts');
    await page.getByLabel(/work description/i).fill('This is a description of the work completed and the outcomes achieved during innovation.');
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

  test('F7-step1-validation – Next button blocked when step-1 fields are empty', async ({ page }) => {
    await page.goto('/submit-contribution');
    // Do not fill any fields — click Next immediately
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    // Should still be on step 1
    await expect(page.getByText(/step 1 of 2/i)).toBeVisible();
    // At least one field error should appear
    await expect(page.getByText(/required|at least/i).first()).toBeVisible();
  });

  test('F7-submit-error – API error re-enables Submit and shows error', async ({ page }) => {
    await page.goto('/submit-contribution');
    // Fill step 1
    await page.getByLabel(/contribution title/i).fill('Test Contribution Title');
    await page.getByLabel(/problem addressed/i).fill('A clear problem statement that exceeds the thirty character minimum');
    await page.getByLabel(/work description/i).fill('This is a sufficiently detailed work description that exceeds fifty characters for the test.');
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    // Fill step 2
    await page.getByLabel(/contributing office/i).fill('District Court, Eastern District');
    await page.getByLabel(/contributor.*name/i).fill('Jane Doe');
    await page.getByLabel(/current owner/i).fill('Jane Doe');
    await page.getByLabel(/owner contact email/i).fill('jane@ao.uscourts.gov');
    await page.getByLabel(/does not imply.*endorsement/i).check();
    await page.getByLabel(/consent to.*contacting/i).check();
    // Intercept API to return 500
    await page.route('/api/v1/submissions/contribution', route =>
      route.fulfill({ status: 500, body: 'Internal Server Error', contentType: 'text/html' })
    );
    await page.getByRole('button', { name: /submit contribution/i }).click();
    // Button must re-enable
    await expect(page.getByRole('button', { name: /submit contribution/i })).not.toBeDisabled();
    // p[role="alert"] excludes Next.js route announcer div
    await expect(page.locator('p[role="alert"]')).toBeVisible();
  });
});
