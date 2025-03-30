To install dependencies:

```sh
bun install
```

To run:

```sh
bun run dev
```

open http://localhost:3000

# Admin Initialization

This directory contains utility scripts for the server, including the admin initialization script.

## Initializing an Admin User

The `init-admin.ts` script allows you to safely initialize an admin user in the database. This should be done after the database schema has been created.

### Prerequisites

- The database must be set up with the schema from `server/sql/init-schema.sql`
- The database connection must be configured in your `.env` file

### Usage

There are two ways to initialize an admin user:

#### 1. Interactive Method (Recommended for Development)

Run the following command:

```bash
npm run init-admin
# or
bun run init-admin
```

This will prompt you to enter:

- Username
- Email
- Password (minimum 8 characters)
- First Name
- Last Name

#### 2. Environment Variables Method (Recommended for Production/CI)

1. Set the following environment variables in your `.env` file or CI/CD pipeline:

```
ADMIN_USERNAME="admin"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="securepassword"
ADMIN_FIRST_NAME="Admin"
ADMIN_LAST_NAME="User"
```

2. Run the initialization script:

```bash
npm run init-admin
# or
bun run init-admin
```

### Security Notes

- The script checks if roles and admin users already exist to prevent duplicate creation
- Passwords are securely hashed using SHA-256 with a random salt
- The salt is stored in the user's metadata JSON field
- In production, consider using a more robust password hashing algorithm like Argon2 or bcrypt

### Integration with Database Reset

If you want to reset your database and initialize an admin user in one step, you can create a custom script that:

1. Resets the database using `reset/reset.ts`
2. Initializes the admin user using `utils/init-admin.ts`

Example:

```typescript
// server/scripts/setup-dev-db.ts
import { resetDatabase } from "../reset/reset";
import { initializeAdmin } from "../utils/init-admin";

async function setupDevDatabase() {
  try {
    // Reset database
    await resetDatabase();

    // Initialize admin
    await initializeAdmin();

    console.log("✅ Database setup completed successfully");
  } catch (error) {
    console.error("❌ Database setup failed:", error);
    process.exit(1);
  }
}

setupDevDatabase();
```
