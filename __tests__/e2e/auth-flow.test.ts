/**
 * End-to-End Authentication Flow Tests
 * 
 * Tests complete user authentication flows including
 * login, logout, registration, and session management
 */

import { test, expect, Page } from '@playwright/test'

// Test configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

// Test user credentials
const TEST_USER = {
  email: 'test@example.com',
  password: 'TestPassword123!',
  firstName: 'John',
  lastName: 'Doe'
}

const ADMIN_USER = {
  email: 'admin@flex-ia.com',
  password: 'AdminPassword123!'
}

// Helper functions
async function navigateToLogin(page: Page) {
  await page.goto(`${BASE_URL}/auth/login`)
  await expect(page).toHaveTitle(/Login.*Flex\.IA/)
}

async function fillLoginForm(page: Page, email: string, password: string) {
  await page.fill('[data-testid="email-input"]', email)
  await page.fill('[data-testid="password-input"]', password)
}

async function submitLoginForm(page: Page) {
  await page.click('[data-testid="login-button"]')
}

async function waitForDashboard(page: Page) {
  await expect(page).toHaveURL(/.*\/dashboard/)
  await expect(page.locator('[data-testid="dashboard-header"]')).toBeVisible()
}

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing sessions
    await page.context().clearCookies()
    await page.context().clearPermissions()
  })

  test.describe('Login Flow', () => {
    test('should successfully log in with valid credentials', async ({ page }) => {
      await navigateToLogin(page)
      
      // Fill and submit login form
      await fillLoginForm(page, TEST_USER.email, TEST_USER.password)
      await submitLoginForm(page)
      
      // Should redirect to dashboard
      await waitForDashboard(page)
      
      // Should display user information
      await expect(page.locator('[data-testid="user-menu"]')).toContainText(TEST_USER.firstName)
    })

    test('should show error for invalid credentials', async ({ page }) => {
      await navigateToLogin(page)
      
      // Fill with invalid credentials
      await fillLoginForm(page, TEST_USER.email, 'wrongpassword')
      await submitLoginForm(page)
      
      // Should show error message
      await expect(page.locator('[data-testid="error-message"]')).toContainText(/invalid credentials/i)
      
      // Should remain on login page
      await expect(page).toHaveURL(/.*\/auth\/login/)
    })

    test('should validate email format', async ({ page }) => {
      await navigateToLogin(page)
      
      // Fill with invalid email
      await fillLoginForm(page, 'invalid-email', TEST_USER.password)
      await submitLoginForm(page)
      
      // Should show validation error
      await expect(page.locator('[data-testid="email-error"]')).toContainText(/invalid email/i)
    })

    test('should validate password requirements', async ({ page }) => {
      await navigateToLogin(page)
      
      // Fill with weak password
      await fillLoginForm(page, TEST_USER.email, '123')
      await submitLoginForm(page)
      
      // Should show validation error
      await expect(page.locator('[data-testid="password-error"]')).toContainText(/password must be/i)
    })

    test('should handle rate limiting', async ({ page }) => {
      await navigateToLogin(page)
      
      // Attempt multiple failed logins
      for (let i = 0; i < 6; i++) {
        await fillLoginForm(page, TEST_USER.email, 'wrongpassword')
        await submitLoginForm(page)
        await page.waitForTimeout(500)
      }
      
      // Should show rate limit error
      await expect(page.locator('[data-testid="error-message"]')).toContainText(/too many attempts/i)
    })

    test('should support keyboard navigation', async ({ page }) => {
      await navigateToLogin(page)
      
      // Navigate using Tab key
      await page.keyboard.press('Tab') // Email field
      await page.keyboard.type(TEST_USER.email)
      
      await page.keyboard.press('Tab') // Password field
      await page.keyboard.type(TEST_USER.password)
      
      await page.keyboard.press('Tab') // Login button
      await page.keyboard.press('Enter') // Submit
      
      await waitForDashboard(page)
    })
  })

  test.describe('Two-Factor Authentication', () => {
    test('should prompt for 2FA when enabled', async ({ page }) => {
      // Assume user has 2FA enabled
      await navigateToLogin(page)
      await fillLoginForm(page, 'user-with-2fa@example.com', 'Password123!')
      await submitLoginForm(page)
      
      // Should show 2FA prompt
      await expect(page.locator('[data-testid="2fa-prompt"]')).toBeVisible()
      await expect(page.locator('[data-testid="2fa-input"]')).toBeVisible()
    })

    test('should validate 2FA token format', async ({ page }) => {
      await navigateToLogin(page)
      await fillLoginForm(page, 'user-with-2fa@example.com', 'Password123!')
      await submitLoginForm(page)
      
      // Enter invalid 2FA token
      await page.fill('[data-testid="2fa-input"]', '123')
      await page.click('[data-testid="2fa-submit"]')
      
      // Should show validation error
      await expect(page.locator('[data-testid="2fa-error"]')).toContainText(/6 digits/i)
    })
  })

  test.describe('Registration Flow', () => {
    test('should successfully register new user', async ({ page }) => {
      await page.goto(`${BASE_URL}/auth/register`)
      
      // Fill registration form
      await page.fill('[data-testid="first-name-input"]', TEST_USER.firstName)
      await page.fill('[data-testid="last-name-input"]', TEST_USER.lastName)
      await page.fill('[data-testid="email-input"]', `new-${Date.now()}@example.com`)
      await page.fill('[data-testid="password-input"]', TEST_USER.password)
      await page.fill('[data-testid="confirm-password-input"]', TEST_USER.password)
      
      // Accept terms
      await page.check('[data-testid="terms-checkbox"]')
      
      // Submit form
      await page.click('[data-testid="register-button"]')
      
      // Should redirect to email verification page
      await expect(page).toHaveURL(/.*\/auth\/verify-email/)
      await expect(page.locator('[data-testid="verification-message"]')).toBeVisible()
    })

    test('should validate password confirmation', async ({ page }) => {
      await page.goto(`${BASE_URL}/auth/register`)
      
      await page.fill('[data-testid="password-input"]', TEST_USER.password)
      await page.fill('[data-testid="confirm-password-input"]', 'DifferentPassword123!')
      
      await page.click('[data-testid="register-button"]')
      
      // Should show password mismatch error
      await expect(page.locator('[data-testid="confirm-password-error"]')).toContainText(/passwords do not match/i)
    })

    test('should require terms acceptance', async ({ page }) => {
      await page.goto(`${BASE_URL}/auth/register`)
      
      // Fill form without accepting terms
      await page.fill('[data-testid="first-name-input"]', TEST_USER.firstName)
      await page.fill('[data-testid="last-name-input"]', TEST_USER.lastName)
      await page.fill('[data-testid="email-input"]', 'test@example.com')
      await page.fill('[data-testid="password-input"]', TEST_USER.password)
      await page.fill('[data-testid="confirm-password-input"]', TEST_USER.password)
      
      await page.click('[data-testid="register-button"]')
      
      // Should show terms error
      await expect(page.locator('[data-testid="terms-error"]')).toContainText(/accept terms/i)
    })
  })

  test.describe('Session Management', () => {
    test('should maintain session across page refreshes', async ({ page }) => {
      // Login first
      await navigateToLogin(page)
      await fillLoginForm(page, TEST_USER.email, TEST_USER.password)
      await submitLoginForm(page)
      await waitForDashboard(page)
      
      // Refresh page
      await page.reload()
      
      // Should still be logged in
      await expect(page).toHaveURL(/.*\/dashboard/)
      await expect(page.locator('[data-testid="user-menu"]')).toBeVisible()
    })

    test('should redirect to login when session expires', async ({ page }) => {
      // Login first
      await navigateToLogin(page)
      await fillLoginForm(page, TEST_USER.email, TEST_USER.password)
      await submitLoginForm(page)
      await waitForDashboard(page)
      
      // Simulate session expiration by clearing cookies
      await page.context().clearCookies()
      
      // Navigate to protected page
      await page.goto(`${BASE_URL}/dashboard/claims`)
      
      // Should redirect to login
      await expect(page).toHaveURL(/.*\/auth\/login/)
    })

    test('should handle concurrent sessions', async ({ browser }) => {
      // Create two browser contexts (different sessions)
      const context1 = await browser.newContext()
      const context2 = await browser.newContext()
      
      const page1 = await context1.newPage()
      const page2 = await context2.newPage()
      
      // Login in both contexts
      await navigateToLogin(page1)
      await fillLoginForm(page1, TEST_USER.email, TEST_USER.password)
      await submitLoginForm(page1)
      await waitForDashboard(page1)
      
      await navigateToLogin(page2)
      await fillLoginForm(page2, TEST_USER.email, TEST_USER.password)
      await submitLoginForm(page2)
      await waitForDashboard(page2)
      
      // Both sessions should be active
      await expect(page1.locator('[data-testid="user-menu"]')).toBeVisible()
      await expect(page2.locator('[data-testid="user-menu"]')).toBeVisible()
      
      await context1.close()
      await context2.close()
    })
  })

  test.describe('Logout Flow', () => {
    test('should successfully log out', async ({ page }) => {
      // Login first
      await navigateToLogin(page)
      await fillLoginForm(page, TEST_USER.email, TEST_USER.password)
      await submitLoginForm(page)
      await waitForDashboard(page)
      
      // Logout
      await page.click('[data-testid="user-menu"]')
      await page.click('[data-testid="logout-button"]')
      
      // Should redirect to login page
      await expect(page).toHaveURL(/.*\/auth\/login/)
      
      // Should show logout success message
      await expect(page.locator('[data-testid="success-message"]')).toContainText(/logged out/i)
    })

    test('should clear session data on logout', async ({ page }) => {
      // Login first
      await navigateToLogin(page)
      await fillLoginForm(page, TEST_USER.email, TEST_USER.password)
      await submitLoginForm(page)
      await waitForDashboard(page)
      
      // Logout
      await page.click('[data-testid="user-menu"]')
      await page.click('[data-testid="logout-button"]')
      
      // Try to access protected page
      await page.goto(`${BASE_URL}/dashboard`)
      
      // Should redirect to login
      await expect(page).toHaveURL(/.*\/auth\/login/)
    })
  })

  test.describe('Password Reset Flow', () => {
    test('should send password reset email', async ({ page }) => {
      await page.goto(`${BASE_URL}/auth/forgot-password`)
      
      await page.fill('[data-testid="email-input"]', TEST_USER.email)
      await page.click('[data-testid="reset-button"]')
      
      // Should show success message
      await expect(page.locator('[data-testid="success-message"]')).toContainText(/reset link sent/i)
    })

    test('should validate email for password reset', async ({ page }) => {
      await page.goto(`${BASE_URL}/auth/forgot-password`)
      
      await page.fill('[data-testid="email-input"]', 'invalid-email')
      await page.click('[data-testid="reset-button"]')
      
      // Should show validation error
      await expect(page.locator('[data-testid="email-error"]')).toContainText(/invalid email/i)
    })
  })

  test.describe('Accessibility', () => {
    test('should be accessible with screen readers', async ({ page }) => {
      await navigateToLogin(page)
      
      // Check for proper ARIA labels
      await expect(page.locator('[data-testid="email-input"]')).toHaveAttribute('aria-label')
      await expect(page.locator('[data-testid="password-input"]')).toHaveAttribute('aria-label')
      
      // Check for proper form structure
      await expect(page.locator('form')).toHaveAttribute('role', 'form')
    })

    test('should have proper focus management', async ({ page }) => {
      await navigateToLogin(page)
      
      // First focusable element should be email input
      await page.keyboard.press('Tab')
      await expect(page.locator('[data-testid="email-input"]')).toBeFocused()
    })
  })
})
