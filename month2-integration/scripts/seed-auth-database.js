const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seedAuthDatabase() {
  console.log('🌱 Seeding authentication database...');

  // Create roles
  const roles = [
    { name: 'admin', description: 'System administrator with full access' },
    { name: 'developer', description: 'Property developer' },
    { name: 'buyer', description: 'Property buyer' },
    { name: 'agent', description: 'Estate agent' },
    { name: 'solicitor', description: 'Legal representative' },
    { name: 'investor', description: 'Property investor' }
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role
    });
    console.log(`✓ Created role: ${role.name}`);
  }

  // Create permissions
  const permissions = [
    { name: 'projects.read', resource: 'projects', action: 'read' },
    { name: 'projects.write', resource: 'projects', action: 'write' },
    { name: 'projects.delete', resource: 'projects', action: 'delete' },
    { name: 'slp.read', resource: 'slp', action: 'read' },
    { name: 'slp.write', resource: 'slp', action: 'write' },
    { name: 'slp.approve', resource: 'slp', action: 'approve' },
    { name: 'transactions.read', resource: 'transactions', action: 'read' },
    { name: 'transactions.write', resource: 'transactions', action: 'write' },
    { name: 'users.read', resource: 'users', action: 'read' },
    { name: 'users.write', resource: 'users', action: 'write' },
    { name: 'admin.all', resource: 'admin', action: 'all' }
  ];

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { name: permission.name },
      update: {},
      create: permission
    });
    console.log(`✓ Created permission: ${permission.name}`);
  }

  // Assign permissions to roles
  const rolePermissions = {
    admin: ['admin.all'],
    developer: ['projects.read', 'projects.write', 'slp.read', 'slp.write', 'transactions.read'],
    buyer: ['projects.read', 'slp.read', 'transactions.read', 'transactions.write'],
    agent: ['projects.read', 'slp.read', 'transactions.read'],
    solicitor: ['projects.read', 'slp.read', 'slp.approve', 'transactions.read', 'transactions.write'],
    investor: ['projects.read', 'transactions.read']
  };

  for (const [roleName, permissionNames] of Object.entries(rolePermissions)) {
    const role = await prisma.role.findUnique({ where: { name: roleName } });
    const permissionIds = [];
    
    for (const permName of permissionNames) {
      const permission = await prisma.permission.findUnique({ where: { name: permName } });
      if (permission) {
        permissionIds.push({ id: permission.id });
      }
    }

    await prisma.role.update({
      where: { id: role.id },
      data: {
        permissions: {
          connect: permissionIds
        }
      }
    });
    console.log(`✓ Assigned permissions to role: ${roleName}`);
  }

  // Create test users
  const testUsers = [
    {
      email: 'admin@example.com',
      password: 'Admin123!',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin'
    },
    {
      email: 'developer@example.com',
      password: 'Developer123!',
      firstName: 'John',
      lastName: 'Developer',
      role: 'developer'
    },
    {
      email: 'buyer@example.com',
      password: 'Buyer123!',
      firstName: 'Jane',
      lastName: 'Buyer',
      role: 'buyer'
    },
    {
      email: 'solicitor@example.com',
      password: 'Solicitor123!',
      firstName: 'Legal',
      lastName: 'Eagle',
      role: 'solicitor'
    }
  ];

  for (const userData of testUsers) {
    const { password, role: roleName, ...userInfo } = userData;
    const passwordHash = await bcrypt.hash(password, 10);
    const role = await prisma.role.findUnique({ where: { name: roleName } });

    await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        ...userInfo,
        passwordHash,
        roleId: role.id,
        emailVerified: true
      }
    });
    console.log(`✓ Created user: ${userData.email} (password: ${password})`);
  }

  console.log('\n✅ Authentication database seeding completed!');
  console.log('\nTest accounts:');
  testUsers.forEach(user => {
    console.log(`  ${user.email} / ${user.password} (${user.role})`);
  });
}

seedAuthDatabase()
  .catch(error => {
    console.error('❌ Error seeding authentication database:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });