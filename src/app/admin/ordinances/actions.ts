"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { PublicationStatus } from "@prisma/client";
import { metadataFromForm } from "@/lib/forms";
import {
  createOrdinance,
  transitionOrdinancePublication,
  updateOrdinance,
} from "@/services/ordinances";

export async function createOrdinanceAction(formData: FormData) {
  const file = formData.get("file");
  const ordinance = await createOrdinance(
    metadataFromForm(formData),
    file instanceof File && file.size > 0 ? file : null,
  );
  revalidatePath("/admin/ordinances");
  revalidatePath("/ordinances");
  redirect(`/admin/ordinances/${ordinance.id}/edit`);
}

export async function updateOrdinanceAction(id: string, formData: FormData) {
  const file = formData.get("file");
  await updateOrdinance(
    id,
    metadataFromForm(formData),
    file instanceof File && file.size > 0 ? file : null,
  );
  revalidatePath("/admin/ordinances");
  revalidatePath(`/admin/ordinances/${id}/edit`);
  revalidatePath("/ordinances");
}

export async function transitionOrdinanceAction(
  id: string,
  status: PublicationStatus,
) {
  try {
    await transitionOrdinancePublication(id, { id, publicationStatus: status });
    revalidatePath("/admin/ordinances");
    revalidatePath(`/admin/ordinances/${id}/edit`);
    revalidatePath("/ordinances");
    return {};
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Status change failed" };
  }
}
