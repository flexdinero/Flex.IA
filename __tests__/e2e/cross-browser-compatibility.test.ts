/**
 * Cross-Browser Compatibility Tests for Flex.IA
 * 
 * Comprehensive testing across Chrome, Firefox, Safari, and Edge
 * Tests all critical functionality for browser compatibility
 */

import { test, expect, Page, BrowserContext } from '@playwright/test'

// Test data
const TEST_USER = {
  email: 'test@example.com',
  password: 'TestPassword123!',
  firstName: 'John',
  lastName: 'Doe'
}

// Helper functions
async function loginUser(page: Page) {
  await page.goto('/auth/login')
  await page.fill('[data-testid="email-input"]', TEST_USER.email)
  await page.fill('[data-testid="password-input"]', TEST_USER.password)
  await page.click('[data-testid="login-button"]')
  await expect(page).toHaveURL(/.*\/dashboard/)
}

async function checkResponsiveLayout(page: Page) {
  // Test different viewport sizes
  const viewports = [
    { width: 320, height: 568 }, // iPhone SE
    { width: 768, height: 1024 }, // iPad
    { width: 1024, height: 768 }, // iPad Landscape
    { width: 1280, height: 720 }, // Desktop
    { width: 1920, height: 1080 } // Large Desktop
  ]

  for (const viewport of viewports) {
    await page.setViewportSize(viewport)
    await page.waitForTimeout(500) // Allow layout to settle
    
    // Check that navigation is accessible
    const nav = page.locator('[data-testid="main-navigation"]')
    await expect(nav).toBeVisible()
    
    // Check that content doesn't overflow
    const body = page.locator('body')
    const scrollWidth = await body.evaluate(el => el.scrollWidth)
    const clientWidth = await body.evaluate(el => el.clientWidth)
    
    // Allow for small differences due to scrollbars
    expect(scrollWidth - clientWidth).toBeLessThan(20)
  }
}

