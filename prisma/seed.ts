// Seeds the database with the ventures/jobs that used to be hardcoded in
// components/sections/VentureShowcase.tsx and components/careers/JobList.tsx.
// Safe to re-run: existing rows (matched by slug) are left untouched.
//
// Usage: npm run seed   (requires DATABASE_URL in the environment or .env)
import "dotenv/config";
import { prisma } from "../lib/prisma";

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
    // upsert with an empty update leaves existing rows untouched, matching the
    // old `ON CONFLICT (slug) DO NOTHING` behaviour.
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: {},
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

  console.log(
    `Seeded ${projects.length} projects and ${jobs.length} jobs (existing slugs left untouched).`
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
