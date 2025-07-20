#!/usr/bin/env node

/**
 * Test Coverage Report Generator
 * 
 * Generates comprehensive test coverage reports and
 * validates coverage thresholds for production readiness
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// Coverage thresholds
const COVERAGE_THRESHOLDS = {
  global: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80
  },
  critical: {
    branches: 90,
    functions: 90,
    lines: 90,
    statements: 90
  }
}

// Critical files that require higher coverage
const CRITICAL_FILES = [
  'lib/auth.ts',
  'lib/security.ts',
  'lib/error-handling.ts',
  'middleware.ts'
]

class CoverageReporter {
  constructor() {
    this.coverageDir = path.join(process.cwd(), 'coverage')
    this.summaryFile = path.join(this.coverageDir, 'coverage-summary.json')
    this.report = {
      timestamp: new Date().toISOString(),
      overall: {},
      files: [],
      violations: [],
      recommendations: [],
      passed: false
    }
  }

  async generateReport() {
    console.log('📊 Generating test coverage report...')

    try {
      // Run tests with coverage
      await this.runTestsWithCoverage()
      
      // Parse coverage data
      await this.parseCoverageData()
      
      // Validate thresholds
      this.validateThresholds()
      
      // Generate recommendations
      this.generateRecommendations()
      
      // Create reports
      await this.createReports()
      
      // Display summary
      this.displaySummary()
      
    } catch (error) {
      console.error('❌ Coverage report generation failed:', error)
      process.exit(1)
    }
  }

  async runTestsWithCoverage() {
    console.log('🧪 Running tests with coverage...')
    
    try {
      execSync('npm test -- --coverage --watchAll=false', {
        stdio: 'inherit',
        env: { ...process.env, CI: 'true' }
      })
    } catch (error) {
      console.warn('⚠️  Some tests failed, but continuing with coverage analysis')
    }
  }

  async parseCoverageData() {
    console.log('📈 Parsing coverage data...')
    
    if (!fs.existsSync(this.summaryFile)) {
      throw new Error('Coverage summary file not found. Make sure tests ran successfully.')
    }

    const coverageData = JSON.parse(fs.readFileSync(this.summaryFile, 'utf8'))
    
    // Parse overall coverage
    this.report.overall = coverageData.total
    
    // Parse file-level coverage
    for (const [filePath, coverage] of Object.entries(coverageData)) {
      if (filePath !== 'total') {
        this.report.files.push({
          path: filePath,
          coverage,
          isCritical: CRITICAL_FILES.some(critical => filePath.includes(critical))
        })
      }
    }
    
    // Sort files by coverage percentage (lowest first)
    this.report.files.sort((a, b) => {
      const aAvg = this.getAverageCoverage(a.coverage)
      const bAvg = this.getAverageCoverage(b.coverage)
      return aAvg - bAvg
    })
  }

  validateThresholds() {
    console.log('✅ Validating coverage thresholds...')
    
    // Check overall thresholds
    const overall = this.report.overall
    const globalThresholds = COVERAGE_THRESHOLDS.global
    
    for (const [metric, threshold] of Object.entries(globalThresholds)) {
      const actual = overall[metric]?.pct || 0
      if (actual < threshold) {
        this.report.violations.push({
          type: 'global',
          metric,
          actual,
          threshold,
          message: `Global ${metric} coverage (${actual}%) below threshold (${threshold}%)`
        })
      }
    }
    
    // Check critical file thresholds
    const criticalThresholds = COVERAGE_THRESHOLDS.critical
    
    for (const file of this.report.files) {
      if (file.isCritical) {
        for (const [metric, threshold] of Object.entries(criticalThresholds)) {
          const actual = file.coverage[metric]?.pct || 0
          if (actual < threshold) {
            this.report.violations.push({
              type: 'critical',
              file: file.path,
              metric,
              actual,
              threshold,
              message: `Critical file ${file.path} ${metric} coverage (${actual}%) below threshold (${threshold}%)`
            })
          }
        }
      }
    }
    
    this.report.passed = this.report.violations.length === 0
  }

  generateRecommendations() {
    console.log('💡 Generating recommendations...')
    
    // Find files with low coverage
    const lowCoverageFiles = this.report.files.filter(file => {
      const avgCoverage = this.getAverageCoverage(file.coverage)
      return avgCoverage < 70
    })
    
    if (lowCoverageFiles.length > 0) {
      this.report.recommendations.push({
        type: 'low-coverage',
        message: 'Focus testing efforts on files with low coverage',
        files: lowCoverageFiles.map(f => ({
          path: f.path,
          coverage: this.getAverageCoverage(f.coverage)
        }))
      })
    }
    
    // Find untested files
    const untestedFiles = this.report.files.filter(file => {
      return Object.values(file.coverage).every(metric => 
        typeof metric === 'object' && metric.pct === 0
      )
    })
    
    if (untestedFiles.length > 0) {
      this.report.recommendations.push({
        type: 'untested',
        message: 'Add tests for completely untested files',
        files: untestedFiles.map(f => f.path)
      })
    }
    
    // Recommend integration tests if unit coverage is high but integration is low
    const avgUnitCoverage = this.getAverageCoverage(this.report.overall)
    if (avgUnitCoverage > 85) {
      this.report.recommendations.push({
        type: 'integration',
        message: 'Consider adding more integration and E2E tests',
        reason: 'High unit test coverage suggests good foundation for integration testing'
      })
    }
  }

  async createReports() {
    console.log('📄 Creating coverage reports...')
    
    // Create JSON report
    const jsonReportPath = path.join(this.coverageDir, 'coverage-report.json')
    fs.writeFileSync(jsonReportPath, JSON.stringify(this.report, null, 2))
    
    // Create Markdown report
    const markdownReport = this.generateMarkdownReport()
    const mdReportPath = path.join(this.coverageDir, 'coverage-report.md')
    fs.writeFileSync(mdReportPath, markdownReport)
    
    console.log(`📊 JSON report: ${jsonReportPath}`)
    console.log(`📝 Markdown report: ${mdReportPath}`)
  }

  generateMarkdownReport() {
    const overall = this.report.overall
    const avgCoverage = this.getAverageCoverage(overall)
    
    return `# Test Coverage Report

Generated: ${this.report.timestamp}

## Overall Coverage

| Metric | Coverage | Status |
|--------|----------|--------|
| Lines | ${overall.lines?.pct || 0}% | ${this.getStatusEmoji(overall.lines?.pct, 80)} |
| Functions | ${overall.functions?.pct || 0}% | ${this.getStatusEmoji(overall.functions?.pct, 80)} |
| Branches | ${overall.branches?.pct || 0}% | ${this.getStatusEmoji(overall.branches?.pct, 80)} |
| Statements | ${overall.statements?.pct || 0}% | ${this.getStatusEmoji(overall.statements?.pct, 80)} |

**Average Coverage: ${avgCoverage.toFixed(1)}%**

## Status

${this.report.passed ? '✅ All coverage thresholds met!' : '❌ Coverage thresholds not met'}

## Violations

${this.report.violations.length === 0 ? 'None' : this.report.violations.map(v => `- ${v.message}`).join('\n')}

## Files with Lowest Coverage

${this.report.files.slice(0, 10).map(file => {
  const avg = this.getAverageCoverage(file.coverage)
  return `- ${file.path}: ${avg.toFixed(1)}%`
}).join('\n')}

## Recommendations

${this.report.recommendations.map(rec => `- **${rec.type}**: ${rec.message}`).join('\n')}

## Critical Files Coverage

${this.report.files.filter(f => f.isCritical).map(file => {
  const avg = this.getAverageCoverage(file.coverage)
  const status = avg >= 90 ? '✅' : '❌'
  return `- ${status} ${file.path}: ${avg.toFixed(1)}%`
}).join('\n')}
`
  }

  displaySummary() {
    console.log('\n📊 Coverage Summary:')
    console.log('==================')
    
    const overall = this.report.overall
    console.log(`Lines: ${overall.lines?.pct || 0}%`)
    console.log(`Functions: ${overall.functions?.pct || 0}%`)
    console.log(`Branches: ${overall.branches?.pct || 0}%`)
    console.log(`Statements: ${overall.statements?.pct || 0}%`)
    
    console.log(`\nAverage: ${this.getAverageCoverage(overall).toFixed(1)}%`)
    
    if (this.report.violations.length > 0) {
      console.log('\n❌ Violations:')
      this.report.violations.forEach(violation => {
        console.log(`  - ${violation.message}`)
      })
    }
    
    if (this.report.recommendations.length > 0) {
      console.log('\n💡 Recommendations:')
      this.report.recommendations.forEach(rec => {
        console.log(`  - ${rec.message}`)
      })
    }
    
    console.log(`\n${this.report.passed ? '✅ Coverage goals met!' : '❌ Coverage goals not met'}`)
    
    if (!this.report.passed) {
      process.exit(1)
    }
  }

  getAverageCoverage(coverage) {
    const metrics = ['lines', 'functions', 'branches', 'statements']
    const values = metrics.map(metric => coverage[metric]?.pct || 0)
    return values.reduce((sum, val) => sum + val, 0) / values.length
  }

  getStatusEmoji(value, threshold) {
    return (value || 0) >= threshold ? '✅' : '❌'
  }
}

// Run the coverage reporter
if (require.main === module) {
  const reporter = new CoverageReporter()
  reporter.generateReport().catch(console.error)
}

module.exports = CoverageReporter
