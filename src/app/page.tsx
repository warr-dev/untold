"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { LogoIcon, SunIcon, MoonIcon, QuoteIcon } from "../components/icons";
import { StoryCard, StoryProps } from "../components/story-card";

const INITIAL_STORIES: StoryProps[] = [
  {
    id: "1",
    authorId: "auth_1",
    title: "Why did the developer go broke?",
    tags: ["Jokes", "Random"],
    content: "Because he used up all his cache!\n\nSeriously though, I spent three hours debugging a production issue yesterday only to realize my browser was serving a cached version of the old script. Clear your caches, folks. It saves marriages.",
    timeAgo: "1 hour ago",
    auraGradient: "linear-gradient(135deg, #f59e0b 0%, #ec4899 100%)",
    upvotes: 142,
    comments: [
      { id: "c1", author: "Giggling Sparrow", content: "Certified cache classic. I do this at least once a month.", timeAgo: "45 mins ago" },
      { id: "c2", author: "Silly Star", content: "Caching is one of the two hardest problems in computer science... along with naming things and off-by-one errors.", timeAgo: "10 mins ago" }
    ]
  },
  {
    id: "2",
    authorId: "auth_2",
    title: "The Zoom Meeting Fiasco",
    tags: ["Funny Moments", "Random"],
    content: "I was in a very serious client pitch yesterday. I stood up to grab my water, completely forgetting I was wearing a formal shirt on top... and literal SpongeBob pajama bottoms.\n\nMy client stopped mid-sentence, stared, and said, 'Nice trousers, Bob.' My boss facepalmed so hard I heard it through the audio. We ended up winning the contract anyway, probably out of sheer pity.",
    timeAgo: "4 hours ago",
    auraGradient: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
    upvotes: 312,
    comments: [
      { id: "c3", author: "Cheering Wave", content: "Professionalism is overrated anyway. Spongebob pajamas seal the deal!", timeAgo: "3 hours ago" }
    ]
  },
  {
    id: "3",
    authorId: "auth_3",
    title: "The Promotion I Didn't Want",
    tags: ["Career", "Confessions"],
    content: "Last month, I was promoted to engineering director. Everyone celebrated. My parents called to say how proud they were, and my peers congratulated me on 'making it.'\n\nBut inside, I feel a suffocating weight. I loved writing code, fixing bugs, and collaborating on technical problems. Now, my days are filled with spreadsheets, political alignment meetings, and performance reviews. I go home feeling empty. I want to ask to step down, but the fear of professional embarrassment and looking like a failure is keeping me silent. So daily, I wear the mask of a successful leader.",
    timeAgo: "6 hours ago",
    auraGradient: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
    upvotes: 88,
    comments: [
      { id: "c4", author: "Empathetic Oak", content: "You're not a failure for knowing what makes you happy. Status isn't worth your daily joy.", timeAgo: "5 hours ago" }
    ]
  },
  {
    id: "4",
    authorId: "auth_4",
    title: "If we clean a vacuum cleaner...",
    tags: ["Shower Thoughts", "Random"],
    content: "If you clean a vacuum cleaner, do you become the vacuum cleaner?\n\nI was cleaning the dust filter on our Dyson this morning and this thought hit me. I've been staring at the wall for twenty minutes questioning the definitions of hygiene and agency.",
    timeAgo: "1 day ago",
    auraGradient: "linear-gradient(135deg, #ef4444 0%, #8b5cf6 100%)",
    upvotes: 189,
    comments: [
      { id: "c5", author: "Puzzled Panda", content: "You are the vacuum cleaner of vacuum cleaners. Mind blown.", timeAgo: "12 hours ago" }
    ]
  },
  {
    id: "5",
    authorId: "auth_5",
    title: "Learning to Breathe Again",
    tags: ["Mental Health", "Life Lessons"],
    content: "For three years, panic attacks governed my life. I couldn't go to grocery stores without mapping out the exits. Going to restaurants felt like running a gauntlet. I felt like a broken version of my former self, hiding it from colleagues and friends behind fake excuses.\n\nSix months of therapy and daily practice of sitting in discomfort changed my life. Today, I sat in a crowded coffee shop for an hour, alone, reading a book. No panic. Just the warmth of my cup and the sound of chatter. If you are in the thick of it right now, please know that healing isn't a straight line, but it is possible. Keep breathing.",
    timeAgo: "2 days ago",
    auraGradient: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
    upvotes: 245,
    comments: []
  }
];

