#!/usr/bin/env tsx

/**
 * Production Database Migration Script
 * Migrates from SQLite to PostgreSQL with data preservation
 */

import { PrismaClient as SQLiteClient } from '@prisma/client'
import { PrismaClient as PostgreSQLClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

// SQLite client (current)
const sqliteClient = new SQLiteClient({
  datasources: {
    db: {
      url: process.env.SQLITE_DATABASE_URL || 'file:./dev.db'
    }
  }
})

// PostgreSQL client (target)
const postgresClient = new PostgreSQLClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

interface MigrationStats {
  users: number
  claims: number
  earnings: number
  messages: number
  notifications: number
  documents: number
  sessions: number
  firms: number
  errors: string[]
}

async function validateEnvironment() {
  console.log('🔍 Validating environment...')
  
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required for PostgreSQL')
  }
  
  if (!process.env.DATABASE_URL.startsWith('postgresql://')) {
    throw new Error('DATABASE_URL must be a PostgreSQL connection string')
  }
  
  console.log('✅ Environment validation passed')
}

async function backupSQLiteData() {
  console.log('💾 Creating SQLite backup...')
  
  const backupDir = path.join(process.cwd(), 'backups')
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true })
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backupPath = path.join(backupDir, `sqlite-backup-${timestamp}.db`)
  
  // Copy SQLite database file
  const dbPath = process.env.SQLITE_DATABASE_URL?.replace('file:', '') || './dev.db'
  if (fs.existsSync(dbPath)) {
    fs.copyFileSync(dbPath, backupPath)
    console.log(`✅ SQLite backup created: ${backupPath}`)
  } else {
    console.log('⚠️  No existing SQLite database found')
  }
}

async function testPostgreSQLConnection() {
  console.log('🔌 Testing PostgreSQL connection...')
  
  try {
    await postgresClient.$connect()
    await postgresClient.$queryRaw`SELECT 1 as test`
    console.log('✅ PostgreSQL connection successful')
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error)
    throw error
  }
}

async function migrateUsers(stats: MigrationStats) {
  console.log('👥 Migrating users...')
  
  try {
    const users = await sqliteClient.user.findMany()
    
    for (const user of users) {
      // Convert string fields to proper types for PostgreSQL
      const userData = {
        ...user,
        role: user.role as any, // Will be validated by enum
        certifications: user.certifications ? JSON.parse(user.certifications) : null,
        specialties: user.specialties ? JSON.parse(user.specialties) : null,
        hourlyRate: user.hourlyRate ? parseFloat(user.hourlyRate.toString()) : null
      }
      
      await postgresClient.user.create({
        data: userData
      })
    }
    
    stats.users = users.length
    console.log(`✅ Migrated ${users.length} users`)
  } catch (error) {
    console.error('❌ User migration failed:', error)
    stats.errors.push(`User migration: ${error}`)
  }
}

async function migrateFirms(stats: MigrationStats) {
  console.log('🏢 Migrating firms...')
  
  try {
    const firms = await sqliteClient.firm.findMany()
    
    for (const firm of firms) {
      const firmData = {
        ...firm,
        specialties: firm.specialties ? JSON.parse(firm.specialties) : null,
        coverageAreas: firm.coverageAreas ? JSON.parse(firm.coverageAreas) : null
      }
      
      await postgresClient.firm.create({
        data: firmData
      })
    }
    
    stats.firms = firms.length
    console.log(`✅ Migrated ${firms.length} firms`)
  } catch (error) {
    console.error('❌ Firm migration failed:', error)
    stats.errors.push(`Firm migration: ${error}`)
  }
}

async function migrateClaims(stats: MigrationStats) {
  console.log('📋 Migrating claims...')
  
  try {
    const claims = await sqliteClient.claim.findMany()
    
    for (const claim of claims) {
      const claimData = {
        ...claim,
        type: claim.type as any, // Will be validated by enum
        status: claim.status as any,
        priority: claim.priority as any,
        estimatedValue: claim.estimatedValue ? parseFloat(claim.estimatedValue.toString()) : null,
        adjusterFee: claim.adjusterFee ? parseFloat(claim.adjusterFee.toString()) : null
      }
      
      await postgresClient.claim.create({
        data: claimData
      })
    }
    
    stats.claims = claims.length
    console.log(`✅ Migrated ${claims.length} claims`)
  } catch (error) {
    console.error('❌ Claim migration failed:', error)
    stats.errors.push(`Claim migration: ${error}`)
  }
}

async function migrateEarnings(stats: MigrationStats) {
  console.log('💰 Migrating earnings...')
  
  try {
    const earnings = await sqliteClient.earning.findMany()
    
    for (const earning of earnings) {
      const earningData = {
        ...earning,
        amount: parseFloat(earning.amount.toString()),
        status: earning.status as any
      }
      
      await postgresClient.earning.create({
        data: earningData
      })
    }
    
    stats.earnings = earnings.length
    console.log(`✅ Migrated ${earnings.length} earnings`)
  } catch (error) {
    console.error('❌ Earning migration failed:', error)
    stats.errors.push(`Earning migration: ${error}`)
  }
}

