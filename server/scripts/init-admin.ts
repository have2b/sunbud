import { sql } from "bun";

async function rolesExist(): Promise<boolean> {
  try {
    const result = await sql`SELECT COUNT(*) FROM roles`;
    return parseInt(result[0].count) > 0;
  } catch (error) {
    console.error("Error checking roles:", error);
    return false;
  }
}

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

async function initializeRoles(): Promise<void> {
  try {
    const hasRoles = await rolesExist();
    if (hasRoles) {
      console.log("Roles already exist, skipping role initialization");
      return;
    }

    await sql`
      INSERT INTO roles (name, description) VALUES
      ('admin', 'Administrator with full access')
    `;
    console.log("✅ Roles initialized successfully");
  } catch (error) {
    console.error("Error initializing roles:", error);
    throw error;
  }
}

async function createAdminUser(): Promise<void> {
  try {
    const hasAdmin = await adminExists();
    if (hasAdmin) {
      console.log("Admin user already exists, skipping admin creation");
      return;
    }

    const roleResult = await sql`SELECT id FROM roles WHERE name = 'admin'`;
    if (roleResult.length === 0) {
      throw new Error("Admin role not found");
    }
    const roleId = roleResult[0].id;

    const passwordHash = await Bun.password.hash(process.env.ADMIN_PASSWORD!);

    await sql`
      INSERT INTO users (
        role_id, username, email, password_hash, 
        first_name, last_name, created_at, metadata
      ) VALUES (
        ${roleId}, ${process.env.ADMIN_USERNAME!}, ${process.env
      .ADMIN_EMAIL!}, ${passwordHash}, 
        ${process.env.ADMIN_FIRST_NAME!}, ${process.env
      .ADMIN_LAST_NAME!}, NOW(), '{}'
      )
    `;
    console.log("✅ Admin user created successfully");
  } catch (error) {
    console.error("Error creating admin user:", error);
    throw error;
  }
}

async function initializeAdmin(): Promise<void> {
  try {
    await initializeRoles();

    const requiredEnvVars = [
      "ADMIN_USERNAME",
      "ADMIN_EMAIL",
      "ADMIN_PASSWORD",
      "ADMIN_FIRST_NAME",
      "ADMIN_LAST_NAME",
    ];

    const missingVars = requiredEnvVars.filter(
      (varName) => !process.env[varName]
    );

    if (missingVars.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missingVars.join(", ")}\n` +
          "Please set these in your .env file or deployment environment."
      );
    }

    if (process.env.ADMIN_PASSWORD!.length < 8) {
      throw new Error("ADMIN_PASSWORD must be at least 8 characters long");
    }

    await createAdminUser();
    console.log("✅ Admin initialization completed successfully");
  } catch (error) {
    console.error("❌ Admin initialization failed:", error);
    process.exit(1);
  }
}

const isDirectlyExecuted =
  process.argv[1] === __filename || process.argv[1]?.endsWith("/init-admin.ts");

if (isDirectlyExecuted) {
  initializeAdmin();
}

export { initializeAdmin };
