import { prisma } from "@/lib/prisma";
import type { Job as JobModel } from "@/generated/prisma/client";
import { reorderSwap } from "./reorder";

export type Job = {
  id: string;
  slug: string;
  title: string;
  team: string;
  location: string;
  type: string;
  summary: string;
  points: string[];
  published: boolean;
  sortOrder: number;
};

function mapRow(row: JobModel): Job {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    team: row.team,
    location: row.location,
    type: row.type,
    summary: row.summary,
    points: (row.points as string[]) ?? [],
    published: row.published,
    sortOrder: row.sortOrder,
  };
}

export async function listJobs(opts: { publishedOnly?: boolean } = {}): Promise<Job[]> {
  const rows = await prisma.job.findMany({
    where: opts.publishedOnly ? { published: true } : undefined,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return rows.map(mapRow);
}

export async function getJob(id: string): Promise<Job | null> {
  const row = await prisma.job.findUnique({ where: { id } });
  return row ? mapRow(row) : null;
}

export type JobInput = {
  slug: string;
  title: string;
  team: string;
  location: string;
  type: string;
  summary: string;
  points: string[];
  published: boolean;
  sortOrder: number;
};

export async function createJob(input: JobInput): Promise<Job> {
  const row = await prisma.job.create({ data: input });
  return mapRow(row);
}

export async function updateJob(id: string, input: JobInput): Promise<Job> {
  const row = await prisma.job.update({ where: { id }, data: input });
  return mapRow(row);
}

export async function deleteJob(id: string): Promise<void> {
  await prisma.job.delete({ where: { id } });
}

export async function setJobPublished(id: string, published: boolean): Promise<void> {
  await prisma.job.update({ where: { id }, data: { published } });
}

/** Quick inline edit of the fields shown on the list row. */
export async function quickUpdateJob(
  id: string,
  fields: { title: string; team: string; sortOrder: number }
): Promise<void> {
  await prisma.job.update({ where: { id }, data: fields });
}

export async function moveJob(id: string, direction: "up" | "down"): Promise<void> {
  const all = await listJobs();
  await reorderSwap((id, sortOrder) => prisma.job.update({ where: { id }, data: { sortOrder } }), all, id, direction);
}
