To install dependencies:

```sh
bun install
```

To run:

```sh
bun run dev
```

open http://localhost:5000

# Admin Initialization

This directory contains utility scripts for the server, including the admin initialization script.

## Initializing an Admin User

The `init-admin.ts` script allows you to safely initialize an admin user in the database. This should be done after the database schema has been created.

### Prerequisites

- The database must be set up with the schema from `server/sql/init-schema.sql`
- The database connection must be configured in your `.env` file
- Required environment variables must be set (see below)

### Usage

#### Environment Variables Method (Required)

1. Set the following **required** environment variables in your `.env` file or deployment environment:

```env
ADMIN_USERNAME="admin"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="securepassword"  # Must be at least 8 characters
ADMIN_FIRST_NAME="Admin"
ADMIN_LAST_NAME="User"
```
