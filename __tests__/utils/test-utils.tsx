/**
 * Test Utilities for Flex.IA
 * 
 * Comprehensive testing utilities including custom render functions,
 * mock providers, and test helpers for consistent testing patterns
 */

import React, { ReactElement } from 'react'
import { render, RenderOptions, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/hooks/useAuth'
import { ErrorBoundary } from '@/components/error-boundary'

// Mock user data for testing
export const mockUser = {
  id: 'user-123',
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  role: 'ADJUSTER' as const,
  isActive: true,
  emailVerified: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01')
}

// Mock admin user
export const mockAdminUser = {
  ...mockUser,
  id: 'admin-123',
  email: 'admin@example.com',
  role: 'ADMIN' as const
}

// Mock claims data
export const mockClaims = [
  {
    id: 'claim-1',
    claimNumber: 'CLM-2024-001',
    title: 'Property Damage - Hail Storm',
    type: 'PROPERTY_DAMAGE',
    status: 'AVAILABLE',
    priority: 'HIGH',
    estimatedValue: 25000,
    address: '123 Main St',
    city: 'Dallas',
    state: 'TX',
    zipCode: '75201',
    incidentDate: new Date('2024-01-15'),
    reportedDate: new Date('2024-01-16'),
    deadline: new Date('2024-02-15'),
    firm: {
      id: 'firm-1',
      name: 'Test Insurance Firm'
    }
  },
  {
    id: 'claim-2',
    claimNumber: 'CLM-2024-002',
    title: 'Auto Collision',
    type: 'AUTO_COLLISION',
    status: 'ASSIGNED',
    priority: 'MEDIUM',
    estimatedValue: 15000,
    address: '456 Oak Ave',
    city: 'Houston',
    state: 'TX',
    zipCode: '77001',
    incidentDate: new Date('2024-01-20'),
    reportedDate: new Date('2024-01-20'),
    deadline: new Date('2024-02-20'),
    firm: {
      id: 'firm-2',
      name: 'Another Insurance Firm'
    }
  }
]

// Mock API responses
export const mockApiResponses = {
  '/api/user/profile': { status: 200, data: mockUser },
  '/api/claims': { status: 200, data: mockClaims },
  '/api/dashboard/stats': {
    status: 200,
    data: {
      activeClaims: 5,
      monthlyEarnings: 12500,
      completionRate: 95,
      activeFirms: 3
    }
  },
  '/api/auth/login': {
    status: 200,
    data: { user: mockUser, token: 'mock-token' }
  }
}

// Custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialUser?: typeof mockUser | null
  queryClient?: QueryClient
  withErrorBoundary?: boolean
}

export function renderWithProviders(
  ui: ReactElement,
  {
    initialUser = mockUser,
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
      }
    }),
    withErrorBoundary = true,
    ...renderOptions
  }: CustomRenderOptions = {}
) {
  // Mock auth context
  const MockAuthProvider = ({ children }: { children: React.ReactNode }) => {
    const mockAuthValue = {
      user: initialUser,
      loading: false,
      error: null,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn(),
      updateProfile: jest.fn(),
      checkAuth: jest.fn()
    }

    return (
      <AuthProvider value={mockAuthValue}>
        {children}
      </AuthProvider>
    )
  }

  function Wrapper({ children }: { children: React.ReactNode }) {
    const content = (
      <QueryClientProvider client={queryClient}>
        <MockAuthProvider>
          {children}
        </MockAuthProvider>
      </QueryClientProvider>
    )

    if (withErrorBoundary) {
      return (
        <ErrorBoundary>
          {content}
        </ErrorBoundary>
      )
    }

    return content
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

// Mock fetch function
export function mockFetch(responses: Record<string, any> = mockApiResponses) {
  const mockFetch = jest.fn((url: string, options?: RequestInit) => {
    const response = responses[url] || { status: 404, data: { error: 'Not found' } }
    
    return Promise.resolve({
      ok: response.status >= 200 && response.status < 300,
      status: response.status,
      json: () => Promise.resolve(response.data),
      text: () => Promise.resolve(JSON.stringify(response.data)),
      headers: new Headers(),
      url
    } as Response)
  })

  global.fetch = mockFetch
  return mockFetch
}

// Mock localStorage
export function mockLocalStorage() {
  const store: Record<string, string> = {}

  const mockLocalStorage = {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key]
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach(key => delete store[key])
    })
  }

  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage
  })

  return mockLocalStorage
}

// Mock IntersectionObserver
export function mockIntersectionObserver() {
  const mockIntersectionObserver = jest.fn()
  mockIntersectionObserver.mockReturnValue({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn()
  })

  window.IntersectionObserver = mockIntersectionObserver
  return mockIntersectionObserver
}

