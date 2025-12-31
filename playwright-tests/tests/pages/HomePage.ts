// playwright-tests/tests/pages/HomePage.ts
import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly loginButton: Locator;
  readonly bookLinks: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginButton = page.getByText(/Hi Reader\s*Log In/);
    this.bookLinks = page.locator('a[href^="/w/"]');
  }

  async open() {
    await this.page.goto('/');
    await expect(this.page).toHaveURL('/', { timeout: 10_000 });
  }

  async clickLogin() {
    await this.loginButton.click({ timeout: 15_000 });
  }

  async openFirstBook() {
    await expect(this.page).toHaveURL('/');
    
    const firstBook = this.bookLinks.first();
    await expect(firstBook).toBeVisible({ timeout: 15_000 });
    
    await firstBook.click({ timeout: 15_000 });
  }
}