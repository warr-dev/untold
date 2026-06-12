"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LogoIcon, SunIcon, MoonIcon, PlusIcon, CloseIcon, QuoteIcon } from "../../components/icons";
import { StoryCard, StoryProps } from "../../components/story-card";
import { ShareStoryModal } from "../../components/share-story-modal";
import { RecoveryModal } from "../../components/recovery-modal";
import { getStories, createStory, upvoteStory, addComment } from "../actions";

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

function getAuraGradient(authorId: string): string {
  if (!authorId) return "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)";
  let hash = 0;
  for (let i = 0; i < authorId.length; i++) {
    hash = authorId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h1 = Math.abs(hash) % 360;
  const h2 = (h1 + 140) % 360;
  return `linear-gradient(135deg, hsl(${h1}, 75%, 60%) 0%, hsl(${h2}, 85%, 50%) 100%)`;
}

function PlatformContent() {
  const [stories, setStories] = useState<StoryProps[]>(INITIAL_STORIES);
  const [activeUpvotes, setActiveUpvotes] = useState<{ [storyId: string]: boolean }>({});
  const [followedAuthors, setFollowedAuthors] = useState<string[]>([]);
  const [feedType, setFeedType] = useState<"all" | "following">("all");
  const [selectedTag, setSelectedTag] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [tagSearchQuery, setTagSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailedStoryId, setDetailedStoryId] = useState<string | null>(null);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [myAuthorId, setMyAuthorId] = useState("");

  // Recovery States
  const [isRecoveryModalOpen, setIsRecoveryModalOpen] = useState(false);
  const [isRecoveryBound, setIsRecoveryBound] = useState(false);
  const [maskedContact, setMaskedContact] = useState("");
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(myAuthorId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const searchParams = useSearchParams();

  // Load database stories on mount
  useEffect(() => {
    async function loadDbStories() {
      try {
        const dbStories = await getStories();
        if (dbStories !== null) {
          // If database is available but empty (new deployment), seed it with INITIAL_STORIES
          if (dbStories.length === 0) {
            for (const story of INITIAL_STORIES) {
              await createStory({
                id: story.id,
                authorId: story.authorId,
                title: story.title,
                content: story.content,
                tags: story.tags,
                auraGradient: story.auraGradient,
              });
              for (const comment of story.comments) {
                await addComment({
                  id: comment.id,
                  storyId: story.id,
                  author: comment.author,
                  content: comment.content,
                });
              }
            }
            const reFetched = await getStories();
            if (reFetched) {
              setStories(reFetched);
            }
          } else {
            setStories(dbStories);
          }
        }
      } catch (err) {
        console.error("Failed to load stories from Neon DB:", err);
      }
    }
    loadDbStories();
  }, []);

  // Check URL parameters and local storage on mount
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

    // Load local storage states
    if (typeof window !== "undefined") {
      // Followed authors
      const savedFollowed = localStorage.getItem("untold_followed_authors");
      if (savedFollowed) {
        try {
          setFollowedAuthors(JSON.parse(savedFollowed));
        } catch (e) {
          console.error(e);
        }
      }

      // My persistent author ID
      let savedAuthorId = localStorage.getItem("untold_my_author_id") || "";
      if (!savedAuthorId) {
        savedAuthorId = "author_" + Math.random().toString(36).substr(2, 9);
        localStorage.setItem("untold_my_author_id", savedAuthorId);
      }
      setMyAuthorId(savedAuthorId);

      // Recovery binding contact state
      const savedContact = localStorage.getItem("untold_recovery_contact");
      if (savedContact) {
        setIsRecoveryBound(true);
        if (savedContact.includes("@")) {
          const parts = savedContact.split("@");
          setMaskedContact(parts[0].slice(0, 2) + "***@" + parts[1]);
        } else {
          setMaskedContact(savedContact.slice(0, 3) + "*****" + savedContact.slice(-3));
        }
      }
    }
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

  const handleUpvote = async (storyId: string) => {
    const isCurrentlyUpvoted = !!activeUpvotes[storyId];

    setActiveUpvotes((prev) => ({
      ...prev,
      [storyId]: !isCurrentlyUpvoted,
    }));

    setStories((prev) =>
      prev.map((s) => {
        if (s.id === storyId) {
          return {
            ...s,
            upvotes: isCurrentlyUpvoted ? s.upvotes - 1 : s.upvotes + 1,
          };
        }
        return s;
      })
    );

    try {
      await upvoteStory(storyId, !isCurrentlyUpvoted);
    } catch (err) {
      console.error("Failed to update upvote in Neon DB:", err);
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

  const handleAddComment = async (storyId: string, commentText: string) => {
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

    try {
      await addComment({
        id: newComment.id,
        storyId,
        author: newComment.author,
        content: newComment.content,
      });
    } catch (err) {
      console.error("Failed to add comment to Neon DB:", err);
    }
  };

  const handleCreateStory = async (newStoryData: { title: string; content: string; tags: string[] }) => {
    const h1 = Math.floor(Math.random() * 360);
    const h2 = (h1 + 140) % 360;
    const auraGradient = `linear-gradient(135deg, hsl(${h1}, 75%, 60%) 0%, hsl(${h2}, 85%, 50%) 100%)`;

    const newStory: StoryProps = {
      id: Math.random().toString(36).substr(2, 9),
      authorId: myAuthorId || "author_temp",
      title: newStoryData.title,
      content: newStoryData.content,
      tags: newStoryData.tags,
      timeAgo: "Just now",
      auraGradient,
      upvotes: 0,
      comments: [],
    };

    setStories((prev) => [newStory, ...prev]);

    try {
      await createStory({
        id: newStory.id,
        authorId: newStory.authorId,
        title: newStory.title,
        content: newStory.content,
        tags: newStory.tags,
        auraGradient: newStory.auraGradient,
      });
    } catch (err) {
      console.error("Failed to save story to Neon DB:", err);
    }
  };

  // Compile unique tags dynamically from current stories feed state
  const dynamicTags = Array.from(new Set(stories.flatMap((s) => s.tags)));

  // Filter tags list based on tag search query
  const filteredTagsList = dynamicTags.filter((tag) =>
    tag.toLowerCase().includes(tagSearchQuery.toLowerCase())
  );

  // Filter & Search stories based on tags array selection and feed mode
  const filteredStories = stories.filter((story) => {
    // Feed Mode Filter
    if (feedType === "following" && !followedAuthors.includes(story.authorId)) {
      return false;
    }

    // Tag filter
    const matchesTag =
      selectedTag === "All" || story.tags.includes(selectedTag);

    // Keyword Search filter
    const matchesSearch =
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesTag && matchesSearch;
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
              placeholder="Search jokes, tags, funny moments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 text-xs rounded-xl border border-zinc-200 bg-zinc-55 dark:bg-zinc-900/50 dark:border-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-brand-indigo"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full border border-zinc-200 dark:border-white/5 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors text-zinc-500 dark:text-zinc-400 cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <SunIcon size={18} /> : <MoonIcon size={18} />}
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white bg-brand-indigo hover:bg-brand-indigo/90 shadow-md transition-all duration-300 cursor-pointer"
            >
              <PlusIcon size={16} />
              <span className="hidden sm:inline">Share Something</span>
            </button>

            {/* Profile Avatar / Voice Security Popover */}
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="w-9 h-9 rounded-full border border-zinc-200 dark:border-white/10 hover:border-brand-indigo dark:hover:border-brand-lavender p-0.5 transition-all duration-300 focus:outline-none flex-shrink-0 cursor-pointer flex items-center justify-center"
                title="Anonymous Profile"
              >
                <div
                  className="w-full h-full rounded-full shadow-inner relative overflow-hidden"
                  style={{ background: getAuraGradient(myAuthorId) }}
                >
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]"></div>
                </div>
              </button>

              {isProfileDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-3 w-80 rounded-2xl bg-white dark:bg-[#0c0b22] border border-zinc-200 dark:border-white/10 shadow-2xl p-5 z-50 animate-scaleIn select-none">
                    <div className="flex flex-col items-center text-center pb-4 border-b border-zinc-100 dark:border-white/5">
                      <div
                        className="w-14 h-14 rounded-full shadow-md relative overflow-hidden mb-2.5"
                        style={{ background: getAuraGradient(myAuthorId) }}
                      >
                        <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]"></div>
                      </div>
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                        Anonymous Voice
                      </h4>
                      <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">
                        Your unique aura signature
                      </p>
                    </div>

                    <div className="py-4 space-y-4">
                      {/* Author ID */}
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">
                          Writer Signature ID
                        </label>
                        <div className="flex gap-2 items-center">
                          <div className="flex-1 py-1.5 px-2.5 rounded-lg bg-zinc-55 dark:bg-zinc-900/50 dark:border-zinc-800 text-[10px] font-mono text-zinc-700 dark:text-zinc-300 break-all select-all text-left">
                            {myAuthorId}
                          </div>
                          <button
                            onClick={handleCopyId}
                            className="px-2.5 py-1.5 bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 rounded-lg text-[10px] font-bold border border-zinc-200 dark:border-white/5 transition-all cursor-pointer flex-shrink-0"
                          >
                            {copied ? "Copied" : "Copy"}
                          </button>
                        </div>
                      </div>

                      {/* Security Status */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                            Voice Security
                          </span>
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                              isRecoveryBound
                                ? "bg-brand-teal/15 text-brand-teal"
                                : "bg-amber-500/15 text-amber-500"
                            }`}
                          >
                            {isRecoveryBound ? "Secured" : "Vulnerable"}
                          </span>
                        </div>

                        {isRecoveryBound ? (
                          <div className="space-y-2">
                            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                              Your voice is bound to a secure recovery contact hash.
                            </p>
                            <div className="py-1.5 px-2.5 rounded-xl bg-brand-teal/5 text-brand-teal border border-brand-teal/10 text-[10px] font-mono text-center">
                              Bound to: {maskedContact}
                            </div>
                            <button
                              onClick={() => {
                                localStorage.removeItem("untold_recovery_contact");
                                localStorage.removeItem("untold_recovery_type");
                                setIsRecoveryBound(false);
                                setMaskedContact("");
                              }}
                              className="w-full text-center py-1.5 text-[10px] text-rose-500 hover:text-rose-600 hover:underline font-semibold transition-colors cursor-pointer"
                            >
                              Remove Recovery Binding
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                              Secure your voice signature to prevent losing your posts when clearing browser data.
                            </p>
                            <button
                              onClick={() => {
                                setIsProfileDropdownOpen(false);
                                setIsRecoveryModalOpen(true);
                              }}
                              className="w-full py-2 bg-brand-indigo hover:bg-brand-indigo/90 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer text-center"
                            >
                              Setup Recovery Contact
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-3 border-t border-zinc-100 dark:border-white/5 flex items-center justify-between text-[10px]">
                      <button
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          setIsRecoveryModalOpen(true);
                        }}
                        className="text-zinc-500 dark:text-zinc-400 hover:text-brand-indigo dark:hover:text-brand-lavender font-bold transition-colors cursor-pointer"
                      >
                        Restore Voice
                      </button>
                      
                      <button
                        onClick={() => {
                          if (confirm("This will generate a brand new anonymous writer signature. Continue?")) {
                            const newAuthorId = "author_" + Math.random().toString(36).substr(2, 9);
                            setMyAuthorId(newAuthorId);
                            localStorage.setItem("untold_my_author_id", newAuthorId);
                            localStorage.removeItem("untold_recovery_contact");
                            localStorage.removeItem("untold_recovery_type");
                            setIsRecoveryBound(false);
                            setMaskedContact("");
                            setIsProfileDropdownOpen(false);
                          }
                        }}
                        className="text-rose-550 dark:text-rose-450 hover:underline font-bold transition-colors cursor-pointer"
                      >
                        New Voice
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Column - Sidebar (Feed Mode, Tag selector & Guidelines) */}
        <aside className="w-full lg:w-64 flex flex-col gap-6 lg:sticky lg:top-24">
          {/* Mobile search */}
          <div className="w-full md:hidden">
            <input
              type="text"
              placeholder="Search jokes, tags, funny moments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 text-sm rounded-xl border border-zinc-200 bg-zinc-55 dark:bg-zinc-900/50 dark:border-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-brand-indigo"
            />
          </div>

          {/* Feed Mode panel */}
          <div className="glass-panel p-5 rounded-2xl w-full border border-zinc-200/60 dark:border-white/5">
            <h3 className="text-xs font-black tracking-wider uppercase text-zinc-400 dark:text-zinc-505 mb-3">
              Feed Mode
            </h3>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setFeedType("all");
                  setSelectedTag("All");
                }}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-300 text-left flex items-center justify-between cursor-pointer ${
                  feedType === "all"
                    ? "bg-brand-indigo text-white shadow-md shadow-brand-indigo/15 scale-102"
                    : "bg-zinc-100 hover:bg-zinc-205 text-zinc-550 dark:bg-white/5 dark:text-zinc-400 dark:hover:bg-white/10"
                }`}
              >
                <span>Public Feed</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] bg-black/10 dark:bg-white/10">
                  {stories.length}
                </span>
              </button>
              
              <button
                onClick={() => {
                  setFeedType("following");
                  setSelectedTag("All");
                }}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-300 text-left flex items-center justify-between cursor-pointer ${
                  feedType === "following"
                    ? "bg-brand-indigo text-white shadow-md shadow-brand-indigo/15 scale-102"
                    : "bg-zinc-100 hover:bg-zinc-205 text-zinc-550 dark:bg-white/5 dark:text-zinc-400 dark:hover:bg-white/10"
                }`}
              >
                <span>Following Voices</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] bg-black/10 dark:bg-white/10">
                  {followedAuthors.length}
                </span>
              </button>
            </div>
          </div>

          {/* Tags panel */}
          <div className="glass-panel p-5 rounded-2xl w-full border border-zinc-200/60 dark:border-white/5">
            <h3 className="text-xs font-black tracking-wider uppercase text-zinc-400 dark:text-zinc-550 mb-3">
              Filter by Tag
            </h3>
            
            {/* Tag search bar */}
            <div className="relative mb-3">
              <input
                type="text"
                value={tagSearchQuery}
                onChange={(e) => setTagSearchQuery(e.target.value)}
                placeholder="Search tags..."
                className="w-full px-3 py-1.5 text-[11px] rounded-lg border border-zinc-205 bg-zinc-55 dark:bg-zinc-900/50 dark:border-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-brand-indigo"
              />
              {tagSearchQuery && (
                <button
                  type="button"
                  onClick={() => setTagSearchQuery("")}
                  className="absolute right-2.5 top-2.5 text-[10px] text-zinc-450 hover:text-zinc-800 dark:text-zinc-500 dark:hover:text-zinc-200"
                >
                  ✕
                </button>
              )}
            </div>

            <nav className="flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-none max-h-60 lg:max-h-72 overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedTag("All")}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold text-left whitespace-nowrap transition-all duration-300 ${
                  selectedTag === "All"
                    ? "bg-brand-indigo text-white shadow-md shadow-brand-indigo/10"
                    : "bg-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/5"
                }`}
              >
                All
              </button>

              {filteredTagsList.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold text-left whitespace-nowrap transition-all duration-300 ${
                    selectedTag === tag
                      ? "bg-brand-indigo text-white shadow-md shadow-brand-indigo/10"
                      : "bg-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/5"
                  }`}
                >
                  {tag}
                </button>
              ))}

              {filteredTagsList.length === 0 && (
                <p className="text-[10px] italic text-zinc-400 dark:text-zinc-550 py-2">
                  No tags found
                </p>
              )}
            </nav>
          </div>



          {/* Guidelines Box */}
          <div className="glass-panel p-5 rounded-2xl w-full border border-zinc-200/60 dark:border-white/5 hidden lg:block">
            <h3 className="text-xs font-black tracking-wider uppercase text-zinc-400 dark:text-zinc-505 mb-3">
              Safety Code
            </h3>
            <ul className="text-[11px] text-zinc-505 dark:text-zinc-400 space-y-2.5">
              <li className="flex items-start gap-2">
                <span className="text-brand-teal font-bold">✓</span>
                <span>Fully anonymous. No handles, names, or tracking.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-teal font-bold">✓</span>
                <span>Add any custom tag or select presets when sharing.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-teal font-bold">✓</span>
                <span>Respect the community. Hateful content is deleted.</span>
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
                {feedType === "following" ? "Following Feed" : `${selectedTag} Posts`}
              </h2>
              {searchQuery && (
                <p className="text-xs text-zinc-405 mt-1">
                  Showing matches for &quot;{searchQuery}&quot;
                </p>
              )}
            </div>
            <span className="text-xs font-semibold text-zinc-405">
              {filteredStories.length} posts found
            </span>
          </div>

          {/* Stories Grid */}
          {filteredStories.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6 items-start">
              {filteredStories.map((story) => (
                <StoryCard
                  key={story.id}
                  story={story}
                  upvotes={story.upvotes}
                  hasUpvoted={!!activeUpvotes[story.id]}
                  onUpvoteClick={() => handleUpvote(story.id)}
                  isFollowing={followedAuthors.includes(story.authorId)}
                  onFollowToggle={() => handleFollowToggle(story.authorId)}
                  comments={story.comments}
                  onAddComment={(text) => handleAddComment(story.id, text)}
                  onOpenDetails={() => setDetailedStoryId(story.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 glass-panel rounded-2xl border border-zinc-200 dark:border-white/5 flex flex-col items-center justify-center p-8">
              <QuoteIcon className="text-zinc-200 dark:text-zinc-800 mb-4" size={48} />
              
              {feedType === "following" ? (
                <>
                  <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-200 mb-1">
                    Your Following Feed is empty
                  </h3>
                  <p className="text-xs text-zinc-550 dark:text-zinc-400 mb-6 max-w-sm leading-relaxed">
                    You aren't following any anonymous writers yet. Go to the **Public Feed** and click **Follow** on headers of stories you connect with to subscribe to their voice.
                  </p>
                  <button
                    onClick={() => setFeedType("all")}
                    className="px-5 py-2.5 bg-brand-indigo text-white rounded-xl text-xs font-bold hover:bg-brand-indigo/90 transition-colors cursor-pointer"
                  >
                    Go to Public Feed
                  </button>
                </>
              ) : (
                <>
                  <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-200 mb-1">
                    No matching posts
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-500 mb-6">
                    Be the first to share something with the tag &quot;{selectedTag}&quot;.
                  </p>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-5 py-2.5 bg-brand-indigo text-white rounded-xl text-xs font-bold hover:bg-brand-indigo/90 transition-colors"
                  >
                    Share Something
                  </button>
                </>
              )}
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

      {/* Recovery Modal */}
      <RecoveryModal
        isOpen={isRecoveryModalOpen}
        onClose={() => setIsRecoveryModalOpen(false)}
        currentAuthorId={myAuthorId}
        onBindSuccess={(contact) => {
          setIsRecoveryBound(true);
          if (contact.includes("@")) {
            const parts = contact.split("@");
            setMaskedContact(parts[0].slice(0, 2) + "***@" + parts[1]);
          } else {
            setMaskedContact(contact.slice(0, 3) + "*****" + contact.slice(-3));
          }
        }}
        onRestoreSuccess={(recoveredId) => {
          setMyAuthorId(recoveredId);
          localStorage.setItem("untold_my_author_id", recoveredId);
        }}
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
                  Post Details
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
                upvotes={detailedStory.upvotes}
                hasUpvoted={!!activeUpvotes[detailedStory.id]}
                onUpvoteClick={() => handleUpvote(detailedStory.id)}
                isFollowing={followedAuthors.includes(detailedStory.authorId)}
                onFollowToggle={() => handleFollowToggle(detailedStory.authorId)}
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
