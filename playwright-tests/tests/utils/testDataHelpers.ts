// playwright-tests/tests/utils/testDataHelpers.ts

export function generateGuestEmail(): string {
  const localBase = process.env.TB_GUEST_EMAIL_LOCAL ?? 'qa.guest';
  const domain = process.env.TB_GUEST_EMAIL_DOMAIN ?? 'thriftbooksqa.com';
  
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const datePart = `${yy}${mm}${dd}`;
  
  const rand = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `${localBase}+${datePart}-${rand}@${domain}`;
}

export function getTestShippingAddress() {
  return {
    firstName: process.env.TB_GUEST_FIRSTNAME ?? 'QA',
    lastName: process.env.TB_GUEST_LASTNAME ?? 'Guest',
    addressLine1: process.env.TB_GUEST_ADDRESS1 ?? '333 Berkeley Ave',
    city: process.env.TB_GUEST_CITY ?? 'Tacoma',
    state: process.env.TB_GUEST_STATE ?? 'WA',
    postalCode: process.env.TB_GUEST_ZIP ?? '98466',
  };
}

export function getTestCardDetails() {
  return {
    cardNumber: process.env.TB_TEST_CARD_NUMBER ?? '4242424242424242',
    cvv: process.env.TB_TEST_CARD_CVV ?? '123',
    expirationDate: process.env.TB_TEST_CARD_EXPIRATION ?? '09/2027',
  };
}