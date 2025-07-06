const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Import real Fitzgerald Gardens data
const fitzgeraldGardensConfig = {
  projectName: "Fitzgerald Gardens",
  location: "Ballymakenny Road, Drogheda, Co. Louth",
  description: "Premium residential development featuring 96 modern units across four distinct property types - Hawthorne, Oak, Birch, and Willow collections",
  
  totalUnits: 96,
  phase1Units: 43,
  availableForSale: 64,
  currentPhase: "Phase 2a Construction", 
  completionPercentage: 68,
  
  projectStartDate: "2024-02-01",
  estimatedCompletion: "2025-08-15",
  
  unitTypes: {
    "1_bed_apartment": {
      count: 24, // Willow units
      basePrice: 295000,
      size: 58,
      bedrooms: 1,
      bathrooms: 1
    },
    "2_bed_apartment": {
      count: 30, // Birch units
      basePrice: 350000,
      size: 85,
      bedrooms: 2,
      bathrooms: 2
    },
    "3_bed_apartment": {
      count: 24, // Hawthorne units
      basePrice: 397500,
      size: 125,
      bedrooms: 3,
      bathrooms: 2
    },
    "4_bed_apartment": {
      count: 18, // Oak units
      basePrice: 475000,
      size: 165,
      bedrooms: 4,
      bathrooms: 3
    }
  },
  
  totalInvestment: 45000000,
  soldToDate: 22,
  reservedUnits: 10,
  
  keyContacts: {
    "Lead Architect": {
      name: "Sarah O'Connor",
      company: "O'Connor Architecture",
      email: "sarah@oconnor-arch.ie",
      phone: "+353 21 123 4567"
    },
    "Site Manager": {
      name: "Patrick Murphy",
      company: "Murphy Construction",
      email: "pmurphy@murphycon.ie",
      phone: "+353 21 456 7890"
    },
    "Sales Agent": {
      name: "Michael Fitzgerald",
      company: "PROP.ie",
      email: "sales@prop.ie",
      phone: "+353 21 987 6543"
    }
  }
};

