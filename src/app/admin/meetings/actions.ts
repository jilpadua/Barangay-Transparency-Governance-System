"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AttendanceStatus, PublicationStatus } from "@prisma/client";
import { formDataToObject } from "@/lib/forms";
import {
  createMeeting,
  saveAttendance,
  transitionMeetingPublication,
  updateMeeting,
} from "@/services/meetings";

export async function createMeetingAction(formData: FormData) {
  const meeting = await createMeeting(formDataToObject(formData));
  revalidatePath("/admin/meetings");
  revalidatePath("/meetings");
  redirect(`/admin/meetings/${meeting.id}/edit`);
}

export async function updateMeetingAction(id: string, formData: FormData) {
  await updateMeeting(id, formDataToObject(formData));
  revalidatePath("/admin/meetings");
  revalidatePath(`/admin/meetings/${id}/edit`);
  revalidatePath("/meetings");
}

export async function transitionMeetingAction(
  id: string,
  status: PublicationStatus,
) {
  try {
    await transitionMeetingPublication(id, { id, publicationStatus: status });
    revalidatePath("/admin/meetings");
    revalidatePath(`/admin/meetings/${id}/edit`);
    revalidatePath("/meetings");
    return {};
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Status change failed" };
  }
}

export async function saveAttendanceAction(id: string, formData: FormData) {
  const entries: {
    officialId: string;
    status: AttendanceStatus;
    remarks?: string;
  }[] = [];

  for (const [key, value] of formData.entries()) {
    if (key.startsWith("status_") && typeof value === "string") {
      const officialId = key.replace("status_", "");
      entries.push({
        officialId,
        status: value as AttendanceStatus,
        remarks: formData.get(`remarks_${officialId}`)?.toString(),
      });
    }
  }

  await saveAttendance({ meetingId: id, entries });
  revalidatePath(`/admin/meetings/${id}/edit`);
}
