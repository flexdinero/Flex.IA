# API_Documentation.md
## Complete API Reference for Flex.IA Platform

---

## API Overview

### Base Configuration
- **Base URL**: `/api` (relative to application domain)
- **Authentication**: JWT Bearer tokens in Authorization header
- **Content Type**: `application/json` for all requests
- **Response Format**: JSON with consistent error handling
- **Rate Limiting**: To be implemented (recommended: 100 requests/minute per user)

### Authentication Flow
1. **Login**: `POST /api/auth/login` → Returns JWT token
2. **Token Usage**: Include in header: `Authorization: Bearer <token>`
3. **Token Refresh**: Automatic with 7-day expiration
4. **Logout**: `POST /api/auth/logout` → Invalidates session

---

## Authentication Endpoints

### POST /api/auth/login
**Purpose**: Authenticate user and create session
```typescript
// Request
{
  email: string;
  password: string;
  twoFactorToken?: string; // Optional for 2FA users
}

// Response (Success)
{
  success: true;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    emailVerified: boolean;
  };
  token: string;
}

// Response (2FA Required)
{
  success: false;
  requiresTwoFactor: true;
  message: "Two-factor authentication required";
}

// Response (Error)
{
  success: false;
  error: string;
}
```

### POST /api/auth/register
**Purpose**: Create new user account
```typescript
// Request
{
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  licenseNumber?: string;
  specialties?: string[];
}

// Response
{
  success: boolean;
  user?: UserProfile;
  error?: string;
}
```

### POST /api/auth/logout
**Purpose**: Terminate user session
```typescript
// Request: No body required (uses token from header)

// Response
{
  success: boolean;
  message: string;
}
```

### POST /api/auth/forgot-password
**Purpose**: Initiate password reset process
```typescript
// Request
{
  email: string;
}

// Response
{
  success: boolean;
  message: string;
}
```

### POST /api/auth/reset-password
**Purpose**: Complete password reset with token
```typescript
// Request
{
  token: string;
  newPassword: string;
}

// Response
{
  success: boolean;
  message: string;
}
```

---

## User Management Endpoints

### GET /api/user/profile
**Purpose**: Get current user profile information
```typescript
// Response
{
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  profileImage?: string;
  role: string;
  isActive: boolean;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  licenseNumber?: string;
  certifications?: string;
  specialties?: string;
  yearsExperience?: number;
  hourlyRate?: number;
  travelRadius?: number;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}
```

### PUT /api/user/profile
**Purpose**: Update user profile information
```typescript
// Request
{
  firstName?: string;
  lastName?: string;
  phone?: string;
  profileImage?: string;
  licenseNumber?: string;
  certifications?: string;
  specialties?: string;
  yearsExperience?: number;
  hourlyRate?: number;
  travelRadius?: number;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

// Response
{
  success: boolean;
  user?: UserProfile;
  error?: string;
}
```

### GET /api/user/settings
**Purpose**: Get user preferences and settings
```typescript
// Response
{
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private';
    showEarnings: boolean;
  };
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    timezone: string;
  };
}
```

---

## Claims Management Endpoints

### GET /api/claims
**Purpose**: Get list of claims with filtering and pagination
```typescript
// Query Parameters
{
  status?: 'AVAILABLE' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  type?: string;
  location?: string;
  page?: number;
  limit?: number;
  sortBy?: 'deadline' | 'amount' | 'priority' | 'created';
  sortOrder?: 'asc' | 'desc';
}

// Response
{
  claims: Claim[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    availableStatuses: string[];
    availableTypes: string[];
    availableLocations: string[];
  };
}
```

### GET /api/claims/:id
**Purpose**: Get detailed information for specific claim
```typescript
// Response
{
  id: string;
  claimNumber: string;
  title: string;
  description?: string;
  type: string;
  status: string;
  priority: string;
  estimatedValue?: number;
  finalValue?: number;
  adjusterFee?: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  coordinates?: string;
  incidentDate: string;
  reportedDate: string;
  deadline: string;
  completedAt?: string;
  firm: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    rating?: number;
  };
  adjuster?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}
```

### POST /api/claims/:id/assign
**Purpose**: Assign available claim to current user
```typescript
// Request: No body required (uses authenticated user)

// Response
{
  success: boolean;
  claim?: Claim;
  message: string;
}
```

### PUT /api/claims/:id/status
**Purpose**: Update claim status and progress
```typescript
// Request
{
  status: 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD';
  notes?: string;
  finalValue?: number;
  completedAt?: string;
}

// Response
{
  success: boolean;
  claim?: Claim;
  error?: string;
}
```

---

## Communication Endpoints

### GET /api/messages
**Purpose**: Get user messages with pagination and filtering
```typescript
// Query Parameters
{
  conversationId?: string;
  unreadOnly?: boolean;
  page?: number;
  limit?: number;
}

// Response
{
  messages: Message[];
  conversations: Conversation[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}
```

### POST /api/messages
**Purpose**: Send new message
```typescript
// Request
{
  recipientId: string;
  subject?: string;
  content: string;
  claimId?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
}

// Response
{
  success: boolean;
  message?: Message;
  error?: string;
}
```

### PUT /api/messages/:id/read
**Purpose**: Mark message as read
```typescript
// Request: No body required

// Response
{
  success: boolean;
  message: string;
}
```

---

## Dashboard & Analytics Endpoints

### GET /api/dashboard/stats
**Purpose**: Get dashboard KPI metrics
```typescript
// Response
{
  totalEarnings: number;
  monthlyEarnings: number;
  totalClaims: number;
  activeClaims: number;
  completedClaims: number;
  averageRating: number;
  completionRate: number;
  responseTime: number;
  monthlyGoalProgress: number;
  efficiencyScore: number;
}
```

### GET /api/dashboard/recent-activity
**Purpose**: Get recent claims, messages, and tasks
```typescript
// Response
{
  recentClaims: Claim[];
  recentMessages: Message[];
  upcomingTasks: CalendarEvent[];
  notifications: Notification[];
}
```

---

## Error Handling

### Standard Error Response Format
```typescript
{
  success: false;
  error: {
    code: string;           // Machine-readable error code
    message: string;        // Human-readable error message
    details?: any;          // Additional error context
    timestamp: string;      // ISO timestamp
    requestId: string;      // Unique request identifier
  };
}
```

### Common Error Codes
- `AUTH_REQUIRED`: Authentication token missing or invalid
- `AUTH_EXPIRED`: Token has expired
- `FORBIDDEN`: User lacks permission for requested resource
- `NOT_FOUND`: Requested resource does not exist
- `VALIDATION_ERROR`: Request data validation failed
- `RATE_LIMITED`: Too many requests from user
- `SERVER_ERROR`: Internal server error occurred

### HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `401`: Unauthorized (authentication required)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `429`: Too Many Requests (rate limited)
- `500`: Internal Server Error

---

## Request/Response Examples

### Authentication Example
```bash
# Login Request
curl -X POST /api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "adjuster@example.com",
    "password": "securepassword"
  }'

# Authenticated Request
curl -X GET /api/user/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Claims Management Example
```bash
# Get Available Claims
curl -X GET "/api/claims?status=AVAILABLE&priority=HIGH&limit=10" \
  -H "Authorization: Bearer <token>"

# Assign Claim
curl -X POST /api/claims/clm_123456/assign \
  -H "Authorization: Bearer <token>"
```

---

*This API documentation provides the complete reference for all backend endpoints and data structures used in the Flex.IA platform.*
