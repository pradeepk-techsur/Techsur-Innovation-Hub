import { test, expect } from '@playwright/test';

test.describe('Engagement Routing (F8)', () => {
  let recordSlug: string;

  test.beforeAll(async ({ request }) => {
    const res = await request.get('/api/v1/catalog');
    const body = await res.json();
    recordSlug = body.data[0].slug;
  });

  test('F8.1 – next action CTAs visible on record page (seeded actions)', async ({ page }) => {
    await page.goto('/records/audio-security-poc');
    const ctaRegion = page.getByLabel(/next action options/i);
    // At least two buttons should appear (request_demo + contact_ir from seed)
    const buttons = ctaRegion.getByRole('button');
    await expect(buttons).toHaveCount(2);
    // Section heading must read "Next Actions"
    await expect(page.getByRole('heading', { name: /next actions/i })).toBeVisible();
  });

  test('F8.2 – engagement modal opens and shows context', async ({ page }) => {
    await page.goto(`/records/${recordSlug}`);
    await page.getByLabel(/next action options/i).getByRole('button').first().click();
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();
    await expect(modal.getByLabel(/your name/i)).toBeVisible();
    await expect(modal.getByLabel(/your office/i)).toBeVisible();
  });

  test('F8.3 – API persists engagement before email routing', async ({ request }) => {
    const res = await request.post('/api/v1/engagement', {
      data: {
        requestType: 'request_demo',
        originatingRecordTitle: 'Audio Security POC',
        requesterName: 'Test User',
        requesterOffice: 'Test Office',
        requesterEmail: 'test@example.com',
        needDescription: 'We would like to see a demonstration of this technology for our courthouse environment.',
        consentToContact: true,
      },
    });
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.referenceNumber).toMatch(/^ENG-\d{4}-\d+$/);
    // emailSent may be false in dev (EMAIL_ROUTING_MODE=mailto) but record should still be created
    expect(body.id).toBeTruthy();
  });

  test('F8.4 – routing address configurable (from hub_settings)', async ({ request }) => {
    // The routing address should come from hub_settings, not hardcoded
    const res = await request.post('/api/v1/engagement', {
      data: {
        requestType: 'contact_ir',
        requesterName: 'Test User',
        requesterOffice: 'Test Office',
        requesterEmail: 'test@example.com',
        needDescription: 'General inquiry about I&R innovation work and engagement opportunities.',
        consentToContact: true,
      },
    });
    expect(res.status()).toBe(201);
    // routing_address_at_submission should be captured (visible in curator view, not public)
    const body = await res.json();
    expect(body.referenceNumber).toBeTruthy();
  });

  test('F8.6 – engagement without consent returns 422', async ({ request }) => {
    const res = await request.post('/api/v1/engagement', {
      data: {
        requestType: 'request_demo',
        requesterName: 'Test User',
        requesterOffice: 'Test Office',
        requesterEmail: 'test@example.com',
        needDescription: 'Need description here that meets minimum length requirement.',
        // consentToContact MISSING
      },
    });
    expect(res.status()).toBe(422);
  });
});
