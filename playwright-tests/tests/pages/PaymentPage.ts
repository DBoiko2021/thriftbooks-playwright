// playwright-tests/tests/pages/PaymentPage.ts
import { Page, Locator, expect } from '@playwright/test';

export class PaymentPage {
  readonly page: Page;
  readonly continueToPaymentButton: Locator;
  readonly continueToOrderReviewButton: Locator;
  readonly placeOrderButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.continueToPaymentButton = page.getByRole('button', {
      name: /continue\s*to\s*payment/i,
    });

    this.continueToOrderReviewButton = page.getByRole('button', {
      name: /continue\s*to\s*order\s*review/i,
    });

    this.placeOrderButton = page.getByRole('button', {
      name: /place\s*order/i,
    });
  }

  async waitForLoaded() {
    await this.page.waitForLoadState('networkidle', { timeout: 15_000 });

    const placeOrderVisible = await this.placeOrderButton
      .isVisible()
      .catch(() => false);

    if (placeOrderVisible) return;

    const anyButtonVisible = await Promise.race([
      this.continueToPaymentButton
        .waitFor({ state: 'visible', timeout: 15_000 })
        .then(() => true)
        .catch(() => false),
      this.continueToOrderReviewButton
        .waitFor({ state: 'visible', timeout: 15_000 })
        .then(() => true)
        .catch(() => false),
    ]);

    if (!anyButtonVisible) {
      throw new Error(
        'PaymentPage: neither Continue to Payment nor Continue to Order Review became visible.',
      );
    }
  }

  async continueToOrderReview() {
    await this.waitForLoaded();

    const placeOrderVisible = await this.placeOrderButton
      .isVisible()
      .catch(() => false);

    if (placeOrderVisible) return;

    const onShippingStep = await this.continueToPaymentButton
      .isVisible()
      .catch(() => false);

    if (onShippingStep) {
      await expect(this.continueToPaymentButton).toBeEnabled({ timeout: 15_000 });
      await this.continueToPaymentButton.click();

      await this.continueToOrderReviewButton.waitFor({
        state: 'visible',
        timeout: 15_000,
      });
    }

    await expect(this.continueToOrderReviewButton).toBeEnabled({ timeout: 15_000 });
    await this.continueToOrderReviewButton.click();

    await this.page
      .waitForURL('**/checkout*', { timeout: 5_000 })
      .catch(() => {});
  }
}