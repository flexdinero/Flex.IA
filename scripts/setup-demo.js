const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function setupDemo() {
  try {
    console.log('🔍 Checking for demo user...')
    
    // Check if demo user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'demo@flex.ia' }
    })

    if (existingUser) {
      console.log('✅ Demo user already exists!')
      console.log('📧 Email: demo@flex.ia')
      console.log('🔑 Password: demo123')
      console.log('🔐 2FA Code: 123456')
      return
    }

    console.log('👤 Creating demo user...')
    
    // Create demo user
    const hashedPassword = await bcrypt.hash('demo123', 12)
    
    const demoUser = await prisma.user.create({
      data: {
        email: 'demo@flex.ia',
        firstName: 'Demo',
        lastName: 'User',
        hashedPassword,
        role: 'ADJUSTER',
        isActive: true,
        emailVerified: true,
        twoFactorEnabled: true,
        twoFactorSecret: 'JBSWY3DPEHPK3PXP', // Demo secret for 123456
        licenseNumber: 'ADJ-12345',
        specialties: JSON.stringify(['Property Damage', 'Auto Collision']),
        yearsExperience: 5,
        hourlyRate: 75.0,
        travelRadius: 50,
        address: '123 Demo Street',
        city: 'Demo City',
        state: 'TX',
        zipCode: '12345',
        phone: '(555) 123-4567'
      }
    })

    console.log('✅ Demo user created successfully!')
    console.log('📧 Email: demo@flex.ia')
    console.log('🔑 Password: demo123')
    console.log('🔐 2FA Code: 123456')
    
    // Create a demo firm
    const demoFirm = await prisma.firm.create({
      data: {
        name: 'Demo Insurance Firm',
        email: 'contact@demoinsurance.com',
        phone: '(800) 555-0123',
        website: 'https://demoinsurance.com',
        description: 'A demo insurance firm for testing purposes.',
        address: '456 Insurance Ave',
        city: 'Insurance City',
        state: 'TX',
        zipCode: '54321',
        specialties: JSON.stringify(['Property Damage', 'Auto Collision']),
        rating: 4.5
      }
    })

    // Create a demo claim
    await prisma.claim.create({
      data: {
        claimNumber: 'DEMO-2024-001',
        title: 'Demo Property Damage Claim',
        description: 'A demo claim for testing the platform.',
        type: 'PROPERTY_DAMAGE',
        status: 'AVAILABLE',
        priority: 'MEDIUM',
        estimatedValue: 15000,
        address: '789 Damage Street',
        city: 'Claim City',
        state: 'TX',
        zipCode: '67890',
        incidentDate: new Date('2024-01-15'),
        reportedDate: new Date('2024-01-16'),
        deadline: new Date('2024-02-15'),
        firmId: demoFirm.id
      }
    })

    console.log('✅ Demo data setup complete!')
    
  } catch (error) {
    console.error('❌ Error setting up demo:', error)
  } finally {
    await prisma.$disconnect()
  }
}

setupDemo()
