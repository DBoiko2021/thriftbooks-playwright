// playwright-tests/tests/pages/CartDrawer.ts
import { Page, Locator, expect } from '@playwright/test';

export class CartDrawer {
  readonly page: Page;
  readonly drawerContainer: Locator;
  readonly viewCartButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.drawerContainer = page.locator('#AddedToCart');
    this.viewCartButton = this.drawerContainer.locator(
      'a.Button.font14[href="/shopping-cart/"]'
    );
    // More specific selector based on actual HTML structure
    this.continueShoppingButton = this.drawerContainer.locator(
      'button.Button:has-text("Continue Shopping")'
    );
  }

  async waitForLoaded() {
    await expect(this.drawerContainer).toBeVisible();
  }

  async goToCartPage() {
    await expect(this.viewCartButton).toBeVisible();
    await this.viewCartButton.click();

    try {
      await this.page.waitForURL(/\/shopping-cart/, { timeout: 5_000 });
    } catch {
      await this.page.goto('/shopping-cart/', { waitUntil: 'networkidle' });
    }
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
    await expect(this.drawerContainer).toBeHidden({ timeout: 5000 });
  }
}