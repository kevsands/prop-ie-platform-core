const { PrismaClient, ProjectStatus, ComponentStatus } = require('@prisma/slp-client');

const prisma = new PrismaClient();

async function seedDatabase() {
  console.log('🌱 Seeding database...');

  // Create projects
  const projects = [
    {
      id: 'proj-001',
      name: 'Fitzgerald Gardens',
      description: 'Premium residential development in Drogheda',
      developerId: 'dev-001',
      status: ProjectStatus.ACTIVE
    },
    {
      id: 'proj-002',
      name: 'Ballymakenny View',
      description: 'Modern homes with stunning views',
      developerId: 'dev-001',
      status: ProjectStatus.ACTIVE
    },
    {
      id: 'proj-003',
      name: 'Riverside Manor',
      description: 'Luxury apartments by the river',
      developerId: 'dev-002',
      status: ProjectStatus.ACTIVE
    }
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: { id: project.id },
      update: {},
      create: project
    });
    console.log(`✓ Created project: ${project.name}`);
  }

  // Create SLP components for each project
  const slpComponentTemplates = [
    {
      name: 'Title Deeds',
      description: 'Original title deeds and land registry documentation',
      required: true
    },
    {
      name: 'Planning Permission',
      description: 'Planning permission documentation and conditions',
      required: true
    },
    {
      name: 'Building Regulations Compliance',
      description: 'Documentation showing compliance with building regulations',
      required: true
    },
    {
      name: 'Property Searches',
      description: 'Local authority, water, and environmental searches',
      required: true
    },
    {
      name: 'New Home Warranty',
      description: 'Home structural warranty documentation',
      required: true
    },
    {
      name: 'Management Company Information',
      description: 'Details about property management company and service charges',
      required: true
    },
    {
      name: 'Energy Performance Certificate',
      description: 'Energy efficiency rating documentation',
      required: true
    },
    {
      name: 'Sale Contract Template',
      description: 'Standard contract for unit sales',
      required: true
    }
  ];

  for (const project of projects) {
    for (const template of slpComponentTemplates) {
      const component = await prisma.sLPComponent.create({
        data: {
          ...template,
          projectId: project.id,
          status: Math.random() > 0.5 ? ComponentStatus.APPROVED : ComponentStatus.PENDING
        }
      });
      console.log(`✓ Created SLP component: ${component.name} for ${project.name}`);
    }
  }

  // Create a sample transaction
  const transaction = await prisma.transaction.create({
    data: {
      projectId: 'proj-001',
      buyerId: 'user-001',
      status: 'INITIATED'
    }
  });
  console.log(`✓ Created sample transaction: ${transaction.id}`);

  // Create milestones for the transaction
  const milestones = [
    {
      name: 'Initial Deposit',
      description: 'Pay initial deposit to secure property',
      transactionId: transaction.id,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    },
    {
      name: 'Document Submission',
      description: 'Submit all required documents',
      transactionId: transaction.id,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    },
    {
      name: 'Legal Review',
      description: 'Solicitor reviews contracts',
      transactionId: transaction.id,
      dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000)
    }
  ];

  for (const milestone of milestones) {
    await prisma.milestone.create({ data: milestone });
    console.log(`✓ Created milestone: ${milestone.name}`);
  }

  console.log('\n✅ Database seeding completed!');
}

seedDatabase()
  .catch(error => {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
