// tests/pages/CartPage.ts
import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  private readonly proceedToCheckoutLinks: Locator;

  constructor(page: Page) {
    this.page = page;
    this.proceedToCheckoutLinks = page.locator('a.ShoppingCart-proceedButton');
  }

  async waitForLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/shopping-cart/i);
  }

  async proceedToCheckout(): Promise<void> {
    await this.waitForLoaded();

    const visibleLink = this.proceedToCheckoutLinks.locator('visible=true').first();
    
    await expect(visibleLink).toBeVisible({ timeout: 10_000 });
    await expect(visibleLink).toBeEnabled({ timeout: 7_000 });

    await visibleLink.click();

    await expect(this.page).toHaveURL(/\/checkout/i, { timeout: 7_000 });
  }
}