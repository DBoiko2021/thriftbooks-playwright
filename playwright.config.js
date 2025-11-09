// playwright.config.js
const { defineConfig, devices } = require('@playwright/test');

const baseURL = process.env.BASE_URL || 'https://www.thriftbooks.com';

module.exports = defineConfig({
  testDir: './tests',
  retries: process.env.CI ? 2 : 0,
  reporter: [['html'], ['junit', { outputFile: 'results/junit.xml' }]],
  use: {
    headless: false,
    launchOptions: { slowMo: 300 },
    baseURL,
    trace: process.env.CI ? 'on-first-retry' : 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } }
  ],
});