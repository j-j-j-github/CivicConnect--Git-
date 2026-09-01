const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({
  connectionString,
  ssl: false
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // 1. Create Departments
  const deptData = [
    { name: 'Public Works (PWD)', description: 'Handles road maintenance, potholes, and public infrastructure development.' },
    { name: 'Water Authority', description: 'Manages water supply, pipe leakages, and sewage line clearing.' },
    { name: 'Electricity Board', description: 'Responsible for streetlights, power outages, and electrical hazards.' },
    { name: 'Health & Sanitation', description: 'Oversees waste collection, public hygiene, and pest control.' },
  ];

  const depts = [];
  for (const d of deptData) {
    let existing = await prisma.department.findFirst({ where: { name: d.name } });
    if (!existing) {
      existing = await prisma.department.create({ data: d });
    }
    depts.push(existing);
  }
  console.log(`Created/verified ${depts.length} departments.`);

  // 2. Create users
  const passwordHash = await bcrypt.hash('password123', 10);

  // Admin
  let admin = await prisma.user.findUnique({ where: { email: 'admin@civicconnect.gov' } });
  if (!admin) {
    admin = await prisma.user.create({
      data: {
        email: 'admin@civicconnect.gov',
        password_hash: passwordHash,
        role: 'ADMIN',
      }
    });
  }

  // Officers for each department
  const pwdDept = depts.find(d => d.name.includes('Public Works'));
  const waterDept = depts.find(d => d.name.includes('Water'));
  const elecDept = depts.find(d => d.name.includes('Electricity'));
  const healthDept = depts.find(d => d.name.includes('Health'));

  const officerConfigs = [
    { email: 'officer@pwd.gov', deptId: pwdDept.id },
    { email: 'officer2@pwd.gov', deptId: pwdDept.id },
    { email: 'officer@water.gov', deptId: waterDept.id },
    { email: 'officer@electricity.gov', deptId: elecDept.id },
    { email: 'officer@health.gov', deptId: healthDept.id },
  ];

  let officer = null;
  for (const oc of officerConfigs) {
    let u = await prisma.user.findUnique({ where: { email: oc.email } });
    if (!u) {
      u = await prisma.user.create({
        data: {
          email: oc.email,
          password_hash: passwordHash,
          role: 'OFFICER',
          department_id: oc.deptId,
        }
      });
    }
    if (oc.email === 'officer@pwd.gov') officer = u;
  }

  // Citizen
  let citizen = await prisma.user.findUnique({ where: { email: 'citizen@example.com' } });
  if (!citizen) {
    citizen = await prisma.user.create({
      data: {
        email: 'citizen@example.com',
        password_hash: passwordHash,
        role: 'CITIZEN',
      }
    });
    await prisma.citizenProfile.create({
      data: {
        user_id: citizen.id,
        full_name: 'G Anandakrishnan',
      }
    });
  } else {
    await prisma.citizenProfile.upsert({
      where: { user_id: citizen.id },
      update: { full_name: 'G Anandakrishnan' },
      create: { user_id: citizen.id, full_name: 'G Anandakrishnan' }
    });
  }

  // 3. Create some complaints
  const complaintsData = [
    {
      title: 'Pothole on Main St',
      description: 'Large pothole causing severe traffic delays and potential damage to vehicles.',
      status: 'PENDING',
      priority: 'HIGH',
      location_lat: 9.9312,
      location_lng: 76.2673,
      citizen_id: citizen.id,
      department_id: pwdDept.id,
    },
    {
      title: 'Water Leakage in Sector 4',
      description: 'Water pipeline burst and flooding the sidewalk.',
      status: 'VERIFIED',
      priority: 'MEDIUM',
      location_lat: 9.9325,
      location_lng: 76.2690,
      citizen_id: citizen.id,
      department_id: pwdDept.id,
      assigned_officer_id: officer.id,
    },
    {
      title: 'Broken Streetlight',
      description: 'Streetlight completely out at intersection, making it very dark at night.',
      status: 'RESOLVED',
      priority: 'LOW',
      location_lat: 9.9290,
      location_lng: 76.2650,
      citizen_id: citizen.id,
      department_id: depts.find(d => d.name.includes('Electricity')).id,
      resolution_description: 'Replaced the street lamp bulb and re-connected wiring.',
      resolution_media: ['https://example.com/streetlight_fixed.jpg'],
      resolved_at: new Date(),
    }
  ];

  for (const c of complaintsData) {
    const existing = await prisma.complaint.findFirst({ where: { title: c.title } });
    if (!existing) {
      await prisma.complaint.create({ data: c });
    }
  }

  console.log('Database seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