async function seedEnterpriseDatabase() {
  console.log('🌱 Starting enterprise database seeding...');

  try {
    // 1. Create Location
    console.log('📍 Creating location...');
    const location = await prisma.location.create({
      data: {
        address: fitzgeraldGardensConfig.location,
        addressLine1: "Ballymakenny Road",
        city: "Drogheda",
        county: "Louth",
        eircode: "A92 X7Y8",
        country: "Ireland",
        latitude: 53.7095,
        longitude: -6.3447
      }
    });
    console.log(`✓ Created location: ${location.address}`);

    // 2. Create Developer User
    console.log('👤 Creating developer user...');
    const developer = await prisma.user.create({
      data: {
        email: "developer@fitzgeraldgardens.ie",
        firstName: "Patrick",
        lastName: "Fitzgerald",
        phone: "+353 87 123 4567",
        roles: ["DEVELOPER"],
        status: "ACTIVE",
        kycStatus: "APPROVED",
        avatar: "/images/avatars/developer-avatar.jpg"
      }
    });
    console.log(`✓ Created developer: ${developer.firstName} ${developer.lastName}`);

    // 3. Create Development
    console.log('🏗️ Creating development...');
    const development = await prisma.development.create({
      data: {
        name: fitzgeraldGardensConfig.projectName,
        slug: "fitzgerald-gardens",
        developerId: developer.id,
        locationId: location.id,
        status: "CONSTRUCTION",
        marketingStatus: {
          isActive: true,
          launchDate: "2024-03-01",
          salesStarted: true
        },
        salesStatus: {
          totalUnits: fitzgeraldGardensConfig.totalUnits,
          soldUnits: fitzgeraldGardensConfig.soldToDate,
          reservedUnits: fitzgeraldGardensConfig.reservedUnits,
          availableUnits: fitzgeraldGardensConfig.availableForSale
        },
        constructionStatus: {
          phase: fitzgeraldGardensConfig.currentPhase,
          completionPercentage: fitzgeraldGardensConfig.completionPercentage,
          onTrack: true
        },
        complianceStatus: {
          planningApproved: true,
          buildingRegsApproved: true,
          environmentalClearance: true
        },
        mainImage: "/images/developments/fitzgerald-gardens/hero.jpeg",
        images: [
          "/images/developments/fitzgerald-gardens/hero.jpeg",
          "/images/developments/fitzgerald-gardens/3bed-House.jpeg",
          "/images/developments/fitzgerald-gardens/2bed-apartment.jpeg",
          "/images/developments/fitzgerald-gardens/HouseTypes Header.jpeg"
        ],
        videos: ["/videos/fitzgerald-gardens-virtual-tour.mp4"],
        sitePlanUrl: "/documents/fitzgerald-gardens-site-plan.pdf",
        brochureUrl: "/documents/fitzgerald-gardens-brochure.pdf",
        virtualTourUrl: "https://virtual-tour.fitzgeraldgardens.ie",
        websiteUrl: "https://fitzgeraldgardens.ie",
        description: fitzgeraldGardensConfig.description,
        shortDescription: "Premium 96-unit development in Drogheda",
        features: [
          "A2 BER Energy Rating",
          "Private gardens and balconies",
          "High-quality finishes throughout",
          "Ample parking spaces",
          "Close to town center and amenities",
          "Excellent transport links"
        ],
        amenities: [
          "Children's playground",
          "Landscaped communal areas",
          "Electric vehicle charging points",
          "Bike storage facilities",
          "24/7 security system",
          "Fiber broadband ready"
        ],
        buildingSpecs: {
          architecturalStyle: "Contemporary Irish",
          exteriorFinish: "Brick and render",
          roofType: "Slate",
          windows: "Triple glazed",
          insulation: "Premium grade",
          heating: "Gas central heating"
        },
        buildingType: "Mixed residential",
        completionDate: new Date(fitzgeraldGardensConfig.estimatedCompletion),
        startDate: new Date(fitzgeraldGardensConfig.projectStartDate),
        publishedDate: new Date("2024-03-01"),
        isPublished: true,
        tags: ["Premium", "Family-friendly", "Energy-efficient", "Drogheda"],
        awards: ["Irish Architecture Awards - Finalist 2024"]
      }
    });
    console.log(`✓ Created development: ${development.name}`);

    // 4. Create Project Timeline
    console.log('📅 Creating project timeline...');
    const timeline = await prisma.projectTimeline.create({
      data: {
        planningSubmissionDate: new Date("2023-06-01"),
        planningDecisionDate: new Date("2023-10-15"),
        constructionStartDate: new Date(fitzgeraldGardensConfig.projectStartDate),
        constructionEndDate: new Date(fitzgeraldGardensConfig.estimatedCompletion),
        marketingLaunchDate: new Date("2024-03-01"),
        salesLaunchDate: new Date("2024-03-15")
      }
    });

    // Update development with timeline
    await prisma.development.update({
      where: { id: development.id },
      data: { timelineId: timeline.id }
    });
    console.log(`✓ Created project timeline`);

    // 5. Create Units
    console.log('🏠 Creating units...');
    const unitTypes = [
      { name: "Willow", type: "APARTMENT", config: fitzgeraldGardensConfig.unitTypes["1_bed_apartment"] },
      { name: "Birch", type: "APARTMENT", config: fitzgeraldGardensConfig.unitTypes["2_bed_apartment"] },
      { name: "Hawthorne", type: "APARTMENT", config: fitzgeraldGardensConfig.unitTypes["3_bed_apartment"] },
      { name: "Oak", type: "APARTMENT", config: fitzgeraldGardensConfig.unitTypes["4_bed_apartment"] }
    ];

    let unitNumber = 1;
    const units = [];

    for (const unitType of unitTypes) {
      for (let i = 0; i < unitType.config.count; i++) {
        const unitStatus = unitNumber <= fitzgeraldGardensConfig.soldToDate ? "SOLD" :
                          unitNumber <= (fitzgeraldGardensConfig.soldToDate + fitzgeraldGardensConfig.reservedUnits) ? "RESERVED" : 
                          "AVAILABLE";

        const unit = await prisma.unit.create({
          data: {
            developmentId: development.id,
            name: `${unitType.name} ${i + 1}`,
            type: unitType.type,
            size: unitType.config.size,
            bedrooms: unitType.config.bedrooms,
            bathrooms: unitType.config.bathrooms,
            floors: unitType.config.bedrooms >= 3 ? 2 : 1,
            parkingSpaces: 1,
            basePrice: unitType.config.basePrice,
            status: unitStatus,
            berRating: "A2",
            features: [
              "Open plan living",
              "High-quality kitchen",
              "En-suite bathroom",
              "Built-in wardrobes",
              "Private outdoor space"
            ],
            primaryImage: "/images/developments/fitzgerald-gardens/hero.jpeg",
            images: [
              "/images/developments/fitzgerald-gardens/hero.jpeg",
              "/images/developments/fitzgerald-gardens/3bed-House.jpeg",
              "/images/developments/fitzgerald-gardens/2bed-apartment.jpeg"
            ],
            floorplans: [`/images/floorplans/${unitType.name.toLowerCase()}-floorplan.pdf`],
            virtualTourUrl: `https://virtual-tour.fitzgeraldgardens.ie/unit/${unitNumber}`,
            unitNumber: unitNumber.toString(),
            block: Math.ceil(unitNumber / 24).toString(),
            floor: ((unitNumber - 1) % 3) + 1,
            aspect: ["North", "South", "East", "West"][unitNumber % 4],
            availableFrom: unitStatus === "AVAILABLE" ? new Date("2025-06-01") : null,
            viewCount: Math.floor(Math.random() * 50) + 10
          }
        });

        units.push(unit);
        unitNumber++;
      }
    }
    console.log(`✓ Created ${units.length} units`);

    // 6. Create Sample Users (Buyers, Agents, etc.)
    console.log('👥 Creating sample users...');
    
    // Create buyer users
    const buyers = [];
    for (let i = 1; i <= 5; i++) {
      const buyer = await prisma.user.create({
        data: {
          email: `buyer${i}@example.com`,
          firstName: `John${i}`,
          lastName: `Smith`,
          phone: `+353 87 ${String(i).padStart(3, '0')} ${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
          roles: ["BUYER"],
          status: "ACTIVE",
          kycStatus: "APPROVED"
        }
      });
      buyers.push(buyer);
    }

    // Create agent user
    const agent = await prisma.user.create({
      data: {
        email: "agent@prop.ie",
        firstName: "Sarah",
        lastName: "Kelly",
        phone: "+353 87 555 0123",
        roles: ["AGENT"],
        status: "ACTIVE",
        kycStatus: "APPROVED"
      }
    });

    console.log(`✓ Created ${buyers.length} buyers and 1 agent`);

    // 7. Create Sales Records
    console.log('💰 Creating sales records...');
    
    // Create sales for sold units
    const soldUnits = units.filter(unit => unit.status === "SOLD").slice(0, fitzgeraldGardensConfig.soldToDate);
    
    for (let i = 0; i < soldUnits.length; i++) {
      const unit = soldUnits[i];
      const buyer = buyers[i % buyers.length];
      
      const sale = await prisma.sale.create({
        data: {
          unitId: unit.id,
          buyerId: buyer.id,
          sellingAgentId: agent.id,
          status: "COMPLETED",
          contractStatus: "Signed",
          basePrice: unit.basePrice,
          customizationCost: Math.floor(Math.random() * 10000),
          totalPrice: unit.basePrice + Math.floor(Math.random() * 10000),
          completionDate: new Date("2024-11-15"),
          handoverDate: new Date("2024-12-01"),
          keyCollectionDate: new Date("2024-12-01"),
          referenceNumber: `FG-${String(i + 1).padStart(4, '0')}`,
          metadata: {
            paymentMethod: "Mortgage + Deposit",
            mortgageLender: ["AIB", "Bank of Ireland", "Permanent TSB"][i % 3],
            htbApplied: Math.random() > 0.5
          },
          tags: ["Completed", "HTB"],
          developmentId: development.id
        }
      });

      // Create sale timeline
      await prisma.saleTimeline.create({
        data: {
          saleId: sale.id,
          initialEnquiryDate: new Date("2024-03-20"),
          firstViewingDate: new Date("2024-04-05"),
          reservationDate: new Date("2024-04-12"),
          contractIssuedDate: new Date("2024-05-01"),
          contractReturnedDate: new Date("2024-05-15"),
          depositPaidDate: new Date("2024-05-20"),
          mortgageApprovalDate: new Date("2024-09-10"),
          closingDate: new Date("2024-11-15"),
          saleCompletedDate: new Date("2024-11-15"),
          handoverDate: new Date("2024-12-01"),
          keyCollectionDate: new Date("2024-12-01")
        }
      });
    }

    console.log(`✓ Created ${soldUnits.length} sales records`);

    // 8. Create Reservations
    console.log('📝 Creating reservations...');
    
    const reservedUnits = units.filter(unit => unit.status === "RESERVED").slice(0, fitzgeraldGardensConfig.reservedUnits);
    
    for (let i = 0; i < reservedUnits.length; i++) {
      const unit = reservedUnits[i];
      const buyer = buyers[i % buyers.length];
      
      await prisma.reservation.create({
        data: {
          propertyId: unit.id,
          userId: buyer.id,
          status: "active",
          depositAmount: 10000,
          depositPaid: true,
          reservationDate: new Date("2024-10-01"),
          agreementSigned: true,
          expiryDate: new Date("2025-01-01")
        }
      });
    }

    console.log(`✓ Created ${reservedUnits.length} reservations`);

    // 9. Create Project and Project Management Data
    console.log('📊 Creating project management data...');
    
    const project = await prisma.project.create({
      data: {
        developmentId: development.id,
        name: "Fitzgerald Gardens Construction",
        description: "Main construction project for Fitzgerald Gardens development",
        status: "IN_PROGRESS",
        plannedStartDate: new Date(fitzgeraldGardensConfig.projectStartDate),
        plannedEndDate: new Date(fitzgeraldGardensConfig.estimatedCompletion),
        actualStartDate: new Date(fitzgeraldGardensConfig.projectStartDate),
        projectManagerId: developer.id,
        completionPercentage: fitzgeraldGardensConfig.completionPercentage,
        constructionStage: fitzgeraldGardensConfig.currentPhase,
        createdBy: developer.id
      }
    });

    console.log(`✓ Created project management structure`);

    // 10. Create Development Finance
    console.log('💼 Creating development finance...');
    
    const finance = await prisma.developmentFinance.create({
      data: {
        developmentId: development.id,
        projectCost: fitzgeraldGardensConfig.totalInvestment,
        projectCostCurrency: "EUR",
        reportingPeriod: "Monthly"
      }
    });

    // Create funding sources
    await prisma.fundingSource.create({
      data: {
        financeId: finance.id,
        name: "Senior Development Loan",
        type: "DEVELOPMENT_LOAN",
        amount: fitzgeraldGardensConfig.totalInvestment * 0.7,
        currency: "EUR",
        interestRate: 4.5,
        term: 24,
        termUnit: "months",
        startDate: new Date(fitzgeraldGardensConfig.projectStartDate),
        endDate: new Date(fitzgeraldGardensConfig.estimatedCompletion),
        ltvRatio: 70,
        ltcRatio: 70,
        providerName: "Development Finance Bank",
        status: "ACTIVE"
      }
    });

    await prisma.fundingSource.create({
      data: {
        financeId: finance.id,
        name: "Equity Investment",
        type: "EQUITY_INVESTMENT",
        amount: fitzgeraldGardensConfig.totalInvestment * 0.3,
        currency: "EUR",
        startDate: new Date(fitzgeraldGardensConfig.projectStartDate),
        providerName: "Fitzgerald Properties Ltd",
        status: "ACTIVE"
      }
    });

    console.log(`✓ Created development finance structure`);

    // 11. Create Company and Professional Services
    console.log('🏢 Creating professional services...');
    
    const architectureCompany = await prisma.company.create({
      data: {
        name: fitzgeraldGardensConfig.keyContacts["Lead Architect"].company,
        description: "Leading architectural firm specializing in residential developments",
        address: "12 Architects Row, Dublin 2",
        phone: fitzgeraldGardensConfig.keyContacts["Lead Architect"].phone,
        email: fitzgeraldGardensConfig.keyContacts["Lead Architect"].email,
        website: "https://oconnor-arch.ie",
        companyNumber: "IE123456",
        vatNumber: "IE9876543A"
      }
    });

    // Create architect user and professional profile
    const architectUser = await prisma.user.create({
      data: {
        email: fitzgeraldGardensConfig.keyContacts["Lead Architect"].email,
        firstName: fitzgeraldGardensConfig.keyContacts["Lead Architect"].name.split(' ')[0],
        lastName: fitzgeraldGardensConfig.keyContacts["Lead Architect"].name.split(' ')[1],
        phone: fitzgeraldGardensConfig.keyContacts["Lead Architect"].phone,
        roles: ["ARCHITECT"],
        status: "ACTIVE",
        kycStatus: "APPROVED"
      }
    });

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

    console.log(`✓ Created professional services structure`);

    console.log('\n✅ Enterprise database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   • Development: ${development.name}`);
    console.log(`   • Location: ${location.address}`);
    console.log(`   • Total Units: ${units.length}`);
    console.log(`   • Sold Units: ${soldUnits.length}`);
    console.log(`   • Reserved Units: ${reservedUnits.length}`);
    console.log(`   • Available Units: ${units.filter(u => u.status === "AVAILABLE").length}`);
    console.log(`   • Users Created: ${buyers.length + 2} (buyers, developer, agent, architect)`);
    console.log(`   • Sales Records: ${soldUnits.length}`);
    console.log(`   • Reservations: ${reservedUnits.length}`);
    console.log(`   • Project Finance: €${fitzgeraldGardensConfig.totalInvestment.toLocaleString()}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

seedEnterpriseDatabase()
  .catch(error => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });