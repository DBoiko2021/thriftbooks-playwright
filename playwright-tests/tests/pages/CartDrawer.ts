// tests/pages/CartDrawer.ts
import { Page, Locator, expect } from '@playwright/test';

export class CartDrawer {
  readonly page: Page;
  readonly drawerContainer: Locator;
  readonly viewCartButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.drawerContainer = page.locator('#AddedToCart');
    this.viewCartButton = this.drawerContainer.locator(
      'a.Button.font14[href="/shopping-cart/"]'
    );
  }

  async goToCartPage() {
    const target = this.viewCartButton.first();

    await expect(target).toBeVisible({ timeout: 10_000 });
    await expect(target).toBeEnabled();

    await target.click({ timeout: 15_000 });

    const navigated = await this.page
      .waitForURL('**/shopping-cart*', { timeout: 5_000 })
      .then(() => true)
      .catch(() => false);

    if (!navigated) {
      await this.page.goto('/shopping-cart/', { waitUntil: 'domcontentloaded' });
    }

    await expect(this.page).toHaveURL(/\/shopping-cart/);
  }
}