# Untold

> Every untold story deserves a voice.

**Untold** is a privacy-first, fully anonymous sharing hub where stories matter more than identities. It provides a safe, distraction-free space for sharing funny moments, developer jokes, confessions, silent victories, and life lessons without exposing your personal identity.

---

## ✦ Brand Philosophy

Most social platforms ask: **"Who are you?"**  
Untold asks: **"What's your story?"**

We believe that sharing real experiences without the pressure of a personal brand, profile picture, or follower count leads to deeper empathy and cleaner connections.

---

## ✦ Core Features

- **Profile-Free Anonymity:** No user registration, passwords, or handles. Your voice is defined by a local unique author signature.
- **Dynamic Tag Filter & Tag Search:** Select from presets or type to create custom tags. Filter the story feed instantly using a searchable tags index.
- **Upvote Reactions:** Empathy over clicks. Support stories with a simple, helpful upvote button.
- **Anonymous Comments:** Participate in threads with automatically generated, comforting anonymous names (e.g., *Kind Panda*, *Wise Cloud*).
- **Subscribe to Voices (Aura Follows):** Follow specific anonymous authors by subscribing to their voice's unique color gradient aura, which populates your custom "Following Voices" feed.
- **Privacy-Preserving Recovery Bindings:** Secure your anonymous signature using an email or phone number. Details are processed server-side using SHA-256 hashes so that no plain text ever touches the database, allowing you to recover your writer profile if you switch devices or clear browser caches.
- **Neon Database Integration:** High-performance persistence layer using serverless PostgreSQL. The application auto-seeds standard mock data if initialized on a fresh database, and automatically falls back to full-featured client-side mocks and `localStorage` if database connection strings are absent.

---

## ✦ Technical Architecture

- **Framework:** Next.js 15 (App Router, React 19)
- **Styling:** Tailwind CSS v4 (incorporating glassmorphism, responsive grids, sleek dark mode transitions, and dynamic mesh glow animations)
- **Database:** Serverless PostgreSQL via `@neondatabase/serverless`
- **Security:** Node's native `crypto` module for server-side contact hashing (SHA-256)

---

## ✦ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) (v18+ recommended)
- A [Neon PostgreSQL](https://neon.tech) database (optional, will fall back to local mock state if not configured)

### Installation & Run

1. Clone or navigate to the repository:
   ```bash
   cd /home/war/projects/untold
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup environment variables:
   - Copy `.env.example` to `.env.local`
     ```bash
     cp .env.example .env.local
     ```
   - Add your Neon Database URL inside `.env.local`:
     ```env
     DATABASE_URL=postgresql://[user]:[password]@[host]/[database]?sslmode=require
     ```

4. Run database migrations, seed, or clear data (optional):
   ```bash
   npm run db:migrate  # Create tables
   npm run db:seed     # Seed standard mock stories & comments
   npm run db:clear    # Wipe all tables (to start with fresh, real data)
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## ✦ Project Structure

```
├── .env.example             # Template for local environment configuration
├── package.json             # NPM package declarations
├── plan.md                  # Project vision and roadmap
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Root layout configuration & font styles
│   │   ├── page.tsx         # Landing Editorial Gateway (Top 3 Upvoted Highlights)
│   │   ├── platform/
│   │   │   └── page.tsx     # Sharing Hub Feed (Search, filters, post flows)
│   │   └── actions.ts       # Server actions (Neon database transactions & hashing)
│   ├── components/
│   │   ├── icons.tsx        # Standardized inline SVG icons
│   │   ├── recovery-modal.tsx   # Bind/Restore anonymous signature interface
│   │   ├── share-story-modal.tsx# Submission card with dynamic Tagify-style editor
│   │   └── story-card.tsx   # Individual post presentation & comment drawer
│   └── lib/
│       └── db.ts            # Neon PostgreSQL connection setup & table initialization
```

---

## ✦ Deploying to Vercel

Untold is fully optimized for serverless Edge hosting on the Vercel platform.

### Step-by-Step Vercel Deployment

1. **Install Vercel CLI (if not already installed):**
   ```bash
   npm install -g vercel
   ```

2. **Link and deploy the project:**
   Run the following command in the project root:
   ```bash
   vercel
   ```
   Follow the prompts to log in and link the directory to your Vercel project.

3. **Configure the Database Environment Variable:**
   * Untold requires a **Neon Serverless PostgreSQL** database connection.
   * Add the `DATABASE_URL` environment variable using Vercel CLI:
     ```bash
     vercel env add DATABASE_URL production
     ```
     *(Paste your Neon database connection string when prompted)*
   * Alternatively, add `DATABASE_URL` directly in the Vercel Web Dashboard under **Project Settings > Environment Variables**.
   * **Note:** If `DATABASE_URL` is omitted, the application will automatically fall back to client-side mode, storing stories and comments in the user's `localStorage` and running fully profile-free/serverless.

4. **Automatic Database Migration:**
   * Once `DATABASE_URL` is set, you do not need to run manual migration scripts. 
   * Untold's serverless backend automatically initializes all required tables (`stories`, `comments`, `recoveries`, `tags`) on the first server-action request.

5. **Trigger a Production Release:**
   Redeploy the application so that Vercel builds the project with the active environment variable:
   ```bash
   vercel --prod
   ```

---

## ✦ Production Servicing (Self-Hosted)

To package and serve the application on standard self-hosted Node environments:
```bash
npm run build
npm run start
```
