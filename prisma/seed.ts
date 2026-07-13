// Seeds the database with the ventures/jobs that used to be hardcoded in
// components/sections/VentureShowcase.tsx and components/careers/JobList.tsx.
// Safe to re-run: existing rows (matched by slug) are left untouched.
//
// Usage: npm run seed   (requires DATABASE_URL in the environment or .env)
import "dotenv/config";
import { prisma } from "../lib/prisma";
import { estimateReadMinutes } from "../lib/data/stories";

const projects = [
  {
    slug: "banglareels",
    name: "BanglaReels",
    tagline: "Short-form streaming for the Bangla-speaking world",
    description:
      "A vertical micro-drama platform built for how 300 million people actually watch — serialized stories, episode by episode, in their own language.",
    status: "In development",
    features: ["Vertical serials", "Episode unlocks", "Creator tooling", "Offline-first"],
    accent: "#e11d48",
    sortOrder: 1,
  },
  {
    slug: "danumai-studios",
    name: "Danumai Studios",
    tagline: "Original stories, produced in-house",
    description:
      "The content engine behind our platforms. We write, produce, and own the serials we stream — no licensing, no middlemen, full creative control.",
    status: "In development",
    features: ["Writers' room", "Vertical-first production", "Owned IP", "Fast cycles"],
    accent: "#7c3aed",
    sortOrder: 2,
  },
  {
    slug: "care-technology",
    name: "Care Technology",
    tagline: "Software for the people who look after people",
    description:
      "Tools that give caregivers time back — scheduling, coordination, and communication built around the realities of care work, not around billing codes.",
    status: "Research",
    features: ["Shift coordination", "Family updates", "Care logs", "Gentle reminders"],
    accent: "#0d9488",
    sortOrder: 3,
  },
  {
    slug: "ad-network",
    name: "Ad Network",
    tagline: "Monetization infrastructure for vertical streaming",
    description:
      "The ad layer connecting BanglaReels and our other platforms to advertisers — targeting, delivery, and measurement built for vertical video from the ground up, not repurposed from display.",
    status: "Research",
    features: ["Vertical video ad units", "Regional targeting", "Advertiser dashboard", "Real-time measurement"],
    accent: "#2563eb",
    imageUrl: "/projects/ad-network-cover.png",
    sortOrder: 4,
  },
];

const stories = [
  {
    slug: "banglareels-launches-july-20",
    title: "BanglaReels launches July 20",
    subtitle: "Vertical serials for the Bangla-speaking world, live in two weeks",
    category: "Launch",
    excerpt:
      "BanglaReels opens to viewers on July 20 — the first vertical micro-drama platform built ground-up for how 300 million Bangla speakers actually watch.",
    body:
      "BanglaReels launches on July 20, bringing serialized, episode-by-episode vertical drama to the Bangla-speaking world. Built in-house by Danumai Labs, the platform is designed around how people already watch on their phones — short episodes, fast unlocks, and an offline-first experience for patchy connections.\n\nThis is the first release from Danumai Inc.'s house of ventures: content produced by Danumai Studios, distributed on infrastructure we own and operate ourselves.",
    accent: "#e11d48",
    published: true,
    publishedAt: "2026-07-20T00:00:00.000Z",
    sortOrder: 1,
  },
];

// Every role is onsite in Niketon, Dhaka (remote is not possible) and full-time.
// Location, salary, and type render as icon chips on the careers page, so they
// stay out of the summary prose. Perks are shared across roles — edit per role
// from the admin panel.
const perks = ["2× festival bonus", "Lunch provided", "Device provided"];

