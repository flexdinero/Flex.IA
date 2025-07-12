import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create sample firms
  const firms = await Promise.all([
    prisma.firm.create({
      data: {
        name: 'Crawford & Company',
        email: 'contact@crawford.com',
        phone: '+1-555-0101',
        website: 'https://crawford.com',
        description: 'Leading global provider of claims management and outsourcing solutions',
        address: '1001 Summit Blvd',
        city: 'Atlanta',
        state: 'GA',
        zipCode: '30319',
        specialties: JSON.stringify(['Property Damage', 'Auto Collision', 'Storm Damage']),
        rating: 4.8
      }
    }),
    prisma.firm.create({
      data: {
        name: 'Sedgwick',
        email: 'info@sedgwick.com',
        phone: '+1-555-0102',
        website: 'https://sedgwick.com',
        description: 'Comprehensive claims management and business solutions',
        address: '1100 Ridgeway Loop Rd',
        city: 'Memphis',
        state: 'TN',
        zipCode: '38120',
        specialties: JSON.stringify(['Workers Comp', 'Liability', 'Property Damage']),
        rating: 4.6
      }
    }),
    prisma.firm.create({
      data: {
        name: 'Pilot Catastrophe Services',
        email: 'support@pilotcat.com',
        phone: '+1-555-0103',
        website: 'https://pilotcat.com',
        description: 'Specialized catastrophe adjusting services',
        address: '500 Main St',
        city: 'Dallas',
        state: 'TX',
        zipCode: '75201',
        specialties: JSON.stringify(['Storm Damage', 'Fire Damage', 'Water Damage']),
        rating: 4.9
      }
    })
  ])

  // Create sample users
  const hashedPassword = await bcrypt.hash('demo123', 12)

  const users = await Promise.all([
    // Demo adjuster
    prisma.user.create({
      data: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'demo@flex.ia',
        hashedPassword,
        phone: '+1-555-1001',
        role: 'ADJUSTER',
        emailVerified: true,
        licenseNumber: 'TX-ADJ-12345',
        certifications: JSON.stringify(['Property & Casualty', 'Public Adjuster']),
        specialties: JSON.stringify(['Property Damage', 'Storm Damage', 'Auto Collision']),
        yearsExperience: 8,
        hourlyRate: 75.00,
        travelRadius: 50,
        address: '123 Main St',
        city: 'Houston',
        state: 'TX',
        zipCode: '77001'
      }
    }),
    // Additional adjusters
    prisma.user.create({
      data: {
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@email.com',
        hashedPassword,
        phone: '+1-555-1002',
        role: 'ADJUSTER',
        emailVerified: true,
        licenseNumber: 'TX-ADJ-23456',
        certifications: JSON.stringify(['Property & Casualty']),
        specialties: JSON.stringify(['Property Damage', 'Fire Damage']),
        yearsExperience: 12,
        hourlyRate: 85.00,
        travelRadius: 75,
        address: '456 Oak Ave',
        city: 'Austin',
        state: 'TX',
        zipCode: '78701'
      }
    }),
    prisma.user.create({
      data: {
        firstName: 'Mike',
        lastName: 'Rodriguez',
        email: 'mike.rodriguez@email.com',
        hashedPassword,
        phone: '+1-555-1003',
        role: 'ADJUSTER',
        emailVerified: true,
        licenseNumber: 'FL-ADJ-34567',
        certifications: JSON.stringify(['Property & Casualty', 'CAT Specialist']),
        specialties: JSON.stringify(['Storm Damage', 'Water Damage', 'Auto Collision']),
        yearsExperience: 6,
        hourlyRate: 70.00,
        travelRadius: 100,
        address: '789 Beach Blvd',
        city: 'Miami',
        state: 'FL',
        zipCode: '33101'
      }
    })
  ])

  // Note: Simplified schema - no firm connections table

  // Create sample claims
  const claims = []
  const claimTypes = ['PROPERTY_DAMAGE', 'AUTO_COLLISION', 'STORM_DAMAGE', 'FIRE_DAMAGE', 'WATER_DAMAGE']
  const priorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT']
  const statuses = ['AVAILABLE', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED']

  for (let i = 0; i < 20; i++) {
    const firmIndex = i % firms.length
    const typeIndex = i % claimTypes.length
    const priorityIndex = i % priorities.length
    const statusIndex = i % statuses.length
    
    const claimNumber = `CLM-2024-${String(i + 1).padStart(4, '0')}`
    const incidentDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Last 30 days
    const deadline = new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000) // Next 14 days
    
    const claim = await prisma.claim.create({
      data: {
        claimNumber,
        title: `${claimTypes[typeIndex].replace('_', ' ')} - Case ${i + 1}`,
        description: `Detailed description for claim ${claimNumber}`,
        type: claimTypes[typeIndex] as any,
        status: statuses[statusIndex] as any,
        priority: priorities[priorityIndex] as any,
        estimatedValue: Math.floor(Math.random() * 50000) + 10000,
        adjusterFee: Math.floor(Math.random() * 3000) + 1000,
        address: `${Math.floor(Math.random() * 9999) + 1} Test St`,
        city: ['Houston', 'Dallas', 'Austin', 'San Antonio'][Math.floor(Math.random() * 4)],
        state: 'TX',
        zipCode: `7${Math.floor(Math.random() * 9000) + 1000}`,
        incidentDate,
        reportedDate: incidentDate,
        deadline,
        firmId: firms[firmIndex].id,
        adjusterId: statuses[statusIndex] !== 'AVAILABLE' ? users[i % users.length].id : null,
        completedAt: statuses[statusIndex] === 'COMPLETED' ? new Date() : null
      }
    })
    claims.push(claim)
  }

  // Create sample earnings
  for (const user of users) {
    for (let i = 0; i < 10; i++) {
      await prisma.earning.create({
        data: {
          userId: user.id,
          claimId: claims[Math.floor(Math.random() * claims.length)].id,
          amount: Math.floor(Math.random() * 3000) + 1000,
          type: 'CLAIM_FEE',
          status: ['PENDING', 'APPROVED', 'PAID'][Math.floor(Math.random() * 3)] as any,
          earnedDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000), // Last 90 days
          description: `Payment for claim services`
        }
      })
    }
  }

  // Create sample messages
  for (let i = 0; i < 15; i++) {
    const senderIndex = Math.floor(Math.random() * users.length)
    const recipientIndex = (senderIndex + 1) % users.length
    const claimIndex = Math.floor(Math.random() * claims.length)
    
    await prisma.message.create({
      data: {
        subject: `Re: Claim ${claims[claimIndex].claimNumber}`,
        content: `This is a sample message regarding claim ${claims[claimIndex].claimNumber}. Please review the attached documentation.`,
        senderId: users[senderIndex].id,
        recipientId: users[recipientIndex].id,
        claimId: claims[claimIndex].id,
        firmId: claims[claimIndex].firmId,
        isRead: Math.random() > 0.5
      }
    })
  }

  // Create sample calendar events
  for (const user of users) {
    for (let i = 0; i < 5; i++) {
      const startTime = new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000) // Next 30 days
      const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000) // 2 hours later
      
      await prisma.calendarEvent.create({
        data: {
          title: `Property Inspection - ${Math.floor(Math.random() * 9999) + 1000} Main St`,
          description: 'Scheduled property inspection for insurance claim',
          type: 'INSPECTION',
          status: 'SCHEDULED',
          startTime,
          endTime,
          address: `${Math.floor(Math.random() * 9999) + 1000} Main St`,
          city: ['Houston', 'Dallas', 'Austin'][Math.floor(Math.random() * 3)],
          state: 'TX',
          zipCode: `7${Math.floor(Math.random() * 9000) + 1000}`,
          userId: user.id,
          claimId: claims[Math.floor(Math.random() * claims.length)].id
        }
      })
    }
  }

  // Create sample notifications
  for (const user of users) {
    const notifications = [
      'New claim assigned to you',
      'Payment has been processed',
      'Deadline reminder for claim inspection',
      'Message received from firm',
      'Profile update successful'
    ]
    
    for (let i = 0; i < 5; i++) {
      await prisma.notification.create({
        data: {
          title: notifications[i],
          content: `This is a sample notification: ${notifications[i]}`,
          type: ['CLAIM_ASSIGNED', 'PAYMENT_RECEIVED', 'DEADLINE_REMINDER', 'MESSAGE_RECEIVED', 'SYSTEM_UPDATE'][i] as any,
          userId: user.id,
          isRead: Math.random() > 0.5
        }
      })
    }
  }

  // Note: Ratings not included in simplified schema

  console.log('✅ Database seeded successfully!')
  console.log(`Created:`)
  console.log(`- ${firms.length} firms`)
  console.log(`- ${users.length} users`)
  console.log(`- ${claims.length} claims`)
  console.log(`- Sample earnings, messages, events, and notifications`)
  console.log('\n👤 Demo login credentials:')
  console.log('Email: demo@flex.ia')
  console.log('Password: demo123')
  console.log('2FA Code: 123456')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
