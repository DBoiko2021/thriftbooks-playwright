const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false
  });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://www.thriftbooks.com/w/into-the-wild_jon-krakauer/245729/#edition=2382200&idiq=1792698');
  await page.getByRole('button', { name: 'Close this dialog' }).click();
  await page.getByRole('button', { name: 'Add to Cart' }).click();
  await page.getByRole('link', { name: 'View Cart & Checkout' }).click();
  await page.close();

  // ---------------------
  await context.close();
  await browser.close();
})();