"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createProject,
  updateProject,
  deleteProject,
  getProject,
  setProjectPublished,
  quickUpdateProject,
  moveProject,
  type ProjectInput,
} from "@/lib/data/projects";
import { uploadImage, deleteImage } from "@/lib/storage";
import { slugify } from "@/lib/slugify";
import { requireAdmin } from "@/lib/auth";

export type ProjectFormState = {
  error?: string;
};

function parseFeatures(raw: string): string[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 12);
}

export type ExistingImages = {
  imageUrl: string | null;
  gallery: string[];
};

async function readInput(formData: FormData, existing: ExistingImages): Promise<ProjectInput> {
  const name = String(formData.get("name") ?? "").trim();
  const slugRaw = String(formData.get("slug") ?? "").trim();
  const tagline = String(formData.get("tagline") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();
  const accent = String(formData.get("accent") ?? "#d99a4e").trim();
  const sortOrder = Number(formData.get("sortOrder") ?? 0) || 0;
  const published = formData.get("published") === "on";
  const features = parseFeatures(String(formData.get("features") ?? ""));
  const techStack = parseFeatures(String(formData.get("techStack") ?? ""));

  if (!name) throw new Error("Name is required.");

  let imageUrl = existing.imageUrl;
  const file = formData.get("image");
  if (file instanceof File && file.size > 0) {
    imageUrl = await uploadImage(file, "projects");
    if (existing.imageUrl) await deleteImage(existing.imageUrl);
  } else if (formData.get("removeImage") === "on" && existing.imageUrl) {
    await deleteImage(existing.imageUrl);
    imageUrl = null;
  }

  // Gallery: keep existing images unless individually marked for removal,
  // then append any newly uploaded files.
  const removeSet = new Set(
    formData.getAll("removeGalleryImage").map((v) => String(v))
  );
  const kept = existing.gallery.filter((url) => !removeSet.has(url));
  for (const url of existing.gallery) {
    if (removeSet.has(url)) await deleteImage(url);
  }
  const galleryFiles = formData
    .getAll("galleryImages")
    .filter((f): f is File => f instanceof File && f.size > 0);
  const uploaded: string[] = [];
  for (const gf of galleryFiles) {
    uploaded.push(await uploadImage(gf, "projects/gallery"));
  }

  return {
    slug: slugify(slugRaw || name),
    name,
    tagline,
    description,
    status,
    features,
    accent,
    techStack,
    imageUrl,
    gallery: [...kept, ...uploaded],
    published,
    sortOrder,
  };
}

export async function createProjectAction(
  _prevState: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  await requireAdmin();
  try {
    const input = await readInput(formData, { imageUrl: null, gallery: [] });
    await createProject(input);
  } catch (err) {
    console.error("createProjectAction failed", err);
    return { error: err instanceof Error ? err.message : "Something went wrong." };
  }
  revalidatePath("/admin/projects");
  revalidatePath("/");
  redirect("/admin/projects");
}

export async function updateProjectAction(
  id: string,
  existing: ExistingImages,
  _prevState: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  await requireAdmin();
  try {
    const input = await readInput(formData, existing);
    await updateProject(id, input);
  } catch (err) {
    console.error("updateProjectAction failed", err);
    return { error: err instanceof Error ? err.message : "Something went wrong." };
  }
  revalidatePath("/admin/projects");
  revalidatePath("/");
  redirect("/admin/projects");
}

export async function deleteProjectAction(id: string, imageUrl: string | null) {
  await requireAdmin();
  const project = await getProject(id);
  await deleteProject(id);
  if (imageUrl) await deleteImage(imageUrl);
  for (const url of project?.gallery ?? []) {
    await deleteImage(url);
  }
  revalidatePath("/admin/projects");
  revalidatePath("/");
}

export async function toggleProjectPublishedAction(id: string, published: boolean) {
  await requireAdmin();
  await setProjectPublished(id, published);
  revalidatePath("/admin/projects");
  revalidatePath("/");
}

export async function moveProjectAction(id: string, direction: "up" | "down") {
  await requireAdmin();
  await moveProject(id, direction);
  revalidatePath("/admin/projects");
  revalidatePath("/");
}

export async function quickUpdateProjectAction(
  id: string,
  fields: { name: string; status: string; sortOrder: number }
) {
  await requireAdmin();
  if (!fields.name.trim()) throw new Error("Name is required.");
  await quickUpdateProject(id, {
    name: fields.name.trim(),
    status: fields.status.trim(),
    sortOrder: Number(fields.sortOrder) || 0,
  });
  revalidatePath("/admin/projects");
  revalidatePath("/");
}
