import { test, expect, Page, BrowserContext } from '@playwright/test';

test.describe.serial('basic user flow', () => {
  let context: BrowserContext;
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext({
      permissions: ['geolocation'],
      geolocation: { latitude: 48.8566, longitude: 2.3522 }
    });
    page = await context.newPage();
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

test('create-profile', async () => {
  // Generate unique email using Unix timestamp in milliseconds
  const timestamp = Date.now();
  const uniqueEmail = `playwright_test_${timestamp}@email.com`;

  await page.goto('http://localhost:4200/');
  await page.getByRole('button', { name: 'Continue As Guest' }).click();
  await expect(page.locator('app-home')).toContainText('Set your name and claim your account! This ensures you\'re able to recover your account if signed out.');
  await page.getByText('Set your name and claim your').click();
  await page.locator('#ion-input-2').click();
  await page.locator('#ion-input-2').fill('playwright_test');
  await page.locator('#ion-input-3').click();
  await page.locator('#ion-input-3').fill('test');
  await page.locator('#ion-input-4').click();
  await page.locator('#ion-input-4').fill(uniqueEmail);
  await page.locator('#ion-input-7').click();
  await page.locator('#ion-input-7').fill('playwright_test');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.locator('ion-tabs')).toContainText('playwright_test test');
});

test('create-event', async () => {
  
  await page.locator('#tab-button-home > .ios > .icon-inner > .ionicon').click();
  await page.locator('ion-fab-button > .ios > .icon-inner > .ionicon').first().click();
  await page.locator('circle').first().click();
  await page.getByRole('textbox', { name: '*' }).click();
  await page.getByRole('textbox', { name: '*' }).fill('playwright_test_event');
  await page.locator('input[name="ion-input-11"]').click();
  await page.locator('input[name="ion-input-11"]').fill('0');
  await page.locator('input[name="ion-input-12"]').click();
  await page.locator('input[name="ion-input-12"]').fill('2');
  await page.locator('#ion-textarea-0').click();
  await page.locator('#ion-textarea-0').fill('description of event');
  await page.locator('#ion-input-13').click();
  await page.getByRole('searchbox', { name: 'search text' }).click();
  await page.getByRole('searchbox', { name: 'search text' }).fill('paris');
  await page.waitForTimeout(500);
  await page.getByText(/france/i).first().click({ force: true });
  await page.getByRole('button', { name: 'Select Location' }).click();
  await page.getByRole('button', { name: 'Upload Image' }).click();
  await page.getByRole('button', { name: 'Select Picture' }).click();
  await page.setInputFiles('input[type="file"]', 'resources/icon.png');
  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page.locator('ion-card-title')).toContainText('playwright_test_event');
  await page.waitForSelector('app-event-card img', { state: 'visible', timeout: 10000 });
  await expect(page.locator('app-event-card img')).toBeVisible();

});

test('create-place', async () => {
  await page.locator('#tab-button-home').getByRole('tab').click();
  await page.locator('#main').getByRole('button').first().click();
  await page.getByRole('button').nth(2).click();
  await page.getByRole('textbox', { name: '*' }).click();
  await page.getByRole('textbox', { name: '*' }).fill('playwright_test_place');
  await page.keyboard.press('Tab');
  await page.keyboard.type('Place Description');
  await page.getByTestId('location-input').click();
  await page.getByRole('searchbox', { name: 'search text' }).click();
  await page.getByRole('searchbox', { name: 'search text' }).fill('london');
  await page.waitForTimeout(500);
  await page.getByText(/england/i).first().click({ force: true });
  await page.getByRole('button', { name: 'Select Location' }).click();
  await page.getByRole('button', { name: 'Upload Image' }).click();
  await page.getByRole('button', { name: 'Select Picture' }).click();
  await page.setInputFiles('input[type="file"]', 'resources/icon.png');
  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page.locator('app-hub-card')).toContainText('playwright_test_place');
});
});