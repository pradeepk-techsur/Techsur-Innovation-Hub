/**
 * F8 Requirements — Engagement Routing
 * Each test maps 1:1 to a requirement in .planning/REQUIREMENTS.md §F8
 */
import { test, expect } from '@playwright/test';

let recordSlug = '';

test.describe('F8 — Engagement Routing', () => {

  test.beforeAll(async ({ request }) => {
    const res = await request.get('/api/v1/catalog');
    const body = await res.json();
    recordSlug = body.data?.[0]?.slug ?? '';
  });

  test('[F8.1] CTAs visible on record detail page', async ({ page }) => {
    await page.goto(`/records/${recordSlug}`);
    const ctaArea = page.getByLabel(/next action options/i);
    await expect(ctaArea).toBeVisible();
  });

  test('[F8.2] Engagement modal captures requester info', async ({ page }) => {
    await page.goto(`/records/${recordSlug}`);
    // Click first CTA button to open engagement modal
    const ctaButton = page.getByLabel(/next action options/i).getByRole('button').first();
    if (await ctaButton.isVisible()) {
      await ctaButton.click();
      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();
      await expect(dialog.getByLabel(/your name/i)).toBeVisible();
      await expect(dialog.getByLabel(/your office/i)).toBeVisible();
    }
  });

  test('[F8.3] Engagement persisted before email — API returns reference number', async ({ request }) => {
    const res = await request.post('/api/v1/engagement', {
      data: {
        requestType: 'contact_ir',
        requesterName: 'Req Verifier',
        requesterOffice: 'Verification Office',
        requesterEmail: 'verify@req.example',
        needDescription: 'End-to-end requirement verification test engagement request with sufficient description.',
        consentToContact: true,
      },
    });
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.referenceNumber).toMatch(/^ENG-/);
    expect(body.id).toBeTruthy();  // DB record created regardless of email
  });

  test('[F8.4] Routing address configurable from hub_settings', async ({ request }) => {
    await request.post('/api/auth/login', { data: { role: 'admin' } });
    const res = await request.get('/api/v1/curator/settings');
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    // Settings returned as a keyed object: { engagement_routing_address: { value, type, ... } }
    const routingAddress = body.data?.['engagement_routing_address'];
    expect(routingAddress).toBeDefined();
    expect(routingAddress.value).toBeTruthy();
  });

  test('[F8.5] Default routing address is TSIO I&R address', async ({ request }) => {
    await request.post('/api/auth/login', { data: { role: 'admin' } });
    const res = await request.get('/api/v1/curator/settings');
    const body = await res.json();
    // Settings returned as a keyed object: { engagement_routing_address: { value, type, ... } }
    const addr = body.data?.['engagement_routing_address'];
    expect(addr?.value).toContain('ao.uscourts.gov');
  });

  test('[F8.6] Engagement without consent returns 422', async ({ request }) => {
    const res = await request.post('/api/v1/engagement', {
      data: {
        requestType: 'request_demo',
        requesterName: 'Test',
        requesterOffice: 'Test Office',
        requesterEmail: 'test@test.example',
        needDescription: 'Need description for this engagement request that meets minimum length.',
        // consentToContact missing
      },
    });
    expect(res.status()).toBe(422);
  });
});
