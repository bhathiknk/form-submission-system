/* eslint-disable no-console */
require('dotenv').config();
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const SALT_ROUNDS = 12;

// creates the first admin account so someone can log in and add more admins
async function main() {
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@evotec.software';
  const password = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!';

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`Seed admin already exists: ${email} (skipping)`);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const admin = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: 'ADMIN',
      isSeedAdmin: true,
    },
  });

  console.log('Seed super admin created:');
  console.log(`  Email:    ${admin.email}`);
  console.log(`  Password: ${password}`);
  console.log('  (change this password before real production use)');
}

main()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
