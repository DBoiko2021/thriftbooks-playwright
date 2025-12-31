// playwright-tests/tests/pages/PostCheckoutPage.ts
import { Page, Locator, expect } from '@playwright/test';

export class PostCheckoutPage {
  readonly page: Page;
  readonly confirmationHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.confirmationHeader = page.getByText('Thank you for your order (#');
  }

  async waitForLoaded() {
  await this.page.waitForLoadState('networkidle', { timeout: 15_000 });
  await expect(this.confirmationHeader).toBeVisible({ timeout: 15_000 });
}
}