export default function Home() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [followedAuthors, setFollowedAuthors] = useState<string[]>([]);

  useEffect(() => {
    // Default theme to dark mode
    document.documentElement.classList.add("dark");

    // Load followed authors on client mount
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("untold_followed_authors");
      if (saved) {
        try {
          setFollowedAuthors(JSON.parse(saved));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const toggleTheme = () => {
    if (theme === "dark") {
      document.documentElement.classList.remove("dark");
      setTheme("light");
    } else {
      document.documentElement.classList.add("dark");
      setTheme("dark");
    }
  };

  const handleFollowToggle = (authorId: string) => {
    setFollowedAuthors((prev) => {
      const updated = prev.includes(authorId)
        ? prev.filter((id) => id !== authorId)
        : [...prev, authorId];
      localStorage.setItem("untold_followed_authors", JSON.stringify(updated));
      return updated;
    });
  };

  // Find the top 3 stories with the most upvotes
  const highlightedStories = [...INITIAL_STORIES]
    .sort((a, b) => b.upvotes - a.upvotes)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background text-foreground bg-mesh-glow relative">
      {/* Decorative Blur Bulbs (Dark Mode Only) */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-brand-indigo/5 dark:bg-brand-indigo/10 rounded-full blur-[100px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute top-2/3 right-10 w-96 h-96 bg-brand-lavender/5 dark:bg-brand-lavender/8 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>

      {/* Header / Nav */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200/50 dark:border-white/5 bg-background/80 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LogoIcon className="text-brand-indigo dark:text-brand-lavender" />
            <span className="font-serif text-2xl font-bold tracking-tight bg-gradient-to-r from-brand-indigo via-brand-lavender to-brand-teal bg-clip-text text-transparent">
              Untold
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-500 dark:text-zinc-400">
            <Link href="/platform" className="hover:text-brand-indigo dark:hover:text-brand-lavender transition-colors">
              Sharing Hub
            </Link>
            <a href="#philosophy" className="hover:text-brand-indigo dark:hover:text-brand-lavender transition-colors">
              Philosophy
            </a>
            <a href="#guidelines" className="hover:text-brand-indigo dark:hover:text-brand-lavender transition-colors">
              Principles
            </a>
          </nav>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full border border-zinc-200 dark:border-white/5 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors text-zinc-500 dark:text-zinc-400"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <SunIcon size={18} /> : <MoonIcon size={18} />}
            </button>

            {/* CTA */}
            <Link
              href="/platform"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white bg-brand-indigo hover:bg-brand-indigo/90 shadow-md shadow-brand-indigo/10 hover:shadow-lg hover:shadow-brand-indigo/25 transition-all duration-350"
            >
              <span>Go to Platform</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 md:pt-32 md:pb-36 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          {/* Slogan pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-indigo/10 text-brand-indigo dark:bg-brand-indigo/20 dark:text-brand-lavender text-xs font-semibold tracking-wider uppercase mb-8 border border-brand-indigo/15 animate-float">
            <span>✦</span>
            <span>Anonymous Sharing Hub</span>
            <span>✦</span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight font-serif text-zinc-900 dark:text-zinc-50 mb-6 leading-tight max-w-2xl">
            Share anything{" "}
            <span className="italic font-normal bg-gradient-to-r from-brand-indigo via-brand-lavender to-brand-teal bg-clip-text text-transparent">
              fully anonymously
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-zinc-700 dark:text-zinc-300 max-w-2xl leading-relaxed mb-10">
            Publish your funny moments, jokes, shower thoughts, confessions, or silent victories. 
            Connect with others through supportive upvotes, follow anonymous authors, and enjoy genuine profile-free sharing.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-16 animate-fadeIn transition-all duration-300">
            <Link
              href="/platform?write=true"
              className="w-full sm:w-56 px-8 py-4 bg-brand-indigo hover:bg-brand-indigo/90 text-white rounded-xl font-bold text-center shadow-lg shadow-brand-indigo/20 hover:shadow-xl transition-all duration-300 flex items-center justify-center"
            >
              Share a Joke or Story
            </Link>
            <Link
              href="/platform"
              className="w-full sm:w-56 px-8 py-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10 rounded-xl font-bold text-center border border-zinc-200 dark:border-white/5 transition-all duration-300 flex items-center justify-center"
            >
              Enter Sharing Hub
            </Link>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 w-full max-w-3xl pt-10 border-t border-zinc-200/50 dark:border-white/5">
            {[
              { val: "No Profiles", desc: "No identity exposure" },
              { val: "Follow Auras", desc: "Subscribe to anonymous voices" },
              { val: "Supportive Upvotes", desc: "Show connection directly" },
              { val: "Pure Privacy", desc: "No cookies or trackers" }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-base font-bold text-zinc-900 dark:text-zinc-50">{stat.val}</span>
                <span className="text-xs text-zinc-400 dark:text-zinc-400 mt-1">{stat.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlighted Untold Stories Section */}
      {highlightedStories.length > 0 && (
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative group p-8 rounded-3xl border border-brand-indigo/20 bg-gradient-to-br from-brand-indigo/[0.03] to-brand-lavender/[0.01] dark:from-brand-indigo/[0.06] dark:to-brand-lavender/[0.02] shadow-xl shadow-brand-indigo/5 dark:shadow-brand-indigo/10 overflow-hidden">
            {/* Background large decorative quote mark */}
            <div className="absolute -right-6 -bottom-10 opacity-[0.03] dark:opacity-[0.05] pointer-events-none text-brand-indigo select-none">
              <QuoteIcon size={250} />
            </div>

            {/* Section Header */}
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-brand-teal animate-pulse"></span>
                <span className="text-[10px] font-extrabold tracking-widest text-brand-indigo dark:text-brand-lavender uppercase">
                  Trending Highlights — Top 3 Most Upvoted Posts
                </span>
              </div>
              <Link
                href="/platform"
                className="text-xs font-bold text-brand-indigo dark:text-brand-lavender hover:underline flex items-center gap-1"
              >
                <span>View All Posts</span>
                <span>→</span>
              </Link>
            </div>

            {/* Controlled Story Cards Grid */}
            <div className="grid md:grid-cols-3 gap-6 relative z-10">
              {highlightedStories.map((story, index) => (
                <div key={story.id} className="relative flex flex-col">
                  {/* Badge for Rank (1st, 2nd, 3rd) */}
                  <div className="absolute -top-3 -left-2 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-brand-indigo to-brand-lavender text-xs font-black text-white shadow-md">
                    {index + 1}
                  </div>
                  <StoryCard
                    story={story}
                    isFollowing={followedAuthors.includes(story.authorId)}
                    onFollowToggle={() => handleFollowToggle(story.authorId)}
                    onOpenDetails={() => {
                      if (typeof window !== "undefined") {
                        window.location.href = `/platform?storyId=${story.id}`;
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Philosophy Section */}
      <section id="philosophy" className="py-20 bg-zinc-50 dark:bg-black/20 border-y border-zinc-200/50 dark:border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold font-serif text-zinc-900 dark:text-zinc-50">
              A Different Way to Connect
            </h2>
            <p className="text-sm text-zinc-400 dark:text-zinc-505 mt-2">
              Most social platforms feed on metrics. Untold feeds on understanding and pure expression.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Traditional Social */}
            <div className="p-8 rounded-2xl border border-zinc-200 bg-white dark:bg-zinc-900/10 dark:border-zinc-800/50 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-widest block mb-4">
                  Traditional Social Platforms
                </span>
                <h3 className="text-2xl font-bold font-serif text-zinc-700 dark:text-zinc-400 mb-6">
                  &quot;Who are you?&quot;
                </h3>
                <ul className="space-y-4 text-zinc-505 text-sm">
                  <li className="flex items-start gap-2.5">
                    <span className="text-rose-500">✕</span>
                    <span>Identity-driven: Showcases highlights, popularity, and curated personas.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-rose-500">✕</span>
                    <span>Metric-focused: Follower counts, likes, and shares drive engagement anxiety.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-rose-500">✕</span>
                    <span>Prone to judgment: Comments often lead to arguments, harassment, and shame.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-rose-500">✕</span>
                    <span>Performative writing: Users share what gathers clicks, not what is real.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-6 border-t border-zinc-105 dark:border-zinc-800/50 text-xs italic text-zinc-400">
                Connection based on popularity and vanity.
              </div>
            </div>

            {/* Untold Way */}
            <div className="p-8 rounded-2xl border border-brand-indigo/20 bg-brand-indigo/[0.02] dark:bg-brand-indigo/[0.04] flex flex-col justify-between relative overflow-hidden group">
              {/* Highlight background light */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-indigo/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-500"></div>

              <div>
                <span className="text-xs font-bold text-brand-indigo dark:text-brand-lavender uppercase tracking-widest block mb-4">
                  The Untold Approach
                </span>
                <h3 className="text-2xl font-bold font-serif text-zinc-900 dark:text-zinc-50 mb-6">
                  &quot;What&apos;s your story?&quot;
                </h3>
                <ul className="space-y-4 text-zinc-750 dark:text-zinc-300 text-sm">
                  <li className="flex items-start gap-2.5">
                    <span className="text-brand-teal font-bold">✓</span>
                    <span>Pure Expression: Complete anonymity removes social masks and enables raw truth.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-brand-teal font-bold">✓</span>
                    <span>Upvote Connection: Simple, helpful voting shows community alignment and support.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-brand-teal font-bold">✓</span>
                    <span>Safe conversations: Anonymous, moderated comments focused on positive feedback.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-brand-teal font-bold">✓</span>
                    <span>Follow Auras: Follow specific anonymous writers by their aura code to read all their stories.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-6 border-t border-brand-indigo/10 text-xs italic text-brand-indigo dark:text-brand-lavender font-medium">
                Connection based on raw shared humanity and empathy.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Principles / Guidelines Section */}
      <section id="guidelines" className="py-20 bg-zinc-50 dark:bg-black/20 border-t border-zinc-200/50 dark:border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold font-serif text-zinc-900 dark:text-zinc-50">
              Our Guiding Principles
            </h2>
            <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-2">
              To keep Untold a safe, comforting space, we align under these core values.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Absolute Anonymity",
                desc: "We do not request names, handles, or emails. We actively filter identifiers to protect your personal life.",
                tag: "Protect"
              },
              {
                title: "Supportive Environment",
                desc: "Upvote funny moments, good jokes, and genuine stories. Keep comments helpful, clean, and positive.",
                tag: "Connect"
              },
              {
                title: "Safety & Dignity",
                desc: "Content showcasing harassment, toxic spam, target doxxing, or self-harm will be immediately moderated and removed.",
                tag: "Moderate"
              }
            ].map((principle, i) => (
              <div
                key={i}
                className="glass-panel p-6 rounded-2xl flex flex-col justify-between hover:-translate-y-1 transition-all duration-350"
              >
                <div>
                  <span className="text-[10px] font-bold text-brand-teal uppercase tracking-widest px-2 py-0.5 rounded bg-brand-teal/10 inline-block mb-4">
                    {principle.tag}
                  </span>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-2">
                    {principle.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                    {principle.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200/50 dark:border-white/5 bg-background transition-colors py-12 text-center text-xs text-zinc-505 dark:text-zinc-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <LogoIcon size={24} className="text-brand-indigo dark:text-brand-lavender" />
            <span className="font-serif text-lg font-bold tracking-tight bg-gradient-to-r from-brand-indigo via-brand-lavender to-brand-teal bg-clip-text text-transparent">
              Untold
            </span>
          </div>
          <p className="italic text-zinc-400 dark:text-zinc-505">
            &quot;Every untold story deserves a voice.&quot;
          </p>
          <div className="flex items-center gap-6 mt-2 text-zinc-500 dark:text-zinc-400">
            <Link href="/platform" className="hover:text-brand-indigo transition-colors">Stories</Link>
            <span>•</span>
            <a href="#philosophy" className="hover:text-brand-indigo transition-colors">Philosophy</a>
            <span>•</span>
            <a href="#guidelines" className="hover:text-brand-indigo transition-colors">Principles</a>
          </div>
          <p className="mt-6 text-[10px] text-zinc-400 dark:text-zinc-605">
            &copy; {new Date().getFullYear()} Untold. Created with privacy and empathy.
          </p>
        </div>
      </footer>
    </div>
  );
}
