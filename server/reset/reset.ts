import { sql } from "bun";
import { existsSync } from "node:fs";
import { isAbsolute, normalize, resolve } from "node:path";

interface ResetConfig {
  resetScriptPath: string;
  schemaScriptPath: string;
  verbose: boolean;
  timeout?: number; // Timeout in milliseconds
}

const DEFAULT_CONFIG: ResetConfig = {
  resetScriptPath: "./reset/reset-script.sql",
  schemaScriptPath: "./sql/init-schema.sql",
  verbose: true,
  timeout: 30000, // 30 seconds timeout
};

/**
 * Validates a file path to prevent path traversal attacks
 * @param filePath Path to validate
 * @returns Resolved safe path
 * @throws Error if path is invalid or file doesn't exist
 */
function validateFilePath(filePath: string): string {
  // Normalize and resolve the path
  const normalizedPath = normalize(filePath);
  const resolvedPath = isAbsolute(normalizedPath)
    ? normalizedPath
    : resolve(process.cwd(), normalizedPath);

  // Check if file exists
  if (!existsSync(resolvedPath)) {
    throw new Error(`SQL file not found: ${filePath}`);
  }

  return resolvedPath;
}

/**
 * Resets the database by executing SQL scripts
 * @param config Configuration options
 * @returns Promise that resolves when reset is complete
 */
async function resetDatabase(config: Partial<ResetConfig> = {}): Promise<void> {
  // Merge with default config
  const finalConfig: ResetConfig = { ...DEFAULT_CONFIG, ...config };
  const { resetScriptPath, schemaScriptPath, verbose, timeout } = finalConfig;

  // Validate file paths
  const validatedResetPath = validateFilePath(resetScriptPath);
  const validatedSchemaPath = validateFilePath(schemaScriptPath);

  // Start timing
  const startTime = performance.now();

  try {
    // Set timeout if specified
    const timeoutPromise = timeout
      ? new Promise<never>((_, reject) =>
          setTimeout(
            () =>
              reject(new Error(`Database reset timed out after ${timeout}ms`)),
            timeout
          )
        )
      : null;

    // Execute reset script with timeout if specified
    if (timeoutPromise) {
      await Promise.race([sql.file(validatedResetPath), timeoutPromise]);
    } else {
      await sql.file(validatedResetPath);
    }

    if (verbose) console.log("✓ Database schema reset");

    // Execute schema initialization script with timeout if specified
    if (timeoutPromise) {
      await Promise.race([sql.file(validatedSchemaPath), timeoutPromise]);
    } else {
      await sql.file(validatedSchemaPath);
    }

    const endTime = performance.now();
    const duration = (endTime - startTime).toFixed(2);

    if (verbose) {
      console.log("✓ Database schema initialized");
      console.log(`✓ Database reset completed in ${duration}ms`);
    }
  } catch (error) {
    const endTime = performance.now();
    const duration = (endTime - startTime).toFixed(2);

    console.error(`❌ Database reset failed after ${duration}ms`);

    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
      console.error(error.stack);
    } else {
      console.error(`Unknown error: ${error}`);
    }

    // Re-throw the error for the caller to handle
    throw error;
  }
}

/**
 * Main function to execute the database reset
 */
async function main() {
  try {
    // Check if we're in a production environment
    const isProduction = process.env.NODE_ENV === "production";

    // Add safety check for production environments
    if (isProduction) {
      const confirmation = process.env.FORCE_DB_RESET === "true";
      if (!confirmation) {
        console.error(
          "❌ Database reset aborted: Not allowed in production without FORCE_DB_RESET=true"
        );
        process.exit(1);
      }
      console.warn("⚠️ WARNING: Resetting database in PRODUCTION environment!");
    }

    await resetDatabase({
      verbose: process.env.VERBOSE !== "false",
      timeout: process.env.DB_RESET_TIMEOUT
        ? parseInt(process.env.DB_RESET_TIMEOUT)
        : undefined,
    });

    console.log("✅ Database reset successfully completed");
  } catch (error) {
    console.error("❌ Database reset failed");

    // Exit with error code
    process.exit(1);
  }
}

// Determine if this file is being run directly
const isDirectlyExecuted =
  process.argv[1] === __filename || process.argv[1]?.endsWith("/reset.ts");

// Execute if this file is run directly
if (isDirectlyExecuted) {
  main();
}

// Export for use in other modules
export { resetDatabase };
