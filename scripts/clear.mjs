import { neon } from "@neondatabase/serverless";
import fs from "fs";
import path from "path";

// Programmatic fallback parser for local env files if not set in process environment
function loadLocalEnv() {
  if (process.env.DATABASE_URL) return;
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const match = line.match(/^\s*DATABASE_URL\s*=\s*(.*)\s*$/);
      if (match) {
        process.env.DATABASE_URL = match[1].trim().replace(/(^['"]|['"]$)/g, "");
        console.log("ℹ️ Loaded DATABASE_URL from .env.local");
        break;
      }
    }
  }
}

loadLocalEnv();

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("❌ Error: DATABASE_URL environment variable is not defined.");
  process.exit(1);
}

const sql = neon(databaseUrl);

async function run() {
  console.log("🧹 Clearing all database tables...");
  try {
    await sql`DELETE FROM comments`;
    await sql`DELETE FROM stories`;
    await sql`DELETE FROM recoveries`;
    console.log("✅ All tables cleared successfully! The database is now completely empty.");
  } catch (err) {
    console.error("❌ Clear failed:", err);
    process.exit(1);
  }
}

run();
