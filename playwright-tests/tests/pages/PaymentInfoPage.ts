// playwright-tests/tests/pages/PaymentInfoPage.ts
import { Page, Locator, FrameLocator, expect } from '@playwright/test';

type CardDetails = {
  cardNumber: string;
  cvv: string;
  expirationDate: string;
};

export class PaymentInfoPage {
  private readonly page: Page;
  private readonly paymentSection: Locator;
  private readonly creditCardRadio: Locator;
  private readonly creditCardRadioInput: Locator;

  private readonly cardNumberFrame: FrameLocator;
  private readonly cvvFrame: FrameLocator;
  private readonly expirationFrame: FrameLocator;

  private readonly cardNumberInput: Locator;
  private readonly cvvInput: Locator;
  private readonly expirationInput: Locator;

  private readonly continueToOrderReviewButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.paymentSection = page.locator('.Checkout-paymentMethodNew').first();

    this.creditCardRadio = page.locator('label.RadioButton', {
      hasText: 'Pay with credit card',
    });
    this.creditCardRadioInput = page.locator(
      'input[type="radio"]#Credit\\ Card',
    );

    this.cardNumberFrame = page.frameLocator(
      'iframe#braintree-hosted-field-number',
    );
    this.cvvFrame = page.frameLocator('iframe#braintree-hosted-field-cvv');
    this.expirationFrame = page.frameLocator(
      'iframe#braintree-hosted-field-expirationDate',
    );

    this.cardNumberInput = this.cardNumberFrame
      .locator(
        'input#credit-card-number, input[data-braintree-name="number"]',
      )
      .first();

    this.cvvInput = this.cvvFrame
      .locator('input[name="cvv"], input[data-braintree-name="cvv"]')
      .first();

    this.expirationInput = this.expirationFrame
      .locator(
        'input[data-braintree-name="expirationDate"], input[name="expiration-date"]',
      )
      .first();

    this.continueToOrderReviewButton = page.getByRole('button', {
      name: 'Continue to Order Review',
    });
  }

  async waitForReady(): Promise<void> {
  await this.page.waitForLoadState('networkidle', { timeout: 15_000 });
  
  console.log('[Payment] Waiting for payment page, URL:', this.page.url());
  
  await expect(this.paymentSection).toBeVisible({ timeout: 15_000 });

  await Promise.all([
    expect(this.cardNumberInput).toBeVisible({ timeout: 15_000 }),
    expect(this.cvvInput).toBeVisible({ timeout: 15_000 }),
    expect(this.expirationInput).toBeVisible({ timeout: 15_000 }),
  ]);
  
  console.log('[Payment] Payment fields ready');
}

  async selectCreditCardIfNeeded(): Promise<void> {
    const isChecked = await this.creditCardRadioInput
      .isChecked()
      .catch(() => false);
    
    if (isChecked) return;

    await this.creditCardRadioInput.click();
    await expect(this.creditCardRadioInput).toBeChecked();
  }

  async fillCardDetails(card: CardDetails): Promise<void> {
    await this.waitForReady();
    await this.selectCreditCardIfNeeded();

    if (!/^\d{2}\/\d{4}$/.test(card.expirationDate)) {
      throw new Error(
        `PaymentInfoPage: expirationDate must be in MM/YYYY format, got: "${card.expirationDate}"`,
      );
    }

    console.log('[Payment] Filling card details');
    await this.cardNumberInput.fill(card.cardNumber);
    await this.cvvInput.fill(card.cvv);
    await this.expirationInput.fill(card.expirationDate);
    console.log('[Payment] Card details filled');
  }

  async continueToOrderReview(): Promise<void> {
    console.log('[Payment] Before continue, URL:', this.page.url());
    
    await expect(this.continueToOrderReviewButton).toBeVisible();
    await expect(this.continueToOrderReviewButton).toBeEnabled();

    await this.continueToOrderReviewButton.click();

    await this.page.waitForURL((url) => !url.pathname.endsWith('/checkout/payment'), {
      timeout: 10_000,
    });
    
    console.log('[Payment] After continue, URL:', this.page.url());
    
    const url = this.page.url();
    if (url.endsWith('/checkout/')) {
      throw new Error('Redirected back to Guest Login page after payment step');
    }
  }
}