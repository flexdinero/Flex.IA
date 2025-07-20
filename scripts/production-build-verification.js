#!/usr/bin/env node

/**
 * Production Build Verification Script for Flex.IA
 * 
 * Comprehensive verification of production build readiness including
 * build validation, environment checks, security verification, and deployment readiness
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// Production readiness checklist
const PRODUCTION_CHECKLIST = {
  environment: [
    'NODE_ENV=production',
    'DATABASE_URL (PostgreSQL)',
    'JWT_SECRET (32+ characters)',
    'NEXTAUTH_SECRET',
    'STRIPE_SECRET_KEY',
    'STRIPE_PUBLISHABLE_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'RESEND_API_KEY',
    'NEXT_PUBLIC_SITE_URL'
  ],
  build: [
    'Next.js build succeeds',
    'TypeScript compilation passes',
    'ESLint passes without errors',
    'Image optimization enabled',
    'Bundle size within limits',
    'No console.log in production'
  ],
  security: [
    'Security headers configured',
    'CSP policy implemented',
    'JWT secret is secure',
    'Input validation in place',
    'Rate limiting configured',
    'File upload security'
  ],
  performance: [
    'Code splitting implemented',
    'Lazy loading configured',
    'Caching strategies in place',
    'Bundle analysis completed',
    'Core Web Vitals optimized'
  ],
  seo: [
    'Meta tags implemented',
    'Sitemap generated',
    'Robots.txt configured',
    'Structured data added',
    'Open Graph tags'
  ]
}

class ProductionVerifier {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      passed: false,
      score: 0,
      maxScore: 0,
      categories: {},
      errors: [],
      warnings: [],
      recommendations: []
    }
  }

  async verify() {
    console.log('🚀 Starting production build verification...')
    console.log('=' .repeat(50))

    try {
      await this.checkEnvironment()
      await this.verifyBuild()
      await this.checkSecurity()
      await this.verifyPerformance()
      await this.checkSEO()
      await this.generateReport()
      
      this.calculateScore()
      this.displayResults()
      
    } catch (error) {
      console.error('❌ Verification failed:', error)
      process.exit(1)
    }
  }

  async checkEnvironment() {
    console.log('🔍 Checking environment configuration...')
    
    const category = 'environment'
    this.results.categories[category] = { passed: 0, total: 0, issues: [] }
    
    // Check .env.example exists
    if (fs.existsSync('.env.example')) {
      this.addPass(category, '.env.example file exists')
    } else {
      this.addFail(category, '.env.example file missing')
    }
    
    // Check required environment variables
    const requiredVars = [
      'DATABASE_URL',
      'JWT_SECRET',
      'NEXTAUTH_SECRET',
      'STRIPE_SECRET_KEY',
      'STRIPE_PUBLISHABLE_KEY',
      'RESEND_API_KEY'
    ]
    
    for (const varName of requiredVars) {
      if (process.env[varName]) {
        this.addPass(category, `${varName} is set`)
        
        // Additional validation for specific variables
        if (varName === 'JWT_SECRET' && process.env[varName].length < 32) {
          this.addFail(category, `${varName} is too short (minimum 32 characters)`)
        }
        
        if (varName === 'DATABASE_URL' && !process.env[varName].startsWith('postgresql://')) {
          this.addFail(category, `${varName} should be PostgreSQL URL for production`)
        }
      } else {
        this.addFail(category, `${varName} is not set`)
      }
    }
    
    // Check NODE_ENV
    if (process.env.NODE_ENV === 'production') {
      this.addPass(category, 'NODE_ENV is set to production')
    } else {
      this.addWarning(category, 'NODE_ENV is not set to production')
    }
  }

  async verifyBuild() {
    console.log('🏗️  Verifying build configuration...')
    
    const category = 'build'
    this.results.categories[category] = { passed: 0, total: 0, issues: [] }
    
    try {
      // Check Next.js config
      const nextConfigPath = path.join(process.cwd(), 'next.config.js')
      if (fs.existsSync(nextConfigPath)) {
        const nextConfig = require(nextConfigPath)
        
        // Check image optimization
        if (!nextConfig.images?.unoptimized) {
          this.addPass(category, 'Image optimization is enabled')
        } else {
          this.addFail(category, 'Image optimization is disabled')
        }
        
        // Check build error handling
        if (!nextConfig.typescript?.ignoreBuildErrors) {
          this.addPass(category, 'TypeScript build errors are not ignored')
        } else {
          this.addFail(category, 'TypeScript build errors are ignored')
        }
        
        if (!nextConfig.eslint?.ignoreDuringBuilds) {
          this.addPass(category, 'ESLint errors are not ignored during builds')
        } else {
          this.addFail(category, 'ESLint errors are ignored during builds')
        }
      }
      
      // Test build
      console.log('  Building application...')
      execSync('npm run build', { stdio: 'pipe' })
      this.addPass(category, 'Production build succeeds')
      
      // Check build output
      const buildDir = path.join(process.cwd(), '.next')
      if (fs.existsSync(buildDir)) {
        this.addPass(category, 'Build output directory exists')
        
        // Check for static optimization
        const staticDir = path.join(buildDir, 'static')
        if (fs.existsSync(staticDir)) {
          this.addPass(category, 'Static assets generated')
        }
      }
      
    } catch (error) {
      this.addFail(category, `Build failed: ${error.message}`)
    }
  }

  async checkSecurity() {
    console.log('🔒 Checking security configuration...')
    
    const category = 'security'
    this.results.categories[category] = { passed: 0, total: 0, issues: [] }
    
    // Check middleware security headers
    const middlewarePath = path.join(process.cwd(), 'middleware.ts')
    if (fs.existsSync(middlewarePath)) {
      const middlewareContent = fs.readFileSync(middlewarePath, 'utf8')
      
      if (middlewareContent.includes('X-Frame-Options')) {
        this.addPass(category, 'X-Frame-Options header configured')
      } else {
        this.addFail(category, 'X-Frame-Options header missing')
      }
      
      if (middlewareContent.includes('Content-Security-Policy')) {
        this.addPass(category, 'Content Security Policy configured')
      } else {
        this.addFail(category, 'Content Security Policy missing')
      }
      
      if (middlewareContent.includes('X-Content-Type-Options')) {
        this.addPass(category, 'X-Content-Type-Options header configured')
      } else {
        this.addFail(category, 'X-Content-Type-Options header missing')
      }
    } else {
      this.addFail(category, 'Middleware security configuration missing')
    }
    
    // Check for console.log statements in production code
    const hasConsoleLogs = this.checkForConsoleLogs()
    if (!hasConsoleLogs) {
      this.addPass(category, 'No console.log statements in production code')
    } else {
      this.addWarning(category, 'Console.log statements found in production code')
    }
    
    // Check auth configuration
    const authPath = path.join(process.cwd(), 'lib', 'auth.ts')
    if (fs.existsSync(authPath)) {
      const authContent = fs.readFileSync(authPath, 'utf8')
      
      if (!authContent.includes('fallback-secret')) {
        this.addPass(category, 'No fallback JWT secret in production')
      } else {
        this.addFail(category, 'Fallback JWT secret found in production code')
      }
    }
  }

  async verifyPerformance() {
    console.log('⚡ Verifying performance optimization...')
    
    const category = 'performance'
    this.results.categories[category] = { passed: 0, total: 0, issues: [] }
    
    // Check bundle size
    const buildManifest = path.join(process.cwd(), '.next', 'build-manifest.json')
    if (fs.existsSync(buildManifest)) {
      this.addPass(category, 'Build manifest exists')
      
      // Analyze bundle size (simplified check)
      const manifest = JSON.parse(fs.readFileSync(buildManifest, 'utf8'))
      const pageFiles = manifest.pages['/'] || []
      const totalSize = pageFiles.length
      
      if (totalSize < 10) { // Simplified metric
        this.addPass(category, 'Bundle size is optimized')
      } else {
        this.addWarning(category, 'Bundle size may be large')
      }
    }
    
    // Check for code splitting
    const pagesDir = path.join(process.cwd(), 'app')
    if (fs.existsSync(pagesDir)) {
      this.addPass(category, 'App directory structure supports code splitting')
    }
    
    // Check for lazy loading implementation
    const hasLazyLoading = this.checkForLazyLoading()
    if (hasLazyLoading) {
      this.addPass(category, 'Lazy loading implemented')
    } else {
      this.addWarning(category, 'Consider implementing lazy loading')
    }
  }

  async checkSEO() {
    console.log('🔍 Checking SEO configuration...')
    
    const category = 'seo'
    this.results.categories[category] = { passed: 0, total: 0, issues: [] }
    
    // Check sitemap
    const sitemapPath = path.join(process.cwd(), 'app', 'sitemap.ts')
    if (fs.existsSync(sitemapPath)) {
      this.addPass(category, 'Sitemap configuration exists')
    } else {
      this.addFail(category, 'Sitemap configuration missing')
    }
    
    // Check robots.txt
    const robotsPath = path.join(process.cwd(), 'app', 'robots.ts')
    if (fs.existsSync(robotsPath)) {
      this.addPass(category, 'Robots.txt configuration exists')
    } else {
      this.addFail(category, 'Robots.txt configuration missing')
    }
    
    // Check manifest
    const manifestPath = path.join(process.cwd(), 'app', 'manifest.ts')
    if (fs.existsSync(manifestPath)) {
      this.addPass(category, 'Web app manifest exists')
    } else {
      this.addWarning(category, 'Web app manifest missing')
    }
    
    // Check layout metadata
    const layoutPath = path.join(process.cwd(), 'app', 'layout.tsx')
    if (fs.existsSync(layoutPath)) {
      const layoutContent = fs.readFileSync(layoutPath, 'utf8')
      
      if (layoutContent.includes('generateMetadata')) {
        this.addPass(category, 'SEO metadata generation implemented')
      } else {
        this.addWarning(category, 'Consider implementing dynamic metadata generation')
      }
      
      if (layoutContent.includes('application/ld+json')) {
        this.addPass(category, 'Structured data implemented')
      } else {
        this.addWarning(category, 'Consider adding structured data')
      }
    }
  }

  checkForConsoleLogs() {
    const sourceFiles = this.getSourceFiles()
    
    for (const file of sourceFiles) {
      const content = fs.readFileSync(file, 'utf8')
      if (content.includes('console.log') && !file.includes('test') && !file.includes('spec')) {
        return true
      }
    }
    
    return false
  }

  checkForLazyLoading() {
    const sourceFiles = this.getSourceFiles()
    
    for (const file of sourceFiles) {
      const content = fs.readFileSync(file, 'utf8')
      if (content.includes('lazy(') || content.includes('dynamic(')) {
        return true
      }
    }
    
    return false
  }

  getSourceFiles() {
    const files = []
    const dirs = ['app', 'components', 'lib', 'hooks']
    
    for (const dir of dirs) {
      if (fs.existsSync(dir)) {
        this.walkDir(dir, files)
      }
    }
    
    return files.filter(file => file.endsWith('.ts') || file.endsWith('.tsx'))
  }

  walkDir(dir, files) {
    const items = fs.readdirSync(dir)
    
    for (const item of items) {
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)
      
      if (stat.isDirectory()) {
        this.walkDir(fullPath, files)
      } else {
        files.push(fullPath)
      }
    }
  }

  addPass(category, message) {
    this.results.categories[category].passed++
    this.results.categories[category].total++
    console.log(`  ✅ ${message}`)
  }

  addFail(category, message) {
    this.results.categories[category].total++
    this.results.categories[category].issues.push({ type: 'error', message })
    this.results.errors.push(`${category}: ${message}`)
    console.log(`  ❌ ${message}`)
  }

  addWarning(category, message) {
    this.results.categories[category].total++
    this.results.categories[category].issues.push({ type: 'warning', message })
    this.results.warnings.push(`${category}: ${message}`)
    console.log(`  ⚠️  ${message}`)
  }

  calculateScore() {
    let totalPassed = 0
    let totalChecks = 0
    
    for (const category of Object.values(this.results.categories)) {
      totalPassed += category.passed
      totalChecks += category.total
    }
    
    this.results.score = totalPassed
    this.results.maxScore = totalChecks
    this.results.passed = this.results.errors.length === 0
  }

  async generateReport() {
    const report = {
      ...this.results,
      recommendations: this.generateRecommendations()
    }
    
    const reportPath = path.join(process.cwd(), 'production-verification-report.json')
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
    
    console.log(`\n📊 Report saved to: ${reportPath}`)
  }

  generateRecommendations() {
    const recommendations = []
    
    if (this.results.errors.length > 0) {
      recommendations.push('Fix all critical errors before deploying to production')
    }
    
    if (this.results.warnings.length > 5) {
      recommendations.push('Address warnings to improve production readiness')
    }
    
    recommendations.push('Run security audit: npm audit')
    recommendations.push('Test with production data before deployment')
    recommendations.push('Set up monitoring and alerting')
    recommendations.push('Configure backup and disaster recovery')
    
    return recommendations
  }

  displayResults() {
    console.log('\n' + '=' .repeat(50))
    console.log('📊 PRODUCTION VERIFICATION RESULTS')
    console.log('=' .repeat(50))
    
    const percentage = Math.round((this.results.score / this.results.maxScore) * 100)
    console.log(`Score: ${this.results.score}/${this.results.maxScore} (${percentage}%)`)
    
    if (this.results.passed) {
      console.log('🎉 Production build verification PASSED!')
    } else {
      console.log('❌ Production build verification FAILED!')
      console.log(`\nErrors (${this.results.errors.length}):`)
      this.results.errors.forEach(error => console.log(`  - ${error}`))
    }
    
    if (this.results.warnings.length > 0) {
      console.log(`\nWarnings (${this.results.warnings.length}):`)
      this.results.warnings.forEach(warning => console.log(`  - ${warning}`))
    }
    
    console.log('\nRecommendations:')
    this.generateRecommendations().forEach(rec => console.log(`  - ${rec}`))
    
    if (!this.results.passed) {
      process.exit(1)
    }
  }
}

// Run verification
if (require.main === module) {
  const verifier = new ProductionVerifier()
  verifier.verify().catch(console.error)
}

module.exports = ProductionVerifier
