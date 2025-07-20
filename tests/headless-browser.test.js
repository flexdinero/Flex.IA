/**
 * Headless Browser Test for Flex.IA Core Business Functionality
 * 
 * This test ensures that headless browser automation works correctly
 * for connecting independent adjusters to insurance firms.
 */

const { chromium } = require('playwright');

describe('Flex.IA Headless Browser Automation', () => {
  let browser;
  let context;
  let page;

  beforeAll(async () => {
    // Launch browser in headless mode
    browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });
    
    context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    });
    
    page = await context.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('Browser launches successfully', async () => {
    expect(browser).toBeDefined();
    expect(page).toBeDefined();
  });

  test('Can navigate to Flex.IA application', async () => {
    // Navigate to the application
    await page.goto('http://localhost:3005');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check if page loaded successfully
    const title = await page.title();
    expect(title).toContain('Flex.IA');
  });

  test('Can interact with login form', async () => {
    // Navigate to login page
    await page.goto('http://localhost:3005/auth/login');
    await page.waitForLoadState('networkidle');
    
    // Check if login form elements exist
    const emailInput = await page.locator('input[type="email"]');
    const passwordInput = await page.locator('input[type="password"]');
    const loginButton = await page.locator('button[type="submit"]');
    
    expect(await emailInput.count()).toBeGreaterThan(0);
    expect(await passwordInput.count()).toBeGreaterThan(0);
    expect(await loginButton.count()).toBeGreaterThan(0);
    
    // Test form interaction
    await emailInput.fill('test@example.com');
    await passwordInput.fill('testpassword');
    
    const emailValue = await emailInput.inputValue();
    const passwordValue = await passwordInput.inputValue();
    
    expect(emailValue).toBe('test@example.com');
    expect(passwordValue).toBe('testpassword');
  });

  test('Can access dashboard after authentication', async () => {
    // Navigate to test login page (bypasses authentication)
    await page.goto('http://localhost:3005/test-login');
    await page.waitForLoadState('networkidle');
    
    // Should redirect to dashboard
    await page.waitForURL('**/dashboard');
    
    // Check if dashboard elements are present
    const dashboardTitle = await page.locator('h1, h2').first();
    expect(await dashboardTitle.count()).toBeGreaterThan(0);
  });

  test('Can navigate to claims management', async () => {
    // Navigate to claims page
    await page.goto('http://localhost:3005/dashboard/claims');
    await page.waitForLoadState('networkidle');
    
    // Check if claims page loaded
    const claimsElements = await page.locator('[data-testid="claims-page"], .claims-container, h1:has-text("Claims")');
    expect(await claimsElements.count()).toBeGreaterThan(0);
  });

  test('Can interact with firm connections', async () => {
    // Navigate to firms page
    await page.goto('http://localhost:3005/dashboard/firms');
    await page.waitForLoadState('networkidle');
    
    // Check if firms page loaded
    const firmsElements = await page.locator('[data-testid="firms-page"], .firms-container, h1:has-text("Firms")');
    expect(await firmsElements.count()).toBeGreaterThan(0);
    
    // Look for connection buttons or forms
    const connectButtons = await page.locator('button:has-text("Connect"), button:has-text("Add Firm")');
    expect(await connectButtons.count()).toBeGreaterThan(0);
  });

  test('Can handle form submissions', async () => {
    // Test form submission capability
    await page.goto('http://localhost:3005/dashboard/settings');
    await page.waitForLoadState('networkidle');
    
    // Look for any form elements
    const forms = await page.locator('form');
    if (await forms.count() > 0) {
      const firstForm = forms.first();
      const inputs = await firstForm.locator('input, textarea, select');
      
      // Test that we can interact with form elements
      if (await inputs.count() > 0) {
        const firstInput = inputs.first();
        const inputType = await firstInput.getAttribute('type');
        
        if (inputType === 'text' || inputType === 'email') {
          await firstInput.fill('test value');
          const value = await firstInput.inputValue();
          expect(value).toBe('test value');
        }
      }
    }
  });

  test('Can handle JavaScript execution', async () => {
    // Test JavaScript execution capability
    const result = await page.evaluate(() => {
      return {
        userAgent: navigator.userAgent,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        hasLocalStorage: typeof localStorage !== 'undefined',
        hasSessionStorage: typeof sessionStorage !== 'undefined'
      };
    });
    
    expect(result.userAgent).toBeDefined();
    expect(result.windowWidth).toBeGreaterThan(0);
    expect(result.windowHeight).toBeGreaterThan(0);
    expect(result.hasLocalStorage).toBe(true);
    expect(result.hasSessionStorage).toBe(true);
  });

  test('Can handle file uploads', async () => {
    // Navigate to a page that might have file uploads
    await page.goto('http://localhost:3005/dashboard/vault');
    await page.waitForLoadState('networkidle');
    
    // Look for file input elements
    const fileInputs = await page.locator('input[type="file"]');
    
    if (await fileInputs.count() > 0) {
      // Test file upload capability (without actually uploading)
      const fileInput = fileInputs.first();
      expect(await fileInput.isVisible()).toBe(true);
    }
  });

  test('Can handle network requests', async () => {
    const responses = [];
    
    // Listen for network responses
    page.on('response', response => {
      responses.push({
        url: response.url(),
        status: response.status(),
        contentType: response.headers()['content-type']
      });
    });
    
    // Navigate to a page that makes API calls
    await page.goto('http://localhost:3005/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Check that we captured some responses
    expect(responses.length).toBeGreaterThan(0);
    
    // Check that we can handle different response types
    const htmlResponses = responses.filter(r => r.contentType && r.contentType.includes('text/html'));
    const jsResponses = responses.filter(r => r.contentType && r.contentType.includes('javascript'));
    
    expect(htmlResponses.length).toBeGreaterThan(0);
  });

  test('Can handle cookies and session management', async () => {
    // Set a cookie
    await context.addCookies([{
      name: 'test-cookie',
      value: 'test-value',
      domain: 'localhost',
      path: '/'
    }]);
    
    // Navigate to a page
    await page.goto('http://localhost:3005/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Check if cookie was set
    const cookies = await context.cookies();
    const testCookie = cookies.find(c => c.name === 'test-cookie');
    
    expect(testCookie).toBeDefined();
    expect(testCookie.value).toBe('test-value');
  });

  test('Can handle multiple tabs/pages', async () => {
    // Open a new page
    const newPage = await context.newPage();
    
    // Navigate to different pages
    await page.goto('http://localhost:3005/dashboard/claims');
    await newPage.goto('http://localhost:3005/dashboard/firms');
    
    await Promise.all([
      page.waitForLoadState('networkidle'),
      newPage.waitForLoadState('networkidle')
    ]);
    
    // Check that both pages loaded
    const page1Title = await page.title();
    const page2Title = await newPage.title();
    
    expect(page1Title).toBeDefined();
    expect(page2Title).toBeDefined();
    
    await newPage.close();
  });

  test('Performance and memory handling', async () => {
    // Test that the browser can handle multiple navigations without issues
    const pages = [
      'http://localhost:3005/dashboard',
      'http://localhost:3005/dashboard/claims',
      'http://localhost:3005/dashboard/firms',
      'http://localhost:3005/dashboard/earnings',
      'http://localhost:3005/dashboard/calendar'
    ];
    
    for (const url of pages) {
      await page.goto(url);
      await page.waitForLoadState('networkidle');
      
      // Check that page loaded successfully
      const title = await page.title();
      expect(title).toBeDefined();
    }
  });
});

// Export test utilities for use in other tests
module.exports = {
  createBrowserContext: async () => {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    return { browser, context, page };
  },
  
  closeBrowserContext: async ({ browser, context, page }) => {
    await page.close();
    await context.close();
    await browser.close();
  }
};
