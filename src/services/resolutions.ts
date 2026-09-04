import { PublicationStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { PERMISSIONS } from "@/lib/permissions";
import { assertPermission } from "@/lib/permissions/server";
import { parseOrThrow } from "@/lib/validation";
import {
  resolutionFormSchema,
  resolutionTransitionSchema,
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

export async function listResolutions() {
  const ctx = await getServiceContext();
  assertPermission(ctx.permissions, PERMISSIONS.RESOLUTIONS_VIEW);

  return prisma.resolution.findMany({
    where: { barangayId: ctx.barangayId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getResolution(id: string) {
  const ctx = await getServiceContext();
  assertPermission(ctx.permissions, PERMISSIONS.RESOLUTIONS_VIEW);

  const resolution = await prisma.resolution.findFirst({
    where: { id, barangayId: ctx.barangayId },
  });
  if (!resolution) throw new Error("Resolution not found");
  return resolution;
}

export async function createResolution(data: unknown, file?: File | null) {
  const ctx = await getServiceContext();
  assertPermission(ctx.permissions, PERMISSIONS.RESOLUTIONS_MANAGE);
  const input = parseOrThrow(resolutionFormSchema, data);

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

  const resolution = await prisma.resolution.create({
    data: {
      barangayId: ctx.barangayId,
      ...input,
      documentUrl,
      publicationStatus: PublicationStatus.DRAFT,
    },
  });

  await auditMutation(ctx, {
    action: "CREATE",
    module: "resolutions",
    recordId: resolution.id,
  });

  return resolution;
}

export async function updateResolution(
  id: string,
  data: unknown,
  file?: File | null,
) {
  const ctx = await getServiceContext();
  assertPermission(ctx.permissions, PERMISSIONS.RESOLUTIONS_MANAGE);
  const input = parseOrThrow(resolutionFormSchema, data);
  const existing = await getResolution(id);

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

  const resolution = await prisma.resolution.update({
    where: { id: existing.id },
    data: { ...input, documentUrl },
  });

  await auditMutation(ctx, {
    action: "UPDATE",
    module: "resolutions",
    recordId: resolution.id,
  });

  return resolution;
}

export async function transitionResolutionPublication(id: string, data: unknown) {
  const ctx = await getServiceContext();
  const input = parseOrThrow(resolutionTransitionSchema, data);
  const existing = await getResolution(id);
  const caps = getPublicationCapabilities(ctx.permissions);
  const transition = transitionPublicationStatus(
    existing.publicationStatus,
    input.publicationStatus,
    caps,
  );

  const resolution = await prisma.resolution.update({
    where: { id },
    data: {
      publicationStatus: transition.status,
      publishedAt: transition.publishedAt ?? existing.publishedAt,
    },
  });

  await auditMutation(ctx, {
    action: "TRANSITION",
    module: "resolutions",
    recordId: resolution.id,
    metadata: { from: existing.publicationStatus, to: transition.status },
  });

  return resolution;
}

export async function getResolutionPublicationTransitions(id: string) {
  const ctx = await getServiceContext();
  const resolution = await getResolution(id);
  const caps = getPublicationCapabilities(ctx.permissions);
  return getAvailablePublicationTransitions(
    resolution.publicationStatus,
    caps,
  );
}

export async function listPublishedResolutions() {
  return prisma.resolution.findMany({
    where: { publicationStatus: PublicationStatus.PUBLISHED },
    orderBy: { resolutionDate: "desc" },
  });
}
