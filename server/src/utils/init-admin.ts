import { sql } from "bun";
import { createHash } from "crypto";
import { createInterface } from "readline";

// Password hashing function
function hashPassword(password: string, salt: string): string {
  return createHash("sha256")
    .update(password + salt)
    .digest("hex");
}

// Generate a random salt
function generateSalt(length: number = 16): string {
  return Array.from({ length }, () =>
    Math.floor(Math.random() * 36).toString(36)
  ).join("");
}

// Function to check if roles exist
async function rolesExist(): Promise<boolean> {
  try {
    const result = await sql`SELECT COUNT(*) FROM roles`;
    return parseInt(result[0].count) > 0;
  } catch (error) {
    console.error("Error checking roles:", error);
    return false;
  }
}

// Function to check if admin user exists
async function adminExists(): Promise<boolean> {
  try {
    const result = await sql`
      SELECT COUNT(*) FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE r.name = 'admin'
    `;
    return parseInt(result[0].count) > 0;
  } catch (error) {
    console.error("Error checking admin:", error);
    return false;
  }
}

// Function to initialize roles
async function initializeRoles(): Promise<void> {
  try {
    // Check if roles already exist
    const hasRoles = await rolesExist();
    if (hasRoles) {
      console.log("Roles already exist, skipping role initialization");
      return;
    }

    // Insert basic roles
    await sql`
      INSERT INTO roles (name, description) VALUES
      ('admin', 'Administrator with full access'),
      ('manager', 'Manager with limited administrative access'),
      ('customer', 'Regular customer user')
    `;
    console.log("✅ Roles initialized successfully");
  } catch (error) {
    console.error("Error initializing roles:", error);
    throw error;
  }
}

// Function to create admin user
async function createAdminUser(
  username: string,
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<void> {
  try {
    // Check if admin already exists
    const hasAdmin = await adminExists();
    if (hasAdmin) {
      console.log("Admin user already exists, skipping admin creation");
      return;
    }

    // Get admin role ID
    const roleResult = await sql`SELECT id FROM roles WHERE name = 'admin'`;
    if (roleResult.length === 0) {
      throw new Error("Admin role not found");
    }
    const roleId = roleResult[0].id;

    // Generate salt and hash password
    const salt = generateSalt();
    const passwordHash = hashPassword(password, salt);

    // Store salt and hashed password
    const metadata = { salt };

    // Insert admin user
    await sql`
      INSERT INTO users (
        role_id, username, email, password_hash, 
        first_name, last_name, created_at, metadata
      ) VALUES (
        ${roleId}, ${username}, ${email}, ${passwordHash}, 
        ${firstName}, ${lastName}, NOW(), ${JSON.stringify(metadata)}
      )
    `;
    console.log("✅ Admin user created successfully");
  } catch (error) {
    console.error("Error creating admin user:", error);
    throw error;
  }
}

// Interactive CLI for admin creation
async function promptForAdminDetails(): Promise<{
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (query: string): Promise<string> =>
    new Promise((resolve) => rl.question(query, resolve));

  try {
    console.log("Please provide admin user details:");
    const username = await question("Username: ");
    const email = await question("Email: ");
    const password = await question("Password (min 8 characters): ");
    const firstName = await question("First Name: ");
    const lastName = await question("Last Name: ");

    rl.close();

    // Validate inputs
    if (!username || !email || !password || !firstName || !lastName) {
      throw new Error("All fields are required");
    }

    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }

    return { username, email, password, firstName, lastName };
  } catch (error) {
    rl.close();
    throw error;
  }
}

// Main function
async function initializeAdmin(): Promise<void> {
  try {
    // Initialize roles first
    await initializeRoles();

    // Check if we should use environment variables or prompt
    const useEnvVars =
      process.env.ADMIN_USERNAME &&
      process.env.ADMIN_EMAIL &&
      process.env.ADMIN_PASSWORD &&
      process.env.ADMIN_FIRST_NAME &&
      process.env.ADMIN_LAST_NAME;

    if (useEnvVars) {
      // Use environment variables
      await createAdminUser(
        process.env.ADMIN_USERNAME!,
        process.env.ADMIN_EMAIL!,
        process.env.ADMIN_PASSWORD!,
        process.env.ADMIN_FIRST_NAME!,
        process.env.ADMIN_LAST_NAME!
      );
    } else {
      // Use interactive prompt
      const adminDetails = await promptForAdminDetails();
      await createAdminUser(
        adminDetails.username,
        adminDetails.email,
        adminDetails.password,
        adminDetails.firstName,
        adminDetails.lastName
      );
    }

    console.log("✅ Admin initialization completed successfully");
  } catch (error) {
    console.error("❌ Admin initialization failed:", error);
    process.exit(1);
  }
}

// Determine if this file is being run directly
const isDirectlyExecuted =
  process.argv[1] === __filename || process.argv[1]?.endsWith("/init-admin.ts");

// Execute if this file is run directly
if (isDirectlyExecuted) {
  initializeAdmin();
}

// Export for use in other modules
export { generateSalt, hashPassword, initializeAdmin };
