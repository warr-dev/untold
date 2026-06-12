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
  console.log("🚀 Running database migrations...");
  try {
    // 1. Stories Table
    console.log("⚡ Creating 'stories' table...");
    await sql`
      CREATE TABLE IF NOT EXISTS stories (
        id TEXT PRIMARY KEY,
        author_id TEXT NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        tags TEXT[] NOT NULL,
        upvotes INTEGER DEFAULT 0,
        aura_gradient TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // 2. Comments Table
    console.log("⚡ Creating 'comments' table...");
    await sql`
      CREATE TABLE IF NOT EXISTS comments (
        id TEXT PRIMARY KEY,
        story_id TEXT NOT NULL,
        author TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // 3. Recoveries Table
    console.log("⚡ Creating 'recoveries' table...");
    await sql`
      CREATE TABLE IF NOT EXISTS recoveries (
        contact_hash TEXT PRIMARY KEY,
        author_id TEXT UNIQUE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log("✅ Database migrations completed successfully!");
  } catch (err) {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  }
}

run();
