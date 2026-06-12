import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.warn("⚠️ DATABASE_URL is not set. Untold will run in client-side mock data fallback mode.");
}

export const sql = databaseUrl ? neon(databaseUrl) : null;

// Function to initialize tables in the Neon PostgreSQL database
export async function initDatabase() {
  if (!sql) return false;

  try {
    // 1. Stories Table
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
    await sql`
      CREATE TABLE IF NOT EXISTS comments (
        id TEXT PRIMARY KEY,
        story_id TEXT NOT NULL,
        author TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // 3. Recoveries Table (stores hashed email/phone to recover authorIds anonymously)
    await sql`
      CREATE TABLE IF NOT EXISTS recoveries (
        contact_hash TEXT PRIMARY KEY,
        author_id TEXT UNIQUE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log("✅ Neon Database tables initialized successfully.");
    return true;
  } catch (error) {
    console.error("❌ Failed to initialize database tables:", error);
    return false;
  }
}
