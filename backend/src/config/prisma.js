const { PrismaClient } = require('@prisma/client');

// single shared prisma instance for the whole app
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

module.exports = prisma;
