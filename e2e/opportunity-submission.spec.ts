import { test, expect } from '@playwright/test';

test.describe('Opportunity Submission (F6)', () => {
  test.beforeEach(async ({ page }) => {
    // Log in as stakeholder before each test
    await page.request.post('/api/auth/login', {
      data: { role: 'stakeholder' },
    });
  });

  test('F6.1 – form starts with problem description, not application request', async ({ page }) => {
    await page.goto('/submit-opportunity');
    await expect(page.getByText(/describe the problem/i).first()).toBeVisible();
    await expect(page.getByPlaceholder(/mission problem/i)).toBeVisible();
    // Must NOT start with "what application" language
    const pageText = await page.textContent('main');
    expect(pageText).not.toMatch(/what application do you want/i);
  });

  test('F6.4 – non-acceptance notice visible on form and confirmation', async ({ page }) => {
    await page.goto('/submit-opportunity');
    // Notice in intro banner
    await expect(page.getByRole('note')).toContainText(/does not.*imply acceptance/i);
  });

  test('F6.3 – request type selector present', async ({ page }) => {
    await page.goto('/submit-opportunity');
    await expect(page.getByRole('combobox')).toBeVisible();
  });

  test('AUTH-09 – unauthenticated user redirected to login', async ({ page: anonPage }) => {
    // Use a fresh browser context with no cookies
    const context = await anonPage.context().browser()!.newContext();
    const page = await context.newPage();
    await page.goto('/submit-opportunity');
    await expect(page).toHaveURL(/\/login/);
    await context.close();
  });

  test('F6.5 – successful submission returns reference number', async ({ page }) => {
    await page.goto('/submit-opportunity');
    // Step 1
    await page.getByLabel(/problem title/i).fill('Test Mission Problem');
    await page.getByLabel(/describe the problem/i).fill('This is a minimum fifty character description of the mission problem that needs to be solved for the test.');
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    // Step 2
    await page.getByLabel(/who is affected/i).fill('Court clerks and administrators in district courts across the country');
    await page.getByLabel(/what is the impact/i).fill('Significant manual processing burden requiring hours of staff time');
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    // Step 3
    await page.getByLabel(/does not imply acceptance/i).check();
    await page.getByLabel(/consent to.*contacting/i).check();
    await page.getByRole('button', { name: /submit/i }).click();
    // Confirmation page
    await expect(page).toHaveURL(/confirmation/);
    await expect(page.getByText(/OPP-/)).toBeVisible();
    await expect(page.getByText(/does not imply acceptance/i)).toBeVisible();
  });
});
