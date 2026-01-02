// tests/pages/PostCheckoutPage.ts

import { Page, Locator, expect } from '@playwright/test';

export class PostCheckoutPage {
  readonly page: Page;
  readonly confirmationHeader: Locator;
  readonly confirmationItems: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Correct selector based on actual HTML
    this.confirmationHeader = page.locator('.OrderFinal-OrderNumber');
    this.confirmationItems = page.locator('.OrderFinal-OrderItem');
  }

  async waitForLoaded() {
    // Wait for page to load
    await this.page.waitForLoadState('networkidle', { timeout: 15000 });
    
    // Wait for confirmation header with order number
    await expect(this.confirmationHeader).toBeVisible({ timeout: 15000 });
  }

  async getItemCount(): Promise<number> {
    return await this.confirmationItems.count();
  }
}