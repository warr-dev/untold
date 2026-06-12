import type { Metadata } from "next";
import HomeClient from "./home-client";

export const metadata: Metadata = {
  title: "Untold — Share Stories, Jokes & Confessions Anonymously",
  description: "Every untold story deserves a voice. Untold is a privacy-first, fully anonymous sharing hub for developer jokes, funny moments, confessions, and life lessons without profiles, tracking, or judgment.",
  keywords: [
    "anonymous stories",
    "anonymous sharing",
    "developer jokes",
    "funny moments",
    "confessions",
    "privacy-first sharing",
    "profile-free social",
    "empathy feed",
    "life lessons",
    "safe space online"
  ],
  openGraph: {
    title: "Untold — Every untold story deserves a voice",
    description: "Share your real experiences, developer jokes, and life lessons completely anonymously without public profiles, follower lists, or likes anxiety.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Untold — Every untold story deserves a voice",
    description: "Profile-free anonymous sharing for genuine stories, jokes, and life confessions.",
  }
};

export default function Home() {
  return <HomeClient />;
}
