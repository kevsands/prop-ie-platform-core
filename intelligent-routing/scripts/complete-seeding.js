const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function completeSeeding() {
  console.log('🔧 Completing enterprise database seeding...');

  try {
    // Check if company already exists
    const existingCompany = await prisma.company.findFirst({
      where: { name: "O'Connor Architecture" }
    });

    if (existingCompany) {
      console.log('✓ Professional services already exist');
      return;
    }

    // Create Company
    const architectureCompany = await prisma.company.create({
      data: {
        name: "O'Connor Architecture",
        description: "Leading architectural firm specializing in residential developments",
        address: "12 Architects Row, Dublin 2",
        phone: "+353 21 123 4567",
        email: "sarah@oconnor-arch.ie",
        website: "https://oconnor-arch.ie",
        companyNumber: "IE123456",
        vatNumber: "IE9876543A"
      }
    });

    // Create architect user
    const architectUser = await prisma.user.create({
      data: {
        email: "sarah@oconnor-arch.ie",
        firstName: "Sarah",
        lastName: "O'Connor",
        phone: "+353 21 123 4567",
        roles: ["ARCHITECT"],
        status: "ACTIVE",
        kycStatus: "APPROVED"
      }
    });

    // Create professional profile
    const professional = await prisma.professional.create({
      data: {
        userId: architectUser.id,
        companyId: architectureCompany.id,
        specializations: ["Residential Design", "Sustainable Architecture"],
        status: "ACTIVE",
        licenseNumber: "ARCH-2024-001",
        professionalBio: "Senior architect with 15+ years experience in residential developments"
      }
    });

    // Get development
    const development = await prisma.development.findFirst({
      where: { name: "Fitzgerald Gardens" }
    });

    if (development) {
      // Create professional appointment
      await prisma.professionalAppointment.create({
        data: {
          developmentId: development.id,
          professionalId: professional.id,
          role: "Lead Architect",
          status: "ACTIVE",
          responsibilities: [
            "Overall architectural design",
            "Planning application preparation", 
            "Construction documentation",
            "Site supervision"
          ]
        }
      });
    }

    console.log('✅ Professional services completed successfully!');

  } catch (error) {
    console.error('❌ Error completing seeding:', error);
    throw error;
  }
}

completeSeeding()
  .catch(error => {
    console.error('❌ Completion failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });