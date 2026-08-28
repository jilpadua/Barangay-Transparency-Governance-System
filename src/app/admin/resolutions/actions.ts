"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { PublicationStatus } from "@prisma/client";
import { metadataFromForm } from "@/lib/forms";
import {
  createResolution,
  transitionResolutionPublication,
  updateResolution,
} from "@/services/resolutions";

export async function createResolutionAction(formData: FormData) {
  const file = formData.get("file");
  const resolution = await createResolution(
    metadataFromForm(formData, ["isSk"]),
    file instanceof File && file.size > 0 ? file : null,
  );
  revalidatePath("/admin/resolutions");
  revalidatePath("/resolutions");
  redirect(`/admin/resolutions/${resolution.id}/edit`);
}

export async function updateResolutionAction(id: string, formData: FormData) {
  const file = formData.get("file");
  await updateResolution(
    id,
    metadataFromForm(formData, ["isSk"]),
    file instanceof File && file.size > 0 ? file : null,
  );
  revalidatePath("/admin/resolutions");
  revalidatePath(`/admin/resolutions/${id}/edit`);
  revalidatePath("/resolutions");
}

export async function transitionResolutionAction(
  id: string,
  status: PublicationStatus,
) {
  try {
    await transitionResolutionPublication(id, { id, publicationStatus: status });
    revalidatePath("/admin/resolutions");
    revalidatePath(`/admin/resolutions/${id}/edit`);
    revalidatePath("/resolutions");
    return {};
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Status change failed" };
  }
}