async function migrateMessages(stats: MigrationStats) {
  console.log('💬 Migrating messages...')
  
  try {
    const messages = await sqliteClient.message.findMany()
    
    for (const message of messages) {
      const messageData = {
        ...message,
        type: (message.type || 'DIRECT') as any,
        priority: (message.priority || 'MEDIUM') as any,
        attachments: message.attachments ? JSON.parse(message.attachments) : null
      }
      
      await postgresClient.message.create({
        data: messageData
      })
    }
    
    stats.messages = messages.length
    console.log(`✅ Migrated ${messages.length} messages`)
  } catch (error) {
    console.error('❌ Message migration failed:', error)
    stats.errors.push(`Message migration: ${error}`)
  }
}

async function migrateNotifications(stats: MigrationStats) {
  console.log('🔔 Migrating notifications...')
  
  try {
    const notifications = await sqliteClient.notification.findMany()
    
    for (const notification of notifications) {
      const notificationData = {
        ...notification,
        type: notification.type as any,
        metadata: notification.metadata ? JSON.parse(notification.metadata) : null
      }
      
      await postgresClient.notification.create({
        data: notificationData
      })
    }
    
    stats.notifications = notifications.length
    console.log(`✅ Migrated ${notifications.length} notifications`)
  } catch (error) {
    console.error('❌ Notification migration failed:', error)
    stats.errors.push(`Notification migration: ${error}`)
  }
}

async function migrateDocuments(stats: MigrationStats) {
  console.log('📄 Migrating documents...')
  
  try {
    const documents = await sqliteClient.document.findMany()
    
    for (const document of documents) {
      const documentData = {
        ...document,
        type: document.type as any
      }
      
      await postgresClient.document.create({
        data: documentData
      })
    }
    
    stats.documents = documents.length
    console.log(`✅ Migrated ${documents.length} documents`)
  } catch (error) {
    console.error('❌ Document migration failed:', error)
    stats.errors.push(`Document migration: ${error}`)
  }
}

async function migrateSessions(stats: MigrationStats) {
  console.log('🔐 Migrating sessions...')
  
  try {
    const sessions = await sqliteClient.session.findMany()
    
    for (const session of sessions) {
      await postgresClient.session.create({
        data: session
      })
    }
    
    stats.sessions = sessions.length
    console.log(`✅ Migrated ${sessions.length} sessions`)
  } catch (error) {
    console.error('❌ Session migration failed:', error)
    stats.errors.push(`Session migration: ${error}`)
  }
}

async function generateMigrationReport(stats: MigrationStats) {
  const report = `
# Database Migration Report
Generated: ${new Date().toISOString()}

## Migration Statistics
- Users: ${stats.users}
- Firms: ${stats.firms}
- Claims: ${stats.claims}
- Earnings: ${stats.earnings}
- Messages: ${stats.messages}
- Notifications: ${stats.notifications}
- Documents: ${stats.documents}
- Sessions: ${stats.sessions}

## Errors
${stats.errors.length === 0 ? 'No errors encountered' : stats.errors.map(e => `- ${e}`).join('\n')}

## Next Steps
1. Update DATABASE_URL in production environment
2. Run database schema migration: \`npx prisma migrate deploy\`
3. Verify data integrity
4. Update application configuration
5. Test all functionality
`

  const reportPath = path.join(process.cwd(), 'migration-report.md')
  fs.writeFileSync(reportPath, report)
  console.log(`📊 Migration report saved: ${reportPath}`)
}

async function main() {
  console.log('🚀 Starting database migration from SQLite to PostgreSQL...')
  
  const stats: MigrationStats = {
    users: 0,
    claims: 0,
    earnings: 0,
    messages: 0,
    notifications: 0,
    documents: 0,
    sessions: 0,
    firms: 0,
    errors: []
  }
  
  try {
    await validateEnvironment()
    await backupSQLiteData()
    await testPostgreSQLConnection()
    
    // Run migrations in dependency order
    await migrateUsers(stats)
    await migrateFirms(stats)
    await migrateClaims(stats)
    await migrateEarnings(stats)
    await migrateMessages(stats)
    await migrateNotifications(stats)
    await migrateDocuments(stats)
    await migrateSessions(stats)
    
    await generateMigrationReport(stats)
    
    console.log('🎉 Database migration completed successfully!')
    
    if (stats.errors.length > 0) {
      console.log(`⚠️  ${stats.errors.length} errors encountered. Check migration report for details.`)
    }
    
  } catch (error) {
    console.error('💥 Migration failed:', error)
    process.exit(1)
  } finally {
    await sqliteClient.$disconnect()
    await postgresClient.$disconnect()
  }
}

if (require.main === module) {
  main()
}

export { main as migrateDatabaseToPostgreSQL }
