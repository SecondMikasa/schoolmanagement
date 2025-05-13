const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const result = await prisma.$queryRawUnsafe('SELECT VERSION() AS version');
    if (Array.isArray(result) && result.length > 0) {
      console.log('MySQL Version:', result[0].version);
    } else {
      console.log('No result returned. Possibly insufficient privileges.');
    }
  } catch (error) {
    console.error('Error running query:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
