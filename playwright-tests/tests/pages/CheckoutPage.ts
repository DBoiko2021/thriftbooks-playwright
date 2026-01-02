// playwright-tests/tests/pages/CheckoutPage.ts
import { Page, Locator, expect } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  private readonly placeOrderSubmit: Locator;

  constructor(page: Page) {
    this.page = page;
    this.placeOrderSubmit = page.locator(
      'input[type="submit"][value="Place Order"]',
    );
  }

  async waitForLoaded() {
    await this.page.waitForLoadState('networkidle');
    await expect(this.page).not.toHaveURL(/\/checkout\/?$/);
  }

  async placeOrder() {
    const submit = this.placeOrderSubmit.first();
    
    await expect(submit).toBeVisible();
    await submit.click();
  }
}