import { sql } from "drizzle-orm";
import { db } from ".";

async function resetDatabase() {
  await db.execute(sql`-- Begin transaction for atomic operation
BEGIN;

-- Drop the public schema (and all objects) safely
DROP SCHEMA public CASCADE;

-- Recreate the public schema
CREATE SCHEMA public;

-- Optionally, reset privileges on the new schema
GRANT ALL ON SCHEMA public TO public;
REVOKE CREATE ON SCHEMA public FROM public;

COMMIT;

-- End transaction
`);
  console.log("🧹 Database schema reset! Now reapplying schema...");
}

resetDatabase();

console.log("✅ Database reset completed successfully");
