"use server";

import crypto from "crypto";
import { sql, initDatabase } from "../lib/db";
import { StoryProps, CommentData } from "../components/story-card";

// Helper to hash recovery contact details server-side
function hashContact(contact: string): string {
  return crypto.createHash("sha256").update(contact.trim().toLowerCase()).digest("hex");
}

// Ensure DB is initialized (helper called by database data fetchers)
let isDbReady = false;
async function ensureDb() {
  if (!isDbReady && sql) {
    isDbReady = await initDatabase();
  }
}

// Fetch all stories and their associated comments from Neon
export async function getStories(): Promise<StoryProps[] | null> {
  if (!sql) return null;

  try {
    await ensureDb();

    // 1. Get stories
    const dbStories = await sql`
      SELECT id, author_id as "authorId", title, content, tags, upvotes, aura_gradient as "auraGradient", created_at as "createdAt"
      FROM stories
      ORDER BY created_at DESC
    `;

    if (dbStories.length === 0) return [];

    // 2. Get comments
    const dbComments = await sql`
      SELECT id, story_id as "storyId", author, content, created_at as "createdAt"
      FROM comments
      ORDER BY created_at ASC
    `;

    // Map comments by storyId
    const commentsByStory: { [storyId: string]: CommentData[] } = {};
    dbComments.forEach((c: any) => {
      const storyId = c.storyId;
      if (!commentsByStory[storyId]) {
        commentsByStory[storyId] = [];
      }
      commentsByStory[storyId].push({
        id: c.id,
        author: c.author,
        content: c.content,
        timeAgo: "Just now", // In a real app, calculate relative time
      });
    });

    // Construct return stories list
    return dbStories.map((s: any) => ({
      id: s.id,
      authorId: s.authorId,
      title: s.title,
      content: s.content,
      tags: s.tags || [],
      timeAgo: "Just now", // Calculate relative time in real app
      auraGradient: s.auraGradient,
      upvotes: s.upvotes || 0,
      comments: commentsByStory[s.id] || [],
    }));
  } catch (error) {
    console.error("❌ Failed to fetch stories from DB:", error);
    return null;
  }
}

// Insert a new anonymous story
export async function createStory(story: {
  id: string;
  authorId: string;
  title: string;
  content: string;
  tags: string[];
  auraGradient: string;
}): Promise<boolean> {
  if (!sql) return false;

  try {
    await ensureDb();
    await sql`
      INSERT INTO stories (id, author_id, title, content, tags, upvotes, aura_gradient)
      VALUES (${story.id}, ${story.authorId}, ${story.title}, ${story.content}, ${story.tags}, 0, ${story.auraGradient})
    `;
    return true;
  } catch (error) {
    console.error("❌ Failed to insert story into DB:", error);
    return false;
  }
}

// Handle dynamic upvotes
export async function upvoteStory(storyId: string, isIncrement: boolean): Promise<boolean> {
  if (!sql) return false;

  try {
    await ensureDb();
    const amount = isIncrement ? 1 : -1;
    await sql`
      UPDATE stories
      SET upvotes = upvotes + ${amount}
      WHERE id = ${storyId}
    `;
    return true;
  } catch (error) {
    console.error("❌ Failed to update upvote in DB:", error);
    return false;
  }
}

// Insert an anonymous comment
export async function addComment(comment: {
  id: string;
  storyId: string;
  author: string;
  content: string;
}): Promise<boolean> {
  if (!sql) return false;

  try {
    await ensureDb();
    await sql`
      INSERT INTO comments (id, story_id, author, content)
      VALUES (${comment.id}, ${comment.storyId}, ${comment.author}, ${comment.content})
    `;
    return true;
  } catch (error) {
    console.error("❌ Failed to insert comment into DB:", error);
    return false;
  }
}

// Bind anonymous account to email/phone contact (hashed on the server)
export async function bindRecovery(contact: string, authorId: string): Promise<boolean> {
  if (!sql) return false;

  try {
    await ensureDb();
    const contactHash = hashContact(contact);
    await sql`
      INSERT INTO recoveries (contact_hash, author_id)
      VALUES (${contactHash}, ${authorId})
      ON CONFLICT (contact_hash) DO UPDATE SET author_id = EXCLUDED.author_id
    `;
    return true;
  } catch (error) {
    console.error("❌ Failed to bind recovery in DB:", error);
    return false;
  }
}

// Restore account using email/phone contact (hashed on the server to match DB hash)
export async function restoreRecovery(contact: string): Promise<string | null> {
  if (!sql) return null;

  try {
    await ensureDb();
    const contactHash = hashContact(contact);
    const result = await sql`
      SELECT author_id as "authorId"
      FROM recoveries
      WHERE contact_hash = ${contactHash}
    `;
    if (result.length > 0) {
      return result[0].authorId;
    }
    return null;
  } catch (error) {
    console.error("❌ Failed to restore recovery from DB:", error);
    return null;
  }
}
