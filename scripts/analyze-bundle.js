#!/usr/bin/env node

/**
 * Bundle Analysis Script for Flex.IA
 * 
 * Analyzes bundle size, identifies optimization opportunities,
 * and generates performance reports
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// Performance budgets (in KB)
const PERFORMANCE_BUDGETS = {
  // Total bundle sizes
  totalJS: 500, // 500KB total JavaScript
  totalCSS: 100, // 100KB total CSS
  
  // Individual chunk sizes
  mainChunk: 200, // 200KB main chunk
  vendorChunk: 250, // 250KB vendor chunk
  pageChunk: 50, // 50KB per page chunk
  
  // Asset sizes
  images: 1000, // 1MB total images
  fonts: 100, // 100KB total fonts
}

// Critical dependencies that should be monitored
const CRITICAL_DEPENDENCIES = [
  'react',
  'react-dom',
  'next',
  '@prisma/client',
  'lucide-react',
  'tailwindcss'
]

class BundleAnalyzer {
  constructor() {
    this.buildDir = path.join(process.cwd(), '.next')
    this.staticDir = path.join(this.buildDir, 'static')
    this.report = {
      timestamp: new Date().toISOString(),
      totalSize: 0,
      chunks: [],
      assets: [],
      dependencies: [],
      violations: [],
      recommendations: []
    }
  }

  async analyze() {
    console.log('🔍 Starting bundle analysis...')
    
    try {
      // Build the application first
      await this.buildApplication()
      
      // Analyze chunks
      await this.analyzeChunks()
      
      // Analyze assets
      await this.analyzeAssets()
      
      // Analyze dependencies
      await this.analyzeDependencies()
      
      // Check performance budgets
      this.checkPerformanceBudgets()
      
      // Generate recommendations
      this.generateRecommendations()
      
      // Generate report
      await this.generateReport()
      
      console.log('✅ Bundle analysis completed!')
      
    } catch (error) {
      console.error('❌ Bundle analysis failed:', error)
      process.exit(1)
    }
  }

  async buildApplication() {
    console.log('🏗️  Building application...')
    
    try {
      execSync('npm run build', { 
        stdio: 'inherit',
        env: { ...process.env, ANALYZE: 'false' }
      })
    } catch (error) {
      throw new Error('Build failed: ' + error.message)
    }
  }

  async analyzeChunks() {
    console.log('📦 Analyzing JavaScript chunks...')
    
    const chunksDir = path.join(this.staticDir, 'chunks')
    if (!fs.existsSync(chunksDir)) {
      console.warn('Chunks directory not found')
      return
    }

    const files = fs.readdirSync(chunksDir, { recursive: true })
    
    for (const file of files) {
      if (file.endsWith('.js')) {
        const filePath = path.join(chunksDir, file)
        const stats = fs.statSync(filePath)
        const sizeKB = Math.round(stats.size / 1024)
        
        this.report.chunks.push({
          name: file,
          size: sizeKB,
          path: filePath,
          type: this.getChunkType(file)
        })
        
        this.report.totalSize += sizeKB
      }
    }
    
    // Sort chunks by size
    this.report.chunks.sort((a, b) => b.size - a.size)
    
    console.log(`Found ${this.report.chunks.length} JavaScript chunks`)
  }

  async analyzeAssets() {
    console.log('🖼️  Analyzing static assets...')
    
    const assetsDir = path.join(this.staticDir, 'media')
    if (!fs.existsSync(assetsDir)) {
      console.warn('Assets directory not found')
      return
    }

    const files = fs.readdirSync(assetsDir, { recursive: true })
    
    for (const file of files) {
      const filePath = path.join(assetsDir, file)
      const stats = fs.statSync(filePath)
      const sizeKB = Math.round(stats.size / 1024)
      
      this.report.assets.push({
        name: file,
        size: sizeKB,
        type: this.getAssetType(file)
      })
    }
    
    // Sort assets by size
    this.report.assets.sort((a, b) => b.size - a.size)
    
    console.log(`Found ${this.report.assets.length} static assets`)
  }

  async analyzeDependencies() {
    console.log('📚 Analyzing dependencies...')
    
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8')
    )
    
    const dependencies = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies
    }
    
    for (const [name, version] of Object.entries(dependencies)) {
      try {
        const packagePath = path.join(process.cwd(), 'node_modules', name, 'package.json')
        if (fs.existsSync(packagePath)) {
          const depPackageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
          
          this.report.dependencies.push({
            name,
            version,
            description: depPackageJson.description || '',
            isCritical: CRITICAL_DEPENDENCIES.includes(name),
            size: await this.estimatePackageSize(name)
          })
        }
      } catch (error) {
        console.warn(`Failed to analyze dependency ${name}:`, error.message)
      }
    }
    
    // Sort dependencies by size
    this.report.dependencies.sort((a, b) => b.size - a.size)
  }

  async estimatePackageSize(packageName) {
    try {
      const packageDir = path.join(process.cwd(), 'node_modules', packageName)
      const size = await this.getDirectorySize(packageDir)
      return Math.round(size / 1024) // Convert to KB
    } catch (error) {
      return 0
    }
  }

  async getDirectorySize(dirPath) {
    let totalSize = 0
    
    try {
      const files = fs.readdirSync(dirPath, { withFileTypes: true })
      
      for (const file of files) {
        const filePath = path.join(dirPath, file.name)
        
        if (file.isDirectory()) {
          totalSize += await this.getDirectorySize(filePath)
        } else {
          const stats = fs.statSync(filePath)
          totalSize += stats.size
        }
      }
    } catch (error) {
      // Ignore errors for inaccessible directories
    }
    
    return totalSize
  }

  checkPerformanceBudgets() {
    console.log('⚖️  Checking performance budgets...')
    
    // Check total JavaScript size
    const totalJS = this.report.chunks.reduce((sum, chunk) => sum + chunk.size, 0)
    if (totalJS > PERFORMANCE_BUDGETS.totalJS) {
      this.report.violations.push({
        type: 'budget',
        message: `Total JavaScript size (${totalJS}KB) exceeds budget (${PERFORMANCE_BUDGETS.totalJS}KB)`,
        severity: 'high'
      })
    }
    
    // Check individual chunk sizes
    for (const chunk of this.report.chunks) {
      const budget = this.getChunkBudget(chunk.type)
      if (chunk.size > budget) {
        this.report.violations.push({
          type: 'budget',
          message: `Chunk ${chunk.name} (${chunk.size}KB) exceeds budget (${budget}KB)`,
          severity: 'medium'
        })
      }
    }
    
    // Check large assets
    const largeAssets = this.report.assets.filter(asset => asset.size > 100) // 100KB
    for (const asset of largeAssets) {
      this.report.violations.push({
        type: 'asset',
        message: `Large asset detected: ${asset.name} (${asset.size}KB)`,
        severity: 'low'
      })
    }
  }

  generateRecommendations() {
    console.log('💡 Generating recommendations...')
    
    // Recommend code splitting for large chunks
    const largeChunks = this.report.chunks.filter(chunk => chunk.size > 100)
    if (largeChunks.length > 0) {
      this.report.recommendations.push({
        type: 'code-splitting',
        message: 'Consider implementing code splitting for large chunks',
        chunks: largeChunks.map(c => c.name)
      })
    }
    
    // Recommend dependency optimization
    const largeDependencies = this.report.dependencies.filter(dep => dep.size > 50)
    if (largeDependencies.length > 0) {
      this.report.recommendations.push({
        type: 'dependencies',
        message: 'Consider optimizing or replacing large dependencies',
        dependencies: largeDependencies.map(d => ({ name: d.name, size: d.size }))
      })
    }
    
    // Recommend asset optimization
    const unoptimizedAssets = this.report.assets.filter(asset => 
      asset.type === 'image' && asset.size > 50
    )
    if (unoptimizedAssets.length > 0) {
      this.report.recommendations.push({
        type: 'assets',
        message: 'Consider optimizing large images',
        assets: unoptimizedAssets.map(a => ({ name: a.name, size: a.size }))
      })
    }
  }

  async generateReport() {
    console.log('📊 Generating report...')
    
    const reportPath = path.join(process.cwd(), 'bundle-analysis-report.json')
    fs.writeFileSync(reportPath, JSON.stringify(this.report, null, 2))
    
    // Generate human-readable summary
    const summaryPath = path.join(process.cwd(), 'bundle-analysis-summary.md')
    const summary = this.generateMarkdownSummary()
    fs.writeFileSync(summaryPath, summary)
    
    console.log(`📄 Report saved to: ${reportPath}`)
    console.log(`📄 Summary saved to: ${summaryPath}`)
  }

  generateMarkdownSummary() {
    const totalJS = this.report.chunks.reduce((sum, chunk) => sum + chunk.size, 0)
    const totalAssets = this.report.assets.reduce((sum, asset) => sum + asset.size, 0)
    
    return `# Bundle Analysis Report

Generated: ${this.report.timestamp}

## Summary

- **Total JavaScript**: ${totalJS}KB
- **Total Assets**: ${totalAssets}KB
- **Total Chunks**: ${this.report.chunks.length}
- **Total Dependencies**: ${this.report.dependencies.length}

## Performance Budget Status

${this.report.violations.length === 0 ? '✅ All budgets passed!' : `❌ ${this.report.violations.length} budget violations`}

## Largest Chunks

${this.report.chunks.slice(0, 5).map(chunk => 
  `- ${chunk.name}: ${chunk.size}KB`
).join('\n')}

## Largest Dependencies

${this.report.dependencies.slice(0, 5).map(dep => 
  `- ${dep.name}: ${dep.size}KB`
).join('\n')}

## Recommendations

${this.report.recommendations.map(rec => 
  `- **${rec.type}**: ${rec.message}`
).join('\n')}

## Violations

${this.report.violations.map(violation => 
  `- **${violation.severity}**: ${violation.message}`
).join('\n')}
`
  }

  getChunkType(filename) {
    if (filename.includes('vendor') || filename.includes('node_modules')) return 'vendor'
    if (filename.includes('main') || filename.includes('app')) return 'main'
    if (filename.includes('page')) return 'page'
    return 'other'
  }

  getChunkBudget(type) {
    switch (type) {
      case 'main': return PERFORMANCE_BUDGETS.mainChunk
      case 'vendor': return PERFORMANCE_BUDGETS.vendorChunk
      case 'page': return PERFORMANCE_BUDGETS.pageChunk
      default: return 50
    }
  }

  getAssetType(filename) {
    const ext = path.extname(filename).toLowerCase()
    if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif'].includes(ext)) return 'image'
    if (['.woff', '.woff2', '.ttf', '.otf'].includes(ext)) return 'font'
    if (['.css'].includes(ext)) return 'css'
    return 'other'
  }
}

// Run the analyzer
if (require.main === module) {
  const analyzer = new BundleAnalyzer()
  analyzer.analyze().catch(console.error)
}

module.exports = BundleAnalyzer
