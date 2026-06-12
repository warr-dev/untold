"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LogoIcon, SunIcon, MoonIcon, PlusIcon, CloseIcon, QuoteIcon } from "../../components/icons";
import { StoryCard, StoryProps, ReactionData } from "../../components/story-card";
import { ShareStoryModal } from "../../components/share-story-modal";

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
    timeAgo: "8 hours ago",
    auraGradient: "linear-gradient(135deg, #f59e0b 0%, #ec4899 100%)",
    reactions: { relate: 34, alone: 12, thank: 19, help: 24 },
    comments: [
      { id: "c4", author: "Brave Sparrow", content: "This is beautiful. Sometimes, rich lives require simpler means. Good luck with your art!", timeAgo: "6 hours ago" }
    ],
  },
  {
    id: "4",
    title: "The Secret I Can't Share with My Family",
    category: "Confessions",
    content: "My family holds very traditional, religious beliefs. They expect me to marry someone within our community, settle down in our hometown, and follow the paths they laid out. They talk about it at every dinner.\n\nBut I don't share their beliefs anymore. I live in a city three hours away. I have a life here that they would completely reject. I love them deeply, and I know that telling them the truth would break their hearts and potentially lead to estrangement. So I live a double life. Every visit home feels like acting in a play. I'm writing this here because the weight of keeping these two lives apart is growing heavier by the day.",
    timeAgo: "1 day ago",
    auraGradient: "linear-gradient(135deg, #ef4444 0%, #8b5cf6 100%)",
    reactions: { relate: 56, alone: 68, thank: 15, help: 9 },
    comments: [
      { id: "c5", author: "Wise Wave", content: "You are protecting your peace. That double life is hard, but your sanity is worth protecting.", timeAgo: "12 hours ago" }
    ],
  },
  {
    id: "5",
    title: "What My Father's Hands Taught Me",
    category: "Life Lessons",
    content: "My dad was a carpenter. His hands were always calloused, scarred, and stained with wood stain. As a teenager, I wanted a desk job. I wanted clean hands. I wanted status. I went to college and got an office job.\n\nHe passed away last summer. On my first week back at work, sitting in my air-conditioned cubicle staring at a screen, I looked at my soft, clean hands. I realized that my father built real, tangible shelters, tables, and toys that people loved and lived on. My digital reports would be forgotten in a week. I bought a small wood-turning lathe last month. I'm learning to make bowls. Holding the raw wood, I finally feel connected to him, and to what honest work really means.",
    timeAgo: "2 days ago",
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

function PlatformContent() {
  const [stories, setStories] = useState<StoryProps[]>(INITIAL_STORIES);
  const [activeReactions, setActiveReactions] = useState<{ [storyId: string]: { [key: string]: boolean } }>({});
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailedStoryId, setDetailedStoryId] = useState<string | null>(null);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const searchParams = useSearchParams();

  // Check URL parameters on mount
  useEffect(() => {
    const write = searchParams.get("write");
    if (write === "true") {
      setIsModalOpen(true);
    }
    const storyId = searchParams.get("storyId");
    if (storyId) {
      setDetailedStoryId(storyId);
    }

    // Default theme dark
    document.documentElement.classList.add("dark");
  }, [searchParams]);

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

    // Toggle
    setActiveReactions((prev) => ({
      ...prev,
      [storyId]: {
        ...storyActive,
        [type]: !isActive,
      },
    }));

    // Adjust count
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

  const handleCreateStory = (newStoryData: { title: string; content: string; category: string }) => {
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

  // Filter & Search stories
  const filteredStories = stories.filter((story) => {
    const matchesCategory =
      selectedCategory === "All" || story.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background text-foreground bg-mesh-glow relative flex flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-45 w-full border-b border-zinc-200/50 dark:border-white/5 bg-background/80 backdrop-blur-md transition-colors h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <a href="/" className="flex items-center gap-2">
              <LogoIcon className="text-brand-indigo dark:text-brand-lavender" />
              <span className="font-serif text-2xl font-bold tracking-tight bg-gradient-to-r from-brand-indigo via-brand-lavender to-brand-teal bg-clip-text text-transparent">
                Untold
              </span>
            </a>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded bg-zinc-200 text-zinc-700 dark:bg-white/5 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-wider">
              Sharing Hub
            </span>
          </div>

          {/* Search bar inside header */}
          <div className="flex-1 max-w-md hidden md:block">
            <input
              type="text"
              placeholder="Search untold stories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 text-xs rounded-xl border border-zinc-200 bg-zinc-50 dark:bg-zinc-900/50 dark:border-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-brand-indigo"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full border border-zinc-200 dark:border-white/5 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors text-zinc-500 dark:text-zinc-400"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <SunIcon size={18} /> : <MoonIcon size={18} />}
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white bg-brand-indigo hover:bg-brand-indigo/90 shadow-md transition-all duration-300"
            >
              <PlusIcon size={16} />
              <span className="hidden sm:inline">Write Story</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Column - Sidebar (Category selector & Guidelines) */}
        <aside className="w-full lg:w-64 flex flex-col gap-6 lg:sticky lg:top-24">
          {/* Mobile search */}
          <div className="w-full md:hidden">
            <input
              type="text"
              placeholder="Search untold stories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 text-sm rounded-xl border border-zinc-200 bg-zinc-50 dark:bg-zinc-900/50 dark:border-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-brand-indigo"
            />
          </div>

          {/* Categories panel */}
          <div className="glass-panel p-5 rounded-2xl w-full border border-zinc-200/60 dark:border-white/5">
            <h3 className="text-xs font-black tracking-wider uppercase text-zinc-400 dark:text-zinc-500 mb-4">
              Categories
            </h3>
            <nav className="flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-none">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold text-left whitespace-nowrap transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-brand-indigo text-white shadow-md shadow-brand-indigo/10"
                      : "bg-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/5"
                  }`}
                >
                  {category}
                </button>
              ))}
            </nav>
          </div>

          {/* Guidelines Box */}
          <div className="glass-panel p-5 rounded-2xl w-full border border-zinc-200/60 dark:border-white/5 hidden lg:block">
            <h3 className="text-xs font-black tracking-wider uppercase text-zinc-400 dark:text-zinc-500 mb-3">
              Safety Code
            </h3>
            <ul className="text-[11px] text-zinc-500 dark:text-zinc-400 space-y-2.5">
              <li className="flex items-start gap-2">
                <span className="text-brand-teal font-bold">✓</span>
                <span>No usernames or handles. Always stay fully anonymous.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-teal font-bold">✓</span>
                <span>Support and listen first. Abuse is removed instantly.</span>
              </li>
            </ul>
          </div>
        </aside>

        {/* Right Column - Feed Grid */}
        <section className="flex-1 w-full min-h-[500px]">
          {/* Feed Title Bar */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-200/50 dark:border-white/5">
            <div>
              <h2 className="text-lg font-bold font-serif text-zinc-900 dark:text-zinc-50">
                {selectedCategory} Stories
              </h2>
              {searchQuery && (
                <p className="text-xs text-zinc-400 mt-1">
                  Showing matches for &quot;{searchQuery}&quot;
                </p>
              )}
            </div>
            <span className="text-xs font-semibold text-zinc-400">
              {filteredStories.length} stories found
            </span>
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
                  onOpenDetails={() => setDetailedStoryId(story.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 glass-panel rounded-2xl border border-zinc-200 dark:border-white/5">
              <QuoteIcon className="mx-auto text-zinc-200 dark:text-zinc-800 mb-4" size={48} />
              <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-200 mb-1">
                No matching stories
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-500 mb-6">
                Be the first to share an anonymous story here.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-5 py-2.5 bg-brand-indigo text-white rounded-xl text-xs font-bold hover:bg-brand-indigo/90 transition-colors"
              >
                Share Story
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Story Submission Modal */}
      <ShareStoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateStory}
      />

      {/* Story Detail Modal */}
      {detailedStoryId && stories.find((s) => s.id === detailedStoryId) && (() => {
        const detailedStory = stories.find((s) => s.id === detailedStoryId)!;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
              onClick={() => setDetailedStoryId(null)}
            />

            {/* Modal Container */}
            <div className="glass-panel relative w-full max-w-2xl rounded-2xl bg-white dark:bg-[#0d0c24] p-6 shadow-2xl animate-scaleIn transition-all duration-300 border border-zinc-200 dark:border-white/10 max-h-[90vh] overflow-y-auto">
              {/* Header / Close button */}
              <div className="flex justify-between items-center pb-4 border-b border-zinc-150 dark:border-white/5 mb-6">
                <span className="text-xs font-extrabold tracking-widest text-brand-indigo dark:text-brand-lavender uppercase">
                  Story Details
                </span>
                <button
                  onClick={() => setDetailedStoryId(null)}
                  className="p-1 rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-white/5 dark:hover:text-zinc-200 transition-colors"
                >
                  <CloseIcon size={22} />
                </button>
              </div>

              {/* Controlled Story Card in details mode (no onOpenDetails prop) */}
              <StoryCard
                story={detailedStory}
                reactions={detailedStory.reactions}
                activeReactions={activeReactions[detailedStory.id]}
                onReactionClick={(type) => handleReaction(detailedStory.id, type)}
                comments={detailedStory.comments}
                onAddComment={(text) => handleAddComment(detailedStory.id, text)}
              />
            </div>
          </div>
        );
      })()}
    </div>
  );
}

export default function PlatformPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center bg-mesh-glow">
          <div className="flex items-center gap-3">
            <LogoIcon className="text-brand-indigo dark:text-brand-lavender animate-pulse" size={40} />
            <span className="font-serif text-2xl font-bold tracking-tight bg-gradient-to-r from-brand-indigo via-brand-lavender to-brand-teal bg-clip-text text-transparent">
              Loading Sharing Platform...
            </span>
          </div>
        </div>
      }
    >
      <PlatformContent />
    </Suspense>
  );
}
