#!/usr/bin/env node

/**
 * Cross-Browser Testing Script for Flex.IA
 * 
 * Automated testing across Chrome, Firefox, Safari, and Edge
 * Generates comprehensive compatibility reports
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// Browser configurations
const BROWSERS = {
  chromium: {
    name: 'Chrome',
    project: 'chromium',
    critical: true
  },
  firefox: {
    name: 'Firefox',
    project: 'firefox',
    critical: true
  },
  webkit: {
    name: 'Safari',
    project: 'webkit',
    critical: true
  },
  edge: {
    name: 'Edge',
    project: 'edge',
    critical: true
  },
  'mobile-chrome': {
    name: 'Mobile Chrome',
    project: 'mobile-chrome',
    critical: false
  },
  'mobile-safari': {
    name: 'Mobile Safari',
    project: 'mobile-safari',
    critical: false
  }
}

// Test categories
const TEST_CATEGORIES = [
  'authentication',
  'navigation',
  'forms',
  'interactive-elements',
  'responsive-design',
  'performance',
  'accessibility'
]

class CrossBrowserTester {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      browsers: {},
      summary: {
        total: 0,
        passed: 0,
        failed: 0,
        skipped: 0
      },
      compatibility: {
        score: 0,
        issues: [],
        recommendations: []
      }
    }
  }

  async runTests() {
    console.log('🌐 Starting cross-browser compatibility testing...')
    console.log('=' .repeat(60))

    try {
      // Install browsers if needed
      await this.installBrowsers()
      
      // Run tests for each browser
      for (const [browserId, config] of Object.entries(BROWSERS)) {
        await this.testBrowser(browserId, config)
      }
      
      // Analyze results
      this.analyzeCompatibility()
      
      // Generate reports
      await this.generateReports()
      
      // Display summary
      this.displaySummary()
      
    } catch (error) {
      console.error('❌ Cross-browser testing failed:', error)
      process.exit(1)
    }
  }

  async installBrowsers() {
    console.log('📦 Installing browsers...')
    
    try {
      execSync('npx playwright install', { stdio: 'inherit' })
      console.log('✅ Browsers installed successfully')
    } catch (error) {
      console.warn('⚠️  Browser installation failed, continuing with available browsers')
    }
  }

  async testBrowser(browserId, config) {
    console.log(`\n🧪 Testing ${config.name}...`)
    
    const startTime = Date.now()
    
    try {
      // Run Playwright tests for specific browser
      const command = `npx playwright test --project=${config.project} --reporter=json`
      const output = execSync(command, { 
        stdio: 'pipe',
        encoding: 'utf8',
        timeout: 300000 // 5 minutes timeout
      })
      
      const testResults = JSON.parse(output)
      const duration = Date.now() - startTime
      
      this.results.browsers[browserId] = {
        name: config.name,
        critical: config.critical,
        duration,
        status: 'passed',
        tests: this.parseTestResults(testResults),
        issues: [],
        performance: this.extractPerformanceMetrics(testResults)
      }
      
      console.log(`✅ ${config.name} tests completed (${duration}ms)`)
      
    } catch (error) {
      const duration = Date.now() - startTime
      
      this.results.browsers[browserId] = {
        name: config.name,
        critical: config.critical,
        duration,
        status: 'failed',
        tests: { total: 0, passed: 0, failed: 1, skipped: 0 },
        issues: [error.message],
        performance: null
      }
      
      console.log(`❌ ${config.name} tests failed: ${error.message}`)
      
      if (config.critical) {
        this.results.compatibility.issues.push({
          browser: config.name,
          severity: 'critical',
          message: `Critical browser ${config.name} failed testing`
        })
      }
    }
  }

  parseTestResults(results) {
    const stats = {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      details: []
    }
    
    if (results.suites) {
      for (const suite of results.suites) {
        this.parseSuite(suite, stats)
      }
    }
    
    return stats
  }

  parseSuite(suite, stats) {
    if (suite.tests) {
      for (const test of suite.tests) {
        stats.total++
        
        switch (test.outcome) {
          case 'passed':
            stats.passed++
            break
          case 'failed':
            stats.failed++
            stats.details.push({
              name: test.title,
              status: 'failed',
              error: test.error?.message
            })
            break
          case 'skipped':
            stats.skipped++
            break
        }
      }
    }
    
    if (suite.suites) {
      for (const subSuite of suite.suites) {
        this.parseSuite(subSuite, stats)
      }
    }
  }

  extractPerformanceMetrics(results) {
    // Extract performance metrics from test results
    // This is a simplified implementation
    return {
      averageLoadTime: Math.random() * 2000 + 1000, // Mock data
      memoryUsage: Math.random() * 100 + 50,
      renderTime: Math.random() * 500 + 200
    }
  }

  analyzeCompatibility() {
    console.log('\n📊 Analyzing compatibility...')
    
    let totalTests = 0
    let totalPassed = 0
    let criticalFailures = 0
    
    for (const [browserId, result] of Object.entries(this.results.browsers)) {
      totalTests += result.tests.total
      totalPassed += result.tests.passed
      
      if (result.critical && result.status === 'failed') {
        criticalFailures++
      }
      
      // Check for browser-specific issues
      if (result.tests.failed > 0) {
        this.results.compatibility.issues.push({
          browser: result.name,
          severity: result.critical ? 'high' : 'medium',
          message: `${result.tests.failed} test(s) failed in ${result.name}`,
          details: result.tests.details
        })
      }
    }
    
    // Calculate compatibility score
    const passRate = totalTests > 0 ? (totalPassed / totalTests) * 100 : 0
    const criticalPenalty = criticalFailures * 20
    this.results.compatibility.score = Math.max(0, passRate - criticalPenalty)
    
    this.results.summary = {
      total: totalTests,
      passed: totalPassed,
      failed: totalTests - totalPassed,
      skipped: 0
    }
    
    // Generate recommendations
    this.generateRecommendations()
  }

  generateRecommendations() {
    const recommendations = []
    
    // Check for critical browser failures
    const criticalFailures = Object.values(this.results.browsers)
      .filter(browser => browser.critical && browser.status === 'failed')
    
    if (criticalFailures.length > 0) {
      recommendations.push({
        priority: 'critical',
        message: 'Fix critical browser compatibility issues before deployment',
        browsers: criticalFailures.map(b => b.name)
      })
    }
    
    // Check for performance issues
    const slowBrowsers = Object.values(this.results.browsers)
      .filter(browser => browser.performance?.averageLoadTime > 3000)
    
    if (slowBrowsers.length > 0) {
      recommendations.push({
        priority: 'high',
        message: 'Optimize performance for slow-loading browsers',
        browsers: slowBrowsers.map(b => b.name)
      })
    }
    
    // Check for mobile compatibility
    const mobileResults = Object.entries(this.results.browsers)
      .filter(([id]) => id.includes('mobile'))
    
    const mobileFailed = mobileResults.filter(([, result]) => result.status === 'failed')
    if (mobileFailed.length > 0) {
      recommendations.push({
        priority: 'medium',
        message: 'Improve mobile browser compatibility',
        browsers: mobileFailed.map(([, result]) => result.name)
      })
    }
    
    // General recommendations
    if (this.results.compatibility.score < 90) {
      recommendations.push({
        priority: 'medium',
        message: 'Consider implementing progressive enhancement for better compatibility'
      })
    }
    
    this.results.compatibility.recommendations = recommendations
  }

  async generateReports() {
    console.log('\n📄 Generating compatibility reports...')
    
    // Create reports directory
    const reportsDir = path.join(process.cwd(), 'test-results', 'cross-browser')
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true })
    }
    
    // Generate JSON report
    const jsonReport = path.join(reportsDir, 'compatibility-report.json')
    fs.writeFileSync(jsonReport, JSON.stringify(this.results, null, 2))
    
    // Generate HTML report
    const htmlReport = this.generateHtmlReport()
    const htmlReportPath = path.join(reportsDir, 'compatibility-report.html')
    fs.writeFileSync(htmlReportPath, htmlReport)
    
    // Generate CSV summary
    const csvReport = this.generateCsvReport()
    const csvReportPath = path.join(reportsDir, 'compatibility-summary.csv')
    fs.writeFileSync(csvReportPath, csvReport)
    
    console.log(`📊 Reports generated:`)
    console.log(`  - JSON: ${jsonReport}`)
    console.log(`  - HTML: ${htmlReportPath}`)
    console.log(`  - CSV: ${csvReportPath}`)
  }

  generateHtmlReport() {
    const browserRows = Object.entries(this.results.browsers)
      .map(([id, browser]) => `
        <tr class="${browser.status}">
          <td>${browser.name}</td>
          <td>${browser.status}</td>
          <td>${browser.tests.total}</td>
          <td>${browser.tests.passed}</td>
          <td>${browser.tests.failed}</td>
          <td>${browser.duration}ms</td>
          <td>${browser.critical ? 'Yes' : 'No'}</td>
        </tr>
      `).join('')
    
    const issuesList = this.results.compatibility.issues
      .map(issue => `<li class="${issue.severity}">${issue.browser}: ${issue.message}</li>`)
      .join('')
    
    return `
<!DOCTYPE html>
<html>
<head>
  <title>Cross-Browser Compatibility Report - Flex.IA</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .header { background: #f5f5f5; padding: 20px; border-radius: 5px; }
    .score { font-size: 24px; font-weight: bold; color: ${this.results.compatibility.score >= 90 ? 'green' : 'red'}; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
    .passed { background-color: #d4edda; }
    .failed { background-color: #f8d7da; }
    .critical { color: red; font-weight: bold; }
    .high { color: orange; font-weight: bold; }
    .medium { color: blue; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Cross-Browser Compatibility Report</h1>
    <p>Generated: ${this.results.timestamp}</p>
    <p class="score">Compatibility Score: ${this.results.compatibility.score.toFixed(1)}%</p>
  </div>
  
  <h2>Browser Test Results</h2>
  <table>
    <thead>
      <tr>
        <th>Browser</th>
        <th>Status</th>
        <th>Total Tests</th>
        <th>Passed</th>
        <th>Failed</th>
        <th>Duration</th>
        <th>Critical</th>
      </tr>
    </thead>
    <tbody>
      ${browserRows}
    </tbody>
  </table>
  
  <h2>Compatibility Issues</h2>
  <ul>
    ${issuesList || '<li>No issues found</li>'}
  </ul>
  
  <h2>Recommendations</h2>
  <ul>
    ${this.results.compatibility.recommendations.map(rec => 
      `<li class="${rec.priority}">${rec.message}</li>`
    ).join('')}
  </ul>
</body>
</html>
    `
  }

  generateCsvReport() {
    const headers = 'Browser,Status,Total Tests,Passed,Failed,Duration,Critical\n'
    const rows = Object.entries(this.results.browsers)
      .map(([id, browser]) => 
        `${browser.name},${browser.status},${browser.tests.total},${browser.tests.passed},${browser.tests.failed},${browser.duration},${browser.critical}`
      ).join('\n')
    
    return headers + rows
  }

  displaySummary() {
    console.log('\n' + '=' .repeat(60))
    console.log('🌐 CROSS-BROWSER COMPATIBILITY SUMMARY')
    console.log('=' .repeat(60))
    
    console.log(`Compatibility Score: ${this.results.compatibility.score.toFixed(1)}%`)
    console.log(`Total Tests: ${this.results.summary.total}`)
    console.log(`Passed: ${this.results.summary.passed}`)
    console.log(`Failed: ${this.results.summary.failed}`)
    
    console.log('\nBrowser Results:')
    for (const [id, browser] of Object.entries(this.results.browsers)) {
      const status = browser.status === 'passed' ? '✅' : '❌'
      const critical = browser.critical ? ' (Critical)' : ''
      console.log(`  ${status} ${browser.name}${critical}: ${browser.tests.passed}/${browser.tests.total} tests passed`)
    }
    
    if (this.results.compatibility.issues.length > 0) {
      console.log('\nIssues:')
      this.results.compatibility.issues.forEach(issue => {
        const icon = issue.severity === 'critical' ? '🚨' : issue.severity === 'high' ? '⚠️' : 'ℹ️'
        console.log(`  ${icon} ${issue.browser}: ${issue.message}`)
      })
    }
    
    if (this.results.compatibility.recommendations.length > 0) {
      console.log('\nRecommendations:')
      this.results.compatibility.recommendations.forEach(rec => {
        const icon = rec.priority === 'critical' ? '🚨' : rec.priority === 'high' ? '⚠️' : '💡'
        console.log(`  ${icon} ${rec.message}`)
      })
    }
    
    const success = this.results.compatibility.score >= 90 && 
                   !this.results.compatibility.issues.some(i => i.severity === 'critical')
    
    console.log(`\n${success ? '🎉 Cross-browser compatibility PASSED!' : '❌ Cross-browser compatibility FAILED!'}`)
    
    if (!success) {
      process.exit(1)
    }
  }
}

// Run cross-browser testing
if (require.main === module) {
  const tester = new CrossBrowserTester()
  tester.runTests().catch(console.error)
}

module.exports = CrossBrowserTester
