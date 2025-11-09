// pages/WorksPage.js
const { expect } = require('@playwright/test');

class WorksPage {
  constructor(page) {
    this.page = page;
    this.h1 = page.getByRole('heading', { level: 1 }).first();
    this.closeDialogBtn = page.getByRole('button', { name: 'Close this dialog' }).first();
    this.addToCartBtn = page.getByRole('button', { name: 'Add to Cart' }).first();
    this.viewCartAndCheckoutLink = page.getByRole('link', { name: 'View Cart & Checkout' }).first();
  }

  async open(fullUrl) {
    await this.page.goto(fullUrl, { waitUntil: 'domcontentloaded' });
    await this.closeDialogIfPresent();
  }

  async getTitle() {
    const t = await this.h1.innerText();
    return (t || '').trim();
  }

  async closeDialogIfPresent() {
    try {
      if (await this.closeDialogBtn.isVisible()) {
        await this.closeDialogBtn.click();
      }
    } catch {}
  }

  async addToCart() {
    await expect(this.addToCartBtn).toBeVisible();
    await this.addToCartBtn.click();
  }

  async goToCart() {
    await expect(this.viewCartAndCheckoutLink).toBeVisible();
    await this.viewCartAndCheckoutLink.click();
  }
}

module.exports = { WorksPage };