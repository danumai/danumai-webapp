"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createJob,
  updateJob,
  deleteJob,
  setJobPublished,
  quickUpdateJob,
  moveJob,
  type JobInput,
} from "@/lib/data/jobs";
import { slugify } from "@/lib/slugify";
import { requireAdmin } from "@/lib/auth";

export type JobFormState = {
  error?: string;
};

function parsePoints(raw: string): string[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 12);
}

function readInput(formData: FormData): JobInput {
  const title = String(formData.get("title") ?? "").trim();
  const slugRaw = String(formData.get("slug") ?? "").trim();
  const team = String(formData.get("team") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const type = String(formData.get("type") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const points = parsePoints(String(formData.get("points") ?? ""));
  const published = formData.get("published") === "on";
  const sortOrder = Number(formData.get("sortOrder") ?? 0) || 0;

  if (!title) throw new Error("Title is required.");

  return {
    slug: slugify(slugRaw || title),
    title,
    team,
    location,
    type,
    summary,
    points,
    published,
    sortOrder,
  };
}

export async function createJobAction(
  _prevState: JobFormState,
  formData: FormData
): Promise<JobFormState> {
  await requireAdmin();
  try {
    await createJob(readInput(formData));
  } catch (err) {
    console.error("createJobAction failed", err);
    return { error: err instanceof Error ? err.message : "Something went wrong." };
  }
  revalidatePath("/admin/jobs");
  revalidatePath("/careers");
  redirect("/admin/jobs");
}

export async function updateJobAction(
  id: string,
  _prevState: JobFormState,
  formData: FormData
): Promise<JobFormState> {
  await requireAdmin();
  try {
    await updateJob(id, readInput(formData));
  } catch (err) {
    console.error("updateJobAction failed", err);
    return { error: err instanceof Error ? err.message : "Something went wrong." };
  }
  revalidatePath("/admin/jobs");
  revalidatePath("/careers");
  redirect("/admin/jobs");
}

export async function deleteJobAction(id: string) {
  await requireAdmin();
  await deleteJob(id);
  revalidatePath("/admin/jobs");
  revalidatePath("/careers");
}

export async function toggleJobPublishedAction(id: string, published: boolean) {
  await requireAdmin();
  await setJobPublished(id, published);
  revalidatePath("/admin/jobs");
  revalidatePath("/careers");
}

export async function moveJobAction(id: string, direction: "up" | "down") {
  await requireAdmin();
  await moveJob(id, direction);
  revalidatePath("/admin/jobs");
  revalidatePath("/careers");
}

export async function quickUpdateJobAction(
  id: string,
  fields: { title: string; team: string; sortOrder: number }
) {
  await requireAdmin();
  if (!fields.title.trim()) throw new Error("Title is required.");
  await quickUpdateJob(id, {
    title: fields.title.trim(),
    team: fields.team.trim(),
    sortOrder: Number(fields.sortOrder) || 0,
  });
  revalidatePath("/admin/jobs");
  revalidatePath("/careers");
}
