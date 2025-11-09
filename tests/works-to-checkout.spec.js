// tests/works-to-checkout.spec.js
const { test, expect } = require('@playwright/test');
const { WorksPage } = require('../pages/WorksPage');
const { CheckoutPage } = require('../pages/CheckoutPage');

const FULL_URL =
  'https://www.thriftbooks.com/w/into-the-wild_jon-krakauer/245729/#edition=2382200&idiq=1792698';

test('works → cart → checkout (minimal)', async ({ page }) => {
  const works = new WorksPage(page);
  const checkout = new CheckoutPage(page);

  await works.open(FULL_URL);

  const title = await works.getTitle();
  expect.soft(title.length).toBeGreaterThan(0);

  await works.addToCart();
  await works.goToCart();

  await expect(page).toHaveURL(/cart|checkout/i);
  await checkout.assertHasItem(title);
});