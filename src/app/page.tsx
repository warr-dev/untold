"use client";

import React, { useState, useEffect } from "react";
import { LogoIcon, SunIcon, MoonIcon, PlusIcon, QuoteIcon } from "../components/icons";
import { StoryCard, StoryProps, ReactionData } from "../components/story-card";
import { ShareStoryModal } from "../components/share-story-modal";

const INITIAL_STORIES: StoryProps[] = [
  {
    id: "1",
    title: "The Promotion I Didn't Want",
    category: "Career",
    content: "Last month, I was promoted to engineering director. Everyone celebrated. My parents called to say how proud they were, and my peers congratulated me on 'making it.'\n\nBut inside, I feel a suffocating weight. I loved writing code, fixing bugs, and collaborating on technical problems. Now, my days are filled with spreadsheets, political alignment meetings, and performance reviews. I go home feeling empty. I want to ask to step down, but the fear of professional embarrassment and looking like a failure is keeping me silent. So daily, I wear the mask of a successful leader.",
    timeAgo: "2 hours ago",
    auraGradient: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
    reactions: { relate: 48, alone: 32, thank: 12, help: 5 },
    comments: [
      { id: "c1", author: "Empathetic Oak", content: "You're not a failure for knowing what makes you happy. Status isn't worth your daily joy.", timeAgo: "1 hour ago" },
      { id: "c2", author: "Quiet Flame", content: "I stepped down from a management role back to senior dev 2 years ago. Best decision of my life.", timeAgo: "45 mins ago" }
    ],
  },
  {
    id: "2",
    title: "Learning to Breathe Again",
    category: "Mental Health",
    content: "For three years, panic attacks governed my life. I couldn't go to grocery stores without mapping out the exits. Going to restaurants felt like running a gauntlet. I felt like a broken version of my former self, hiding it from colleagues and friends behind fake excuses.\n\nSix months of therapy and daily practice of sitting in discomfort changed my life. Today, I sat in a crowded coffee shop for an hour, alone, reading a book. No panic. Just the warmth of my cup and the sound of chatter. If you are in the thick of it right now, please know that healing isn't a straight line, but it is possible. Keep breathing.",
    timeAgo: "5 hours ago",
    auraGradient: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
    reactions: { relate: 89, alone: 74, thank: 45, help: 28 },
    comments: [
      { id: "c3", author: "Calm River", content: "Needed this today. Currently struggling with agoraphobia. Your success gives me hope.", timeAgo: "3 hours ago" }
    ],
  },
  {
    id: "3",
    title: "I Quit My Stable Job at 35 to Paint",
    category: "Success Stories",
    content: "I had a great corporate finance job. Nice salary, dental plan, and retirement matching. But every evening, I would stare at my blank canvas and feel a deep ache. At 35, single and without kids, I decided to take the leap. I resigned, rented a small studio, and committed to painting full-time.\n\nIt has been 8 months. I make less than half of my old salary, and I buy cheaper groceries. But when I wake up in the morning and smell the linseed oil, I feel an electric joy I haven't felt in fifteen years. I am poorer in my bank account, but infinitely richer in my soul. If there is a creative fire in you, don't let safety smother it completely.",
    timeAgo: "1 day ago",
    auraGradient: "linear-gradient(135deg, #f59e0b 0%, #ec4899 100%)",
    reactions: { relate: 34, alone: 12, thank: 19, help: 24 },
    comments: [
      { id: "c4", author: "Brave Sparrow", content: "This is beautiful. Sometimes, rich lives require simpler means. Good luck with your art!", timeAgo: "18 hours ago" }
    ],
  },
  {
    id: "4",
    title: "The Secret I Can't Share with My Family",
    category: "Confessions",
    content: "My family holds very traditional, religious beliefs. They expect me to marry someone within our community, settle down in our hometown, and follow the paths they laid out. They talk about it at every dinner.\n\nBut I don't share their beliefs anymore. I live in a city three hours away. I have a life here that they would completely reject. I love them deeply, and I know that telling them the truth would break their hearts and potentially lead to estrangement. So I live a double life. Every visit home feels like acting in a play. I'm writing this here because the weight of keeping these two lives apart is growing heavier by the day.",
    timeAgo: "2 days ago",
    auraGradient: "linear-gradient(135deg, #ef4444 0%, #8b5cf6 100%)",
    reactions: { relate: 56, alone: 68, thank: 15, help: 9 },
    comments: [
      { id: "c5", author: "Wise Wave", content: "You are protecting your peace. That double life is hard, but your sanity is worth protecting.", timeAgo: "1 day ago" },
      { id: "c6", author: "Kind Cloud", content: "You are not alone in this. Millions of us live in that liminal space. Big hug.", timeAgo: "12 hours ago" }
    ],
  },
  {
    id: "5",
    title: "What My Father's Hands Taught Me",
    category: "Life Lessons",
    content: "My dad was a carpenter. His hands were always calloused, scarred, and stained with wood stain. As a teenager, I wanted a desk job. I wanted clean hands. I wanted status. I went to college and got an office job.\n\nHe passed away last summer. On my first week back at work, sitting in my air-conditioned cubicle staring at a screen, I looked at my soft, clean hands. I realized that my father built real, tangible shelters, tables, and toys that people loved and lived on. My digital reports would be forgotten in a week. I bought a small wood-turning lathe last month. I'm learning to make bowls. Holding the raw wood, I finally feel connected to him, and to what honest work really means.",
    timeAgo: "3 days ago",
    auraGradient: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
    reactions: { relate: 112, alone: 43, thank: 88, help: 61 },
    comments: [],
  }
];

