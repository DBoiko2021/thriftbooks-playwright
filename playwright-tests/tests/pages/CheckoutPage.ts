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

  async waitForLoaded(): Promise<void> {
  await this.page.waitForLoadState('networkidle', { timeout: 15_000 });
  
  console.log('[Checkout/OrderReview] Current URL:', this.page.url());
  
  const url = this.page.url();
  if (url.endsWith('/checkout/') && !url.includes('/review')) {
    throw new Error('Still on Guest Login page (/checkout/), not Order Review');
  }
  
  console.log('[Checkout/OrderReview] Page stabilized');
}

  async placeOrder(): Promise<void> {
    await this.waitForLoaded();

    const count = await this.placeOrderSubmit.count();
    console.log('[Checkout/OrderReview] Place Order buttons found:', count);

    const submit = this.placeOrderSubmit.first();

    await expect(submit).toBeVisible({ timeout: 15_000 });
    await expect(submit).toBeEnabled({ timeout: 5_000 });

    console.log('[Checkout/OrderReview] Clicking Place Order');
    await submit.click({ timeout: 10_000 });
    
    console.log('[Checkout/OrderReview] Place Order clicked');
  }
}