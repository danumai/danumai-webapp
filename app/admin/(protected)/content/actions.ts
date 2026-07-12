"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { updateSection } from "@/lib/data/content";
import { SECTIONS, type SectionKey } from "@/lib/content";

export type SectionFormState = { error?: string; ok?: boolean };

export async function saveSectionAction(
  key: SectionKey,
  _prevState: SectionFormState,
  formData: FormData
): Promise<SectionFormState> {
  await requireAdmin();
  if (!SECTIONS.some((s) => s.key === key)) {
    return { error: "Unknown section." };
  }
  try {
    const raw = JSON.parse(String(formData.get("payload") ?? "{}"));
    await updateSection(key, raw);
  } catch (err) {
    console.error("saveSectionAction failed", err);
    return { error: err instanceof Error ? err.message : "Something went wrong." };
  }
  // Content shows on the public site and its careers page; refresh both plus
  // the admin content screens.
  revalidatePath("/");
  revalidatePath("/careers");
  revalidatePath("/contact");
  revalidatePath("/admin/content");
  revalidatePath(`/admin/content/${key}`);
  return { ok: true };
}
