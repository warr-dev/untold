import type { Metadata } from "next";
import PlatformClient from "./platform-client";

export const metadata: Metadata = {
  title: "Sharing Hub | Untold — Anonymous Story & Joke Feed",
  description: "Read, search, filter, and share anonymous developer jokes, funny moments, confessions, and life lessons. Subscribe to anonymous voices by their aura gradients and upvote your favorites.",
  keywords: [
    "anonymous stories feed",
    "anonymous jokes feed",
    "joke sharing board",
    "confession board",
    "anonymous comments",
    "aura subscription",
    "privacy-first feed",
    "read anonymous posts"
  ],
  openGraph: {
    title: "Sharing Hub | Untold — Anonymous Story & Joke Feed",
    description: "Read, search, filter, and share anonymous stories and jokes. Subscribe to anonymous voices by their unique aura gradients.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sharing Hub | Untold — Anonymous Feed",
    description: "Read and share anonymous jokes, confessions, and stories. Subscriptions and comments are 100% profile-free.",
  }
};

export default function PlatformPage() {
  return <PlatformClient />;
}