test.describe('Cross-Browser Compatibility', () => {
  test.describe('Core Functionality', () => {
    test('homepage loads correctly across browsers', async ({ page, browserName }) => {
      await page.goto('/')
      
      // Check page title
      await expect(page).toHaveTitle(/Flex\.IA/)
      
      // Check main navigation
      await expect(page.locator('[data-testid="main-navigation"]')).toBeVisible()
      
      // Check hero section
      await expect(page.locator('[data-testid="hero-section"]')).toBeVisible()
      
      // Check CTA buttons
      await expect(page.locator('[data-testid="cta-primary"]')).toBeVisible()
      
      // Browser-specific checks
      if (browserName === 'webkit') {
        // Safari-specific checks
        await expect(page.locator('body')).toHaveCSS('font-family', /system-ui/)
      }
      
      if (browserName === 'firefox') {
        // Firefox-specific checks
        await expect(page.locator('html')).toHaveAttribute('lang', 'en')
      }
    })

    test('authentication flow works across browsers', async ({ page, browserName }) => {
      // Test login
      await page.goto('/auth/login')
      
      // Fill login form
      await page.fill('[data-testid="email-input"]', TEST_USER.email)
      await page.fill('[data-testid="password-input"]', TEST_USER.password)
      
      // Submit form
      await page.click('[data-testid="login-button"]')
      
      // Verify redirect to dashboard
      await expect(page).toHaveURL(/.*\/dashboard/)
      
      // Verify user menu is visible
      await expect(page.locator('[data-testid="user-menu"]')).toBeVisible()
      
      // Test logout
      await page.click('[data-testid="user-menu"]')
      await page.click('[data-testid="logout-button"]')
      
      // Verify redirect to login
      await expect(page).toHaveURL(/.*\/auth\/login/)
      
      // Browser-specific authentication checks
      if (browserName === 'webkit') {
        // Check Safari keychain integration doesn't interfere
        const passwordField = page.locator('[data-testid="password-input"]')
        await expect(passwordField).toHaveAttribute('type', 'password')
      }
    })

    test('dashboard functionality works across browsers', async ({ page, browserName }) => {
      await loginUser(page)
      
      // Check dashboard widgets load
      await expect(page.locator('[data-testid="dashboard-widgets"]')).toBeVisible()
      
      // Check stats cards
      await expect(page.locator('[data-testid="stats-cards"]')).toBeVisible()
      
      // Check recent activity
      await expect(page.locator('[data-testid="recent-activity"]')).toBeVisible()
      
      // Test widget interactions
      const editButton = page.locator('[data-testid="edit-dashboard"]')
      if (await editButton.isVisible()) {
        await editButton.click()
        await expect(page.locator('[data-testid="widget-controls"]')).toBeVisible()
      }
      
      // Browser-specific dashboard checks
      if (browserName === 'firefox') {
        // Firefox sometimes has different scrolling behavior
        await page.evaluate(() => window.scrollTo(0, 0))
        await expect(page.locator('[data-testid="dashboard-header"]')).toBeInViewport()
      }
    })
  })

  test.describe('Navigation and Routing', () => {
    test('navigation works consistently across browsers', async ({ page, browserName }) => {
      await loginUser(page)
      
      const navigationItems = [
        { testId: 'nav-claims', url: '/dashboard/claims' },
        { testId: 'nav-earnings', url: '/dashboard/earnings' },
        { testId: 'nav-firms', url: '/dashboard/firms' },
        { testId: 'nav-messages', url: '/dashboard/messages' },
        { testId: 'nav-calendar', url: '/dashboard/calendar' }
      ]
      
      for (const item of navigationItems) {
        await page.click(`[data-testid="${item.testId}"]`)
        await expect(page).toHaveURL(new RegExp(item.url))
        
        // Check page loads completely
        await expect(page.locator('[data-testid="page-content"]')).toBeVisible()
        
        // Browser-specific navigation checks
        if (browserName === 'webkit' && item.testId === 'nav-calendar') {
          // Safari sometimes has issues with date pickers
          const datePicker = page.locator('[data-testid="date-picker"]')
          if (await datePicker.isVisible()) {
            await expect(datePicker).toBeEnabled()
          }
        }
      }
    })

    test('back/forward navigation works', async ({ page }) => {
      await loginUser(page)
      
      // Navigate to claims
      await page.click('[data-testid="nav-claims"]')
      await expect(page).toHaveURL(/.*\/claims/)
      
      // Navigate to earnings
      await page.click('[data-testid="nav-earnings"]')
      await expect(page).toHaveURL(/.*\/earnings/)
      
      // Test browser back button
      await page.goBack()
      await expect(page).toHaveURL(/.*\/claims/)
      
      // Test browser forward button
      await page.goForward()
      await expect(page).toHaveURL(/.*\/earnings/)
    })
  })

  test.describe('Forms and Input Handling', () => {
    test('form inputs work across browsers', async ({ page, browserName }) => {
      await page.goto('/auth/register')
      
      // Test text inputs
      await page.fill('[data-testid="first-name-input"]', 'John')
      await page.fill('[data-testid="last-name-input"]', 'Doe')
      await page.fill('[data-testid="email-input"]', 'test@example.com')
      
      // Test password input
      await page.fill('[data-testid="password-input"]', 'TestPassword123!')
      await page.fill('[data-testid="confirm-password-input"]', 'TestPassword123!')
      
      // Test checkbox
      await page.check('[data-testid="terms-checkbox"]')
      
      // Verify form state
      await expect(page.locator('[data-testid="first-name-input"]')).toHaveValue('John')
      await expect(page.locator('[data-testid="terms-checkbox"]')).toBeChecked()
      
      // Browser-specific form checks
      if (browserName === 'firefox') {
        // Firefox has different autocomplete behavior
        const emailInput = page.locator('[data-testid="email-input"]')
        await expect(emailInput).toHaveAttribute('autocomplete', 'email')
      }
      
      if (browserName === 'webkit') {
        // Safari has different password handling
        const passwordInput = page.locator('[data-testid="password-input"]')
        await expect(passwordInput).toHaveAttribute('type', 'password')
      }
    })

    test('file upload works across browsers', async ({ page, browserName }) => {
      await loginUser(page)
      await page.goto('/dashboard/vault')
      
      // Create a test file
      const fileContent = 'Test file content'
      const fileName = 'test-document.txt'
      
      // Upload file
      const fileInput = page.locator('[data-testid="file-upload-input"]')
      await fileInput.setInputFiles({
        name: fileName,
        mimeType: 'text/plain',
        buffer: Buffer.from(fileContent)
      })
      
      // Verify upload
      await expect(page.locator(`[data-testid="uploaded-file-${fileName}"]`)).toBeVisible()
      
      // Browser-specific upload checks
      if (browserName === 'webkit') {
        // Safari has stricter file type validation
        await expect(page.locator('[data-testid="upload-success"]')).toBeVisible()
      }
    })
  })

  test.describe('Interactive Elements', () => {
    test('dropdowns and selects work across browsers', async ({ page, browserName }) => {
      await loginUser(page)
      await page.goto('/dashboard/claims')
      
      // Test filter dropdown
      const filterDropdown = page.locator('[data-testid="status-filter"]')
      await filterDropdown.click()
      
      // Select an option
      await page.click('[data-testid="filter-option-active"]')
      
      // Verify selection
      await expect(filterDropdown).toContainText('Active')
      
      // Browser-specific dropdown checks
      if (browserName === 'firefox') {
        // Firefox sometimes renders dropdowns differently
        await expect(filterDropdown).toBeVisible()
      }
    })

    test('modals and overlays work across browsers', async ({ page, browserName }) => {
      await loginUser(page)
      
      // Open user menu modal
      await page.click('[data-testid="user-menu"]')
      await expect(page.locator('[data-testid="user-menu-dropdown"]')).toBeVisible()
      
      // Close modal by clicking outside
      await page.click('body')
      await expect(page.locator('[data-testid="user-menu-dropdown"]')).not.toBeVisible()
      
      // Browser-specific modal checks
      if (browserName === 'webkit') {
        // Safari sometimes has z-index issues
        await page.click('[data-testid="user-menu"]')
        const modal = page.locator('[data-testid="user-menu-dropdown"]')
        await expect(modal).toBeVisible()
        await expect(modal).toHaveCSS('position', 'absolute')
      }
    })
  })

  test.describe('Responsive Design', () => {
    test('responsive layout works across browsers', async ({ page, browserName }) => {
      await loginUser(page)
      await checkResponsiveLayout(page)
    })

    test('mobile navigation works across browsers', async ({ page, browserName }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 })
      await loginUser(page)
      
      // Check mobile navigation
      const mobileNav = page.locator('[data-testid="mobile-navigation"]')
      if (await mobileNav.isVisible()) {
        await expect(mobileNav).toBeVisible()
        
        // Test mobile menu toggle
        const menuToggle = page.locator('[data-testid="mobile-menu-toggle"]')
        await menuToggle.click()
        await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible()
      }
    })
  })

  test.describe('Performance and Loading', () => {
    test('page load performance is acceptable across browsers', async ({ page, browserName }) => {
      const startTime = Date.now()
      
      await page.goto('/')
      
      // Wait for page to be fully loaded
      await page.waitForLoadState('networkidle')
      
      const loadTime = Date.now() - startTime
      
      // Performance should be under 5 seconds
      expect(loadTime).toBeLessThan(5000)
      
      // Browser-specific performance checks
      if (browserName === 'chromium') {
        // Chrome DevTools metrics
        const metrics = await page.evaluate(() => {
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
          return {
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            loadComplete: navigation.loadEventEnd - navigation.loadEventStart
          }
        })
        
        expect(metrics.domContentLoaded).toBeLessThan(2000)
      }
    })
  })

  test.describe('Accessibility', () => {
    test('keyboard navigation works across browsers', async ({ page, browserName }) => {
      await page.goto('/')
      
      // Test tab navigation
      await page.keyboard.press('Tab')
      await expect(page.locator(':focus')).toBeVisible()
      
      // Continue tabbing through interactive elements
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Tab')
        const focusedElement = page.locator(':focus')
        await expect(focusedElement).toBeVisible()
      }
      
      // Test Enter key activation
      await page.keyboard.press('Enter')
      
      // Browser-specific accessibility checks
      if (browserName === 'firefox') {
        // Firefox has better screen reader support
        const focusedElement = page.locator(':focus')
        await expect(focusedElement).toHaveAttribute('tabindex')
      }
    })
  })

  test.describe('Error Handling', () => {
    test('error pages display correctly across browsers', async ({ page, browserName }) => {
      // Test 404 page
      await page.goto('/non-existent-page')
      await expect(page.locator('[data-testid="error-404"]')).toBeVisible()
      
      // Test error boundary
      await page.goto('/dashboard/test-error')
      if (await page.locator('[data-testid="error-boundary"]').isVisible()) {
        await expect(page.locator('[data-testid="error-boundary"]')).toBeVisible()
      }
    })
  })
})
