import { test, expect } from '@playwright/test';
import { setupPlaywrightEnvironment } from './setup-playwright-environment/helpers.js';

test.describe('smoke tests', () => {
  test('Can call /companies', async ({ page }) => {
    await setupPlaywrightEnvironment({
      page
    });

    const companies = await page.evaluate(async () => {
      return await window.reactorSdk.listCompanies();
    });

    expect(Array.isArray(companies.data)).toBe(
      true,
      'companies.data should be an array'
    );
    expect(companies.data.length).toBeGreaterThan(
      0,
      'companies.data should have at least one company'
    );
  });
});
