// Database Testing Utilities
// Tools for testing and validating database enhancements

import db from './enhanced-client'
import { validateEntity, runDataQualityChecks } from './data-validation'
import { analyzeDevelopmentFinancials } from '../financial/analysis-engine'
import { getDashboardMetrics } from '../monitoring/dashboard'
import { getPerformanceProfile } from '../monitoring/performance'

export interface TestResult {
  testName: string
  status: 'PASS' | 'FAIL' | 'SKIP'
  duration: number
  error?: string
  details?: any
}

export interface TestSuite {
  suiteName: string
  results: TestResult[]
  summary: {
    total: number
    passed: number
    failed: number
    skipped: number
    duration: number
  }
}

export class DatabaseTestRunner {
  
  // Run comprehensive database tests
  static async runAllTests(): Promise<TestSuite[]> {
    console.log('🧪 Starting Database Enhancement Tests...')
    
    const suites = [
      await this.testDatabaseConnection(),
      await this.testEnhancedClient(),
      await this.testDataValidation(),
      await this.testFinancialAnalysis(),
      await this.testMonitoring(),
      await this.testPerformance()
    ]

    const overallSummary = suites.reduce((acc, suite) => ({
      total: acc.total + suite.summary.total,
      passed: acc.passed + suite.summary.passed,
      failed: acc.failed + suite.summary.failed,
      skipped: acc.skipped + suite.summary.skipped,
      duration: acc.duration + suite.summary.duration
    }), { total: 0, passed: 0, failed: 0, skipped: 0, duration: 0 })

    console.log(`\n📊 Test Summary:`)
    console.log(`   Total: ${overallSummary.total}`)
    console.log(`   Passed: ${overallSummary.passed}`)
    console.log(`   Failed: ${overallSummary.failed}`)
    console.log(`   Skipped: ${overallSummary.skipped}`)
    console.log(`   Duration: ${overallSummary.duration}ms`)

    return suites
  }

  // Test basic database connection
  private static async testDatabaseConnection(): Promise<TestSuite> {
    const results: TestResult[] = []
    
    // Test 1: Database health check
    const healthResult = await this.runTest('Database Health Check', async () => {
      const health = await db.healthCheck()
      if (health.status !== 'healthy') {
        throw new Error(`Database unhealthy: ${health.error}`)
      }
      return health
    })
    results.push(healthResult)

    // Test 2: Basic query execution
    const queryResult = await this.runTest('Basic Query Execution', async () => {
      const userCount = await db.prisma.user.count()
      return { userCount }
    })
    results.push(queryResult)

    return this.createTestSuite('Database Connection', results)
  }

  // Test enhanced database client
  private static async testEnhancedClient(): Promise<TestSuite> {
    const results: TestResult[] = []

    // Test 1: Find user by email
    const findUserResult = await this.runTest('Find User by Email', async () => {
      // Try to find a user (may not exist, that's ok)
      const user = await db.findUserByEmail('test@example.com')
      return { userFound: !!user }
    })
    results.push(findUserResult)

    // Test 2: Get active developments
    const developmentsResult = await this.runTest('Get Active Developments', async () => {
      const developments = await db.getActiveDevelopments(1, 5)
      return { developmentCount: developments.length }
    })
    results.push(developmentsResult)

    // Test 3: Search properties
    const searchResult = await this.runTest('Search Properties', async () => {
      const properties = await db.searchProperties({ limit: 5 })
      return { propertyCount: properties.length }
    })
    results.push(searchResult)

    return this.createTestSuite('Enhanced Database Client', results)
  }

  // Test data validation
  private static async testDataValidation(): Promise<TestSuite> {
    const results: TestResult[] = []

    // Test 1: User validation
    const userValidationResult = await this.runTest('User Validation', async () => {
      const validUser = {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        roles: ['BUYER']
      }
      
      const result = await validateEntity('user', validUser)
      if (!result.isValid) {
        throw new Error(`Validation failed: ${result.errors.join(', ')}`)
      }
      return result
    })
    results.push(userValidationResult)

    // Test 2: Development validation
    const devValidationResult = await this.runTest('Development Validation', async () => {
      const validDev = {
        name: 'Test Development',
        slug: 'test-development',
        totalUnits: 10
      }
      
      const result = await validateEntity('development', validDev)
      if (!result.isValid) {
        throw new Error(`Validation failed: ${result.errors.join(', ')}`)
      }
      return result
    })
    results.push(devValidationResult)

    // Test 3: Data quality checks
    const qualityResult = await this.runTest('Data Quality Checks', async () => {
      const report = await runDataQualityChecks()
      return { 
        totalRules: report.totalRules,
        violations: report.violationCount 
      }
    })
    results.push(qualityResult)

    return this.createTestSuite('Data Validation', results)
  }

