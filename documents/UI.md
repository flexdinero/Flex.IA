# UI.md
## Complete UI Overview and Design System for Flex.IA

---

## Design System Overview

### Visual Identity
- **Brand Colors**: Purple-blue gradient theme (#6366f1 to #3b82f6)
- **Typography**: Inter font family from Google Fonts
- **Logo**: Gradient "F" in rounded square with "Flex.IA" wordmark
- **Style**: Modern, professional, tech-forward aesthetic
- **Tone**: Trustworthy, efficient, empowering for independent adjusters

### Color Palette
```css
/* Primary Colors */
--primary: 263 70% 50%        /* Purple #6366f1 */
--primary-foreground: 210 40% 98%

/* Secondary Colors */
--secondary: 220 14.3% 95.9%
--secondary-foreground: 220.9 39.3% 11%

/* Accent Colors */
--accent: 220 14.3% 95.9%
--accent-foreground: 220.9 39.3% 11%

/* Status Colors */
--destructive: 0 84.2% 60.2%  /* Red for errors */
--success: 142 76% 36%        /* Green for success */
--warning: 38 92% 50%         /* Yellow for warnings */
--info: 221 83% 53%           /* Blue for information */
```

### Typography Scale
- **Headings**: 
  - H1: 3rem (48px) - Hero titles
  - H2: 2.25rem (36px) - Section headers
  - H3: 1.875rem (30px) - Card titles
  - H4: 1.5rem (24px) - Component headers
- **Body Text**: 1rem (16px) - Default text
- **Small Text**: 0.875rem (14px) - Captions, metadata
- **Micro Text**: 0.75rem (12px) - Labels, badges

---

## Component Library (Atomic Design)

### Atoms (Basic UI Elements)

#### Buttons
```typescript
// Primary button for main actions
<Button className="bg-gradient-to-r from-purple-600 to-blue-600">
  Primary Action
</Button>

// Secondary button for alternative actions
<Button variant="outline">
  Secondary Action
</Button>

// Ghost button for subtle actions
<Button variant="ghost">
  Subtle Action
</Button>
```

#### Form Inputs
- **Text Input**: Standard text fields with focus states
- **Password Input**: Masked input with show/hide toggle
- **Select Dropdown**: Custom styled select with search
- **Checkbox**: Custom styled with indeterminate state
- **Radio Buttons**: Grouped selection controls
- **File Upload**: Drag-and-drop with preview

#### Feedback Elements
- **Badge**: Status indicators with color coding
- **Progress Bar**: Linear progress with percentage
- **Avatar**: User profile images with fallback initials
- **Skeleton**: Loading placeholders for content

### Molecules (Composed Components)

#### Cards
```typescript
// Standard card layout
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    Card content area
  </CardContent>
</Card>

// Metric card for dashboard KPIs
<Card className="hover:shadow-lg transition-shadow">
  <CardHeader className="flex flex-row items-center justify-between">
    <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
    <DollarSign className="h-4 w-4 text-green-600" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold text-green-600">$156,750</div>
    <div className="text-xs text-muted-foreground">+12.5% from last month</div>
  </CardContent>
</Card>
```

#### Navigation Elements
- **Sidebar Navigation**: Collapsible with role-based menu items
- **Breadcrumbs**: Hierarchical navigation trail
- **Tabs**: Horizontal tab navigation for content sections
- **Pagination**: Page navigation with first/last/prev/next

#### Data Display
- **Table**: Sortable columns with row actions
- **List**: Virtualized lists for large datasets
- **Timeline**: Chronological event display
- **Chart**: Recharts integration for analytics

### Organisms (Complex Components)

#### Dashboard Layout
```typescript
<DashboardLayout>
  <div className="space-y-6">
    {/* KPI Metrics Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Metric cards */}
    </div>
    
    {/* Quick Actions */}
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Action grid */}
      </CardContent>
    </Card>
    
    {/* Content Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent claims and messages */}
    </div>
  </div>
</DashboardLayout>
```

#### Authentication Forms
- **Login Form**: Email/password with 2FA support
- **Registration Form**: Multi-step with validation
- **Password Reset**: Email-based reset flow
- **Profile Setup**: Onboarding form for new users

---

## Page Layouts and Templates

### Landing Page Structure
1. **Hero Section**: Value proposition with gradient background
2. **Stats Section**: Key metrics in 4-column grid
3. **Features Section**: 6-card grid with icons and descriptions
4. **Testimonials**: Rotating testimonial carousel
5. **Pricing Section**: 3-tier pricing cards
6. **CTA Section**: Final conversion with gradient background
7. **Footer**: Links and company information

### Dashboard Layout
```
┌─────────────────────────────────────────────────────────┐
│ Header: Logo, User Menu, Theme Toggle                   │
├─────────────────────────────────────────────────────────┤
│ Welcome Header: Greeting, Quick Actions                 │
├─────────────────────────────────────────────────────────┤
│ KPI Grid: 4 metric cards (earnings, claims, rating)     │
├─────────────────────────────────────────────────────────┤
│ Quick Actions: 4 action cards with navigation           │
├─────────────────────────────────────────────────────────┤
│ Content Grid: Recent claims | Recent messages           │
├─────────────────────────────────────────────────────────┤
│ Tasks Section: Upcoming calendar events                 │
├─────────────────────────────────────────────────────────┤
│ Performance Grid: Monthly, efficiency, satisfaction     │
└─────────────────────────────────────────────────────────┘
```

### Claims Management Layout
- **Filter Sidebar**: Status, priority, location, date filters
- **Claims Grid**: Card-based layout with key information
- **Detail Modal**: Expandable claim details with actions
- **Map View**: Geographic visualization of claims

---

## Responsive Design Strategy

### Breakpoint System
```css
/* Mobile First Approach */
/* Default: 0px - 639px (Mobile) */
.container { padding: 1rem; }

/* sm: 640px+ (Large Mobile) */
@media (min-width: 640px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}

/* md: 768px+ (Tablet) */
@media (min-width: 768px) {
  .grid { grid-template-columns: repeat(3, 1fr); }
  .sidebar { display: block; }
}

/* lg: 1024px+ (Desktop) */
@media (min-width: 1024px) {
  .grid { grid-template-columns: repeat(4, 1fr); }
  .container { max-width: 1200px; }
}
```

### Mobile Optimizations
- **Touch Targets**: Minimum 44px for interactive elements
- **Navigation**: Collapsible hamburger menu
- **Cards**: Single column layout with full-width cards
- **Forms**: Stacked form fields with large inputs
- **Tables**: Horizontal scroll with sticky headers

---

## Theme System

### Dark/Light Mode Implementation
```typescript
// Theme Provider Context
const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  
  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }, [theme])
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
```

### CSS Custom Properties
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 263 70% 50%;
  --primary-foreground: 210 40% 98%;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 263 70% 50%;
  --primary-foreground: 222.2 84% 4.9%;
}
```

---

## Animation and Interactions

### Transition System
- **Duration**: 150ms for micro-interactions, 300ms for layout changes
- **Easing**: ease-out for entrances, ease-in for exits
- **Hover States**: Subtle scale and shadow changes
- **Loading States**: Skeleton animations and spinners

### Key Animations
```css
/* Card hover effects */
.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transition: all 300ms ease-out;
}

