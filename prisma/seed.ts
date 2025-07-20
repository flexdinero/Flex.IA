import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../lib/auth'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create admin user
  const adminPassword = await hashPassword('admin123!')
  const admin = await prisma.user.upsert({
    where: { email: 'admin@flex-ia.com' },
    update: {},
    create: {
      email: 'admin@flex-ia.com',
      firstName: 'System',
      lastName: 'Administrator',
      hashedPassword: adminPassword,
      role: 'ADMIN',
      emailVerified: true,
      isActive: true
    }
  })

  // Create demo user
  const hashedPassword = await hashPassword('demo123!')
  
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@flex.ia' },
    update: {},
    create: {
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

  console.log('✅ Demo user created:', demoUser.email)

  // Create demo firms
  const firms = [
    {
      name: 'Crawford & Company',
      email: 'adjusters@crawco.com',
      phone: '(800) 555-0123',
      website: 'https://www.crawco.com',
      description: 'Leading global provider of claims management and outsourcing solutions.',
      address: '1001 Summit Blvd',
      city: 'Atlanta',
      state: 'GA',
      zipCode: '30319',
      specialties: JSON.stringify(['Property Damage', 'Auto Collision', 'Commercial Claims']),
      rating: 4.8
    },
    {
      name: 'Sedgwick',
      email: 'network@sedgwick.com',
      phone: '(800) 555-0456',
      website: 'https://www.sedgwick.com',
      description: 'Sedgwick is a leading global technology-enabled business solutions company.',
      address: '1100 Ridgeway Loop Rd',
      city: 'Memphis',
      state: 'TN',
      zipCode: '38120',
      specialties: JSON.stringify(['Workers Compensation', 'Property Damage', 'Liability']),
      rating: 4.6
    },
    {
      name: 'Pilot Catastrophe',
      email: 'cat@pilotcat.com',
      phone: '(800) 555-0789',
      website: 'https://www.pilotcat.com',
      description: 'Specialized catastrophe adjusting services for major weather events.',
      address: '2500 Dallas Pkwy',
      city: 'Plano',
      state: 'TX',
      zipCode: '75093',
      specialties: JSON.stringify(['Catastrophe', 'Storm Damage', 'Hail Damage']),
      rating: 4.9
    }
  ]

  for (const firmData of firms) {
    const firm = await prisma.firm.upsert({
      where: { email: firmData.email },
      update: {},
      create: firmData
    })
    console.log('✅ Firm created:', firm.name)
  }

  // Create demo claims
  const claims = [
    {
      claimNumber: 'CLM-2024-0001',
      title: 'Residential Fire Damage',
      description: 'Kitchen fire caused significant smoke and water damage throughout the home.',
      type: 'FIRE_DAMAGE',
      status: 'AVAILABLE',
      priority: 'HIGH',
      estimatedValue: 45000,
      address: '456 Oak Street',
      city: 'Dallas',
      state: 'TX',
      zipCode: '75201',
      incidentDate: new Date('2024-01-15'),
      reportedDate: new Date('2024-01-16'),
      deadline: new Date('2024-02-15'),
      firmId: '', // Will be set below
    },
    {
      claimNumber: 'CLM-2024-0002',
      title: 'Auto Collision - Multi-Vehicle',
      description: 'Three-car collision on I-35. Significant damage to all vehicles.',
      type: 'AUTO_COLLISION',
      status: 'AVAILABLE',
      priority: 'MEDIUM',
      estimatedValue: 25000,
      address: 'I-35 Mile Marker 234',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
      incidentDate: new Date('2024-01-20'),
      reportedDate: new Date('2024-01-20'),
      deadline: new Date('2024-02-20'),
      firmId: '', // Will be set below
    },
    {
      claimNumber: 'CLM-2024-0003',
      title: 'Commercial Water Damage',
      description: 'Burst pipe in office building caused flooding on multiple floors.',
      type: 'WATER_DAMAGE',
      status: 'ASSIGNED',
      priority: 'HIGH',
      estimatedValue: 75000,
      address: '789 Business Plaza',
      city: 'Houston',
      state: 'TX',
      zipCode: '77001',
      incidentDate: new Date('2024-01-25'),
      reportedDate: new Date('2024-01-25'),
      deadline: new Date('2024-02-25'),
      firmId: '', // Will be set below
      adjusterId: demoUser.id
    }
  ]

  // Get the first firm to assign claims to
  const firstFirm = await prisma.firm.findFirst()
  if (firstFirm) {
    for (const claimData of claims) {
      claimData.firmId = firstFirm.id
      const claim = await prisma.claim.upsert({
        where: { claimNumber: claimData.claimNumber },
        update: {},
        create: claimData
      })
      console.log('✅ Claim created:', claim.claimNumber)
    }
  }

  // Create demo messages
  const secondFirm = await prisma.firm.findMany({ take: 2 })
  if (secondFirm.length > 1) {
    const message = await prisma.message.create({
      data: {
        senderId: demoUser.id,
        recipientId: demoUser.id, // Self message for demo
        firmId: secondFirm[1].id,
        subject: 'Welcome to Flex.IA!',
        content: 'This is a demo message to show how the messaging system works.',
        isRead: false
      }
    })
    console.log('✅ Demo message created')
  }

  // Create demo earnings
  const earnings = [
    {
      userId: demoUser.id,
      amount: 2500.00,
      type: 'CLAIM_FEE',
      description: 'Property damage claim completion',
      earnedDate: new Date('2024-01-15'),
      status: 'PAID'
    },
    {
      userId: demoUser.id,
      amount: 1800.00,
      type: 'CLAIM_FEE',
      description: 'Auto collision assessment',
      earnedDate: new Date('2024-01-20'),
      status: 'PENDING'
    },
    {
      userId: demoUser.id,
      amount: 3200.00,
      type: 'CLAIM_FEE',
      description: 'Commercial water damage evaluation',
      earnedDate: new Date('2024-01-25'),
      status: 'PAID'
    }
  ]

  for (const earningData of earnings) {
    const earning = await prisma.earning.create({
      data: earningData
    })
    console.log('✅ Earning record created:', earning.amount)
  }

  // Create demo calendar events
  const calendarEvents = [
    {
      userId: demoUser.id,
      title: 'Property Inspection - Oak Street',
      description: 'Initial inspection for fire damage claim',
      startTime: new Date('2024-02-01T09:00:00'),
      endTime: new Date('2024-02-01T11:00:00'),
      type: 'INSPECTION',
      address: '456 Oak Street',
      city: 'Dallas',
      state: 'TX'
    },
    {
      userId: demoUser.id,
      title: 'Client Meeting - Auto Collision',
      description: 'Meet with claimant to discuss settlement',
      startTime: new Date('2024-02-02T14:00:00'),
      endTime: new Date('2024-02-02T15:00:00'),
      type: 'MEETING',
      address: 'Client Office'
    }
  ]

  for (const eventData of calendarEvents) {
    const event = await prisma.calendarEvent.create({
      data: eventData
    })
    console.log('✅ Calendar event created:', event.title)
  }

  console.log('🎉 Database seeded successfully!')
  console.log('')
  console.log('Demo Login Credentials:')
  console.log('Email: demo@flex.ia')
  console.log('Password: demo123')
  console.log('2FA Code: 123456 (when prompted)')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
