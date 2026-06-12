"use client";

import React, { useState } from "react";
import { HeartIcon, HandsIcon, LightbulbIcon, SproutIcon, EyeIcon } from "./icons";

export interface ReactionData {
  relate: number;
  alone: number;
  thank: number;
  help: number;
}

export interface CommentData {
  id: string;
  author: string; // e.g., "Compassionate Fox", "Kind Oak", etc.
  content: string;
  timeAgo: string;
}

export interface StoryProps {
  id: string;
  title: string;
  content: string;
  category: string;
  timeAgo: string;
  auraGradient: string; // e.g., "linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)"
  reactions: ReactionData;
  comments: CommentData[];
}

interface StoryCardProps {
  story: StoryProps;
  reactions?: ReactionData;
  activeReactions?: { [key: string]: boolean };
  onReactionClick?: (type: keyof ReactionData) => void;
  comments?: CommentData[];
  onAddComment?: (commentText: string) => void;
  onOpenDetails?: () => void;
}

export const StoryCard: React.FC<StoryCardProps> = ({
  story,
  reactions: propReactions,
  activeReactions: propActiveReactions,
  onReactionClick,
  comments: propComments,
  onAddComment,
  onOpenDetails,
}) => {
  const [localReactions, setLocalReactions] = useState<ReactionData>(story.reactions);
  const [localActiveReactions, setLocalActiveReactions] = useState<{ [key: string]: boolean }>({
    relate: false,
    alone: false,
    thank: false,
    help: false,
  });
  const [localComments, setLocalComments] = useState<CommentData[]>(story.comments);

  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  const reactions = propReactions ?? localReactions;
  const activeReactions = propActiveReactions ?? localActiveReactions;
  const commentsList = propComments ?? localComments;

  // Lists of adjectives and nouns to generate a random anonymous commenter name
  const adjectives = ["Warm", "Gentle", "Quiet", "Kind", "Calm", "Wise", "Brave", "Empathetic", "Listening"];
  const nouns = ["Soul", "Wave", "Panda", "River", "Sparrow", "Oak", "Star", "Flame", "Cloud", "Echo"];

  const generateAnonymousName = () => {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    return `${adj} ${noun}`;
  };

  const handleReactionClick = (type: keyof ReactionData) => {
    if (onReactionClick) {
      onReactionClick(type);
    } else {
      const isActive = localActiveReactions[type];
      setLocalActiveReactions((prev) => ({ ...prev, [type]: !isActive }));
      setLocalReactions((prev) => ({
        ...prev,
        [type]: isActive ? prev[type] - 1 : prev[type] + 1,
      }));
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    if (onAddComment) {
      onAddComment(commentText.trim());
      setCommentText("");
    } else {
      const newComment: CommentData = {
        id: Math.random().toString(36).substr(2, 9),
        author: generateAnonymousName(),
        content: commentText.trim(),
        timeAgo: "Just now",
      };
      setLocalComments((prev) => [...prev, newComment]);
      setCommentText("");
    }
  };

  return (
    <article
      onClick={() => onOpenDetails && onOpenDetails()}
      className={`glass-panel group relative flex flex-col rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-brand-indigo/5 hover:border-brand-indigo/20 dark:hover:bg-brand-indigo/[0.03] ${
        onOpenDetails ? "min-h-[350px] h-[350px] cursor-pointer" : "h-auto"
      }`}
    >
      {/* Upper row: Avatar aura & Category & Time */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* HSL Gradient aura avatar */}
          <div
            className="w-8 h-8 rounded-full shadow-inner relative overflow-hidden"
            style={{ background: story.auraGradient }}
          >
            <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]"></div>
          </div>
          <div>
            <span className="text-xs font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full bg-brand-indigo/10 text-brand-indigo dark:bg-brand-indigo/20 dark:text-brand-lavender">
              {story.category}
            </span>
          </div>
        </div>
        <span className="text-xs text-zinc-400 dark:text-zinc-500">{story.timeAgo}</span>
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-3 group-hover:text-brand-indigo dark:group-hover:text-brand-lavender transition-colors duration-300">
        {story.title}
      </h3>

      {/* Content */}
      <p
        className={`text-sm leading-relaxed text-zinc-650 dark:text-zinc-350 mb-4 whitespace-pre-wrap font-sans flex-1 ${
          onOpenDetails ? "line-clamp-4 overflow-hidden" : ""
        }`}
      >
        {story.content}
      </p>

      {/* Read More link */}
      {onOpenDetails && story.content.length > 180 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetails();
          }}
          className="text-xs font-bold text-brand-indigo dark:text-brand-lavender hover:underline self-start mb-4"
        >
          Read full story...
        </button>
      )}

      {/* Interaction Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
        {/* Empathy Reactions */}
        <div className="flex flex-wrap gap-2">
          {/* ❤️ I Relate */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleReactionClick("relate");
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
              activeReactions.relate
                ? "bg-rose-500/15 text-rose-500 scale-105"
                : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-white/5 dark:text-zinc-400 dark:hover:bg-white/10"
            }`}
          >
            <HeartIcon
              className={`transition-transform duration-300 ${activeReactions.relate ? "fill-rose-500 stroke-rose-500 scale-110" : ""}`}
            />
            <span>I Relate</span>
            <span className="font-semibold">{reactions.relate}</span>
          </button>

          {/* 🤝 You're Not Alone */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleReactionClick("alone");
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
              activeReactions.alone
                ? "bg-brand-lavender/15 text-brand-lavender scale-105"
                : "bg-zinc-100 text-zinc-505 hover:bg-zinc-200 dark:bg-white/5 dark:text-zinc-400 dark:hover:bg-white/10"
            }`}
          >
            <HandsIcon
              className={`transition-transform duration-300 ${activeReactions.alone ? "fill-brand-lavender stroke-brand-lavender scale-110" : ""}`}
            />
            <span>Not Alone</span>
            <span className="font-semibold">{reactions.alone}</span>
          </button>

          {/* 💡 Thank You */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleReactionClick("thank");
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
              activeReactions.thank
                ? "bg-amber-500/15 text-amber-500 scale-105"
                : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-white/5 dark:text-zinc-400 dark:hover:bg-white/10"
            }`}
          >
            <LightbulbIcon
              className={`transition-transform duration-300 ${activeReactions.thank ? "fill-amber-500/10 stroke-amber-500 scale-110" : ""}`}
            />
            <span>Thank You</span>
            <span className="font-semibold">{reactions.thank}</span>
          </button>

          {/* 🌱 This Helped Me */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleReactionClick("help");
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
              activeReactions.help
                ? "bg-brand-teal/15 text-brand-teal scale-105"
                : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-white/5 dark:text-zinc-400 dark:hover:bg-white/10"
            }`}
          >
            <SproutIcon
              className={`transition-transform duration-300 ${activeReactions.help ? "fill-brand-teal/10 stroke-brand-teal scale-110" : ""}`}
            />
            <span>Helped Me</span>
            <span className="font-semibold">{reactions.help}</span>
          </button>
        </div>

        {/* Comment Action Toggle */}
        <div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowComments(!showComments);
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-zinc-450 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/5 transition-all duration-300"
          >
            <EyeIcon size={16} />
            <span>Comments</span>
            <span className="px-1.5 py-0.5 rounded-md bg-zinc-200 dark:bg-zinc-800 text-[10px] text-zinc-600 dark:text-zinc-300 font-bold">
              {commentsList.length}
            </span>
          </button>
        </div>
      </div>

      {/* Expandable Comments Drawer */}
      {showComments && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="mt-5 pt-5 border-t border-zinc-100 dark:border-zinc-800 animate-fadeIn duration-300"
        >
          <h4 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-3">
            Anonymous Conversations ({commentsList.length})
          </h4>

          {/* Comment List */}
          {commentsList.length > 0 ? (
            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto pr-1">
              {commentsList.map((comment) => (
                <div key={comment.id} className="p-3 rounded-lg bg-zinc-50 dark:bg-white/[0.02] border border-zinc-100/50 dark:border-white/[0.02]">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold text-brand-indigo dark:text-brand-lavender">
                      {comment.author}
                    </span>
                    <span className="text-[10px] text-zinc-400">{comment.timeAgo}</span>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300">{comment.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs italic text-zinc-400 mb-4 dark:text-zinc-500">
              No responses yet. Share some support.
            </p>
          )}

          {/* Add Comment Form */}
          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a supportive response..."
              className="flex-1 px-3.5 py-2 text-xs rounded-lg border border-zinc-200 bg-white dark:bg-zinc-900/50 dark:border-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-brand-indigo"
            />
            <button
              type="submit"
              className="px-3.5 py-2 text-xs font-semibold text-white bg-brand-indigo rounded-lg hover:bg-brand-indigo/90 focus:outline-none focus:ring-2 focus:ring-brand-indigo focus:ring-offset-2 dark:focus:ring-offset-zinc-950 transition-colors"
            >
              Reply
            </button>
          </form>
        </div>
      )}
    </article>
  );
};
