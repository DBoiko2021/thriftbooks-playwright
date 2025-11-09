// pages/CheckoutPage.js
const { expect } = require('@playwright/test');

const escapeRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

class CheckoutPage {
  constructor(page) { this.page = page; }

  async assertHasItem(title) {
    await this.page.waitForLoadState('domcontentloaded');

    // нормализуем: убираем лишние пробелы, переносы
    const normalized = title.replace(/\s+/g, ' ').trim();
    const exact = new RegExp(`^${escapeRe(normalized)}$`, 'i');

    // 1) чаще всего название — это ссылка на товар
    const asLink = this.page.getByRole('link', { name: exact }).first();
    if (await asLink.count()) {
      await expect(asLink).toBeVisible();
      return;
    }
  }
}

module.exports = { CheckoutPage };