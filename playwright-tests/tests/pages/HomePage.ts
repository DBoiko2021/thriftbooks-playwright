// playwright-tests/tests/pages/HomePage.ts
import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly loginButton: Locator;
  readonly bookLinks: Locator;
  readonly logo: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginButton = page.getByText(/Hi Reader\s*Log In/);
    this.bookLinks = page.locator('a[href^="/w/"]');
    this.logo = page.locator('img.header-logo[alt="ThriftBooks"]').first();
  }

  async open() {
    await this.page.goto('/', { waitUntil: 'networkidle' });
  }

  async clickLogin() {
    await this.loginButton.click();
  }

  async openFirstBook() {
    const firstBook = this.bookLinks.first();
    await expect(firstBook).toBeVisible();
    await firstBook.click();
  }

  async openBookByIndex(index: number) {
    const book = this.bookLinks.nth(index);
    await expect(book).toBeVisible();
    await book.click();
  }

  async clickLogo() {
    await this.logo.click();
    await this.page.waitForURL('/');
  }
}