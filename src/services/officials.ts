import { OfficialBody, PublicationStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { PERMISSIONS } from "@/lib/permissions";
import { assertPermission } from "@/lib/permissions/server";
import { parseOrThrow } from "@/lib/validation";
import {
  committeeFormSchema,
  officialFormSchema,
  officialTransitionSchema,
} from "@/lib/validation/schemas/officials";
import { auditMutation } from "@/services/audit-helper";
import { getServiceContext } from "@/services/context";
import {
  getAvailablePublicationTransitions,
  getPublicationCapabilities,
  transitionPublicationStatus,
} from "@/services/publication";

export async function listOfficials(filters?: {
  body?: OfficialBody;
  publicationStatus?: PublicationStatus;
  isActive?: boolean;
}) {
  const ctx = await getServiceContext();
  assertPermission(ctx.permissions, PERMISSIONS.OFFICIALS_VIEW);

  return prisma.official.findMany({
    where: {
      barangayId: ctx.barangayId,
      ...(filters?.body && { body: filters.body }),
      ...(filters?.publicationStatus && {
        publicationStatus: filters.publicationStatus,
      }),
      ...(filters?.isActive !== undefined && { isActive: filters.isActive }),
    },
    include: { committee: true },
    orderBy: [{ body: "asc" }, { position: "asc" }],
  });
}

export async function listCommittees(body?: OfficialBody) {
  const ctx = await getServiceContext();
  assertPermission(ctx.permissions, PERMISSIONS.OFFICIALS_VIEW);

  return prisma.committee.findMany({
    where: {
      barangayId: ctx.barangayId,
      ...(body && { body }),
    },
    orderBy: { name: "asc" },
  });
}

export async function getOfficial(id: string) {
  const ctx = await getServiceContext();
  assertPermission(ctx.permissions, PERMISSIONS.OFFICIALS_VIEW);

  const official = await prisma.official.findFirst({
    where: { id, barangayId: ctx.barangayId },
    include: { committee: true },
  });
  if (!official) throw new Error("Official not found");
  return official;
}

export async function createOfficial(data: unknown) {
  const ctx = await getServiceContext();
  assertPermission(ctx.permissions, PERMISSIONS.OFFICIALS_MANAGE);
  const input = parseOrThrow(officialFormSchema, data);

  const official = await prisma.official.create({
    data: {
      barangayId: ctx.barangayId,
      body: input.body,
      committeeId: input.committeeId || null,
      firstName: input.firstName,
      lastName: input.lastName,
      middleName: input.middleName,
      position: input.position,
      photoUrl: input.photoUrl,
      publicBio: input.publicBio,
      publicEmail: input.publicEmail,
      termStart: input.termStart,
      termEnd: input.termEnd,
      isActive: input.isActive,
      publicationStatus: PublicationStatus.DRAFT,
    },
  });

  await auditMutation(ctx, {
    action: "CREATE",
    module: "officials",
    recordId: official.id,
  });

  return official;
}

export async function updateOfficial(id: string, data: unknown) {
  const ctx = await getServiceContext();
  assertPermission(ctx.permissions, PERMISSIONS.OFFICIALS_MANAGE);
  const input = parseOrThrow(officialFormSchema, data);

  const existing = await getOfficial(id);
  const official = await prisma.official.update({
    where: { id: existing.id },
    data: {
      body: input.body,
      committeeId: input.committeeId || null,
      firstName: input.firstName,
      lastName: input.lastName,
      middleName: input.middleName,
      position: input.position,
      photoUrl: input.photoUrl,
      publicBio: input.publicBio,
      publicEmail: input.publicEmail,
      termStart: input.termStart,
      termEnd: input.termEnd,
      isActive: input.isActive,
    },
  });

  await auditMutation(ctx, {
    action: "UPDATE",
    module: "officials",
    recordId: official.id,
  });

  return official;
}

export async function transitionOfficialPublication(id: string, data: unknown) {
  const ctx = await getServiceContext();
  const input = parseOrThrow(officialTransitionSchema, data);
  const existing = await getOfficial(id);
  const caps = getPublicationCapabilities(ctx.permissions);
  const transition = transitionPublicationStatus(
    existing.publicationStatus,
    input.publicationStatus,
    caps,
  );

  const official = await prisma.official.update({
    where: { id },
    data: {
      publicationStatus: transition.status,
      publishedAt: transition.publishedAt ?? existing.publishedAt,
    },
  });

  await auditMutation(ctx, {
    action: "TRANSITION",
    module: "officials",
    recordId: official.id,
    metadata: {
      from: existing.publicationStatus,
      to: transition.status,
    },
  });

  return official;
}

export async function createCommittee(data: unknown) {
  const ctx = await getServiceContext();
  assertPermission(ctx.permissions, PERMISSIONS.OFFICIALS_MANAGE);
  const input = parseOrThrow(committeeFormSchema, data);

  return prisma.committee.create({
    data: {
      barangayId: ctx.barangayId,
      name: input.name,
      body: input.body,
      description: input.description,
    },
  });
}

export async function getOfficialPublicationTransitions(id: string) {
  const ctx = await getServiceContext();
  const official = await getOfficial(id);
  const caps = getPublicationCapabilities(ctx.permissions);
  return getAvailablePublicationTransitions(official.publicationStatus, caps);
}

export async function listPublishedOfficials() {
  return prisma.official.findMany({
    where: {
      publicationStatus: PublicationStatus.PUBLISHED,
      isActive: true,
    },
    include: { committee: true },
    orderBy: [{ body: "asc" }, { position: "asc" }],
  });
}
