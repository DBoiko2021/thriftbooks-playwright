// playwright-tests/tests/pages/GuestLoginPage.ts
import { Page, Locator, expect } from '@playwright/test';

export class GuestLoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly confirmEmailInput: Locator;
  readonly continueButton: Locator;

  private readonly createAccountCheckbox: Locator;
  private readonly createAccountCheckboxVisual: Locator;

  constructor(page: Page) {
    this.page = page;

    const checkboxLabel = page.locator('label.Checkbox', {
      hasText: 'Create an account or uncheck for guest checkout',
    });
    this.createAccountCheckbox = checkboxLabel.locator('input[type="checkbox"]');
    this.createAccountCheckboxVisual = checkboxLabel.locator('.Checkbox-state');

    this.emailInput = page.getByRole('textbox', {
      name: 'New Customer Email Address',
      exact: true,
    });
    this.confirmEmailInput = page.getByRole('textbox', {
      name: 'New Customer Email Address Confirmation',
      exact: true,
    });

    this.continueButton = page.getByRole('button', { name: /^continue$/i });
  }

  async waitForLoaded() {
  await this.page.waitForLoadState('networkidle', { timeout: 15_000 });
  
  await Promise.all([
    expect(this.emailInput).toBeVisible({ timeout: 15_000 }),
    expect(this.confirmEmailInput).toBeVisible({ timeout: 15_000 }),
    expect(this.continueButton).toBeVisible({ timeout: 15_000 }),
  ]);
}

  async switchToGuestCheckout() {
    await this.waitForLoaded();

    const isVisible = await this.createAccountCheckbox.isVisible().catch(() => false);
    if (!isVisible) return;

    const isChecked = await this.createAccountCheckbox.isChecked();
    if (!isChecked) return;

    await this.createAccountCheckboxVisual.click({ timeout: 15_000 });

    await expect(this.createAccountCheckbox).not.toBeChecked({
      timeout: 5_000,
    });
  }

  async enterGuestEmail(email: string) {
    await this.emailInput.fill(email);
    await this.confirmEmailInput.fill(email);
  }

  async continue() {
    await this.continueButton.click({ timeout: 15_000 });
  }

  async guestCheckout(email: string) {
    await this.switchToGuestCheckout();
    await this.enterGuestEmail(email);
    
    console.log('[GuestLogin] Before continue, URL:', this.page.url());
    await this.continue();
    
    await this.page.waitForURL((url) => !url.pathname.endsWith('/checkout/'), { 
      timeout: 15_000 
    });
    
    console.log('[GuestLogin] After continue, URL:', this.page.url());
  }
}