const jobs = [
  {
    slug: "senior-react-native-engineer",
    title: "Senior React Native Engineer — Video & Performance",
    team: "Danumai Labs",
    location: "Niketon, Dhaka · Onsite",
    type: "Full-time",
    salary: "BDT 50,000/mo",
    summary:
      "Own the video player and episode feed for our short-drama app — where viewers watch a short ad to unlock the next episode — and make it run smoothly on every phone.",
    points: [
      "3+ years of React Native, with production apps live on the Play Store / App Store",
      "Strong JavaScript/TypeScript and React fundamentals — hooks, rendering, state",
      "Hands-on video playback in React Native (react-native-video / ExoPlayer): preloading, caching, smooth feeds",
      "Proven performance work on low-end Android — startup, scrolling, memory, frame rate (FlatList/FlashList, Hermes, profiling)",
      "Integrate rewarded video ad SDKs (AdMob / AppLovin) into the watch-ad → unlock-episode flow",
      "Guide and review the work of our mid-level React Native engineers",
      "Nice to have: ad SDK integration, Reanimated, Expo/EAS, mobile CI",
    ],
    perks,
    sortOrder: 1,
  },
  {
    slug: "backend-engineer-nestjs",
    title: "Backend Engineer (NestJS) — Mid-Level",
    team: "Danumai Labs",
    location: "Niketon, Dhaka · Onsite",
    type: "Full-time",
    salary: "BDT 35,000–40,000/mo",
    summary:
      "Build the REST APIs behind our short-drama app in NestJS + TypeScript — content feeds, episode unlocks, user accounts, and the ad-reward platform.",
    points: [
      "2–4 years of backend development with Node.js + TypeScript",
      "Production experience with NestJS (or strong Express + TypeScript, ready to work in Nest)",
      "Solid NestJS basics: modules, dependency injection, DTO validation, guards",
      "Good PostgreSQL skills: schema design, joins, indexing, and efficient queries",
      "Verify rewarded-ad callbacks and unlock episodes reliably — webhooks/callbacks, JWT auth, API security",
      "Nice to have: Redis for caching and jobs, Docker, TypeORM/Prisma, high-traffic consumer APIs",
    ],
    perks,
    sortOrder: 2,
  },
  {
    slug: "react-native-engineer",
    title: "React Native Engineer — Mid-Level",
    team: "Danumai Labs",
    location: "Niketon, Dhaka · Onsite",
    type: "Full-time",
    salary: "BDT 30,000–35,000/mo",
    summary:
      "Ship user-facing app features every week — series pages, unlock screens, search, profiles, onboarding — turning Figma into clean UI for Android and iOS.",
    points: [
      "2–3 years of React Native with at least one production app shipped",
      "Strong JavaScript/TypeScript and React fundamentals — hooks, props/state, rendering",
      "React Navigation, REST API integration, async storage, forms and validation",
      "Convert Figma designs into clean, responsive UI for both Android and iOS",
      "An eye for UI detail and speed — we ship weekly",
      "Nice to have: Expo/EAS, Reanimated, push notifications (FCM), app release experience",
    ],
    perks,
    sortOrder: 3,
  },
  {
    slug: "fullstack-engineer-nextjs",
    title: "Fullstack Engineer (Next.js) — Mid-Level",
    team: "Danumai Labs",
    location: "Niketon, Dhaka · Onsite",
    type: "Full-time",
    salary: "BDT 35,000–40,000/mo",
    summary:
      "Build our internal tools in Next.js + TypeScript — content management, an ad campaign dashboard, and analytics views — wired to our NestJS backend and PostgreSQL.",
    points: [
      "2–4 years of web development with React; 1+ year with Next.js in production",
      "Strong TypeScript, with a clear grasp of server vs client components and SSR/SSG",
      "Comfortable with PostgreSQL (Prisma/TypeORM or SQL) and REST APIs",
      "Build clean, usable dashboards with Tailwind CSS — auth, forms, and data tables",
      "Create API routes / server actions connecting to the NestJS backend",
      "Nice to have: NestJS familiarity, charting (Recharts/Chart.js), file/media upload handling",
    ],
    perks,
    sortOrder: 4,
  },
];

// The old placeholder roles that shipped hardcoded — retire them so the
// careers page shows only these real, currently-open positions.
const retiredJobSlugs = ["founding-product-engineer", "motion-designer", "content-producer"];

async function main() {
  for (const p of projects) {
    // Existing rows are otherwise left untouched (matching the old
    // `ON CONFLICT (slug) DO NOTHING` behaviour), but we do push a cover image
    // when the seed provides one — Prisma treats an `undefined` field as "no
    // change", so projects without an `imageUrl` here are still left alone.
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: { imageUrl: "imageUrl" in p ? p.imageUrl : undefined },
      create: p,
    });
  }

  await prisma.job.deleteMany({ where: { slug: { in: retiredJobSlugs } } });

  for (const j of jobs) {
    // Jobs are authoritative here: re-running the seed keeps the copy and
    // ordering in sync (unlike projects/stories, which are left untouched).
    await prisma.job.upsert({
      where: { slug: j.slug },
      update: j,
      create: j,
    });
  }

  for (const s of stories) {
    await prisma.story.upsert({
      where: { slug: s.slug },
      update: {},
      create: {
        ...s,
        readMinutes: estimateReadMinutes(s.body),
        publishedAt: new Date(s.publishedAt),
      },
    });
  }

  console.log(
    `Seeded ${projects.length} projects, ${jobs.length} jobs, and ${stories.length} stories (existing slugs left untouched).`
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
