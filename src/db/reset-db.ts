import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function resetDatabase() {
  await prisma.$executeRawUnsafe(`
    BEGIN;
    DROP SCHEMA public CASCADE;
    CREATE SCHEMA public;
    GRANT ALL ON SCHEMA public TO public;
    REVOKE CREATE ON SCHEMA public FROM public;
    COMMIT;
  `);

  console.log("🧹 Database schema reset! Now reapplying schema...");
}

resetDatabase()
  .then(() => {
    console.log("✅ Database reset completed successfully");
  })
  .catch((e) => {
    console.error("Error during reset", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
