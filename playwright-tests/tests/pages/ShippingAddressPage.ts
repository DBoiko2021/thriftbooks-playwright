// playwright-tests/tests/pages/ShippingAddressPage.ts
import { Page, Locator, expect } from '@playwright/test';

export type ShippingAddress = {
  firstName: string;
  lastName: string;
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  useSuggestion?: boolean;
};

export class ShippingAddressPage {
  readonly page: Page;
  readonly header: Locator;

  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly address1Input: Locator;
  readonly cityInput: Locator;
  readonly stateSelect: Locator;
  readonly postalCodeInput: Locator;

  readonly firstSuggestion: Locator;
  readonly continueToPaymentButton: Locator;

  readonly uspsModal: Locator;
  readonly uspsUseSelectedAddressButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.header = page.locator('h1.Shipping-Header', {
      hasText: 'Add a Shipping Address',
    });

    this.firstNameInput = page.getByLabel('Enter First Name');
    this.lastNameInput = page.getByLabel('Enter Last Name');
    this.address1Input = page.getByLabel('Enter Address or PO Box');
    this.cityInput = page.getByLabel('Enter City');
    this.stateSelect = page.getByLabel('Enter State');
    this.postalCodeInput = page.getByLabel('Enter Zip Code');

    this.firstSuggestion = page.locator('.Address-Suggestion').first();

    this.continueToPaymentButton = page.getByRole('button', {
      name: /continue to payment/i,
    });

    this.uspsModal = page.locator('.BasicModal-Container').filter({
      has: page.locator('h2', { hasText: 'Please confirm your address' }),
    });

    this.uspsUseSelectedAddressButton = this.uspsModal.locator(
      'button.BasicModal-Button.ml8',
      { hasText: 'Use Selected Address' },
    );
  }

  async waitForLoaded() {
    await this.page.waitForLoadState('networkidle', { timeout: 15_000 });
    
    await expect(this.header).toBeVisible({ timeout: 15_000 });
    await expect(this.address1Input).toBeVisible({ timeout: 15_000 });
  }

  private async tryPickFirstSuggestionIfAppears(): Promise<boolean> {
    const suggestionAppeared = await this.firstSuggestion
      .waitFor({ state: 'visible', timeout: 2_000 })
      .then(() => true)
      .catch(() => false);

    if (!suggestionAppeared) return false;

    await this.firstSuggestion.click();

    const applied = await expect
      .poll(async () => {
        const zip = await this.postalCodeInput.inputValue().catch(() => '');
        const city = await this.cityInput.inputValue().catch(() => '');
        return zip !== '' || city !== '';
      })
      .toBeTruthy()
      .then(() => true)
      .catch(() => false);

    return applied;
  }

  async fillAddress(data: ShippingAddress) {
    await this.waitForLoaded();

    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.address1Input.fill(data.addressLine1);

    const useSuggestion = data.useSuggestion ?? true;
    if (useSuggestion) {
      const picked = await this.tryPickFirstSuggestionIfAppears();
      if (picked) return;
    }

    await this.cityInput.fill(data.city);
    await this.stateSelect.selectOption({ value: data.state });
    await this.postalCodeInput.fill(data.postalCode);
  }

  async continueToPayment() {
    await expect(this.continueToPaymentButton).toBeVisible({ timeout: 15_000 });
    await this.continueToPaymentButton.click();

    const modalVisible = await this.uspsModal
      .waitFor({ state: 'visible', timeout: 5_000 })
      .then(() => true)
      .catch(() => false);

    if (modalVisible) {
      await this.uspsUseSelectedAddressButton.waitFor({
        state: 'visible',
        timeout: 10_000,
      });
      await this.uspsUseSelectedAddressButton.click();
    }

    await expect(this.header).toBeHidden({ timeout: 15_000 });
  }
}