// Mock ResizeObserver
export function mockResizeObserver() {
  const mockResizeObserver = jest.fn()
  mockResizeObserver.mockReturnValue({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn()
  })

  window.ResizeObserver = mockResizeObserver
  return mockResizeObserver
}

// Mock window.matchMedia
export function mockMatchMedia() {
  const mockMatchMedia = jest.fn((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }))

  window.matchMedia = mockMatchMedia
  return mockMatchMedia
}

// Test helpers
export const testHelpers = {
  // Wait for element to appear
  waitForElement: async (text: string | RegExp) => {
    return await waitFor(() => screen.getByText(text))
  },

  // Wait for element to disappear
  waitForElementToBeRemoved: async (text: string | RegExp) => {
    return await waitFor(() => {
      expect(screen.queryByText(text)).not.toBeInTheDocument()
    })
  },

  // Fill form field
  fillField: async (labelText: string | RegExp, value: string) => {
    const user = userEvent.setup()
    const field = screen.getByLabelText(labelText)
    await user.clear(field)
    await user.type(field, value)
    return field
  },

  // Click button
  clickButton: async (buttonText: string | RegExp) => {
    const user = userEvent.setup()
    const button = screen.getByRole('button', { name: buttonText })
    await user.click(button)
    return button
  },

  // Select option from dropdown
  selectOption: async (selectLabel: string | RegExp, optionText: string | RegExp) => {
    const user = userEvent.setup()
    const select = screen.getByLabelText(selectLabel)
    await user.click(select)
    const option = screen.getByText(optionText)
    await user.click(option)
    return option
  },

  // Upload file
  uploadFile: async (inputLabel: string | RegExp, file: File) => {
    const user = userEvent.setup()
    const input = screen.getByLabelText(inputLabel) as HTMLInputElement
    await user.upload(input, file)
    return input
  }
}

// Custom matchers
export const customMatchers = {
  toBeVisible: (element: HTMLElement) => {
    const isVisible = element.offsetWidth > 0 && element.offsetHeight > 0
    return {
      pass: isVisible,
      message: () => `Expected element to ${isVisible ? 'not ' : ''}be visible`
    }
  },

  toHaveAccessibleName: (element: HTMLElement, expectedName: string) => {
    const accessibleName = element.getAttribute('aria-label') || 
                          element.getAttribute('aria-labelledby') ||
                          element.textContent
    const hasName = accessibleName === expectedName
    return {
      pass: hasName,
      message: () => `Expected element to have accessible name "${expectedName}", got "${accessibleName}"`
    }
  }
}

// Performance testing utilities
export const performanceHelpers = {
  measureRenderTime: async (renderFn: () => void) => {
    const start = performance.now()
    renderFn()
    await waitFor(() => {}) // Wait for render to complete
    const end = performance.now()
    return end - start
  },

  expectFastRender: async (renderFn: () => void, maxTime = 100) => {
    const renderTime = await performanceHelpers.measureRenderTime(renderFn)
    expect(renderTime).toBeLessThan(maxTime)
  }
}

// Accessibility testing utilities
export const a11yHelpers = {
  expectKeyboardNavigation: async (element: HTMLElement) => {
    const user = userEvent.setup()
    element.focus()
    expect(element).toHaveFocus()
    
    await user.keyboard('{Tab}')
    // Should move focus to next element
  },

  expectScreenReaderText: (element: HTMLElement, expectedText: string) => {
    const srText = element.querySelector('.sr-only')?.textContent ||
                  element.getAttribute('aria-label') ||
                  element.getAttribute('aria-describedby')
    expect(srText).toContain(expectedText)
  },

  expectProperHeadingStructure: (container: HTMLElement) => {
    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6')
    let previousLevel = 0
    
    headings.forEach((heading) => {
      const level = parseInt(heading.tagName.charAt(1))
      expect(level).toBeLessThanOrEqual(previousLevel + 1)
      previousLevel = level
    })
  }
}

// API testing utilities
export const apiHelpers = {
  mockSuccessResponse: (data: any) => ({
    ok: true,
    status: 200,
    json: () => Promise.resolve(data)
  }),

  mockErrorResponse: (status: number, message: string) => ({
    ok: false,
    status,
    json: () => Promise.resolve({ error: message })
  }),

  expectApiCall: (mockFetch: jest.Mock, url: string, options?: Partial<RequestInit>) => {
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining(url),
      expect.objectContaining(options || {})
    )
  }
}

// Export everything for easy importing
export * from '@testing-library/react'
export * from '@testing-library/user-event'
export { renderWithProviders as render }
