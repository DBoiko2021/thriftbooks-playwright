// playwright-tests/tests/demo/fragile-registered-cart-demo.spec.ts
import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { BookDetailsPage } from '../pages/BookDetailsPage';
import { CartDrawer } from '../pages/CartDrawer';
import { CartPage } from '../pages/CartPage';

test.describe('Demo: registered checkout – headed vs headless behavior', () => {
  test('cart step: stable in headed, fragile in headless (on purpose)', async ({ page }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    const bookDetailPage = new BookDetailsPage(page);
    const cartDrawer = new CartDrawer(page);
    const cartPage = new CartPage(page);

    const isHeadless = !!test.info().project.use?.headless;
    console.log('=== Demo start === isHeadless =', isHeadless);

    // 1) Home → Login
    await homePage.open();
    await homePage.clickLogin();

    // 2) Login
    await loginPage.login();

    // 3) Back to home
    await homePage.open();
    await homePage.openFirstBook();

    // 4) Book details: select format & condition (avoiding "Only 1 Left"), add to cart
    await bookDetailPage.selectFormatAvoidingOneLeft();
    await bookDetailPage.selectConditionAvoidingOneLeft();
    await bookDetailPage.addToCart();

    // 5) Cart drawer → Cart page (stable POM)
    await cartDrawer.goToCartPage();

    // 6) Branch for demo
    if (!isHeadless) {
      // HEADED: correct flow
      console.log('[Demo] headed mode: using stable CartPage.proceedToCheckout()');

      await cartPage.proceedToCheckout();

      await expect(page).toHaveURL(/\/checkout/, { timeout: 30_000 });
      console.log('[Demo] headed mode: reached /checkout, demo test PASSED');
    } else {
      // HEADLESS: intentionally fragile pattern
      console.log(
        '[Demo] headless mode: simulating fragile waitForURL on checkout (this is expected to FAIL)'
      );

      await page.waitForURL('**/checkout-this-will-never-exist*', {
        timeout: 5_000,
      });

      throw new Error(
        'Demo error: fragile headless branch unexpectedly passed. This is not supposed to happen.'
      );
    }

    console.log('=== Demo end ===');
  });
});
