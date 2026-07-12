"use server";

import { revalidatePath } from "next/cache";
import {
  setApplicationRead,
  deleteApplication,
  setContactMessageRead,
  deleteContactMessage,
} from "@/lib/data/submissions";
import { requireAdmin } from "@/lib/auth";

export async function toggleApplicationReadAction(id: string, read: boolean) {
  await requireAdmin();
  await setApplicationRead(id, read);
  revalidatePath("/admin/people");
}

export async function deleteApplicationAction(id: string) {
  await requireAdmin();
  await deleteApplication(id);
  revalidatePath("/admin/people");
}

export async function toggleContactMessageReadAction(id: string, read: boolean) {
  await requireAdmin();
  await setContactMessageRead(id, read);
  revalidatePath("/admin/people");
}

export async function deleteContactMessageAction(id: string) {
  await requireAdmin();
  await deleteContactMessage(id);
  revalidatePath("/admin/people");
}
