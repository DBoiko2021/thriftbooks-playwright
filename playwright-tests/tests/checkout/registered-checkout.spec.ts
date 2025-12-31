// playwright-tests/tests/checkout/registered-checkout.spec.ts
import { test } from '@playwright/test';

import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { BookDetailsPage } from '../pages/BookDetailsPage';
import { CartDrawer } from '../pages/CartDrawer';
import { CartPage } from '../pages/CartPage';
import { PaymentPage } from '../pages/PaymentPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { PostCheckoutPage } from '../pages/PostCheckoutPage';

test.describe('Registered user checkout', () => {
  test('user can complete basic checkout flow', async ({ page }) => {
    test.slow();

    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    const bookDetailsPage = new BookDetailsPage(page);
    const cartDrawer = new CartDrawer(page);
    const cartPage = new CartPage(page);
    const paymentPage = new PaymentPage(page);
    const checkoutPage = new CheckoutPage(page);
    const postCheckoutPage = new PostCheckoutPage(page);

    await homePage.open();
    await homePage.clickLogin();
    await loginPage.login();

    await homePage.open();
    await homePage.openFirstBook();

    await bookDetailsPage.selectFormatAvoidingOneLeft();
    await bookDetailsPage.selectConditionAvoidingOneLeft();
    await bookDetailsPage.addToCart();

    await cartDrawer.goToCartPage();
    await cartPage.proceedToCheckout();

    await paymentPage.continueToOrderReview();
    await checkoutPage.placeOrder();
    await postCheckoutPage.waitForLoaded();
  });
});