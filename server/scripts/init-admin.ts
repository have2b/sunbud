import { eq } from "drizzle-orm";
import { db } from "../src/db";
import { users } from "../src/db/schema";

/**
 * Checks if an admin user already exists in the database
 */
async function adminExists(): Promise<boolean> {
  try {
    const admin = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.role, "ADMIN"));

    return admin.length > 0;
  } catch (error) {
    console.error("Error checking admin existence:", error);
    return false;
  }
}

/**
 * Required environment variables for admin creation
 */
const REQUIRED_ENV_VARS = [
  "ADMIN_USERNAME",
  "ADMIN_EMAIL",
  "ADMIN_PASSWORD",
  "ADMIN_FIRST_NAME",
  "ADMIN_LAST_NAME",
  "ADMIN_PHONE",
] as const;

/**
 * Validates that all required environment variables are present
 * @throws Error if any required variables are missing or invalid
 */
function validateEnvironmentVars(): void {
  const missingVars = REQUIRED_ENV_VARS.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}\n` +
        "Please set these in your .env file or deployment environment."
    );
  }

  if ((process.env.ADMIN_PASSWORD?.length || 0) < 8) {
    throw new Error("ADMIN_PASSWORD must be at least 8 characters long");
  }
}

/**
 * Creates an admin user if one doesn't already exist
 */
async function createAdminUser(): Promise<void> {
  const hasAdmin = await adminExists();

  if (hasAdmin) {
    console.log("Admin user already exists, skipping admin creation");
    return;
  }

  try {
    const passwordHash = await Bun.password.hash(process.env.ADMIN_PASSWORD!);

    await db.insert(users).values({
      username: process.env.ADMIN_USERNAME!,
      email: process.env.ADMIN_EMAIL!,
      passwordHash,
      firstName: process.env.ADMIN_FIRST_NAME!,
      lastName: process.env.ADMIN_LAST_NAME!,
      phone: process.env.ADMIN_PHONE!,
      avatarUrl: "https://github.com/have2b.png",
      role: "ADMIN",
    });

    console.log("✅ Admin user created successfully");
  } catch (error) {
    console.error("Error creating admin user:", error);
    throw error;
  }
}

/**
 * Initializes the admin user in the database
 */
export async function initializeAdmin(): Promise<void> {
  try {
    validateEnvironmentVars();
    await createAdminUser();
    console.log("✅ Admin initialization completed successfully");
  } catch (error) {
    console.error(
      "❌ Admin initialization failed:",
      error instanceof Error ? error.message : error
    );
    if (process.env.NODE_ENV !== "test") {
      process.exit(1);
    }
    throw error; // Re-throw for tests or promise handling
  }
}

const isDirectlyExecuted =
  process.argv[1] === __filename || process.argv[1]?.endsWith("/init-admin.ts");
if (isDirectlyExecuted) {
  initializeAdmin();
}
