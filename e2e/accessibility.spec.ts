import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// WCAG 2.1 AA accessibility verification
// Critical violations block launch (per PRD §9 NFR: Accessibility)

const PUBLIC_PAGES_TO_TEST = [
  { path: '/', name: 'Home' },
  { path: '/catalog', name: 'Innovation Catalog' },
  { path: '/search', name: 'Search' },
  { path: '/login', name: 'Login' },
];

test.describe('Accessibility — WCAG 2.1 AA (PRD §9)', () => {
  for (const { path, name } of PUBLIC_PAGES_TO_TEST) {
    test(`${name} (${path}) — 0 critical accessibility violations`, async ({ page }) => {
      await page.goto(path);
      
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      
      // Critical violations BLOCK launch per PRD §9
      const criticalViolations = results.violations.filter(v => v.impact === 'critical');
      
      if (criticalViolations.length > 0) {
        const descriptions = criticalViolations.map(v =>
          `[${v.impact}] ${v.id}: ${v.description}\n  Nodes: ${v.nodes.map(n => n.target).join(', ')}`
        ).join('\n\n');
        throw new Error(`${criticalViolations.length} critical accessibility violation(s) on ${path}:\n\n${descriptions}`);
      }
      
      expect(criticalViolations.length, `Critical violations on ${name}`).toBe(0);
      
      // Log serious violations as warnings (non-blocking for MVP — should be fixed before release)
      const seriousViolations = results.violations.filter(v => v.impact === 'serious');
      if (seriousViolations.length > 0) {
        console.warn(`\nWarning: ${seriousViolations.length} serious (non-critical) violation(s) on ${path}:`);
        seriousViolations.forEach(v => console.warn(`  - ${v.id}: ${v.description}`));
      }
    });
  }

  test('Catalog record detail page — 0 critical violations', async ({ page }) => {
    // Get a record slug from catalog
    await page.goto('/catalog');
    const firstLink = page.getByRole('article').first().getByRole('link').first();
    await firstLink.click();
    await page.waitForLoadState('networkidle');
    
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    
    const criticalViolations = results.violations.filter(v => v.impact === 'critical');
    expect(criticalViolations.length, 'Critical violations on record detail page').toBe(0);
  });

  test('Skip to main content link is functional', async ({ page }) => {
    await page.goto('/catalog');
    // Tab once to focus the skip link
    await page.keyboard.press('Tab');
    const skipLink = page.getByText(/skip to main content/i);
    await expect(skipLink).toBeFocused();
    // Activate skip link
    await page.keyboard.press('Enter');
    // Main content should be focused
    const mainContent = page.locator('#main-content');
    await expect(mainContent).toBeFocused();
  });

  test('All interactive elements have accessible names', async ({ page }) => {
    await page.goto('/catalog');
    
    // All buttons must have accessible names
    const buttons = page.getByRole('button');
    const count = await buttons.count();
    for (let i = 0; i < count; i++) {
      const name = await buttons.nth(i).getAttribute('aria-label') ??
                   await buttons.nth(i).textContent();
      expect(name?.trim(), `Button ${i} has no accessible name`).toBeTruthy();
    }
  });

  test('Form inputs have associated labels', async ({ page }) => {
    await page.goto('/search');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a'])
      .analyze();
    
    // label-related violations specifically
    const labelViolations = results.violations.filter(v =>
      v.id === 'label' || v.id === 'label-content-name-mismatch'
    );
    expect(labelViolations.length, 'Form labels missing').toBe(0);
  });
});
