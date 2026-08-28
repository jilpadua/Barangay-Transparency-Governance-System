import {
  DocumentVisibility,
  PublicationStatus,
} from "@prisma/client";
import { prisma } from "@/lib/db";
import { PERMISSIONS } from "@/lib/permissions";
import { assertPermission } from "@/lib/permissions/server";
import { parseOrThrow } from "@/lib/validation";
import {
  documentFormSchema,
  documentTransitionSchema,
} from "@/lib/validation/schemas/documents";
import { getStorageProvider } from "@/lib/storage";
import { fileToBuffer, validateUpload } from "@/lib/storage/validate";
import { auditMutation } from "@/services/audit-helper";
import { getServiceContext } from "@/services/context";
import {
  getAvailablePublicationTransitions,
  getPublicationCapabilities,
  transitionPublicationStatus,
} from "@/services/publication";

async function generateDocumentCode(barangayId: string) {
  const year = new Date().getFullYear();
  const count = await prisma.document.count({
    where: { barangayId },
  });
  return `DOC-${year}-${String(count + 1).padStart(4, "0")}`;
}

export async function listDocuments() {
  const ctx = await getServiceContext();
  assertPermission(ctx.permissions, PERMISSIONS.DOCUMENTS_VIEW);

  return prisma.document.findMany({
    where: { barangayId: ctx.barangayId },
    include: {
      versions: { where: { isCurrent: true }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getDocument(id: string) {
  const ctx = await getServiceContext();
  assertPermission(ctx.permissions, PERMISSIONS.DOCUMENTS_VIEW);

  const document = await prisma.document.findFirst({
    where: { id, barangayId: ctx.barangayId },
    include: { versions: { orderBy: { createdAt: "desc" } } },
  });
  if (!document) throw new Error("Document not found");
  return document;
}

export async function createDocument(data: unknown, file?: File | null) {
  const ctx = await getServiceContext();
  assertPermission(ctx.permissions, PERMISSIONS.DOCUMENTS_MANAGE);
  const input = parseOrThrow(documentFormSchema, data);

  if (!file) throw new Error("File is required for new documents");
  validateUpload(file);
  const buffer = await fileToBuffer(file);
  const stored = await getStorageProvider().upload(buffer, {
    fileName: file.name,
    mimeType: file.type,
    folder: "documents",
  });

  const documentCode = await generateDocumentCode(ctx.barangayId);

  const document = await prisma.document.create({
    data: {
      barangayId: ctx.barangayId,
      documentCode,
      title: input.title,
      description: input.description,
      category: input.category,
      referenceNumber: input.referenceNumber,
      publicationDate: input.publicationDate,
      visibility: input.visibility,
      publicationStatus: PublicationStatus.DRAFT,
      versions: {
        create: {
          version: "1.0",
          fileUrl: stored.url,
          fileName: stored.fileName,
          fileSize: stored.size,
          mimeType: stored.mimeType,
          isCurrent: true,
        },
      },
    },
    include: { versions: true },
  });

  await auditMutation(ctx, {
    action: "CREATE",
    module: "documents",
    recordId: document.id,
  });

  return document;
}

export async function updateDocumentMetadata(id: string, data: unknown) {
  const ctx = await getServiceContext();
  assertPermission(ctx.permissions, PERMISSIONS.DOCUMENTS_MANAGE);
  const input = parseOrThrow(documentFormSchema, data);
  const existing = await getDocument(id);

  const document = await prisma.document.update({
    where: { id: existing.id },
    data: {
      title: input.title,
      description: input.description,
      category: input.category,
      referenceNumber: input.referenceNumber,
      publicationDate: input.publicationDate,
      visibility: input.visibility,
    },
  });

  await auditMutation(ctx, {
    action: "UPDATE",
    module: "documents",
    recordId: document.id,
  });

  return document;
}

export async function uploadNewVersion(
  id: string,
  file: File,
  notes?: string,
) {
  const ctx = await getServiceContext();
  assertPermission(ctx.permissions, PERMISSIONS.DOCUMENTS_MANAGE);
  validateUpload(file);

  const existing = await getDocument(id);
  const currentVersion = existing.versions.find((v) => v.isCurrent);
  const nextVersionNum = currentVersion
    ? parseFloat(currentVersion.version) + 0.1
    : 1.0;

  const buffer = await fileToBuffer(file);
  const stored = await getStorageProvider().upload(buffer, {
    fileName: file.name,
    mimeType: file.type,
    folder: "documents",
  });

  await prisma.$transaction([
    prisma.documentVersion.updateMany({
      where: { documentId: id, isCurrent: true },
      data: { isCurrent: false },
    }),
    prisma.documentVersion.create({
      data: {
        documentId: id,
        version: nextVersionNum.toFixed(1),
        fileUrl: stored.url,
        fileName: stored.fileName,
        fileSize: stored.size,
        mimeType: stored.mimeType,
        notes,
        isCurrent: true,
      },
    }),
  ]);

  await auditMutation(ctx, {
    action: "UPLOAD_VERSION",
    module: "documents",
    recordId: id,
    metadata: { version: nextVersionNum.toFixed(1) },
  });

  return getDocument(id);
}

export async function transitionDocumentPublication(id: string, data: unknown) {
  const ctx = await getServiceContext();
  const input = parseOrThrow(documentTransitionSchema, data);
  const existing = await getDocument(id);
  const caps = getPublicationCapabilities(
    ctx.permissions,
    PERMISSIONS.DOCUMENTS_PUBLISH,
  );
  const transition = transitionPublicationStatus(
    existing.publicationStatus,
    input.publicationStatus,
    caps,
  );

  const document = await prisma.document.update({
    where: { id },
    data: {
      publicationStatus: transition.status,
      publishedAt: transition.publishedAt ?? existing.publishedAt,
    },
  });

  await auditMutation(ctx, {
    action: "TRANSITION",
    module: "documents",
    recordId: document.id,
    metadata: {
      from: existing.publicationStatus,
      to: transition.status,
    },
  });

  return document;
}

export async function getDocumentPublicationTransitions(id: string) {
  const ctx = await getServiceContext();
  const document = await getDocument(id);
  const caps = getPublicationCapabilities(
    ctx.permissions,
    PERMISSIONS.DOCUMENTS_PUBLISH,
  );
  return getAvailablePublicationTransitions(document.publicationStatus, caps);
}

export async function listPublishedDocuments(filters?: {
  category?: string;
  search?: string;
}) {
  return prisma.document.findMany({
    where: {
      publicationStatus: PublicationStatus.PUBLISHED,
      visibility: DocumentVisibility.PUBLIC,
      ...(filters?.category && { category: filters.category }),
      ...(filters?.search && {
        OR: [
          { title: { contains: filters.search, mode: "insensitive" } },
          { documentCode: { contains: filters.search, mode: "insensitive" } },
        ],
      }),
    },
    include: {
      versions: { where: { isCurrent: true }, take: 1 },
    },
    orderBy: { publishedAt: "desc" },
  });
}

export async function getPublishedDocument(id: string) {
  const document = await prisma.document.findFirst({
    where: {
      id,
      publicationStatus: PublicationStatus.PUBLISHED,
      visibility: DocumentVisibility.PUBLIC,
    },
    include: {
      versions: { where: { isCurrent: true }, take: 1 },
    },
  });
  if (!document) throw new Error("Document not found");
  return document;
}
