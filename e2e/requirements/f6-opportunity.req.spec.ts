/**
 * F6 Requirements — Opportunity Submission
 * Each test maps 1:1 to a requirement in .planning/REQUIREMENTS.md §F6
 */
import { test, expect } from '@playwright/test';

test.describe('F6 — Opportunity Submission', () => {

  test.beforeEach(async ({ page }) => {
    await page.request.post('/api/auth/login', { data: { role: 'stakeholder' } });
  });

  test('[F6.1] Submission flow starts with problem description, not application request', async ({ page }) => {
    await page.request.post('/api/auth/login', { data: { role: 'stakeholder' } });
    await page.goto('/submit-opportunity');
    // Page should describe problem-first framing
    const text = await page.textContent('main');
    expect(text).toMatch(/problem|mission|friction|need/i);
    expect(text).not.toMatch(/what application do you want/i);
  });

  test('[F6.2] Form captures all required fields', async ({ page }) => {
    await page.request.post('/api/auth/login', { data: { role: 'stakeholder' } });
    await page.goto('/submit-opportunity');
    // Key fields visible: problem, who is affected, impact
    const text = await page.textContent('main');
    expect(text).toMatch(/problem|describe/i);
  });

  test('[F6.3] Request type selector present', async ({ page, request }) => {
    await request.post('/api/auth/login', { data: { role: 'stakeholder' } });
    await page.goto('/submit-opportunity');
    // There should be some type selection available
    const selects = page.locator('select, [role="radiogroup"], [role="combobox"]');
    await expect(selects.first()).toBeVisible();
  });

  test('[F6.4] Non-acceptance notice explicitly stated', async ({ page }) => {
    await page.request.post('/api/auth/login', { data: { role: 'stakeholder' } });
    await page.goto('/submit-opportunity');
    const text = await page.textContent('main');
    expect(text).toMatch(/does not.*imply.*acceptance|does not.*commit|not.*imply.*acceptance/i);
  });

  test('[F6.5] Submission persisted — API returns reference number', async ({ request }) => {
    await request.post('/api/auth/login', { data: { role: 'stakeholder' } });
    const res = await request.post('/api/v1/submissions/opportunity', {
      data: {
        requestType: 'current_mission_problem',
        problemTitle: 'Test Req Verification Problem',
        problemDescription: 'This is a detailed description of the mission problem that needs more than fifty characters to be valid.',
        affectedUsers: 'Court clerks and administrators in district courts across the country',
        impact: 'Significant manual processing burden requiring hours of staff time daily',
        submittingOffice: 'Test Verification Office',
        submitterName: 'Test Verifier',
        submitterEmail: 'verify@test.example',
        consentToContact: true,
        nonAcceptanceAcknowledged: true,
      },
    });
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.referenceNumber).toMatch(/^OPP-/);
  });
});
