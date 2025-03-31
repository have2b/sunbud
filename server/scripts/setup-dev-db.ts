import { initializeAdmin } from "./init-admin";
import { resetDatabase } from "./reset";

/**
 * Sets up a development database by:
 * 1. Resetting the database (dropping and recreating schema)
 * 2. Initializing an admin user
 */
async function setupDevDatabase() {
  try {
    console.log("🔄 Starting database setup...");

    // Reset database
    console.log("🔄 Resetting database...");
    await resetDatabase();

    // Initialize admin
    console.log("🔄 Initializing admin user...");
    await initializeAdmin();

    console.log("✅ Database setup completed successfully");
  } catch (error) {
    console.error("❌ Database setup failed:");

    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
      console.error(error.stack);
    } else {
      console.error(`Unknown error: ${error}`);
    }

    process.exit(1);
  }
}

// Execute the setup
setupDevDatabase();
