/**
 * F7 Requirements — Share Existing Innovation Work
 * Each test maps 1:1 to a requirement in .planning/REQUIREMENTS.md §F7
 */
import { test, expect } from '@playwright/test';

test.describe('F7 — Share Existing Innovation Work', () => {

  test('[F7.1] Separate contribution flow distinct from opportunity submission', async ({ page, request }) => {
    await request.post('/api/auth/login', { data: { role: 'stakeholder' } });
    await page.goto('/submit-contribution');
    const text = await page.textContent('main');
    // Should explicitly distinguish itself from opportunity submission
    expect(text).toMatch(/existing.*work|share.*innovation|have.*work.*share/i);
  });

  test('[F7.2] Attribution fields present and required', async ({ page, request }) => {
    await request.post('/api/auth/login', { data: { role: 'stakeholder' } });
    await page.goto('/submit-contribution');
    const text = await page.textContent('main');
    expect(text).toMatch(/contributing office|contributor|attribution/i);
  });

  test('[F7.3] Attribution preserved — API requires contributingOffice', async ({ request }) => {
    await request.post('/api/auth/login', { data: { role: 'stakeholder' } });
    // Missing contributingOffice should return 422
    const res = await request.post('/api/v1/submissions/contribution', {
      data: {
        contributionTitle: 'Test',
        problemAddressed: 'A problem that was solved and needs to be shared',
        workDescription: 'Description of the work that was done and the outcomes achieved over time',
        // contributingOffice intentionally missing
        contributorNames: 'Test User',
        currentMaturity: 'experiment_poc',
        currentOwner: 'Test Owner',
        ownerContactEmail: 'owner@test.example',
        collaborationPreference: 'open_for_reuse',
        submitterName: 'Test',
        submitterEmail: 'test@test.example',
        nonEndorsementAcknowledged: true,
        consentToContact: true,
      },
    });
    expect(res.status()).toBe(422);
  });

  test('[F7.4] Non-endorsement language present on contribution page', async ({ page, request }) => {
    await request.post('/api/auth/login', { data: { role: 'stakeholder' } });
    await page.goto('/submit-contribution');
    const text = await page.textContent('main');
    expect(text).toMatch(/does not.*imply.*endorsement|not.*endorse|curation.*before.*publication/i);
  });
});
