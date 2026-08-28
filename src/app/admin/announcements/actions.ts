"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { PublicationStatus } from "@prisma/client";
import { formDataToObject } from "@/lib/forms";
import {
  createAnnouncement,
  transitionAnnouncementPublication,
  updateAnnouncement,
} from "@/services/announcements";

export async function createAnnouncementAction(formData: FormData) {
  const announcement = await createAnnouncement(
    formDataToObject(formData, ["featured"]),
  );
  revalidatePath("/admin/announcements");
  revalidatePath("/announcements");
  redirect(`/admin/announcements/${announcement.id}/edit`);
}

export async function updateAnnouncementAction(id: string, formData: FormData) {
  await updateAnnouncement(id, formDataToObject(formData, ["featured"]));
  revalidatePath("/admin/announcements");
  revalidatePath(`/admin/announcements/${id}/edit`);
  revalidatePath("/announcements");
}

export async function transitionAnnouncementAction(
  id: string,
  status: PublicationStatus,
) {
  try {
    await transitionAnnouncementPublication(id, { id, publicationStatus: status });
    revalidatePath("/admin/announcements");
    revalidatePath(`/admin/announcements/${id}/edit`);
    revalidatePath("/announcements");
    return {};
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Status change failed" };
  }
}
