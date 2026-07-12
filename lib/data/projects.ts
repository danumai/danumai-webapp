import { prisma } from "@/lib/prisma";
import type { Project as ProjectModel } from "@/generated/prisma/client";
import { reorderSwap } from "./reorder";

export type Project = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  status: string;
  features: string[];
  accent: string;
  imageUrl: string | null;
  published: boolean;
  sortOrder: number;
};

function mapRow(row: ProjectModel): Project {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    status: row.status,
    features: (row.features as string[]) ?? [],
    accent: row.accent,
    imageUrl: row.imageUrl,
    published: row.published,
    sortOrder: row.sortOrder,
  };
}

export async function listProjects(opts: { publishedOnly?: boolean } = {}): Promise<Project[]> {
  const rows = await prisma.project.findMany({
    where: opts.publishedOnly ? { published: true } : undefined,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return rows.map(mapRow);
}

export async function getProject(id: string): Promise<Project | null> {
  const row = await prisma.project.findUnique({ where: { id } });
  return row ? mapRow(row) : null;
}

export type ProjectInput = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  status: string;
  features: string[];
  accent: string;
  imageUrl: string | null;
  published: boolean;
  sortOrder: number;
};

export async function createProject(input: ProjectInput): Promise<Project> {
  const row = await prisma.project.create({ data: input });
  return mapRow(row);
}

export async function updateProject(id: string, input: ProjectInput): Promise<Project> {
  const row = await prisma.project.update({ where: { id }, data: input });
  return mapRow(row);
}

export async function deleteProject(id: string): Promise<void> {
  await prisma.project.delete({ where: { id } });
}

export async function setProjectPublished(id: string, published: boolean): Promise<void> {
  await prisma.project.update({ where: { id }, data: { published } });
}

/** Quick inline edit of the fields shown on the list row. */
export async function quickUpdateProject(
  id: string,
  fields: { name: string; status: string; sortOrder: number }
): Promise<void> {
  await prisma.project.update({ where: { id }, data: fields });
}

/** Swap a project's sort_order with its neighbour in the given direction,
 *  so up/down buttons reorder the list. */
export async function moveProject(id: string, direction: "up" | "down"): Promise<void> {
  const all = await listProjects();
  await reorderSwap((id, sortOrder) => prisma.project.update({ where: { id }, data: { sortOrder } }), all, id, direction);
}
