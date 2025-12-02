// tests/e2e/label-verification.spec.ts
import { test, expect } from '@playwright/test';
import path from 'path';

// Helper to upload image and fill form
const verifyLabel = async (page: any, imagePath: string, data: any) => {
  await page.goto('http://localhost:3000');

  // Fill form
  await page.getByLabel('Beverage Category').selectOption(data.category || 'auto');
  await page.getByLabel('Brand Name').fill(data.brandName);
  await page.getByLabel(/Class|Varietal|Style/).fill(data.productClass);
  await page.getByLabel('Alcohol Content').fill(data.alcoholContent);
  if (data.netContents) {
    await page.getByLabel('Net Contents').fill(data.netContents);
  }

  // Upload image
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(path.join(__dirname, '..', 'fixtures', imagePath));

  // Submit
  await page.getByRole('button', { name: /Verify Label/ }).click();

  // Wait for result
  await page.waitForSelector('text=LABEL MATCHES APPLICATION', { timeout: 15000 });
};

test.describe('TTB Alcohol Label Verifier - End-to-End Tests', () => {
  test('Old Tom Distillery Bourbon - Perfect Match', async ({ page }) => {
    await verifyLabel(page, 'old-tom-bourbon.jpg', {
      brandName: 'Old Tom Distillery',
      productClass: 'Kentucky Straight Bourbon Whiskey',
      alcoholContent: '45',
      netContents: '750 mL',
    });

    await expect(page.getByText('LABEL MATCHES APPLICATION')).toBeVisible();
    await expect(page.getByText('"Old Tom Distillery" Found')).toBeVisible();
    await expect(page.getByText('Government Health Warning – EXACT')).toBeVisible();
  });

  test('Hawk’s Shadow Orange Muscat - Wine with Sulfites', async ({ page }) => {
    await verifyLabel(page, 'hawks-shadow-muscat.png', {
      brandName: "Hawk's Shadow Estate",
      productClass: 'Orange Muscat',
      alcoholContent: '13.68',
    });

    await expect(page.getByText('LABEL MATCHES APPLICATION')).toBeVisible();
    await expect(page.getByText('"Hawk\'s Shadow Estate" Found')).toBeVisible();
    await expect(page.getByText('Sulfite Declaration')).toBeVisible();
  });

  test('Beer Label - IPA with Alc/Vol', async ({ page }) => {
    await verifyLabel(page, 'ipa-beer-label.jpg', {
      category: 'beer',
      brandName: 'Tree House Brewing',
      productClass: 'Double IPA',
      alcoholContent: '8.2',
    });

    await expect(page.getByText('LABEL MATCHES APPLICATION')).toBeVisible();
  });


});