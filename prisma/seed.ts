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

const jobs = [
  {
    slug: "founding-product-engineer",
    title: "Founding Product Engineer",
    team: "Danumai Labs",
    location: "Dhaka · Remote",
    type: "Full-time",
    summary:
      "Own features end to end across BanglaReels and the shared platform — from data model to the last easing curve.",
    points: [
      "TypeScript, React, Next.js across web and mobile web",
      "You've shipped and operated products, not just built them",
      "Care about motion, accessibility, and the last 5% of polish",
    ],
    sortOrder: 1,
  },
  {
    slug: "motion-designer",
    title: "Product & Motion Designer",
    team: "Danumai Labs",
    location: "Remote",
    type: "Full-time",
    summary:
      "Define how Danumai products feel — a single design language spanning streaming, stories, and care.",
    points: [
      "Strong interaction and motion portfolio (Figma + prototypes)",
      "Comfortable working directly in the codebase with engineers",
      "Taste for restraint: one accent color, spacing over decoration",
    ],
    sortOrder: 2,
  },
  {
    slug: "content-producer",
    title: "Content Producer, Serials",
    team: "Danumai Studios",
    location: "Dhaka",
    type: "Contract → Full-time",
    summary: "Run vertical micro-drama productions from script to screen for BanglaReels.",
    points: [
      "Experience producing short-form or episodic video",
      "Fluent Bangla; deep feel for what the audience actually watches",
      "Scrappy: small crews, fast cycles, owned outcomes",
    ],
    sortOrder: 3,
  },
];

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

  for (const j of jobs) {
    await prisma.job.upsert({
      where: { slug: j.slug },
      update: {},
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
