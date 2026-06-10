"use client";

import React, { useState, useEffect } from "react";
import { CloseIcon } from "./icons";
import { StoryProps } from "./story-card";

interface ShareStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newStory: Omit<StoryProps, "id" | "timeAgo" | "auraGradient" | "reactions" | "comments">) => void;
}

const CATEGORIES = [
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

export const ShareStoryModal: React.FC<ShareStoryModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");

  const maxChars = 1500;

  useEffect(() => {
    // Disable body scrolling when modal is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Please write a title for your story.");
      return;
    }
    if (!content.trim() || content.length < 50) {
      setError("Please write a story containing at least 50 characters.");
      return;
    }
    if (!agreed) {
      setError("You must agree to write with respect and honesty.");
      return;
    }

    onSubmit({
      title: title.trim(),
      content: content.trim(),
      category,
    });

    // Reset fields
    setTitle("");
    setContent("");
    setCategory(CATEGORIES[0]);
    setAgreed(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="glass-panel relative w-full max-w-2xl rounded-2xl bg-white dark:bg-[#0d0c24] p-6 shadow-2xl animate-scaleIn transition-all duration-300 border border-zinc-200 dark:border-white/10 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-150 dark:border-white/5 mb-6">
          <div>
            <h2 className="text-2xl font-bold font-serif text-zinc-900 dark:text-zinc-50">
              Share Your Untold Story
            </h2>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
              Your identity remains completely hidden. Only the story matters.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-white/5 dark:hover:text-zinc-200 transition-colors"
          >
            <CloseIcon size={22} />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3.5 text-xs font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950/20 dark:text-rose-400 rounded-lg border border-rose-100 dark:border-rose-950/30">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your experience a name..."
              maxLength={80}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 dark:bg-zinc-900/50 dark:border-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-brand-indigo focus:border-brand-indigo text-sm"
              required
            />
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 dark:bg-zinc-900/50 dark:border-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-brand-indigo text-sm appearance-none cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="dark:bg-zinc-950">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Story Content */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Story Content
              </label>
              <span className={`text-xs ${content.length > maxChars * 0.9 ? "text-rose-500" : "text-zinc-400"}`}>
                {content.length}/{maxChars}
              </span>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value.slice(0, maxChars))}
              placeholder="What experience, lesson, confession, or battle would you like to speak about? Be authentic, stay anonymous..."
              rows={8}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 dark:bg-zinc-900/50 dark:border-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-brand-indigo text-sm leading-relaxed"
              required
            />
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-1">
              Minimum 50 characters. Write with details, lessons, or feelings.
            </p>
          </div>

          {/* Guidelines & Safety Agreement */}
          <div className="p-4 rounded-xl bg-brand-indigo/5 border border-brand-indigo/10 dark:bg-brand-indigo/10 dark:border-brand-indigo/20">
            <h4 className="text-xs font-bold text-brand-indigo dark:text-brand-lavender uppercase tracking-wider mb-2">
              Untold Community Code
            </h4>
            <ul className="text-xs text-zinc-600 dark:text-zinc-300 space-y-1.5 list-disc list-inside">
              <li>Keep it respectful: Do not post hate speech, spam, or target individuals.</li>
              <li>Keep it real: Share your authentic truths and lessons learned.</li>
              <li>Keep it anonymous: Do not include real names, phone numbers, or social handles.</li>
            </ul>
            <div className="mt-4 flex items-start gap-3">
              <input
                type="checkbox"
                id="agreement-checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 rounded border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-brand-indigo focus:ring-brand-indigo cursor-pointer h-4 w-4"
              />
              <label htmlFor="agreement-checkbox" className="text-xs text-zinc-600 dark:text-zinc-300 cursor-pointer select-none">
                I agree to share my story with empathy and respect. I understand that hate speech or target harassment will be removed.
              </label>
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex justify-end gap-3 pt-3 border-t border-zinc-150 dark:border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-sm font-semibold text-zinc-700 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!agreed}
              className="px-6 py-2.5 rounded-xl bg-brand-indigo hover:bg-brand-indigo/90 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold text-white shadow-lg shadow-brand-indigo/20 transition-all duration-300 hover:shadow-xl"
            >
              Publish Anonymously
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
