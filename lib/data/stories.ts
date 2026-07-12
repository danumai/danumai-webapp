import { prisma } from "@/lib/prisma";
import type { Story as StoryModel } from "@/generated/prisma/client";
import { reorderSwap } from "./reorder";

export type Story = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  excerpt: string;
  body: string;
  coverUrl: string | null;
  accent: string;
  readMinutes: number;
  published: boolean;
  publishedAt: string;
  sortOrder: number;
};

function mapRow(row: StoryModel): Story {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle,
    category: row.category,
    excerpt: row.excerpt,
    body: row.body,
    coverUrl: row.coverUrl,
    accent: row.accent,
    readMinutes: row.readMinutes,
    published: row.published,
    publishedAt: row.publishedAt.toISOString(),
    sortOrder: row.sortOrder,
  };
}

/** Rough read-time estimate: ~200 words per minute, at least one minute for any
 *  non-empty body. Kept here so both create and update stay in lock-step. */
export function estimateReadMinutes(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  if (words === 0) return 0;
  return Math.max(1, Math.round(words / 200));
}

/** Admin listing — manual order. */
export async function listStories(
  opts: { publishedOnly?: boolean } = {}
): Promise<Story[]> {
  const rows = await prisma.story.findMany({
    where: opts.publishedOnly ? { published: true } : undefined,
    orderBy: [{ sortOrder: "asc" }, { publishedAt: "desc" }],
  });
  return rows.map(mapRow);
}

/** Public listing — newest first by the editable posted date. */
export async function listPublishedStories(): Promise<Story[]> {
  const rows = await prisma.story.findMany({
    where: { published: true },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });
  return rows.map(mapRow);
}

export async function getStory(id: string): Promise<Story | null> {
  const row = await prisma.story.findUnique({ where: { id } });
  return row ? mapRow(row) : null;
}

export async function getStoryBySlug(slug: string): Promise<Story | null> {
  const row = await prisma.story.findUnique({ where: { slug } });
  return row ? mapRow(row) : null;
}

export type StoryInput = {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  excerpt: string;
  body: string;
  coverUrl: string | null;
  accent: string;
  published: boolean;
  publishedAt: string;
  sortOrder: number;
};

export async function createStory(input: StoryInput): Promise<Story> {
  const row = await prisma.story.create({
    data: {
      slug: input.slug,
      title: input.title,
      subtitle: input.subtitle,
      category: input.category,
      excerpt: input.excerpt,
      body: input.body,
      coverUrl: input.coverUrl,
      accent: input.accent,
      readMinutes: estimateReadMinutes(input.body),
      published: input.published,
      publishedAt: new Date(input.publishedAt),
      sortOrder: input.sortOrder,
    },
  });
  return mapRow(row);
}

export async function updateStory(id: string, input: StoryInput): Promise<Story> {
  const row = await prisma.story.update({
    where: { id },
    data: {
      slug: input.slug,
      title: input.title,
      subtitle: input.subtitle,
      category: input.category,
      excerpt: input.excerpt,
      body: input.body,
      coverUrl: input.coverUrl,
      accent: input.accent,
      readMinutes: estimateReadMinutes(input.body),
      published: input.published,
      publishedAt: new Date(input.publishedAt),
      sortOrder: input.sortOrder,
    },
  });
  return mapRow(row);
}

export async function deleteStory(id: string): Promise<void> {
  await prisma.story.delete({ where: { id } });
}

export async function setStoryPublished(
  id: string,
  published: boolean
): Promise<void> {
  await prisma.story.update({ where: { id }, data: { published } });
}

/** Quick inline edit of the fields shown on the list row. */
export async function quickUpdateStory(
  id: string,
  fields: { title: string; category: string; sortOrder: number }
): Promise<void> {
  await prisma.story.update({ where: { id }, data: fields });
}

export async function moveStory(id: string, direction: "up" | "down"): Promise<void> {
  const all = await listStories();
  await reorderSwap((id, sortOrder) => prisma.story.update({ where: { id }, data: { sortOrder } }), all, id, direction);
}
