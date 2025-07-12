#!/usr/bin/env ts-node

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('🔍 Checking database...');
    
    // Check if Project table exists and has records
    try {
      const projects = await prisma.project.findMany({
        take: 5
      });
      console.log('📁 Projects found:', projects.length);
      projects.forEach(p => console.log(`  - ${p.id}: ${p.name}`));
    } catch (error) {
      console.log('❌ Project table issue:', (error as Error).message);
    }

    // Check if BillOfQuantities table exists
    try {
      const boqs = await prisma.billOfQuantities.findMany({
        take: 5
      });
      console.log('📋 BOQs found:', boqs.length);
      boqs.forEach(b => console.log(`  - ${b.id}: ${b.projectId}`));
    } catch (error) {
      console.log('❌ BillOfQuantities table issue:', (error as Error).message);
    }

    // Check specifically for fitzgerald-gardens project
    try {
      const fitzProject = await prisma.project.findUnique({
        where: { id: 'fitzgerald-gardens' }
      });
      if (fitzProject) {
        console.log('✅ Fitzgerald Gardens project exists:', fitzProject.name);
      } else {
        console.log('❌ Fitzgerald Gardens project not found');
      }
    } catch (error) {
      console.log('❌ Error checking fitzgerald-gardens:', (error as Error).message);
    }

  } catch (error) {
    console.error('💥 Database error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();