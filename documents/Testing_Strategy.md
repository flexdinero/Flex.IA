# Testing_Strategy.md
## Comprehensive Testing Framework for Flex.IA Platform

---

## Testing Philosophy

### Testing Pyramid Strategy
```
                    /\
                   /  \
                  / E2E \
                 /______\
                /        \
               /Integration\
              /__________\
             /            \
            /     Unit     \
           /________________\
```

- **Unit Tests (70%)**: Fast, isolated component and function testing
- **Integration Tests (20%)**: API endpoints and component interaction testing
- **End-to-End Tests (10%)**: Full user workflow testing

### Quality Gates
- **Code Coverage**: Minimum 90% for critical paths, 80% overall
- **Test Performance**: Unit tests < 100ms, Integration tests < 5s
- **Reliability**: Tests must pass consistently (>99% success rate)
- **Maintainability**: Tests should be readable and easy to update

---

## Unit Testing Framework

### Technology Stack
- **Test Runner**: Jest 29.7.0
- **React Testing**: React Testing Library 14.1.2
- **Mocking**: Jest built-in mocking capabilities
- **Assertions**: Jest matchers with custom extensions
- **Coverage**: Istanbul coverage reports

### Unit Test Structure
```typescript
// Example: User Authentication Hook Test
describe('useAuth Hook', () => {
  beforeEach(() => {
    // Setup test environment
    jest.clearAllMocks()
    fetchMock.resetMocks()
  })

  describe('login functionality', () => {
    it('should successfully authenticate user with valid credentials', async () => {
      // Arrange
      const mockUser = { id: '1', email: 'test@example.com' }
      fetchMock.mockResponseOnce(JSON.stringify({ success: true, user: mockUser }))

      // Act
      const { result } = renderHook(() => useAuth())
      await act(async () => {
        await result.current.login('test@example.com', 'password')
      })

      // Assert
      expect(result.current.user).toEqual(mockUser)
      expect(fetchMock).toHaveBeenCalledWith('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com', password: 'password' })
      })
    })

    it('should handle authentication failure gracefully', async () => {
      // Test error scenarios
    })

    it('should require two-factor authentication when enabled', async () => {
      // Test 2FA flow
    })
  })
})
```

### Component Testing Patterns
```typescript
// Example: Dashboard Component Test
describe('Dashboard Component', () => {
  const mockUser = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    role: 'ADJUSTER'
  }

  beforeEach(() => {
    // Mock authentication context
    jest.spyOn(require('@/hooks/useAuth'), 'useAuth').mockReturnValue({
      user: mockUser,
      loading: false
    })
  })

  it('should display user welcome message', () => {
    render(<DashboardPage />)
    expect(screen.getByText('Welcome back, John!')).toBeInTheDocument()
  })

  it('should show KPI metrics cards', () => {
    render(<DashboardPage />)
    expect(screen.getByText('Total Earnings')).toBeInTheDocument()
    expect(screen.getByText('Active Claims')).toBeInTheDocument()
    expect(screen.getByText('Average Rating')).toBeInTheDocument()
  })

  it('should navigate to claims page when quick action clicked', async () => {
    const user = userEvent.setup()
    render(<DashboardPage />)
    
    const claimsAction = screen.getByText('View Available Claims')
    await user.click(claimsAction)
    
    expect(mockRouter.push).toHaveBeenCalledWith('/dashboard/claims')
  })
})
```

---

## Integration Testing

### API Testing Framework
```typescript
// Example: Claims API Integration Test
describe('Claims API Integration', () => {
  let testUser: User
  let authToken: string

  beforeAll(async () => {
    // Setup test database
    await setupTestDatabase()
    testUser = await createTestUser()
    authToken = await generateAuthToken(testUser)
  })

  afterAll(async () => {
    await cleanupTestDatabase()
  })

  describe('GET /api/claims', () => {
    it('should return paginated claims list', async () => {
      // Create test claims
      await createTestClaims(5)

      const response = await request(app)
        .get('/api/claims?page=1&limit=3')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)

      expect(response.body).toMatchObject({
        claims: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            claimNumber: expect.any(String),
            status: expect.any(String)
          })
        ]),
        pagination: {
          page: 1,
          limit: 3,
          total: 5,
          totalPages: 2
        }
      })
    })

    it('should filter claims by status', async () => {
      await createTestClaims(3, { status: 'AVAILABLE' })
      await createTestClaims(2, { status: 'ASSIGNED' })

      const response = await request(app)
        .get('/api/claims?status=AVAILABLE')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)

      expect(response.body.claims).toHaveLength(3)
      response.body.claims.forEach(claim => {
        expect(claim.status).toBe('AVAILABLE')
      })
    })
  })

  describe('POST /api/claims/:id/assign', () => {
    it('should assign available claim to authenticated user', async () => {
      const claim = await createTestClaim({ status: 'AVAILABLE' })

      const response = await request(app)
        .post(`/api/claims/${claim.id}/assign`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)

      expect(response.body).toMatchObject({
        success: true,
        claim: expect.objectContaining({
          id: claim.id,
          status: 'ASSIGNED',
          adjusterId: testUser.id
        })
      })
    })

    it('should reject assignment of already assigned claim', async () => {
      const claim = await createTestClaim({ 
        status: 'ASSIGNED',
        adjusterId: 'other-user-id'
      })

      await request(app)
        .post(`/api/claims/${claim.id}/assign`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400)
    })
  })
})
```

### Database Integration Testing
```typescript
// Example: Prisma Database Integration Test
describe('Database Operations', () => {
  beforeEach(async () => {
    await prisma.$transaction([
      prisma.claim.deleteMany(),
      prisma.user.deleteMany(),
      prisma.firm.deleteMany()
    ])
  })

  describe('User-Claim Relationships', () => {
    it('should maintain referential integrity', async () => {
      const user = await prisma.user.create({
        data: {
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          hashedPassword: 'hashed'
        }
      })

      const firm = await prisma.firm.create({
        data: {
          name: 'Test Firm',
          email: 'firm@example.com'
        }
      })

      const claim = await prisma.claim.create({
        data: {
          claimNumber: 'CLM-001',
          title: 'Test Claim',
          type: 'PROPERTY_DAMAGE',
          address: '123 Test St',
          city: 'Test City',
          state: 'TX',
          zipCode: '12345',
          incidentDate: new Date(),
          reportedDate: new Date(),
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          firmId: firm.id,
          adjusterId: user.id
        }
      })

      // Verify relationships
      const claimWithRelations = await prisma.claim.findUnique({
        where: { id: claim.id },
        include: { firm: true, adjuster: true }
      })

      expect(claimWithRelations?.firm.name).toBe('Test Firm')
      expect(claimWithRelations?.adjuster?.firstName).toBe('Test')
    })
  })
})
```

---

## End-to-End Testing

### Cypress Configuration
```typescript
// cypress.config.ts
export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    video: true,
    screenshotOnRunFailure: true,
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000
  }
})
```

