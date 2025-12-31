// playwright-tests/tests/pages/BookDetailsPage.ts
import { Page, Locator, expect } from '@playwright/test';

export class BookDetailsPage {
  readonly page: Page;
  readonly formatButtons: Locator;
  readonly conditionButtons: Locator;
  readonly addToCartButton: Locator;

  private readonly oneLeftBanner: Locator;

  constructor(page: Page) {
    this.page = page;

    this.formatButtons = page
      .locator('.WorkSelector-row')
      .nth(0)
      .locator('button.WorkSelector-button');

    this.conditionButtons = page
      .locator('.WorkSelector-row')
      .nth(1)
      .locator('button.WorkSelector-button');

    this.addToCartButton = page.getByRole('button', { name: /add to cart/i });

    this.oneLeftBanner = page
      .locator('.WorkSelector-sidebar')
      .getByText('Almost Gone, Only 1 Left!', { exact: true });
  }

  async waitForLoaded() {
    await expect(this.formatButtons.first()).toBeVisible({ timeout: 10_000 });
    await expect(this.conditionButtons.first()).toBeVisible({ timeout: 10_000 });
  }

  private async isOneLeft(): Promise<boolean> {
    return await this.oneLeftBanner.first().isVisible().catch(() => false);
  }

  private async pickOptionAvoidingOneLeft(
    buttons: Locator,
    kind: 'format' | 'condition',
  ) {
    const count = await buttons.count();

    if (count === 0) {
      throw new Error(`BookDetailsPage: no ${kind} buttons found.`);
    }

    for (let i = 0; i < count; i++) {
      const btn = buttons.nth(i);

      const isInteractable = await btn.isVisible() && await btn.isEnabled();
      if (!isInteractable) continue;

      await btn.click({ timeout: 10_000 });
      await this.page.waitForTimeout(150);

      if (!await this.isOneLeft()) {
        return;
      }
    }

    throw new Error(
      `BookDetailsPage: all ${kind} options resulted in "Only 1 Left". Cannot proceed reliably.`,
    );
  }

  async selectFormatAvoidingOneLeft() {
    await this.waitForLoaded();
    await this.pickOptionAvoidingOneLeft(this.formatButtons, 'format');
  }

  async selectConditionAvoidingOneLeft() {
    await this.waitForLoaded();
    await this.pickOptionAvoidingOneLeft(this.conditionButtons, 'condition');
  }

  async addToCart() {
    await expect(this.addToCartButton).toBeVisible();
    await expect(this.addToCartButton).toBeEnabled();
    await this.addToCartButton.click({ timeout: 10_000 });
  }
}