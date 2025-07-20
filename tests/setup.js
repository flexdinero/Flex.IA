/**
 * Test setup for Flex.IA headless browser tests
 */

// Increase timeout for browser tests
jest.setTimeout(30000);

// Mock console methods to reduce noise during tests
global.console = {
  ...console,
  // Uncomment to silence logs during tests
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};

// Global test utilities
global.testUtils = {
  // Wait for a specific amount of time
  wait: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
  
  // Generate random test data
  generateTestEmail: () => `test-${Date.now()}@example.com`,
  generateTestPassword: () => `TestPass${Date.now()}!`,
  
  // Common test URLs
  urls: {
    home: 'http://localhost:3005',
    login: 'http://localhost:3005/auth/login',
    signup: 'http://localhost:3005/auth/signup',
    dashboard: 'http://localhost:3005/dashboard',
    testLogin: 'http://localhost:3005/test-login'
  }
};

// Setup and teardown helpers
beforeAll(async () => {
  // Global setup if needed
});

afterAll(async () => {
  // Global cleanup if needed
});