  // Test financial analysis
  private static async testFinancialAnalysis(): Promise<TestSuite> {
    const results: TestResult[] = []

    // Test 1: Development financial analysis (will skip if no developments)
    const analysisResult = await this.runTest('Development Financial Analysis', async () => {
      const developments = await db.prisma.development.findMany({ take: 1 })
      if (developments.length === 0) {
        throw new Error('SKIP: No developments found')
      }
      
      const analysis = await analyzeDevelopmentFinancials(developments[0].id)
      return {
        hasAnalysis: !!analysis,
        revenue: analysis.totalProjectRevenue,
        margin: analysis.grossMargin
      }
    })
    results.push(analysisResult)

    return this.createTestSuite('Financial Analysis', results)
  }

  // Test monitoring and dashboard
  private static async testMonitoring(): Promise<TestSuite> {
    const results: TestResult[] = []

    // Test 1: Dashboard metrics
    const dashboardResult = await this.runTest('Dashboard Metrics', async () => {
      const metrics = await getDashboardMetrics()
      return {
        hasUserMetrics: !!metrics.userMetrics,
        hasDevelopmentMetrics: !!metrics.developmentMetrics,
        hasFinancialMetrics: !!metrics.financialMetrics,
        hasPerformanceMetrics: !!metrics.performanceMetrics
      }
    })
    results.push(dashboardResult)

    return this.createTestSuite('Monitoring & Dashboard', results)
  }

  // Test performance monitoring
  private static async testPerformance(): Promise<TestSuite> {
    const results: TestResult[] = []

    // Test 1: Performance profile
    const profileResult = await this.runTest('Performance Profile', async () => {
      const profile = await getPerformanceProfile()
      return {
        hasQueryMetrics: !!profile.queryMetrics,
        hasConnectionMetrics: !!profile.connectionMetrics,
        hasIndexUsage: !!profile.indexUsage,
        hasTableSizes: !!profile.tableSizes
      }
    })
    results.push(profileResult)

    return this.createTestSuite('Performance Monitoring', results)
  }

  // Helper method to run individual tests
  private static async runTest(testName: string, testFn: () => Promise<any>): Promise<TestResult> {
    const startTime = Date.now()
    
    try {
      const result = await testFn()
      const duration = Date.now() - startTime
      
      console.log(`  ✅ ${testName} (${duration}ms)`)
      return {
        testName,
        status: 'PASS',
        duration,
        details: result
      }
    } catch (error) {
      const duration = Date.now() - startTime
      
      if (error.message?.includes('SKIP:')) {
        console.log(`  ⏸️  ${testName} - ${error.message.replace('SKIP: ', '')}`)
        return {
          testName,
          status: 'SKIP',
          duration,
          error: error.message
        }
      } else {
        console.log(`  ❌ ${testName} - ${error.message}`)
        return {
          testName,
          status: 'FAIL',
          duration,
          error: error.message
        }
      }
    }
  }

  // Helper to create test suite summary
  private static createTestSuite(suiteName: string, results: TestResult[]): TestSuite {
    const summary = {
      total: results.length,
      passed: results.filter(r => r.status === 'PASS').length,
      failed: results.filter(r => r.status === 'FAIL').length,
      skipped: results.filter(r => r.status === 'SKIP').length,
      duration: results.reduce((sum, r) => sum + r.duration, 0)
    }

    console.log(`\n📦 ${suiteName}: ${summary.passed}/${summary.total} passed`)
    
    return { suiteName, results, summary }
  }

  // Generate test report
  static generateTestReport(suites: TestSuite[]): string {
    let report = '# Database Enhancement Test Report\n\n'
    report += `Generated: ${new Date().toISOString()}\n\n`

    for (const suite of suites) {
      report += `## ${suite.suiteName}\n\n`
      report += `- **Total Tests**: ${suite.summary.total}\n`
      report += `- **Passed**: ${suite.summary.passed}\n`
      report += `- **Failed**: ${suite.summary.failed}\n`
      report += `- **Skipped**: ${suite.summary.skipped}\n`
      report += `- **Duration**: ${suite.summary.duration}ms\n\n`

      if (suite.summary.failed > 0) {
        report += '### Failed Tests\n\n'
        for (const result of suite.results.filter(r => r.status === 'FAIL')) {
          report += `- **${result.testName}**: ${result.error}\n`
        }
        report += '\n'
      }
    }

    return report
  }
}

// Export test runner function
export const runDatabaseTests = DatabaseTestRunner.runAllTests.bind(DatabaseTestRunner)
export const generateTestReport = DatabaseTestRunner.generateTestReport.bind(DatabaseTestRunner)