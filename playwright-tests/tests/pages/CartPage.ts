// tests/pages/CartPage.ts

import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly proceedToCheckoutLinks: Locator;
  readonly cartItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.proceedToCheckoutLinks = page.locator('.ShoppingCart-proceedButton');
    this.cartItems = page.locator('.ShoppingCartItem');
  }

  async waitForLoaded() {
    await this.page.waitForURL('**/shopping-cart/**', { timeout: 10000 });
    await this.page.waitForLoadState('networkidle', { timeout: 10000 });
    
    // CRITICAL: Wait for at least one cart item to be visible
    await expect(this.cartItems.first()).toBeVisible({ timeout: 10000 });
  }

  async proceedToCheckout() {
    await this.proceedToCheckoutLinks.locator('visible=true').first().click();
  }

  async getItemCount(): Promise<number> {
    // CRITICAL: Wait for items to be visible before counting
    await expect(this.cartItems.first()).toBeVisible({ timeout: 5000 });
    
    return await this.cartItems.count();
  }
}