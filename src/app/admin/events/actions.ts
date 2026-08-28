"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { PublicationStatus } from "@prisma/client";
import { formDataToObject } from "@/lib/forms";
import {
  createEvent,
  transitionEventPublication,
  updateEvent,
} from "@/services/events";

export async function createEventAction(formData: FormData) {
  const event = await createEvent(formDataToObject(formData, ["isSk"]));
  revalidatePath("/admin/events");
  revalidatePath("/events");
  redirect(`/admin/events/${event.id}/edit`);
}

export async function updateEventAction(id: string, formData: FormData) {
  await updateEvent(id, formDataToObject(formData, ["isSk"]));
  revalidatePath("/admin/events");
  revalidatePath(`/admin/events/${id}/edit`);
  revalidatePath("/events");
}

export async function transitionEventAction(
  id: string,
  status: PublicationStatus,
) {
  try {
    await transitionEventPublication(id, { id, publicationStatus: status });
    revalidatePath("/admin/events");
    revalidatePath(`/admin/events/${id}/edit`);
    revalidatePath("/events");
    return {};
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Status change failed" };
  }
}
