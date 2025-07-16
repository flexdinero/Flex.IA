# Project_Blueprint.md
## Single Source of Truth (SSOT) for Flex.IA Project

---

## Project Details

### Project Overview
- **Business name**: Flex.IA
- **Project purpose**: The ultimate platform for independent insurance adjusters to connect all of the IA Firms in one dashboard to get claims easier, stay organized, notified manage their business, connect with firms, and maximize earning potential
- **Core goals**: 
  1. Streamline claims management for independent adjusters
  2. Optimize earnings and performance tracking
  3. Facilitate connections between adjusters and IA firms
- **Unique value**: First comprehensive platform built specifically for independent insurance adjusters with unified claims management, earnings optimization, and firm networking
- **Target audience**: Independent insurance adjusters, IA firms, CAT team leads, property adjusters

### Business Structure
- **Business Type**: SaaS Platform
- **Location**: United States (Texas-focused initially)
- **Contact Info**: Platform-based communication system
- **Legal requirements**: Privacy policy, terms of service, insurance compliance, data protection
- **Monetization Modules**: Subscription tiers (Starter $29/month, Professional $79/month, Enterprise $149/month)

### Timeline/Deadlines
- **Current Status**: MVP Development Phase
- **Key milestones**: 
  - Authentication system ✓
  - Dashboard implementation ✓
  - Claims management system (in progress)
  - Firm networking features (planned)
  - Mobile optimization (planned)

---

## Product Details

### Platform(s)
- **Primary**: Web application (Next.js)
- **Future**: Mobile app, tablet optimization
- **Domain**: Flex.IA platform
- **Responsive design**: Mobile-first approach with tablet and desktop optimization

### Core Functionality
1. **Unified Claims Management**: Centralized dashboard for managing claims from multiple IA firms
2. **Earnings Optimization**: Track earnings, analyze performance metrics, maximize income potential
3. **Firm Connections**: Connect with top IA firms, manage contracts, expand professional network
4. **Smart Scheduling**: Optimize schedule with intelligent routing and automated appointment management
5. **Seamless Communication**: Direct communication with firms, share updates, collaborate on claims
6. **Performance Analytics**: Detailed analytics and benchmarking tools

### Pages/Screens
- Landing page with hero section, features, testimonials, pricing
- Authentication (login, signup, forgot password)
- Dashboard (main overview with KPIs and quick actions)
- Claims management (available, in-progress, completed)
- Messages and communication
- Calendar and scheduling
- Earnings and analytics
- Firm connections
- Settings and profile
- Document vault

### Design System
- **Colors**: Purple-blue gradient theme (#6366f1 to #3b82f6)
- **Framework**: Tailwind CSS with design tokens
- **Components**: Radix UI primitives with custom styling
- **Typography**: Inter font family
- **Theme**: Dark/light mode support

---

## Tech Stack

### Frontend
- **Framework**: Next.js 15.2.4 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with PostCSS
- **UI Components**: Radix UI primitives
- **State Management**: React hooks (useState, useEffect, useContext)
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js with Next.js API routes
- **Framework**: Blitz.js integration
- **Authentication**: Custom JWT-based auth with bcryptjs
- **Session Management**: Database-stored sessions with Prisma

### Database
- **Type**: SQLite (development), PostgreSQL (production ready)
- **ORM**: Prisma
- **Schema**: Users, Sessions, Tokens, Firms, Claims, Messages, Earnings, Calendar Events, Notifications

### Infrastructure
- **Hosting**: Vercel (current deployment)
- **Database URL**: Environment variable configured
- **Security**: JWT tokens, password hashing, session management
- **Environment**: Development, staging, production environments

### Dependencies
- **Core**: React 18, Next.js 15, TypeScript 5
- **UI**: Radix UI components, Tailwind CSS, Lucide icons
- **Backend**: Prisma, bcryptjs, jose (JWT), nanoid
- **Development**: ESLint, Prettier, Jest, Cypress
- **Additional**: date-fns, recharts, sharp, zod

---

## Database Schema

### Core Models
1. **User**: Adjuster profiles with credentials, certifications, specialties
2. **Firm**: IA firm information and ratings
3. **Claim**: Insurance claims with status, location, financial details
4. **Session**: User authentication sessions
5. **Token**: Password reset and email verification tokens
6. **Message**: Communication between adjusters and firms
7. **Earning**: Financial tracking and payment records
8. **CalendarEvent**: Scheduling and appointment management
9. **Notification**: System notifications and alerts

### Relationships
- Users have many Claims, Messages, Earnings, Calendar Events
- Firms have many Claims and Messages
- Claims belong to Firms and can be assigned to Users
- Bidirectional messaging between Users and Firms

---

## Features & Functionality

### Authentication System
- Email/password login with JWT tokens
- Two-factor authentication support
- Password reset functionality
- Email verification
- Session management with database storage

### Dashboard Features
- Key performance metrics (earnings, claims, ratings)
- Quick actions for common tasks
- Recent claims overview
- Message notifications
- Upcoming tasks and calendar integration
- Performance analytics

### Claims Management
- View available claims from multiple firms
- Claim assignment and status tracking
- Priority and deadline management
- Location-based claim organization
- Financial tracking per claim

### Communication System
- Direct messaging with IA firms
- Notification system for updates
- Message history and threading
- Priority message handling

### Earnings & Analytics
- Total and monthly earnings tracking
- Performance metrics and benchmarking
- Completion rate analysis
- Client satisfaction ratings
- Goal tracking and progress monitoring

---

## Security & Compliance
- **Authentication**: JWT-based with secure token storage
- **Password Security**: bcryptjs hashing with salt rounds
- **Session Management**: Database-stored sessions with expiration
- **Data Protection**: Environment variable configuration
- **API Security**: Protected routes with middleware authentication
- **Input Validation**: Zod schema validation for all forms

---

## Development Setup
- **Package Manager**: npm (with pnpm-lock.yaml for future pnpm migration)
- **Development Server**: `npm run dev` (Blitz.js development mode)
- **Database**: Prisma migrations with SQLite for development
- **Testing**: Jest, React Testing Library, Cypress for E2E
- **Code Quality**: ESLint, Prettier, TypeScript strict mode

---

## Future Roadmap
1. **Phase 1**: Complete core claims management features
2. **Phase 2**: Advanced analytics and reporting
3. **Phase 3**: Mobile application development
4. **Phase 4**: AI-powered claim matching and optimization
5. **Phase 5**: Enterprise features and white-label solutions

---

*This document serves as the Single Source of Truth (SSOT) for the Flex.IA project and should be referenced for all development decisions and feature implementations.*