const CATEGORIES = [
  "All",
  "Life",
  "Relationships",
  "Career",
  "Family",
  "Education",
  "Mental Health",
  "Confessions",
  "Success Stories",
  "Failure Stories",
  "Life Lessons",
];

export default function Home() {
  const [stories, setStories] = useState<StoryProps[]>(INITIAL_STORIES);
  const [activeReactions, setActiveReactions] = useState<{ [storyId: string]: { [key: string]: boolean } }>({});
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    // Default theme to dark mode
    document.documentElement.classList.add("dark");
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

  const handleReaction = (storyId: string, type: keyof ReactionData) => {
    const storyActive = activeReactions[storyId] || {};
    const isActive = !!storyActive[type];

    // Toggle the active state
    setActiveReactions((prev) => ({
      ...prev,
      [storyId]: {
        ...storyActive,
        [type]: !isActive,
      },
    }));

    // Adjust the story reaction counts
    setStories((prev) =>
      prev.map((s) => {
        if (s.id === storyId) {
          return {
            ...s,
            reactions: {
              ...s.reactions,
              [type]: isActive ? s.reactions[type] - 1 : s.reactions[type] + 1,
            },
          };
        }
        return s;
      })
    );
  };

  const handleAddComment = (storyId: string, commentText: string) => {
    const adjectives = ["Warm", "Gentle", "Quiet", "Kind", "Calm", "Wise", "Brave", "Empathetic", "Listening"];
    const nouns = ["Soul", "Wave", "Panda", "River", "Sparrow", "Oak", "Star", "Flame", "Cloud", "Echo"];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const author = `${adj} ${noun}`;

    const newComment = {
      id: Math.random().toString(36).substr(2, 9),
      author,
      content: commentText,
      timeAgo: "Just now",
    };

    setStories((prev) =>
      prev.map((s) => {
        if (s.id === storyId) {
          return {
            ...s,
            comments: [...s.comments, newComment],
          };
        }
        return s;
      })
    );
  };

  // Find the story with the most reactions
  const highlightedStory = stories.reduce((maxStory, currentStory) => {
    const currentTotal = Object.values(currentStory.reactions).reduce((sum, val) => sum + val, 0);
    const maxTotal = Object.values(maxStory.reactions).reduce((sum, val) => sum + val, 0);
    return currentTotal > maxTotal ? currentStory : maxStory;
  }, stories[0]);

  const handleCreateStory = (newStoryData: { title: string; content: string; category: string }) => {
    // Generate a beautiful, unique HSL aura gradient
    const h1 = Math.floor(Math.random() * 360);
    const h2 = (h1 + 140) % 360;
    const auraGradient = `linear-gradient(135deg, hsl(${h1}, 75%, 60%) 0%, hsl(${h2}, 85%, 50%) 100%)`;

    const newStory: StoryProps = {
      id: Math.random().toString(36).substr(2, 9),
      title: newStoryData.title,
      content: newStoryData.content,
      category: newStoryData.category,
      timeAgo: "Just now",
      auraGradient,
      reactions: { relate: 0, alone: 0, thank: 0, help: 0 },
      comments: [],
    };

    setStories((prev) => [newStory, ...prev]);
  };

  // Filtered stories based on selection
  const filteredStories =
    selectedCategory === "All"
      ? stories
      : stories.filter((story) => story.category.toLowerCase() === selectedCategory.toLowerCase());

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
            <a href="#feed" className="hover:text-brand-indigo dark:hover:text-brand-lavender transition-colors">
              Stories
            </a>
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
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white bg-brand-indigo hover:bg-brand-indigo/90 shadow-md shadow-brand-indigo/10 hover:shadow-lg hover:shadow-brand-indigo/25 transition-all duration-350"
            >
              <PlusIcon size={16} />
              <span>Share Story</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 md:pt-32 md:pb-36 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          {/* Slogan pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-indigo/10 text-brand-indigo dark:bg-brand-indigo/20 dark:text-brand-lavender text-xs font-semibold tracking-wider uppercase mb-8 border border-brand-indigo/15 animate-float">
            <span>✦</span>
            <span>Anonymous Storytelling Platform</span>
            <span>✦</span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight font-serif text-zinc-900 dark:text-zinc-50 mb-6 leading-tight max-w-2xl">
            Every untold story{" "}
            <span className="italic font-normal bg-gradient-to-r from-brand-indigo via-brand-lavender to-brand-teal bg-clip-text text-transparent">
              deserves a voice
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-zinc-700 dark:text-zinc-300 max-w-2xl leading-relaxed mb-10">
            Share your raw struggles, silent victories, and lessons learned anonymously. 
            Connect with others through genuine empathy, free from judgment, profiles, and follower counts.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-16">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-56 px-8 py-4 bg-brand-indigo hover:bg-brand-indigo/90 text-white rounded-xl font-bold shadow-lg shadow-brand-indigo/20 hover:shadow-xl transition-all duration-300"
            >
              Share Your Story
            </button>
            <a
              href="#feed"
              className="w-full sm:w-56 px-8 py-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10 rounded-xl font-bold text-center border border-zinc-200 dark:border-white/5 transition-all duration-300"
            >
              Read Stories
            </a>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 w-full max-w-3xl pt-10 border-t border-zinc-200/50 dark:border-white/5">
            {[
              { val: "No Profiles", desc: "No identity exposure" },
              { val: "No Followers", desc: "Equal voice for everyone" },
              { val: "No Judgment", desc: "Supportive reactions only" },
              { val: "Pure Empathy", desc: "Read and listen first" }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-base font-bold text-zinc-900 dark:text-zinc-50">{stat.val}</span>
                <span className="text-xs text-zinc-400 dark:text-zinc-400 mt-1">{stat.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlighted Untold Story Section */}
      {highlightedStory && (
        <section className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative group p-8 rounded-3xl border border-brand-indigo/20 bg-gradient-to-br from-brand-indigo/[0.03] to-brand-lavender/[0.01] dark:from-brand-indigo/[0.06] dark:to-brand-lavender/[0.02] shadow-xl shadow-brand-indigo/5 dark:shadow-brand-indigo/10 overflow-hidden">
            {/* Background large decorative quote mark */}
            <div className="absolute -right-6 -bottom-10 opacity-[0.03] dark:opacity-[0.05] pointer-events-none text-brand-indigo select-none">
              <QuoteIcon size={250} />
            </div>

            {/* Section Header */}
            <div className="flex items-center gap-2 mb-6">
              <span className="inline-block w-2 h-2 rounded-full bg-brand-teal animate-pulse"></span>
              <span className="text-[10px] font-extrabold tracking-widest text-brand-indigo dark:text-brand-lavender uppercase">
                Current Highlight — Most Connected Story
              </span>
            </div>

            {/* Controlled Story Card */}
            <StoryCard
              story={highlightedStory}
              reactions={highlightedStory.reactions}
              activeReactions={activeReactions[highlightedStory.id]}
              onReactionClick={(type) => handleReaction(highlightedStory.id, type)}
              comments={highlightedStory.comments}
              onAddComment={(text) => handleAddComment(highlightedStory.id, text)}
            />
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
            <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-2">
              Most social platforms feed on metrics. Untold feeds on understanding.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* The Other Way */}
            <div className="p-8 rounded-2xl border border-zinc-200 bg-white dark:bg-zinc-900/10 dark:border-zinc-800/50 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block mb-4">
                  Traditional Social Platforms
                </span>
                <h3 className="text-2xl font-bold font-serif text-zinc-700 dark:text-zinc-400 mb-6">
                  &quot;Who are you?&quot;
                </h3>
                <ul className="space-y-4 text-zinc-500 text-sm">
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
              <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800/50 text-xs italic text-zinc-450">
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
                <ul className="space-y-4 text-zinc-700 dark:text-zinc-300 text-sm">
                  <li className="flex items-start gap-2.5">
                    <span className="text-brand-teal font-bold">✓</span>
                    <span>Story-driven: Complete anonymity removes social masks and enables raw truth.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-brand-teal font-bold">✓</span>
                    <span>Empathy-focused: Unique reactions express connection rather than ranking.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-brand-teal font-bold">✓</span>
                    <span>Safe conversations: Anonymous, moderated comments focused on support.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-brand-teal font-bold">✓</span>
                    <span>Valuable insights: Share failures, secrets, and triumphs to help others heal.</span>
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

      {/* Main Feed Section */}
      <section id="feed" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl font-bold font-serif text-zinc-900 dark:text-zinc-50">
              The Feed of Honesty
            </h2>
            <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-1">
              Read authentic, anonymous stories from all walks of life.
            </p>
          </div>

          {/* Quick share on feed */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-1.5 px-5 py-2.5 bg-brand-indigo hover:bg-brand-indigo/90 text-white rounded-xl text-sm font-bold shadow-lg shadow-brand-indigo/10 hover:shadow-xl transition-all"
          >
            <PlusIcon size={16} />
            <span>Write Your Story</span>
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 -mx-4 px-4 sm:-mx-0 sm:px-0 scrollbar-none">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                  : "bg-zinc-100 hover:bg-zinc-200 text-zinc-500 dark:bg-white/5 dark:text-zinc-400 dark:hover:bg-white/10"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Stories Grid */}
        {filteredStories.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6 items-start">
            {filteredStories.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                reactions={story.reactions}
                activeReactions={activeReactions[story.id]}
                onReactionClick={(type) => handleReaction(story.id, type)}
                comments={story.comments}
                onAddComment={(text) => handleAddComment(story.id, text)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 glass-panel rounded-2xl border border-zinc-200 dark:border-white/5">
            <QuoteIcon className="mx-auto text-zinc-200 dark:text-zinc-800 mb-4" size={48} />
            <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200 mb-1">
              No stories in this category yet
            </h3>
            <p className="text-sm text-zinc-400 dark:text-zinc-500 mb-6">
              Be the first to share your voice in {selectedCategory}.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2.5 bg-brand-indigo text-white rounded-xl text-xs font-bold hover:bg-brand-indigo/90 transition-colors"
            >
              Write First Story
            </button>
          </div>
        )}
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
                title: "Listening & Empathy",
                desc: "Read stories to understand, not to critique. Respond only with support, constructive comfort, or quiet presence.",
                tag: "Connect"
              },
              {
                title: "Safety & Dignity",
                desc: "Content showcasing harassment, toxicity, doxxing, or self-harm will be immediately moderated and removed.",
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
      <footer className="border-t border-zinc-200/50 dark:border-white/5 bg-background transition-colors py-12 text-center text-xs text-zinc-500 dark:text-zinc-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <LogoIcon size={24} className="text-brand-indigo dark:text-brand-lavender" />
            <span className="font-serif text-lg font-bold tracking-tight bg-gradient-to-r from-brand-indigo via-brand-lavender to-brand-teal bg-clip-text text-transparent">
              Untold
            </span>
          </div>
          <p className="italic text-zinc-400 dark:text-zinc-500">
            &quot;Every untold story deserves a voice.&quot;
          </p>
          <div className="flex items-center gap-6 mt-2 text-zinc-500 dark:text-zinc-400">
            <a href="#feed" className="hover:text-brand-indigo transition-colors">Stories</a>
            <span>•</span>
            <a href="#philosophy" className="hover:text-brand-indigo transition-colors">Philosophy</a>
            <span>•</span>
            <a href="#guidelines" className="hover:text-brand-indigo transition-colors">Principles</a>
          </div>
          <p className="mt-6 text-[10px] text-zinc-400 dark:text-zinc-600">
            &copy; {new Date().getFullYear()} Untold. Created with privacy and empathy.
          </p>
        </div>
      </footer>

      {/* Story Submission Modal */}
      <ShareStoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateStory}
      />
    </div>
  );
}
