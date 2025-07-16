# TechSpecs.md
## Technical Specifications for Flex.IA Platform

---

## System Architecture

### Frontend Architecture
- **Framework**: Next.js 15.2.4 with App Router
- **Language**: TypeScript 5 (strict mode enabled)
- **Build System**: Next.js built-in bundling with Turbopack
- **Rendering**: Server-Side Rendering (SSR) with Client-Side Hydration
- **Routing**: File-based routing with App Router structure

### Backend Architecture
- **Runtime**: Node.js with Next.js API Routes
- **Framework Integration**: Blitz.js for enhanced development experience
- **API Design**: RESTful API endpoints with TypeScript interfaces
- **Middleware**: Custom authentication middleware for protected routes

### Database Architecture
- **Database**: SQLite (development) / PostgreSQL (production)
- **ORM**: Prisma with TypeScript client generation
- **Migrations**: Prisma migrate for schema versioning
- **Connection**: Environment-based connection string configuration

---

## UI Architecture & Design

### Design System
- **CSS Framework**: Tailwind CSS 3.4.17 with PostCSS
- **Component Library**: Radix UI primitives with custom styling
- **Design Tokens**: CSS custom properties for theming
- **Typography**: Inter font family from Google Fonts
- **Icons**: Lucide React icon library

### Component Structure (Atomic Design)
```
components/
├── ui/                    # Atoms (basic UI elements)
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   └── ...
├── dashboard-layout.tsx   # Organisms (complex components)
├── theme-provider.tsx     # Context providers
└── theme-toggle.tsx       # Molecules (composed components)
```

### Responsive Design
- **Approach**: Mobile-first design with progressive enhancement
- **Breakpoints**: Tailwind default breakpoints (sm: 640px, md: 768px, lg: 1024px, xl: 1280px)
- **Grid System**: CSS Grid and Flexbox for layouts
- **Typography**: Responsive text scaling with clamp() functions

### Theme System
- **Dark/Light Mode**: CSS custom properties with class-based switching
- **Color Palette**: Purple-blue gradient primary theme
- **State Management**: React Context for theme persistence
- **Storage**: localStorage for theme preference

---

## Key Technical Decisions

### Authentication Strategy
- **Method**: JWT-based authentication with database sessions
- **Token Storage**: HTTP-only cookies (secure)
- **Session Management**: Database-stored sessions with Prisma
- **Password Security**: bcryptjs with 12 salt rounds
- **Two-Factor**: TOTP support with speakeasy library

### State Management
- **Local State**: React hooks (useState, useEffect, useReducer)
- **Global State**: React Context for authentication and theme
- **Server State**: Direct API calls with fetch (no external state library)
- **Form State**: React Hook Form with Zod validation

### Data Validation
- **Schema Validation**: Zod for runtime type checking
- **Form Validation**: React Hook Form integration with Zod resolvers
- **API Validation**: Server-side validation for all endpoints
- **Type Safety**: TypeScript strict mode with explicit types

---

## Component Relationships

### Page Structure
```
app/
├── layout.tsx             # Root layout with providers
├── page.tsx              # Landing page
├── auth/
│   ├── login/page.tsx    # Authentication pages
│   └── signup/page.tsx
├── dashboard/
│   ├── page.tsx          # Main dashboard
│   ├── claims/page.tsx   # Claims management
│   ├── messages/page.tsx # Communication
│   └── ...
└── api/                  # API routes
    ├── auth/
    ├── user/
    └── ...
```

### Data Flow
1. **Authentication Flow**: Login → JWT creation → Session storage → Protected route access
2. **Dashboard Flow**: User data fetch → Component rendering → Real-time updates
3. **Claims Flow**: Firm data → Available claims → Assignment → Status tracking
4. **Communication Flow**: Message creation → Real-time delivery → Notification system

---

## Technologies Used

### Core Dependencies
```json
{
  "next": "15.2.4",
  "react": "^18.2.0",
  "typescript": "^5",
  "@blitzjs/next": "latest",
  "@blitzjs/rpc": "latest",
  "@prisma/client": "^5.20.0",
  "prisma": "^5.20.0"
}
```

### UI & Styling
```json
{
  "tailwindcss": "^3.4.17",
  "@radix-ui/react-*": "latest",
  "lucide-react": "^0.454.0",
  "class-variance-authority": "^0.7.1",
  "tailwind-merge": "^2.5.5"
}
```

### Authentication & Security
```json
{
  "bcryptjs": "^2.4.3",
  "jose": "^5.8.0",
  "nanoid": "^5.0.9",
  "speakeasy": "^2.0.0"
}
```

### Development Tools
```json
{
  "jest": "^29.7.0",
  "cypress": "^13.6.2",
  "@testing-library/react": "^14.1.2",
  "eslint": "latest",
  "prettier": "latest"
}
```

---

## Development Setup

### Environment Configuration
```bash
# Required environment variables
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-jwt-secret"
NEXTAUTH_SECRET="your-nextauth-secret"
```

### Build Process
1. **Development**: `npm run dev` - Blitz.js development server
2. **Build**: `npm run build` - Next.js production build
3. **Test**: `npm run test` - Jest test runner
4. **Lint**: `npm run lint` - ESLint code analysis

### Database Setup
1. **Install**: Prisma CLI and dependencies
2. **Generate**: `npx prisma generate` - Generate Prisma client
3. **Migrate**: `npx prisma migrate dev` - Apply schema changes
4. **Seed**: `npm run db:seed` - Populate with test data

---

## Technical Constraints

### Performance Requirements
- **First Contentful Paint**: < 1.5 seconds
- **Largest Contentful Paint**: < 2.5 seconds
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3.5 seconds

### Browser Support
- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **JavaScript**: ES2020+ features supported

### Security Constraints
- **HTTPS**: Required for production deployment
- **CSP**: Content Security Policy headers
- **CORS**: Configured for API endpoints
- **Rate Limiting**: API endpoint protection

---

## Deployment Strategy

### Vercel Deployment
- **Platform**: Vercel with automatic deployments
- **Build Command**: `npm run build`
- **Environment**: Production environment variables
- **Domain**: Custom domain configuration

### Database Deployment
- **Development**: SQLite file-based database
- **Production**: PostgreSQL with connection pooling
- **Migrations**: Automated with Prisma migrate
- **Backups**: Automated daily backups

### CI/CD Pipeline
- **Version Control**: Git with GitHub integration
- **Automated Testing**: Jest and Cypress on pull requests
- **Code Quality**: ESLint and Prettier checks
- **Deployment**: Automatic deployment on main branch merge

---

## API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - Session termination
- `POST /api/auth/forgot-password` - Password reset initiation

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/settings` - Get user preferences

### Claims Management
- `GET /api/claims` - List available claims
- `POST /api/claims/:id/assign` - Assign claim to user
- `PUT /api/claims/:id/status` - Update claim status

### Communication
- `GET /api/messages` - Get user messages
- `POST /api/messages` - Send new message
- `PUT /api/messages/:id/read` - Mark message as read

---

*This technical specification serves as the authoritative guide for all technical implementation decisions and system architecture.*
