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

const INITIAL_STORIES = [
  {
    id: "1",
    authorId: "auth_1",
    title: "Why did the developer go broke?",
    tags: ["Jokes", "Random"],
    content: "Because he used up all his cache!\n\nSeriously though, I spent three hours debugging a production issue yesterday only to realize my browser was serving a cached version of the old script. Clear your caches, folks. It saves marriages.",
    auraGradient: "linear-gradient(135deg, #f59e0b 0%, #ec4899 100%)",
    upvotes: 142,
    comments: [
      { id: "c1", author: "Giggling Sparrow", content: "Certified cache classic. I do this at least once a month." },
      { id: "c2", author: "Silly Star", content: "Caching is one of the two hardest problems in computer science... along with naming things and off-by-one errors." }
    ]
  },
  {
    id: "2",
    authorId: "auth_2",
    title: "The Zoom Meeting Fiasco",
    tags: ["Funny Moments", "Random"],
    content: "I was in a very serious client pitch yesterday. I stood up to grab my water, completely forgetting I was wearing a formal shirt on top... and literal SpongeBob pajama bottoms.\n\nMy client stopped mid-sentence, stared, and said, 'Nice trousers, Bob.' My boss facepalmed so hard I heard it through the audio. We ended up winning the contract anyway, probably out of sheer pity.",
    auraGradient: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
    upvotes: 312,
    comments: [
      { id: "c3", author: "Cheering Wave", content: "Professionalism is overrated anyway. Spongebob pajamas seal the deal!" }
    ]
  },
  {
    id: "3",
    authorId: "auth_3",
    title: "The Promotion I Didn't Want",
    tags: ["Career", "Confessions"],
    content: "Last month, I was promoted to engineering director. Everyone celebrated. My parents called to say how proud they were, and my peers congratulated me on 'making it.'\n\nBut inside, I feel a suffocating weight. I loved writing code, fixing bugs, and collaborating on technical problems. Now, my days are filled with spreadsheets, political alignment meetings, and performance reviews. I go home feeling empty. I want to ask to step down, but the fear of professional embarrassment and looking like a failure is keeping me silent. So daily, I wear the mask of a successful leader.",
    auraGradient: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
    upvotes: 88,
    comments: [
      { id: "c4", author: "Empathetic Oak", content: "You're not a failure for knowing what makes you happy. Status isn't worth your daily joy." }
    ]
  },
  {
    id: "4",
    authorId: "auth_4",
    title: "If we clean a vacuum cleaner...",
    tags: ["Shower Thoughts", "Random"],
    content: "If you clean a vacuum cleaner, do you become the vacuum cleaner?\n\nI was cleaning the dust filter on our Dyson this morning and this thought hit me. I've been staring at the wall for twenty minutes questioning the definitions of hygiene and agency.",
    auraGradient: "linear-gradient(135deg, #ef4444 0%, #8b5cf6 100%)",
    upvotes: 189,
    comments: [
      { id: "c5", author: "Puzzled Panda", content: "You are the vacuum cleaner of vacuum cleaners. Mind blown." }
    ]
  },
  {
    id: "5",
    authorId: "auth_5",
    title: "Learning to Breathe Again",
    tags: ["Mental Health", "Life Lessons"],
    content: "For three years, panic attacks governed my life. I couldn't go to grocery stores without mapping out the exits. Going to restaurants felt like running a gauntlet. I felt like a broken version of my former self, hiding it from colleagues and friends behind fake excuses.\n\nSix months of therapy and daily practice of sitting in discomfort changed my life. Today, I sat in a crowded coffee shop for an hour, alone, reading a book. No panic. Just the warmth of my cup and the sound of chatter. If you are in the thick of it right now, please know that healing isn't a straight line, but it is possible. Keep breathing.",
    auraGradient: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
    upvotes: 245,
    comments: []
  }
];

async function run() {
  console.log("🌱 Database seeding started...");
  try {
    // Clear existing stories & comments to ensure clean seed
    console.log("🧹 Clearing existing database data...");
    await sql`DELETE FROM comments`;
    await sql`DELETE FROM stories`;

    for (const story of INITIAL_STORIES) {
      console.log(`📝 Seeding story: "${story.title}"...`);
      await sql`
        INSERT INTO stories (id, author_id, title, content, tags, upvotes, aura_gradient)
        VALUES (${story.id}, ${story.authorId}, ${story.title}, ${story.content}, ${story.tags}, ${story.upvotes}, ${story.auraGradient})
      `;

      for (const comment of story.comments) {
        console.log(`   💬 Seeding comment from "${comment.author}"...`);
        await sql`
          INSERT INTO comments (id, story_id, author, content)
          VALUES (${comment.id}, ${story.id}, ${comment.author}, ${comment.content})
        `;
      }
    }

    console.log("✅ Database seeding completed successfully!");
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

run();
