// playwright-tests/tests/pages/LoginPage.ts
import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByRole('textbox', { name: 'Email Address' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: 'Log In' });
  }

  async waitForLoaded() {
    await this.page.waitForLoadState('networkidle');
    await expect(this.emailInput).toBeVisible();
  }

  async login(
    email: string = process.env.TB_TEST_EMAIL ?? '',
    password: string = process.env.TB_TEST_PASSWORD ?? ''
  ) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    
    await this.page.waitForURL('/');
  }
}