// This file handles database migrations using Drizzle ORM
// It runs automatically in the Dockerfile before the service starts

// Load environment variables from .env file
import "dotenv/config";

// Import required Drizzle ORM and Postgres dependencies
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";

// Create a Postgres connection using the DATABASE_URL from environment variables
// The '!' asserts that DATABASE_URL is definitely defined
const pg = postgres(process.env.DATABASE_URL!);

// Initialize Drizzle ORM with our Postgres connection
const database = drizzle(pg);

async function main() {
  // Run all pending migrations from the migrations folder
  // The '..' points to the parent directory where migrations are stored
  await migrate(database, { migrationsFolder: ".." });

  // Close the database connection after migrations are complete
  await pg.end();
}

// Execute the migration process
main();
