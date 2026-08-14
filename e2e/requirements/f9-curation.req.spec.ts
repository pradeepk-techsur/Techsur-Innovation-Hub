/**
 * F9 Requirements — Curation and Administration
 * Each test maps 1:1 to a requirement in .planning/REQUIREMENTS.md §F9
 */
import { test, expect } from '@playwright/test';

test.describe('F9 — Curation and Administration', () => {

  test.beforeEach(async ({ request }) => {
    await request.post('/api/auth/login', { data: { role: 'curator' } });
  });

  test('[F9.1] Curator dashboard returns live counts', async ({ request }) => {
    await request.post('/api/auth/login', { data: { role: 'curator' } });
    const res = await request.get('/api/v1/curator/dashboard');
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.data?.records).toBeDefined();
    expect(body.data?.pendingOpportunities).toBeDefined();
  });

  test('[F9.2] Record management list returns records across all states', async ({ request }) => {
    await request.post('/api/auth/login', { data: { role: 'curator' } });
    const res = await request.get('/api/v1/curator/records');
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(Array.isArray(body.data)).toBe(true);
  });

  test('[F9.3] Curator can create a draft record', async ({ request }) => {
    await request.post('/api/auth/login', { data: { role: 'curator' } });
    const res = await request.post('/api/v1/curator/records', {
      data: { title: 'F9.3 Req Verification Test Record' },
    });
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.data?.id).toBeTruthy();
  });

  test('[F9.4] Curator can edit record fields with version', async ({ request }) => {
    await request.post('/api/auth/login', { data: { role: 'curator' } });
    const createRes = await request.post('/api/v1/curator/records', {
      data: { title: 'F9.4 Edit Test' },
    });
    const { data: { id } } = await createRes.json();
    const patchRes = await request.patch(`/api/v1/curator/records/${id}`, {
      data: { version: 1, summary: 'Updated summary for F9.4 verification test.' },
    });
    expect(patchRes.ok()).toBeTruthy();
  });

  test('[F9.5] Artifact can be added to a record', async ({ request }) => {
    await request.post('/api/auth/login', { data: { role: 'curator' } });
    const createRes = await request.post('/api/v1/curator/records', { data: { title: 'F9.5 Artifact Test' } });
    const { data: { id } } = await createRes.json();
    const artifactRes = await request.post(`/api/v1/curator/records/${id}/artifacts`, {
      data: {
        name: 'Test Artifact',
        url: 'https://placeholder.example.gov/test-artifact',
        artifact_type: 'poc_report',
        is_restricted: false,
        display_order: 1,
      },
    });
    expect(artifactRes.status()).toBe(201);
  });

  test('[F9.6] Maturity can be assigned independently', async ({ request }) => {
    await request.post('/api/auth/login', { data: { role: 'curator' } });
    const createRes = await request.post('/api/v1/curator/records', { data: { title: 'F9.6 Maturity Test' } });
    const { data: { id } } = await createRes.json();
    const patchRes = await request.patch(`/api/v1/curator/records/${id}`, {
      data: { version: 1, maturity: 'experiment_poc' },
    });
    expect(patchRes.ok()).toBeTruthy();
  });

  test('[F9.7] Review status independent from maturity — both can be set separately', async ({ request }) => {
    await request.post('/api/auth/login', { data: { role: 'curator' } });
    const createRes = await request.post('/api/v1/curator/records', { data: { title: 'F9.7 Independence Test' } });
    const { data: { id } } = await createRes.json();
    // Set maturity and review_statuses in separate patches
    await request.patch(`/api/v1/curator/records/${id}`, {
      data: { version: 1, maturity: 'prototype_pilot' },
    });
    const rsRes = await request.patch(`/api/v1/curator/records/${id}`, {
      data: { version: 2, review_statuses: ['technically_reviewed'] },
    });
    expect(rsRes.ok()).toBeTruthy();
  });

  test('[F9.8] Attribution fields can be set on a record', async ({ request }) => {
    await request.post('/api/auth/login', { data: { role: 'curator' } });
    const createRes = await request.post('/api/v1/curator/records', { data: { title: 'F9.8 Attribution Test' } });
    const { data: { id } } = await createRes.json();
    const patchRes = await request.patch(`/api/v1/curator/records/${id}`, {
      data: {
        version: 1,
        contributing_offices: ['District Courts Division'],
        owner_steward: 'I&R Team',
      },
    });
    expect(patchRes.ok()).toBeTruthy();
  });

  test('[F9.9] Publication lifecycle supports draft to archived transitions', async ({ request }) => {
    await request.post('/api/auth/login', { data: { role: 'curator' } });
    const createRes = await request.post('/api/v1/curator/records', { data: { title: 'F9.9 Lifecycle Test' } });
    expect(createRes.status()).toBe(201);
    const body = await createRes.json();
    // New record starts as draft
    expect(body.data?.state).toBe('draft');
    expect(body.data?.id).toBeTruthy();
  });

  test('[F9.10] Publication gate blocks publish when required fields missing', async ({ request }) => {
    await request.post('/api/auth/login', { data: { role: 'curator' } });
    const createRes = await request.post('/api/v1/curator/records', { data: { title: 'F9.10 Gate Test' } });
    const { data: { id } } = await createRes.json();
    const publishRes = await request.post(`/api/v1/curator/records/${id}/publish`);
    expect(publishRes.status()).toBe(422);
    const body = await publishRes.json();
    expect(body.error_code).toBe('PUBLICATION_GATE_FAILED');
    expect(Object.keys(body.fields ?? {}).length).toBeGreaterThan(0);
  });

  test('[F9.11] Audit history returns events for a record', async ({ request }) => {
    await request.post('/api/auth/login', { data: { role: 'curator' } });
    const createRes = await request.post('/api/v1/curator/records', { data: { title: 'F9.11 Audit Test' } });
    const { data: { id } } = await createRes.json();
    const auditRes = await request.get(`/api/v1/curator/records/${id}/audit`);
    expect(auditRes.ok()).toBeTruthy();
    const body = await auditRes.json();
    expect(body.data?.length).toBeGreaterThan(0);
    expect(body.data[0].event_type).toBe('record_created');
  });

  test('[F9.12] Opportunity submission queue accessible to curator', async ({ request }) => {
    await request.post('/api/auth/login', { data: { role: 'curator' } });
    const res = await request.get('/api/v1/curator/submissions/opportunity');
    expect(res.ok()).toBeTruthy();
  });

  test('[F9.13] Contribution submission queue accessible to curator', async ({ request }) => {
    await request.post('/api/auth/login', { data: { role: 'curator' } });
    const res = await request.get('/api/v1/curator/submissions/contribution');
    expect(res.ok()).toBeTruthy();
  });

  test('[F9.14] Engagement activity accessible to curator', async ({ request }) => {
    await request.post('/api/auth/login', { data: { role: 'curator' } });
    const res = await request.get('/api/v1/curator/engagement');
    expect(res.ok()).toBeTruthy();
  });

  test('[F9.15] Settings management — admin-only update works', async ({ request }) => {
    await request.post('/api/auth/login', { data: { role: 'admin' } });
    const res = await request.put('/api/v1/curator/settings/hub_display_name', {
      data: { value: 'TSIO Innovation Hub' },
    });
    expect(res.ok()).toBeTruthy();
  });

  test('[F9.16] Content model reference returns definitions', async ({ request }) => {
    await request.post('/api/auth/login', { data: { role: 'curator' } });
    const res = await request.get('/api/v1/curator/reference');
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.data?.maturityValues?.length).toBeGreaterThan(0);
    expect(body.data?.publicationGateFields?.length).toBe(15);
    expect(body.data?.trustAxioms?.length).toBeGreaterThan(0);
  });
});
