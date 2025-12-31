// playwright-tests/tests/checkout/guest-checkout.spec.ts
import { test } from '@playwright/test';

import { HomePage } from '../pages/HomePage';
import { BookDetailsPage } from '../pages/BookDetailsPage';
import { CartDrawer } from '../pages/CartDrawer';
import { CartPage } from '../pages/CartPage';
import { GuestLoginPage } from '../pages/GuestLoginPage';
import { ShippingAddressPage } from '../pages/ShippingAddressPage';
import { PaymentInfoPage } from '../pages/PaymentInfoPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { PostCheckoutPage } from '../pages/PostCheckoutPage';

function generateGuestEmail(): string {
  const localBase = process.env.TB_GUEST_EMAIL_LOCAL ?? 'qa.guest';
  const domain = process.env.TB_GUEST_EMAIL_DOMAIN ?? 'thriftbooksqa.com';

  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const datePart = `${yy}${mm}${dd}`;

  const rand = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');

  return `${localBase}+${datePart}-${rand}@${domain}`;
}

test.describe('Guest user checkout', () => {
  test('guest can complete basic checkout flow', async ({ page }) => {
    test.slow();

    const homePage = new HomePage(page);
    const bookDetailsPage = new BookDetailsPage(page);
    const cartDrawer = new CartDrawer(page);
    const cartPage = new CartPage(page);
    const guestLoginPage = new GuestLoginPage(page);
    const shippingAddressPage = new ShippingAddressPage(page);
    const paymentInfoPage = new PaymentInfoPage(page);
    const checkoutPage = new CheckoutPage(page);
    const postCheckoutPage = new PostCheckoutPage(page);

    await homePage.open();
    await homePage.openFirstBook();

    await bookDetailsPage.selectFormatAvoidingOneLeft();
    await bookDetailsPage.selectConditionAvoidingOneLeft();
    await bookDetailsPage.addToCart();

    await cartDrawer.goToCartPage();
    await cartPage.proceedToCheckout();

    const guestEmail = generateGuestEmail();
    await guestLoginPage.guestCheckout(guestEmail);

    await shippingAddressPage.fillAddress({
      firstName: process.env.TB_GUEST_FIRSTNAME ?? 'QA',
      lastName: process.env.TB_GUEST_LASTNAME ?? 'Guest',
      addressLine1: process.env.TB_GUEST_ADDRESS1 ?? '333 Berkeley Ave',
      city: process.env.TB_GUEST_CITY ?? 'Tacoma',
      state: process.env.TB_GUEST_STATE ?? 'WA',
      postalCode: process.env.TB_GUEST_ZIP ?? '98466',
      useSuggestion: true,
    });
    await shippingAddressPage.continueToPayment();

    await paymentInfoPage.waitForReady();
    await paymentInfoPage.fillCardDetails({
      cardNumber: process.env.TB_TEST_CARD_NUMBER ?? '4242424242424242',
      cvv: process.env.TB_TEST_CARD_CVV ?? '123',
      expirationDate: process.env.TB_TEST_CARD_EXP ?? '09/2027',
    });
    await paymentInfoPage.continueToOrderReview();

    await checkoutPage.placeOrder();
    await postCheckoutPage.waitForLoaded();
  });
});