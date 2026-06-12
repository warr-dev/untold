"use client";

import React, { useState } from "react";
import { ArrowUpIcon, EyeIcon } from "./icons";

export interface CommentData {
  id: string;
  author: string; // e.g., "Compassionate Fox", "Kind Oak", etc.
  content: string;
  timeAgo: string;
}

export interface StoryProps {
  id: string;
  authorId: string; // Persistent unique anonymous author ID
  title: string;
  content: string;
  tags: string[]; // e.g., ["Jokes", "Random", "Funny Moments"]
  timeAgo: string;
  auraGradient: string; // HSL gradient aura
  upvotes: number;
  comments: CommentData[];
}

interface StoryCardProps {
  story: StoryProps;
  upvotes?: number;
  hasUpvoted?: boolean;
  onUpvoteClick?: () => void;
  isFollowing?: boolean;
  onFollowToggle?: () => void;
  comments?: CommentData[];
  onAddComment?: (commentText: string) => void;
  onOpenDetails?: () => void;
}

export const StoryCard: React.FC<StoryCardProps> = ({
  story,
  upvotes: propUpvotes,
  hasUpvoted: propHasUpvoted,
  onUpvoteClick,
  isFollowing = false,
  onFollowToggle,
  comments: propComments,
  onAddComment,
  onOpenDetails,
}) => {
  const [localUpvotes, setLocalUpvotes] = useState<number>(story.upvotes);
  const [localHasUpvoted, setLocalHasUpvoted] = useState<boolean>(false);
  const [localComments, setLocalComments] = useState<CommentData[]>(story.comments);

  const [showComments, setShowComments] = useState(!onOpenDetails);
  const [commentText, setCommentText] = useState("");

  const upvotesCount = propUpvotes ?? localUpvotes;
  const isUpvoted = propHasUpvoted ?? localHasUpvoted;
  const commentsList = propComments ?? localComments;

  // Lists of adjectives and nouns to generate a random anonymous commenter name
  const adjectives = ["Warm", "Gentle", "Quiet", "Kind", "Calm", "Wise", "Brave", "Empathetic", "Listening"];
  const nouns = ["Soul", "Wave", "Panda", "River", "Sparrow", "Oak", "Star", "Flame", "Cloud", "Echo"];

  const generateAnonymousName = () => {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    return `${adj} ${noun}`;
  };

  const handleUpvoteClick = () => {
    if (onUpvoteClick) {
      onUpvoteClick();
    } else {
      const active = !localHasUpvoted;
      setLocalHasUpvoted(active);
      setLocalUpvotes((prev) => (active ? prev + 1 : prev - 1));
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
      {/* Upper row: Avatar aura & Tags row & Time / Follow */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* HSL Gradient aura avatar */}
          <div
            className="w-8 h-8 rounded-full shadow-inner relative overflow-hidden flex-shrink-0"
            style={{ background: story.auraGradient }}
          >
            <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]"></div>
          </div>
          {/* Tags pills flex wrapper */}
          <div className="flex flex-wrap gap-1">
            {story.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-bold tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-brand-indigo/10 text-brand-indigo dark:bg-brand-indigo/20 dark:text-brand-lavender whitespace-nowrap"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Time and Follow Action */}
        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
          <span className="text-xs text-zinc-400 dark:text-zinc-505">{story.timeAgo}</span>
          {onFollowToggle && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFollowToggle();
              }}
              className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md border transition-all duration-300 cursor-pointer ${
                isFollowing
                  ? "bg-brand-indigo/10 border-brand-indigo/30 text-brand-indigo dark:text-brand-lavender"
                  : "border-zinc-200 hover:bg-zinc-50 dark:border-white/5 dark:hover:bg-white/5 text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              }`}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>
          )}
        </div>
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
        {/* Simple Upvote Button */}
        <div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleUpvoteClick();
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
              isUpvoted
                ? "bg-brand-indigo text-white scale-105 shadow-md shadow-brand-indigo/20"
                : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-white/5 dark:text-zinc-400 dark:hover:bg-white/10"
            }`}
          >
            <ArrowUpIcon
              className={`transition-transform duration-300 ${
                isUpvoted ? "translate-y-[-1px] scale-110 stroke-[3px]" : ""
              }`}
              size={15}
            />
            <span>Upvote</span>
            <span className="font-extrabold">{upvotesCount}</span>
          </button>
        </div>

        {/* Comment Action Toggle */}
        <div>
          {onOpenDetails ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetails();
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-zinc-505 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/5 transition-all duration-300 cursor-pointer"
            >
              <EyeIcon size={16} />
              <span>Comments</span>
              <span className="px-1.5 py-0.5 rounded-md bg-zinc-200 dark:bg-zinc-800 text-[10px] text-zinc-650 dark:text-zinc-300 font-bold">
                {commentsList.length}
              </span>
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowComments(!showComments);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-zinc-505 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/5 transition-all duration-300 cursor-pointer"
            >
              <EyeIcon size={16} />
              <span>Comments</span>
              <span className="px-1.5 py-0.5 rounded-md bg-zinc-200 dark:bg-zinc-800 text-[10px] text-zinc-650 dark:text-zinc-300 font-bold">
                {commentsList.length}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Expandable Comments Drawer (Only rendered in detailed view) */}
      {!onOpenDetails && showComments && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="mt-5 pt-5 border-t border-zinc-100 dark:border-zinc-800 animate-fadeIn duration-300"
        >
          <h4 className="text-xs font-bold text-zinc-400 dark:text-zinc-505 uppercase tracking-wider mb-3">
            Anonymous Conversations ({commentsList.length})
          </h4>

          {/* Comment List */}
          {commentsList.length > 0 ? (
            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto pr-1">
              {commentsList.map((comment) => (
                <div key={comment.id} className="p-3 rounded-lg bg-zinc-55 dark:bg-white/[0.02] border border-zinc-100/50 dark:border-white/[0.02]">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold text-brand-indigo dark:text-brand-lavender">
                      {comment.author}
                    </span>
                    <span className="text-[10px] text-zinc-400">{comment.timeAgo}</span>
                  </div>
                  <p className="text-xs text-zinc-650 dark:text-zinc-305">{comment.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs italic text-zinc-400 mb-4 dark:text-zinc-505">
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
              className="flex-1 px-3.5 py-2 text-xs rounded-lg border border-zinc-200 bg-white dark:bg-zinc-900/50 dark:border-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-brand-indigo text-xs"
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
