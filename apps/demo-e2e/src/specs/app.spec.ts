import { test, expect } from '@playwright/test';
import { DEMO_URLS } from '../fixtures/test-data';

test.describe('Demo App', () => {
  test('should display the app title', async ({ page }) => {
    await page.goto(DEMO_URLS.root);
    await expect(page.locator('h1')).toHaveText('Optimus Image Cropper');
  });
});
