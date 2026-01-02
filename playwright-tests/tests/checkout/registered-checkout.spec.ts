// playwright-tests/tests/checkout/registered-checkout.spec.ts

import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { BookDetailsPage } from '../pages/BookDetailsPage';
import { CartDrawer } from '../pages/CartDrawer';
import { CartPage } from '../pages/CartPage';
import { PaymentPage } from '../pages/PaymentPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { PostCheckoutPage } from '../pages/PostCheckoutPage';

test.describe('Registered User Checkout', () => {
  
  test('should complete checkout with single item using saved address and card @registered @single', async ({ page }) => {
    test.slow();
    
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    const bookDetailsPage = new BookDetailsPage(page);
    const cartDrawer = new CartDrawer(page);
    const cartPage = new CartPage(page);
    const paymentPage = new PaymentPage(page);
    const checkoutPage = new CheckoutPage(page);
    const postCheckoutPage = new PostCheckoutPage(page);

    const MAX_BOOK_ATTEMPTS = 5;

    await homePage.open();
    await homePage.clickLogin();
    
    await loginPage.waitForLoaded();
    await loginPage.login();
    
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
    
    await paymentPage.waitForLoaded();
    await paymentPage.continueToOrderReview();

    await checkoutPage.waitForLoaded();
    await checkoutPage.placeOrder();

    await postCheckoutPage.waitForLoaded();
  });

  test('should complete checkout with multiple items using saved address and card @registered @multiple', async ({ page }) => {
    test.slow();
    
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    const bookDetailsPage = new BookDetailsPage(page);
    const cartDrawer = new CartDrawer(page);
    const cartPage = new CartPage(page);
    const paymentPage = new PaymentPage(page);
    const checkoutPage = new CheckoutPage(page);
    const postCheckoutPage = new PostCheckoutPage(page);

    const TARGET_ITEMS = 3;
    const MAX_ATTEMPTS_PER_BOOK = 5;

    // Login
    await homePage.open();
    await homePage.clickLogin();
    
    await loginPage.waitForLoaded();
    await loginPage.login();

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

    // Proceed to checkout
    await cartPage.proceedToCheckout();
    
    await paymentPage.waitForLoaded();
    await paymentPage.continueToOrderReview();

    await checkoutPage.waitForLoaded();
    await checkoutPage.placeOrder();

    // Verify order placed successfully
    await postCheckoutPage.waitForLoaded();
  });
});