### E2E Test Examples
```typescript
// cypress/e2e/authentication.cy.ts
describe('User Authentication Flow', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  it('should complete full registration and login flow', () => {
    // Registration
    cy.get('[data-testid="signup-link"]').click()
    cy.url().should('include', '/auth/signup')
    
    cy.get('[data-testid="email-input"]').type('newuser@example.com')
    cy.get('[data-testid="password-input"]').type('SecurePassword123!')
    cy.get('[data-testid="firstName-input"]').type('John')
    cy.get('[data-testid="lastName-input"]').type('Doe')
    cy.get('[data-testid="signup-button"]').click()

    // Should redirect to dashboard after successful registration
    cy.url().should('include', '/dashboard')
    cy.get('[data-testid="welcome-message"]').should('contain', 'Welcome back, John!')
  })

  it('should handle login with invalid credentials', () => {
    cy.get('[data-testid="login-link"]').click()
    cy.get('[data-testid="email-input"]').type('invalid@example.com')
    cy.get('[data-testid="password-input"]').type('wrongpassword')
    cy.get('[data-testid="login-button"]').click()

    cy.get('[data-testid="error-message"]').should('be.visible')
    cy.url().should('include', '/auth/login')
  })
})

// cypress/e2e/claims-management.cy.ts
describe('Claims Management Workflow', () => {
  beforeEach(() => {
    cy.login('adjuster@example.com', 'password')
    cy.visit('/dashboard/claims')
  })

  it('should display available claims and allow assignment', () => {
    // Verify claims list loads
    cy.get('[data-testid="claims-grid"]').should('be.visible')
    cy.get('[data-testid="claim-card"]').should('have.length.at.least', 1)

    // Filter by status
    cy.get('[data-testid="status-filter"]').select('AVAILABLE')
    cy.get('[data-testid="claim-card"]').each($card => {
      cy.wrap($card).find('[data-testid="claim-status"]').should('contain', 'Available')
    })

    // Assign first available claim
    cy.get('[data-testid="claim-card"]').first().within(() => {
      cy.get('[data-testid="assign-button"]').click()
    })

    // Verify assignment success
    cy.get('[data-testid="success-notification"]').should('be.visible')
    cy.get('[data-testid="claim-status"]').first().should('contain', 'Assigned')
  })
})
```

---

## Performance Testing

### Load Testing Strategy
```typescript
// Example: API Load Test Configuration
const loadTestConfig = {
  scenarios: {
    authentication: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 10 },
        { duration: '5m', target: 50 },
        { duration: '2m', target: 0 }
      ]
    },
    dashboard: {
      executor: 'constant-vus',
      vus: 20,
      duration: '10m'
    }
  },
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.1']
  }
}
```

### Frontend Performance Testing
```typescript
// Lighthouse CI Configuration
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000/', 'http://localhost:3000/dashboard'],
      numberOfRuns: 3
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }]
      }
    }
  }
}
```

---

## Test Data Management

### Test Database Setup
```typescript
// Test database configuration
const testDatabaseConfig = {
  provider: 'sqlite',
  url: 'file:./test.db',
  migrations: {
    dir: './prisma/migrations'
  }
}

// Test data factories
export const userFactory = (overrides = {}) => ({
  email: faker.internet.email(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  hashedPassword: 'hashed-password',
  role: 'ADJUSTER',
  ...overrides
})

export const claimFactory = (overrides = {}) => ({
  claimNumber: `CLM-${faker.number.int({ min: 1000, max: 9999 })}`,
  title: faker.lorem.sentence(),
  type: faker.helpers.arrayElement(['PROPERTY_DAMAGE', 'AUTO_COLLISION']),
  status: 'AVAILABLE',
  address: faker.location.streetAddress(),
  city: faker.location.city(),
  state: faker.location.state({ abbreviated: true }),
  zipCode: faker.location.zipCode(),
  incidentDate: faker.date.past(),
  reportedDate: faker.date.recent(),
  deadline: faker.date.future(),
  ...overrides
})
```

---

## Continuous Integration Testing

### GitHub Actions Workflow
```yaml
# .github/workflows/test.yml
name: Test Suite
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:integration
      - run: npm run test:e2e:headless
      
      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
```

### Test Scripts Configuration
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:unit": "jest --testPathPattern=__tests__/unit",
    "test:integration": "jest --testPathPattern=__tests__/integration",
    "test:e2e": "cypress run",
    "test:e2e:open": "cypress open",
    "test:e2e:headless": "cypress run --headless"
  }
}
```

---

*This testing strategy provides comprehensive coverage for all aspects of the Flex.IA platform, ensuring reliability, performance, and user experience quality.*
