import { test, expect } from '@playwright/test';
import { DEMO_URLS } from '../fixtures/test-data';
import fs from 'node:fs';
import path from 'node:path';

const FIXTURE_IMAGE = fs.readFileSync(
  path.resolve(__dirname, '../fixtures/input-picsum-800x600.jpg'),
);

test.describe('Cropper', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('https://picsum.photos/**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'image/jpeg',
        body: FIXTURE_IMAGE,
      });
    });
    await page.route('https://invalid.example/**', (route) => {
      route.fulfill({ status: 404 });
    });
    await page.goto(DEMO_URLS.cropper);
  });

  test('cropper route renders oic-cropper component', async ({ page }) => {
    await expect(page.locator('oic-cropper').first()).toBeAttached();
  });

  test('canvas element becomes visible after image loads', async ({ page }) => {
    const canvas = page.locator('section:has(h2#basic-cropper) canvas').first();
    await expect(canvas).toBeAttached({ timeout: 10000 });
  });

  test('zoom in increases zoom level', async ({ page }) => {
    const section = page.locator('section:has(h2#basic-cropper)');
    await section.locator('canvas').waitFor({ state: 'attached', timeout: 10000 });
    const zoomDisplay = section.locator('oic-cropper').locator('text=/\\d+%/');
    await expect(zoomDisplay).toBeVisible();
    const initialText = await zoomDisplay.textContent();
    const initialZoom = parseInt(initialText ?? '100', 10);

    await section.getByLabel('Zoom In').click();
    await page.waitForTimeout(300);
    const afterText = await zoomDisplay.textContent();
    const afterZoom = parseInt(afterText ?? '100', 10);
    expect(afterZoom).toBeGreaterThan(initialZoom);
  });

  test('zoom out decreases zoom level', async ({ page }) => {
    const section = page.locator('section:has(h2#basic-cropper)');
    await section.locator('canvas').waitFor({ state: 'attached', timeout: 10000 });
    const zoomDisplay = section.locator('oic-cropper').locator('text=/\\d+%/');
    await expect(zoomDisplay).toBeVisible();
    const initialText = await zoomDisplay.textContent();
    const initialZoom = parseInt(initialText ?? '100', 10);

    await section.getByLabel('Zoom Out').click();
    await page.waitForTimeout(300);
    const afterText = await zoomDisplay.textContent();
    const afterZoom = parseInt(afterText ?? '100', 10);
    expect(afterZoom).toBeLessThan(initialZoom);
  });

  test('rotate right updates rotation display', async ({ page }) => {
    const section = page.locator('section:has(h2#basic-cropper)');
    await section.locator('canvas').waitFor({ state: 'attached', timeout: 10000 });
    const rotationInfo = section.locator('oic-cropper').locator('span.oic-cropper-toolbar__rotation-info');
    await expect(rotationInfo).toBeAttached();
    const initialText = await rotationInfo.textContent();
    const initialRotation = parseInt(initialText?.replace('/ ', '').replace('°', '') ?? '0', 10);

    await section.getByLabel('Rotate Right').click();
    await page.waitForTimeout(300);
    const afterText = await rotationInfo.textContent();
    const afterRotation = parseInt(afterText?.replace('/ ', '').replace('°', '') ?? '0', 10);
    expect(afterRotation).toBe((initialRotation + 90) % 360);
  });

  test('rotate left updates rotation display', async ({ page }) => {
    const section = page.locator('section:has(h2#basic-cropper)');
    await section.locator('canvas').waitFor({ state: 'attached', timeout: 10000 });
    const rotationInfo = section.locator('oic-cropper').locator('span.oic-cropper-toolbar__rotation-info');
    await expect(rotationInfo).toBeAttached();
    const initialText = await rotationInfo.textContent();
    const initialRotation = parseInt(initialText?.replace('/ ', '').replace('°', '') ?? '0', 10);

    await section.getByLabel('Rotate Left').click();
    await page.waitForTimeout(300);
    const afterText = await rotationInfo.textContent();
    const afterRotation = parseInt(afterText?.replace('/ ', '').replace('°', '') ?? '0', 10);
    expect(afterRotation).toBe((initialRotation - 90 + 360) % 360);
  });

  test('cropped result image appears after image load', async ({ page }) => {
    const section = page.locator('section:has(h2#basic-cropper)');
    await section.locator('canvas').waitFor({ state: 'attached', timeout: 10000 });
    const preview = section.locator('img.cropper-demo__preview');
    await expect(preview).toBeVisible({ timeout: 5000 });
  });

  test('error handling shows error message with invalid URL', async ({ page }) => {
    const section = page.locator('section:has(h2#error-state)');
    await section.getByRole('button', { name: 'Invalid Image' }).click();
    const errorText = section.getByText(/Failed to load image/);
    await expect(errorText).toBeVisible({ timeout: 10000 });
  });

  test('toolbar positions render all four croppers', async ({ page }) => {
    const section = page.locator('section:has(h2#toolbar-positions)');
    const croppers = section.locator('oic-cropper');
    await expect(croppers).toHaveCount(4);
    const labels = section.locator('p:text-is("Bottom (default)"), p:text-is("Top"), p:text-is("Left"), p:text-is("Right")');
    await expect(labels).toHaveCount(4);
  });

  test('aspect ratio select is visible in free aspect section', async ({ page }) => {
    const freeSection = page.locator('section:has(h2#free-aspect)');
    await freeSection.locator('canvas').waitFor({ state: 'attached', timeout: 10000 });
    await expect(freeSection.getByLabel('Aspect ratio')).toBeVisible();
  });

  test('aspect ratio select is not visible in fixed aspect section', async ({ page }) => {
    const squareSection = page.locator('section:has(h2#square-aspect)');
    await squareSection.locator('canvas').waitFor({ state: 'attached', timeout: 10000 });
    await expect(squareSection.getByLabel('Aspect ratio')).not.toBeVisible();
  });

  test('keyboard navigation moves crop and shows result', async ({ page }) => {
    const section = page.locator('section:has(h2#basic-cropper)');
    await section.locator('canvas').waitFor({ state: 'attached', timeout: 10000 });
    await section.locator('oic-cropper').first().focus();
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowDown');
    const preview = section.locator('img.cropper-demo__preview');
    await expect(preview).toBeVisible({ timeout: 5000 });
  });
});
