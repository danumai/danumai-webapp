"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createStory,
  updateStory,
  deleteStory,
  setStoryPublished,
  quickUpdateStory,
  moveStory,
  type StoryInput,
} from "@/lib/data/stories";
import { uploadImage, deleteImage } from "@/lib/storage";
import { slugify } from "@/lib/slugify";
import { requireAdmin } from "@/lib/auth";

export type StoryFormState = {
  error?: string;
};

/** Parse the `date` input (YYYY-MM-DD) into an ISO timestamp, defaulting to now
 *  when empty or invalid so a story always has a sensible posted date. */
function parsePublishedAt(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return new Date().toISOString();
  const d = new Date(trimmed);
  return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

async function readInput(
  formData: FormData,
  existingCoverUrl: string | null
): Promise<StoryInput> {
  const title = String(formData.get("title") ?? "").trim();
  const slugRaw = String(formData.get("slug") ?? "").trim();
  const subtitle = String(formData.get("subtitle") ?? "").trim();
  const category = String(formData.get("category") ?? "Vision").trim() || "Vision";
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const body = String(formData.get("body") ?? "").replace(/\r\n/g, "\n").trim();
  const accent = String(formData.get("accent") ?? "#d99a4e").trim();
  const published = formData.get("published") === "on";
  const publishedAt = parsePublishedAt(String(formData.get("publishedAt") ?? ""));
  const sortOrder = Number(formData.get("sortOrder") ?? 0) || 0;

  if (!title) throw new Error("Title is required.");

  let coverUrl = existingCoverUrl;
  const file = formData.get("cover");
  if (file instanceof File && file.size > 0) {
    coverUrl = await uploadImage(file, "stories");
    if (existingCoverUrl) await deleteImage(existingCoverUrl);
  } else if (formData.get("removeCover") === "on" && existingCoverUrl) {
    await deleteImage(existingCoverUrl);
    coverUrl = null;
  }

  return {
    slug: slugify(slugRaw || title),
    title,
    subtitle,
    category,
    excerpt,
    body,
    coverUrl,
    accent,
    published,
    publishedAt,
    sortOrder,
  };
}

export async function createStoryAction(
  _prevState: StoryFormState,
  formData: FormData
): Promise<StoryFormState> {
  await requireAdmin();
  try {
    const input = await readInput(formData, null);
    await createStory(input);
  } catch (err) {
    console.error("createStoryAction failed", err);
    return { error: err instanceof Error ? err.message : "Something went wrong." };
  }
  revalidatePath("/admin/stories");
  revalidatePath("/stories");
  redirect("/admin/stories");
}

export async function updateStoryAction(
  id: string,
  existingCoverUrl: string | null,
  _prevState: StoryFormState,
  formData: FormData
): Promise<StoryFormState> {
  await requireAdmin();
  try {
    const input = await readInput(formData, existingCoverUrl);
    await updateStory(id, input);
    revalidatePath(`/stories/${input.slug}`);
  } catch (err) {
    console.error("updateStoryAction failed", err);
    return { error: err instanceof Error ? err.message : "Something went wrong." };
  }
  revalidatePath("/admin/stories");
  revalidatePath("/stories");
  redirect("/admin/stories");
}

export async function deleteStoryAction(id: string, coverUrl: string | null) {
  await requireAdmin();
  await deleteStory(id);
  if (coverUrl) await deleteImage(coverUrl);
  revalidatePath("/admin/stories");
  revalidatePath("/stories");
}

export async function toggleStoryPublishedAction(id: string, published: boolean) {
  await requireAdmin();
  await setStoryPublished(id, published);
  revalidatePath("/admin/stories");
  revalidatePath("/stories");
}

export async function moveStoryAction(id: string, direction: "up" | "down") {
  await requireAdmin();
  await moveStory(id, direction);
  revalidatePath("/admin/stories");
  revalidatePath("/stories");
}

export async function quickUpdateStoryAction(
  id: string,
  fields: { title: string; category: string; sortOrder: number }
) {
  await requireAdmin();
  if (!fields.title.trim()) throw new Error("Title is required.");
  await quickUpdateStory(id, {
    title: fields.title.trim(),
    category: fields.category.trim() || "Vision",
    sortOrder: Number(fields.sortOrder) || 0,
  });
  revalidatePath("/admin/stories");
  revalidatePath("/stories");
}