/* Button press feedback */
.button:active {
  transform: scale(0.98);
  transition: transform 150ms ease-out;
}

/* Page transitions */
.page-enter {
  opacity: 0;
  transform: translateY(10px);
}

.page-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: all 300ms ease-out;
}
```

---

## Accessibility Features

### WCAG 2.1 AA Compliance
- **Color Contrast**: Minimum 4.5:1 ratio for normal text
- **Focus Management**: Visible focus indicators for keyboard navigation
- **Screen Reader Support**: Proper ARIA labels and descriptions
- **Semantic HTML**: Proper heading hierarchy and landmark elements

### Keyboard Navigation
- **Tab Order**: Logical tab sequence through interactive elements
- **Skip Links**: Jump to main content functionality
- **Escape Handling**: Modal and dropdown dismissal
- **Arrow Keys**: Navigation within component groups

---

## Performance Optimizations

### Image Optimization
- **Next.js Image**: Automatic optimization and lazy loading
- **WebP Format**: Modern image format with fallbacks
- **Responsive Images**: Multiple sizes for different viewports
- **Placeholder**: Blur-up effect during loading

### Code Splitting
- **Route-based**: Automatic splitting by Next.js App Router
- **Component-based**: Dynamic imports for heavy components
- **Bundle Analysis**: Regular monitoring of bundle sizes

---

*This UI documentation serves as the complete guide for all visual and interaction design decisions in the Flex.IA platform.*
