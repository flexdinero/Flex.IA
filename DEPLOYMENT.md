# Flex.IA Production Deployment Guide

## 🚀 Overview

This guide covers the complete deployment process for Flex.IA, including database setup, environment configuration, and production deployment.

## 📋 Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- Stripe account for payments
- OpenAI API key (optional, for AI chat)
- Domain name and SSL certificate
- Cloud hosting provider (Vercel, Railway, or similar)

## 🔧 Environment Setup

### 1. Database Configuration

**Option A: Local PostgreSQL**
```bash
# Install PostgreSQL
brew install postgresql  # macOS
sudo apt install postgresql  # Ubuntu

# Create database
createdb flexia_production
```

**Option B: Cloud Database (Recommended)**
- **Supabase**: Free tier with 500MB storage
- **PlanetScale**: Serverless MySQL with generous free tier
- **Railway**: PostgreSQL with automatic backups
- **Neon**: Serverless PostgreSQL

### 2. Environment Variables

Create `.env.production` file:

```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# Authentication
NEXTAUTH_SECRET="your-super-secret-key-here"
NEXTAUTH_URL="https://yourdomain.com"

# Stripe (Production Keys)
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email (Choose one)
# Resend
RESEND_API_KEY="re_..."

# SendGrid
SENDGRID_API_KEY="SG..."
SENDGRID_FROM_EMAIL="noreply@yourdomain.com"

# File Storage (Choose one)
# AWS S3
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="flexia-documents"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# AI Chat (Optional)
OPENAI_API_KEY="sk-..."

# Security
ENCRYPTION_KEY="your-32-character-encryption-key"

# App Configuration
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
```

## 🗄️ Database Migration

### 1. Run Migrations

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Seed initial data (optional)
npx prisma db seed
```

### 2. Verify Database

```bash
# Check database connection
npx prisma db pull

# View database in Prisma Studio
npx prisma studio
```

## 🏗️ Build Process

### 1. Production Build

```bash
# Install production dependencies
npm ci --only=production

# Build the application
npm run build

# Test the build locally
npm start
```

### 2. Build Optimization

Add to `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  images: {
    domains: ['your-domain.com', 'res.cloudinary.com'],
  },
  // Enable compression
  compress: true,
  // Optimize for production
  swcMinify: true,
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
```

## ☁️ Deployment Options

### Option 1: Vercel (Recommended)

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel --prod
   ```

2. **Configure Environment Variables**
   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Add all production environment variables

3. **Custom Domain**
   - Add your domain in Vercel Dashboard
   - Configure DNS records as instructed

### Option 2: Railway

1. **Deploy via CLI**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login and deploy
   railway login
   railway link
   railway up
   ```

2. **Environment Variables**
   ```bash
   # Set environment variables
   railway variables set DATABASE_URL="..."
   railway variables set NEXTAUTH_SECRET="..."
   ```

### Option 3: Docker Deployment

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine AS deps
   RUN apk add --no-cache libc6-compat
   WORKDIR /app
   COPY package.json package-lock.json ./
   RUN npm ci --only=production

   FROM node:18-alpine AS builder
   WORKDIR /app
   COPY --from=deps /app/node_modules ./node_modules
   COPY . .
   RUN npm run build

   FROM node:18-alpine AS runner
   WORKDIR /app
   ENV NODE_ENV production
   RUN addgroup --system --gid 1001 nodejs
   RUN adduser --system --uid 1001 nextjs
   COPY --from=builder /app/public ./public
   COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
   COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
   USER nextjs
   EXPOSE 3000
   ENV PORT 3000
   CMD ["node", "server.js"]
   ```

2. **Build and Deploy**
   ```bash
   # Build image
   docker build -t flexia .
   
   # Run container
   docker run -p 3000:3000 --env-file .env.production flexia
   ```

## 🔒 Security Configuration

### 1. SSL Certificate

**Cloudflare (Recommended)**
- Add your domain to Cloudflare
- Enable "Full (strict)" SSL mode
- Enable "Always Use HTTPS"

**Let's Encrypt**
```bash
# Install certbot
sudo apt install certbot

# Generate certificate
sudo certbot certonly --standalone -d yourdomain.com
```

### 2. Security Headers

Add to your hosting provider or reverse proxy:

```nginx
# Nginx configuration
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;
add_header X-XSS-Protection "1; mode=block";
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';";
```

## 📊 Monitoring & Analytics

### 1. Application Monitoring

**Sentry (Error Tracking)**
```bash
npm install @sentry/nextjs

# Add to next.config.js
const { withSentryConfig } = require('@sentry/nextjs');
module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);
```

**Vercel Analytics**
```bash
npm install @vercel/analytics

# Add to app/layout.tsx
import { Analytics } from '@vercel/analytics/react'
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### 2. Performance Monitoring

**Web Vitals**
```javascript
// pages/_app.js
export function reportWebVitals(metric) {
  console.log(metric)
  // Send to analytics service
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build application
        run: npm run build
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 🧪 Testing in Production

### 1. Health Checks

Create `pages/api/health.js`:

```javascript
export default function handler(req, res) {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version
  })
}
```

### 2. Database Connection Test

```javascript
// pages/api/db-health.js
import { prisma } from '../../lib/db'

export default async function handler(req, res) {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.status(200).json({ database: 'connected' })
  } catch (error) {
    res.status(500).json({ database: 'disconnected', error: error.message })
  }
}
```

## 📈 Post-Deployment

### 1. Domain Configuration

1. **DNS Records**
   ```
   Type: A
   Name: @
   Value: [Your server IP]
   
   Type: CNAME
   Name: www
   Value: yourdomain.com
   ```

2. **Email Setup**
   - Configure SPF, DKIM, and DMARC records
   - Set up email forwarding if needed

### 2. Monitoring Setup

1. **Uptime Monitoring**
   - UptimeRobot (free)
   - Pingdom
   - StatusCake

2. **Performance Monitoring**
   - Google PageSpeed Insights
   - GTmetrix
   - WebPageTest

### 3. Backup Strategy

1. **Database Backups**
   ```bash
   # Automated daily backups
   pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
   ```

2. **File Storage Backups**
   - Enable versioning on S3/Cloudinary
   - Set up automated backup schedules

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear cache and rebuild
   rm -rf .next node_modules
   npm install
   npm run build
   ```

2. **Database Connection Issues**
   ```bash
   # Test connection
   npx prisma db pull
   
   # Reset database (caution!)
   npx prisma migrate reset
   ```

3. **Environment Variable Issues**
   ```bash
   # Verify environment variables
   printenv | grep -E "(DATABASE_URL|NEXTAUTH_SECRET)"
   ```

## 📞 Support

For deployment issues:
1. Check the application logs
2. Verify environment variables
3. Test database connectivity
4. Review security settings
5. Contact hosting provider support

---

**🎉 Congratulations! Your Flex.IA application is now live in production!**
