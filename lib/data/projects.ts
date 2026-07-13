import { prisma } from "@/lib/prisma";
import { Prisma, type Project as ProjectModel } from "@/generated/prisma/client";
import { reorderSwap } from "./reorder";

/** Normalized crop rect over the original cover image (all values 0..1). */
export type CoverCrop = { x: number; y: number; w: number; h: number };

export type Project = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  status: string;
  features: string[];
  accent: string;
  techStack: string[];
  /** The 4:3 cover the site displays (already cropped). */
  imageUrl: string | null;
  /** The untouched upload behind the cover, kept so framing can be re-edited. */
  imageOriginalUrl: string | null;
  /** Where on the original the cover was framed. */
  imageCrop: CoverCrop | null;
  gallery: string[];
  published: boolean;
  sortOrder: number;
};

function parseCrop(raw: unknown): CoverCrop | null {
  if (!raw || typeof raw !== "object") return null;
  const c = raw as Record<string, unknown>;
  const nums = [c.x, c.y, c.w, c.h];
  if (!nums.every((n) => typeof n === "number" && Number.isFinite(n))) return null;
  return { x: c.x as number, y: c.y as number, w: c.w as number, h: c.h as number };
}

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
    techStack: (row.techStack as string[]) ?? [],
    imageUrl: row.imageUrl,
    imageOriginalUrl: row.imageOriginalUrl,
    imageCrop: parseCrop(row.imageCrop),
    gallery: (row.gallery as string[]) ?? [],
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

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const row = await prisma.project.findUnique({ where: { slug } });
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
  techStack: string[];
  imageUrl: string | null;
  imageOriginalUrl: string | null;
  imageCrop: CoverCrop | null;
  gallery: string[];
  published: boolean;
  sortOrder: number;
};

// Prisma's Json column rejects a bare null meaning "set NULL" — it needs the
// DbNull sentinel — so translate the crop field explicitly.
function toData(input: ProjectInput) {
  const { imageCrop, ...rest } = input;
  return { ...rest, imageCrop: imageCrop ?? Prisma.DbNull };
}

export async function createProject(input: ProjectInput): Promise<Project> {
  const row = await prisma.project.create({ data: toData(input) });
  return mapRow(row);
}

export async function updateProject(id: string, input: ProjectInput): Promise<Project> {
  const row = await prisma.project.update({ where: { id }, data: toData(input) });
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
