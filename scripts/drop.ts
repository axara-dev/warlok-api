import { sql } from "drizzle-orm";
import { db } from "../src/database/db";

async function main() {
  console.log("Dropping public schema...");

  await db.execute(sql`DROP SCHEMA IF EXISTS public CASCADE`);
  await db.execute(sql`CREATE SCHEMA public`);

  console.log("Database dropped successfully.");
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
