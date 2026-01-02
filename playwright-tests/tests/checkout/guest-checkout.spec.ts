// playwright-tests/tests/checkout/guest-checkout.spec.ts

import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { BookDetailsPage } from '../pages/BookDetailsPage';
import { CartDrawer } from '../pages/CartDrawer';
import { CartPage } from '../pages/CartPage';
import { GuestLoginPage } from '../pages/GuestLoginPage';
import { ShippingAddressPage } from '../pages/ShippingAddressPage';
import { PaymentInfoPage } from '../pages/PaymentInfoPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { PostCheckoutPage } from '../pages/PostCheckoutPage';
import {
  generateGuestEmail,
  getTestShippingAddress,
  getTestCardDetails,
} from '../utils/testDataHelpers';

test.describe('Guest User Checkout', () => {
  
  test('should complete checkout with single item as guest user @guest @single', async ({ page }) => {
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

    const guestEmail = generateGuestEmail();
    const MAX_BOOK_ATTEMPTS = 5;

    await homePage.open();

    // Try to add a book with retry logic for "Only 1 Left"
    let bookAdded = false;
    let attempts = 0;

    while (!bookAdded && attempts < MAX_BOOK_ATTEMPTS) {
      try {
        await homePage.openBookByIndex(attempts);
        await bookDetailsPage.waitForLoaded();
        
        await bookDetailsPage.selectFormatAvoidingOneLeft();
        await bookDetailsPage.selectConditionAvoidingOneLeft();
        await bookDetailsPage.addToCart();
        
        bookAdded = true;
      } catch (error) {
        // Book has "Only 1 Left" for all formats/conditions - try next book
        attempts++;
        
        if (attempts >= MAX_BOOK_ATTEMPTS) {
          throw new Error(
            `Could not find book without "Only 1 Left" after ${MAX_BOOK_ATTEMPTS} attempts`
          );
        }
        
        // Return to home page to try next book
        await homePage.clickLogo();
      }
    }

    await cartDrawer.goToCartPage();
    
    await cartPage.waitForLoaded();
    await cartPage.proceedToCheckout();
    
    await guestLoginPage.waitForLoaded();
    await guestLoginPage.guestCheckout(guestEmail);
    
    await shippingAddressPage.waitForLoaded();
    await shippingAddressPage.fillAddress(getTestShippingAddress());
    await shippingAddressPage.continueToPayment();
    
    await paymentInfoPage.waitForReady();
    await paymentInfoPage.fillCardDetails(getTestCardDetails());
    await paymentInfoPage.continueToOrderReview();

    await checkoutPage.waitForLoaded();
    await checkoutPage.placeOrder();

    await postCheckoutPage.waitForLoaded();
  });

  test('should complete checkout with multiple items as guest user @guest @multiple', async ({ page }) => {
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

    const guestEmail = generateGuestEmail();
    const TARGET_ITEMS = 3;
    const MAX_ATTEMPTS_PER_BOOK = 5;

    await homePage.open();

    // Add books to cart with retry logic for "Only 1 Left"
    for (let itemNumber = 0; itemNumber < TARGET_ITEMS; itemNumber++) {
      let bookAdded = false;
      let attempts = 0;

      while (!bookAdded && attempts < MAX_ATTEMPTS_PER_BOOK) {
        try {
          await homePage.openBookByIndex(itemNumber + attempts);
          await bookDetailsPage.waitForLoaded();
          
          await bookDetailsPage.selectFormatAvoidingOneLeft();
          await bookDetailsPage.selectConditionAvoidingOneLeft();
          await bookDetailsPage.addToCart();
          
          bookAdded = true;
        } catch (error) {
          // Book has "Only 1 Left" for all formats/conditions - try next book
          attempts++;
          
          if (attempts >= MAX_ATTEMPTS_PER_BOOK) {
            throw new Error(
              `Could not find book without "Only 1 Left" after ${MAX_ATTEMPTS_PER_BOOK} attempts for item #${itemNumber + 1}`
            );
          }
          
          // Return to home page to try next book
          await homePage.clickLogo();
        }
      }

      // After adding book, continue shopping (except for last item)
      if (itemNumber < TARGET_ITEMS - 1) {
        await expect(cartDrawer.continueShoppingButton).toBeVisible({ timeout: 5000 });
        await cartDrawer.continueShopping();
        await homePage.clickLogo();
      }
    }

    // Go to cart
    await cartDrawer.goToCartPage();
    await cartPage.waitForLoaded();

    // Proceed through checkout
    await cartPage.proceedToCheckout();
    
    await guestLoginPage.waitForLoaded();
    await guestLoginPage.guestCheckout(guestEmail);
    
    await shippingAddressPage.waitForLoaded();
    await shippingAddressPage.fillAddress(getTestShippingAddress());
    await shippingAddressPage.continueToPayment();
    
    await paymentInfoPage.waitForReady();
    await paymentInfoPage.fillCardDetails(getTestCardDetails());
    await paymentInfoPage.continueToOrderReview();

    await checkoutPage.waitForLoaded();
    await checkoutPage.placeOrder();

    // Verify order placed successfully
    await postCheckoutPage.waitForLoaded();
  });
});