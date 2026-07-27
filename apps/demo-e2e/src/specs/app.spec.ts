import { test, expect } from '@playwright/test';

test.describe('Demo App', () => {
  test('should display the app title', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toHaveText('Optimus Image Cropper');
  });
});
