import { PublicationStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { PERMISSIONS } from "@/lib/permissions";
import { assertPermission } from "@/lib/permissions/server";
import { parseOrThrow } from "@/lib/validation";
import {
  ordinanceFormSchema,
  ordinanceTransitionSchema,
} from "@/lib/validation/schemas/legal";
import { getStorageProvider } from "@/lib/storage";
import { fileToBuffer, validateUpload } from "@/lib/storage/validate";
import { auditMutation } from "@/services/audit-helper";
import { getServiceContext } from "@/services/context";
import {
  getAvailablePublicationTransitions,
  getPublicationCapabilities,
  transitionPublicationStatus,
} from "@/services/publication";

export async function listOrdinances() {
  const ctx = await getServiceContext();
  assertPermission(ctx.permissions, PERMISSIONS.ORDINANCES_VIEW);

  return prisma.ordinance.findMany({
    where: { barangayId: ctx.barangayId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getOrdinance(id: string) {
  const ctx = await getServiceContext();
  assertPermission(ctx.permissions, PERMISSIONS.ORDINANCES_VIEW);

  const ordinance = await prisma.ordinance.findFirst({
    where: { id, barangayId: ctx.barangayId },
  });
  if (!ordinance) throw new Error("Ordinance not found");
  return ordinance;
}

export async function createOrdinance(data: unknown, file?: File | null) {
  const ctx = await getServiceContext();
  assertPermission(ctx.permissions, PERMISSIONS.ORDINANCES_MANAGE);
  const input = parseOrThrow(ordinanceFormSchema, data);

  let documentUrl = input.documentUrl;
  if (file && file.size > 0) {
    validateUpload(file);
    const buffer = await fileToBuffer(file);
    const stored = await getStorageProvider().upload(buffer, {
      fileName: file.name,
      mimeType: file.type,
      folder: "legal",
    });
    documentUrl = stored.url;
  }

  const ordinance = await prisma.ordinance.create({
    data: {
      barangayId: ctx.barangayId,
      ...input,
      documentUrl,
      publicationStatus: PublicationStatus.DRAFT,
    },
  });

  await auditMutation(ctx, {
    action: "CREATE",
    module: "ordinances",
    recordId: ordinance.id,
  });

  return ordinance;
}

export async function updateOrdinance(
  id: string,
  data: unknown,
  file?: File | null,
) {
  const ctx = await getServiceContext();
  assertPermission(ctx.permissions, PERMISSIONS.ORDINANCES_MANAGE);
  const input = parseOrThrow(ordinanceFormSchema, data);
  const existing = await getOrdinance(id);

  let documentUrl = input.documentUrl ?? existing.documentUrl;
  if (file && file.size > 0) {
    validateUpload(file);
    const buffer = await fileToBuffer(file);
    const stored = await getStorageProvider().upload(buffer, {
      fileName: file.name,
      mimeType: file.type,
      folder: "legal",
    });
    documentUrl = stored.url;
  }

  const ordinance = await prisma.ordinance.update({
    where: { id: existing.id },
    data: { ...input, documentUrl },
  });

  await auditMutation(ctx, {
    action: "UPDATE",
    module: "ordinances",
    recordId: ordinance.id,
  });

  return ordinance;
}

export async function transitionOrdinancePublication(id: string, data: unknown) {
  const ctx = await getServiceContext();
  const input = parseOrThrow(ordinanceTransitionSchema, data);
  const existing = await getOrdinance(id);
  const caps = getPublicationCapabilities(ctx.permissions);
  const transition = transitionPublicationStatus(
    existing.publicationStatus,
    input.publicationStatus,
    caps,
  );

  const ordinance = await prisma.ordinance.update({
    where: { id },
    data: {
      publicationStatus: transition.status,
      publishedAt: transition.publishedAt ?? existing.publishedAt,
    },
  });

  await auditMutation(ctx, {
    action: "TRANSITION",
    module: "ordinances",
    recordId: ordinance.id,
    metadata: { from: existing.publicationStatus, to: transition.status },
  });

  return ordinance;
}

export async function getOrdinancePublicationTransitions(id: string) {
  const ctx = await getServiceContext();
  const ordinance = await getOrdinance(id);
  const caps = getPublicationCapabilities(ctx.permissions);
  return getAvailablePublicationTransitions(
    ordinance.publicationStatus,
    caps,
  );
}

export async function listPublishedOrdinances() {
  return prisma.ordinance.findMany({
    where: { publicationStatus: PublicationStatus.PUBLISHED },
    orderBy: { ordinanceDate: "desc" },
  });
}
