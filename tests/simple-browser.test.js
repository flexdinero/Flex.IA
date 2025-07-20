/**
 * Simple Headless Browser Test for Flex.IA
 */

const { chromium } = require('playwright');

describe('Simple Browser Test', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    page = await context.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('Browser can launch and navigate', async () => {
    // Test basic browser functionality
    expect(browser).toBeDefined();
    expect(page).toBeDefined();
    
    // Navigate to a simple page
    await page.goto('https://example.com');
    const title = await page.title();
    expect(title).toContain('Example');
  });

  test('Can navigate to localhost if available', async () => {
    try {
      await page.goto('http://localhost:3005', { timeout: 5000 });
      const title = await page.title();
      console.log('Successfully connected to localhost:3005, title:', title);
      expect(title).toBeDefined();
    } catch (error) {
      console.log('Could not connect to localhost:3005, this is expected if server is not running');
      // This is expected if the server is not running
      expect(error.message).toContain('net::ERR_CONNECTION_REFUSED');
    }
  });
});
