"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { PublicationStatus } from "@prisma/client";
import { formDataToObject } from "@/lib/forms";
import {
  createOfficial,
  transitionOfficialPublication,
  updateOfficial,
} from "@/services/officials";

export async function createOfficialAction(formData: FormData) {
  const official = await createOfficial(
    formDataToObject(formData, ["isActive"]),
  );
  revalidatePath("/admin/officials");
  revalidatePath("/officials");
  redirect(`/admin/officials/${official.id}/edit`);
}

export async function updateOfficialAction(id: string, formData: FormData) {
  await updateOfficial(id, formDataToObject(formData, ["isActive"]));
  revalidatePath("/admin/officials");
  revalidatePath(`/admin/officials/${id}/edit`);
  revalidatePath("/officials");
}

export async function transitionOfficialAction(
  id: string,
  status: PublicationStatus,
) {
  try {
    await transitionOfficialPublication(id, { id, publicationStatus: status });
    revalidatePath("/admin/officials");
    revalidatePath(`/admin/officials/${id}/edit`);
    revalidatePath("/officials");
    return {};
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Status change failed" };
  }
}
