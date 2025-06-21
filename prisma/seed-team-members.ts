import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Adding professional team members...');

  // Create team members based on your real partners
  const teamMembers = await Promise.all([
    // Solicitor - Brady Hughes
    prisma.user.create({
      data: {
        email: 'brady@bradyhughes.ie',
        password: await bcrypt.hash('solicitor123', 10),
        firstName: 'Brady',
        lastName: 'Hughes',
        phone: '+353417123456',
        roles: ['SOLICITOR'],
        status: 'ACTIVE',
        kycStatus: 'APPROVED',
        organization: 'Brady Hughes Solicitors',
        position: 'Managing Partner'
      }
    }),

    // Accountant - DFK
    prisma.user.create({
      data: {
        email: 'info@dfk.ie',
        password: await bcrypt.hash('accountant123', 10),
        firstName: 'John',
        lastName: 'Murphy',
        phone: '+353417234567',
        roles: ['AGENT'],
        status: 'ACTIVE',
        kycStatus: 'APPROVED',
        organization: 'DFK Chartered Accountants',
        position: 'Partner'
      }
    }),

    // Engineer - Waterman Moylan
    prisma.user.create({
      data: {
        email: 'info@watermanmoylan.ie',
        password: await bcrypt.hash('engineer123', 10),
        firstName: 'Michael',
        lastName: 'Waterman',
        phone: '+353417345678',
        roles: ['ARCHITECT'],
        status: 'ACTIVE',
        kycStatus: 'APPROVED',
        organization: 'Waterman Moylan Consulting Engineers',
        position: 'Senior Engineer'
      }
    }),

    // Project Manager - Gannon
    prisma.user.create({
      data: {
        email: 'info@gannon.ie',
        password: await bcrypt.hash('project123', 10),
        firstName: 'Patrick',
        lastName: 'Gannon',
        phone: '+353417456789',
        roles: ['CONTRACTOR'],
        status: 'ACTIVE',
        kycStatus: 'APPROVED',
        organization: 'Gannon Project Management',
        position: 'Project Manager'
      }
    }),

    // Quantity Surveyor - AMRA
    prisma.user.create({
      data: {
        email: 'info@amra.ie',
        password: await bcrypt.hash('qs123', 10),
        firstName: 'Anne',
        lastName: 'Ryan',
        phone: '+353417567890',
        roles: ['AGENT'],
        status: 'ACTIVE',
        kycStatus: 'APPROVED',
        organization: 'AMRA Quantity Surveyors',
        position: 'Senior Quantity Surveyor'
      }
    }),

    // Contractor - Meegan Builders
    prisma.user.create({
      data: {
        email: 'info@meeganbuilders.ie',
        password: await bcrypt.hash('contractor123', 10),
        firstName: 'Tom',
        lastName: 'Meegan',
        phone: '+353417678901',
        roles: ['CONTRACTOR'],
        status: 'ACTIVE',
        kycStatus: 'APPROVED',
        organization: 'Meegan Builders Ltd',
        position: 'Managing Director'
      }
    }),

    // Structural Engineer - BTY
    prisma.user.create({
      data: {
        email: 'info@bty.ie',
        password: await bcrypt.hash('structural123', 10),
        firstName: 'Brian',
        lastName: 'Taylor',
        phone: '+353417789012',
        roles: ['ARCHITECT'],
        status: 'ACTIVE',
        kycStatus: 'APPROVED',
        organization: 'BTY Structural Engineers',
        position: 'Senior Structural Engineer'
      }
    }),

    // Mechanical Engineer - ACSU
    prisma.user.create({
      data: {
        email: 'info@acsu.ie',
        password: await bcrypt.hash('mechanical123', 10),
        firstName: 'Alice',
        lastName: 'Sullivan',
        phone: '+353417890123',
        roles: ['CONTRACTOR'],
        status: 'ACTIVE',
        kycStatus: 'APPROVED',
        organization: 'ACSU Mechanical Engineers',
        position: 'Principal Engineer'
      }
    }),

    // Sales Agent
    prisma.user.create({
      data: {
        email: 'sales@prop.ie',
        password: await bcrypt.hash('sales123', 10),
        firstName: 'Emma',
        lastName: 'Fitzgerald',
        phone: '+353417901234',
        roles: ['AGENT'],
        status: 'ACTIVE',
        kycStatus: 'APPROVED',
        organization: 'Fitzgerald Developments',
        position: 'Sales Manager'
      }
    }),

    // Additional Sample Buyers
    prisma.user.create({
      data: {
        email: 'john.smith@email.com',
        password: await bcrypt.hash('buyer123', 10),
        firstName: 'John',
        lastName: 'Smith',
        phone: '+353123456792',
        roles: ['BUYER'],
        status: 'ACTIVE',
        kycStatus: 'APPROVED'
      }
    }),

    prisma.user.create({
      data: {
        email: 'mary.kelly@email.com',
        password: await bcrypt.hash('buyer123', 10),
        firstName: 'Mary',
        lastName: 'Kelly',
        phone: '+353123456793',
        roles: ['BUYER'],
        status: 'ACTIVE',
        kycStatus: 'IN_PROGRESS'
      }
    }),

    prisma.user.create({
      data: {
        email: 'david.wilson@email.com',
        password: await bcrypt.hash('buyer123', 10),
        firstName: 'David',
        lastName: 'Wilson',
        phone: '+353123456794',
        roles: ['BUYER'],
        status: 'ACTIVE',
        kycStatus: 'APPROVED'
      }
    })
  ]);

  console.log('✅ Professional team members created:');
  teamMembers.forEach(member => {
    console.log(`   - ${member.firstName} ${member.lastName} (${member.organization}) - ${member.email}`);
  });

  console.log('\n🔑 Login credentials for team members:');
  console.log('   Brady Hughes: brady@bradyhughes.ie / solicitor123');
  console.log('   DFK: info@dfk.ie / accountant123');
  console.log('   Waterman Moylan: info@watermanmoylan.ie / engineer123');
  console.log('   Gannon: info@gannon.ie / project123');
  console.log('   AMRA: info@amra.ie / qs123');
  console.log('   Meegan Builders: info@meeganbuilders.ie / contractor123');
  console.log('   BTY: info@bty.ie / structural123');
  console.log('   ACSU: info@acsu.ie / mechanical123');
  console.log('   Sales Manager: sales@prop.ie / sales123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });