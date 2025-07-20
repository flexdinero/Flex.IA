import { defineConfig, devices } from '@playwright/test'

/**
 * Comprehensive Cross-Browser Testing Configuration for Flex.IA
 * 
 * Tests across Chrome, Firefox, Safari, and Edge with mobile variants
 * Includes accessibility, performance, and visual regression testing
 */

export default defineConfig({
  testDir: '__tests__/e2e',
  
  // Global test configuration
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'test-results/html-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['line']
  ],
  
  // Global setup and teardown
  globalSetup: require.resolve('./__tests__/setup/global-setup.ts'),
  globalTeardown: require.resolve('./__tests__/setup/global-teardown.ts'),
  
  // Shared settings for all projects
  use: {
    // Base URL for tests
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
    
    // Record video on failure
    video: 'retain-on-failure',
    
    // Take screenshot on failure
    screenshot: 'only-on-failure',
    
    // Global timeout for actions
    actionTimeout: 10000,
    
    // Global timeout for navigation
    navigationTimeout: 30000,
    
    // Ignore HTTPS errors
    ignoreHTTPSErrors: true,
    
    // Accept downloads
    acceptDownloads: true,
    
    // Locale and timezone
    locale: 'en-US',
    timezoneId: 'America/New_York'
  },
  
  // Configure projects for major browsers
  projects: [
    // Desktop Browsers
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Enable Chrome DevTools Protocol for performance testing
        launchOptions: {
          args: ['--enable-features=NetworkService,NetworkServiceLogging']
        }
      }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    },
    {
      name: 'edge',
      use: { 
        ...devices['Desktop Edge'],
        channel: 'msedge'
      }
    },
    
    // Mobile Browsers
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] }
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] }
    },
    {
      name: 'tablet-chrome',
      use: { ...devices['iPad Pro'] }
    },
    
    // Accessibility Testing
    {
      name: 'accessibility-chrome',
      use: { 
        ...devices['Desktop Chrome'],
        // Enable accessibility tree
        launchOptions: {
          args: ['--force-renderer-accessibility']
        }
      },
      testMatch: '**/*accessibility*.test.ts'
    },
    
    // Performance Testing
    {
      name: 'performance-chrome',
      use: { 
        ...devices['Desktop Chrome'],
        // Enable performance metrics
        launchOptions: {
          args: ['--enable-precise-memory-info']
        }
      },
      testMatch: '**/*performance*.test.ts'
    },
    
    // Visual Regression Testing
    {
      name: 'visual-chrome',
      use: { 
        ...devices['Desktop Chrome'],
        // Consistent rendering for screenshots
        launchOptions: {
          args: ['--disable-web-security', '--disable-features=TranslateUI']
        }
      },
      testMatch: '**/*visual*.test.ts'
    },
    
    // Older Browser Support
    {
      name: 'chrome-old',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        // Simulate older Chrome version
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36'
      }
    }
  ],
  
  // Web server configuration for local testing
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 120000
  },
  
  // Test output directory
  outputDir: 'test-results/artifacts',
  
  // Global test configuration
  globalTimeout: 60000 * 30, // 30 minutes for all tests
  
  // Expect configuration
  expect: {
    // Threshold for visual comparisons
    threshold: 0.2,
    
    // Animation handling
    animations: 'disabled',
    
    // Screenshot comparison
    toHaveScreenshot: {
      threshold: 0.2,
      mode: 'strict'
    },
    
    // Accessibility
    toPassAxeTest: {
      disabledRules: ['color-contrast'] // Disable if design requires specific colors
    }
  }
})
