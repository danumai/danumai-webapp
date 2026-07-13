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
  type CoverCrop,
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
  imageOriginalUrl: string | null;
  imageCrop: CoverCrop | null;
  gallery: string[];
};

/** Parse and sanity-check the crop JSON the form posts (normalized 0..1). */
function parseCrop(raw: string): CoverCrop | null {
  if (!raw) return null;
  try {
    const c = JSON.parse(raw) as Record<string, unknown>;
    const nums = [c.x, c.y, c.w, c.h];
    if (!nums.every((n) => typeof n === "number" && Number.isFinite(n))) return null;
    const { x, y, w, h } = c as unknown as CoverCrop;
    // A zoomed-out framing extends past the image (x/y negative, w/h > 1),
    // so only reject degenerate or absurd rects, not out-of-bounds ones.
    if (w <= 0 || h <= 0 || w > 8 || h > 8 || Math.abs(x) > 4 || Math.abs(y) > 4)
      return null;
    return { x, y, w, h };
  } catch {
    return null;
  }
}

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

  // Cover pipeline: `image` is the 4:3 crop the site displays; `imageOriginal`
  // is the pristine upload it was framed from; `imageCrop` records where. The
  // original + crop are kept so the framing stays re-editable without loss.
  let imageUrl = existing.imageUrl;
  let imageOriginalUrl = existing.imageOriginalUrl;
  let imageCrop = existing.imageCrop;
  const file = formData.get("image");
  const originalFile = formData.get("imageOriginal");
  const crop = parseCrop(String(formData.get("imageCrop") ?? ""));

  if (file instanceof File && file.size > 0) {
    imageUrl = await uploadImage(file, "projects");
    if (originalFile instanceof File && originalFile.size > 0) {
      // Fresh framed upload: the new original replaces both old files.
      imageOriginalUrl = await uploadImage(originalFile, "projects/originals");
      imageCrop = crop;
      if (existing.imageOriginalUrl) await deleteImage(existing.imageOriginalUrl);
      if (existing.imageUrl) await deleteImage(existing.imageUrl);
    } else if (crop && existing.imageOriginalUrl) {
      // Re-framed from the saved original: keep it, swap the displayed crop.
      imageCrop = crop;
      if (existing.imageUrl) await deleteImage(existing.imageUrl);
    } else if (crop && existing.imageUrl) {
      // Cover saved before originals were kept, now re-framed: the old cover
      // is the source the admin framed, so promote it to the original.
      imageOriginalUrl = existing.imageUrl;
      imageCrop = crop;
    } else {
      // Plain unframed replacement (SVG/GIF): no original, no crop.
      imageOriginalUrl = null;
      if (existing.imageOriginalUrl) await deleteImage(existing.imageOriginalUrl);
      if (existing.imageUrl) await deleteImage(existing.imageUrl);
    }
  } else if (formData.get("removeImage") === "on" && existing.imageUrl) {
    await deleteImage(existing.imageUrl);
    if (existing.imageOriginalUrl) await deleteImage(existing.imageOriginalUrl);
    imageUrl = null;
    imageOriginalUrl = null;
    imageCrop = null;
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
    imageOriginalUrl,
    imageCrop,
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
    const input = await readInput(formData, {
      imageUrl: null,
      imageOriginalUrl: null,
      imageCrop: null,
      gallery: [],
    });
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
  if (project?.imageOriginalUrl && project.imageOriginalUrl !== imageUrl) {
    await deleteImage(project.imageOriginalUrl);
  }
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
