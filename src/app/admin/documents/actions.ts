"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { PublicationStatus } from "@prisma/client";
import { metadataFromForm } from "@/lib/forms";
import {
  createDocument,
  transitionDocumentPublication,
  updateDocumentMetadata,
  uploadNewVersion,
} from "@/services/documents";

export async function createDocumentAction(formData: FormData) {
  const file = formData.get("file");
  const document = await createDocument(
    metadataFromForm(formData),
    file instanceof File && file.size > 0 ? file : null,
  );
  revalidatePath("/admin/documents");
  revalidatePath("/documents");
  redirect(`/admin/documents/${document.id}`);
}

export async function updateDocumentAction(id: string, formData: FormData) {
  await updateDocumentMetadata(id, metadataFromForm(formData));
  revalidatePath("/admin/documents");
  revalidatePath(`/admin/documents/${id}`);
  revalidatePath("/documents");
}

export async function uploadVersionAction(id: string, formData: FormData) {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("File is required");
  }
  const notes = formData.get("notes")?.toString();
  await uploadNewVersion(id, file, notes);
  revalidatePath(`/admin/documents/${id}`);
  revalidatePath("/documents");
}

export async function transitionDocumentAction(
  id: string,
  status: PublicationStatus,
) {
  try {
    await transitionDocumentPublication(id, { id, publicationStatus: status });
    revalidatePath("/admin/documents");
    revalidatePath(`/admin/documents/${id}`);
    revalidatePath("/documents");
    return {};
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Status change failed" };
  }
}
