import { PublicationStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { PERMISSIONS } from "@/lib/permissions";
import { assertPermission } from "@/lib/permissions/server";
import { parseOrThrow } from "@/lib/validation";
import {
  announcementFormSchema,
  announcementTransitionSchema,
} from "@/lib/validation/schemas/announcements";
import { auditMutation } from "@/services/audit-helper";
import { getServiceContext } from "@/services/context";
import {
  getAvailablePublicationTransitions,
  getPublicationCapabilities,
  transitionPublicationStatus,
} from "@/services/publication";

export async function listAnnouncements() {
  const ctx = await getServiceContext();
  assertPermission(ctx.permissions, PERMISSIONS.ANNOUNCEMENTS_VIEW);

  return prisma.announcement.findMany({
    where: { barangayId: ctx.barangayId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAnnouncement(id: string) {
  const ctx = await getServiceContext();
  assertPermission(ctx.permissions, PERMISSIONS.ANNOUNCEMENTS_VIEW);

  const announcement = await prisma.announcement.findFirst({
    where: { id, barangayId: ctx.barangayId },
  });
  if (!announcement) throw new Error("Announcement not found");
  return announcement;
}

export async function createAnnouncement(data: unknown) {
  const ctx = await getServiceContext();
  assertPermission(ctx.permissions, PERMISSIONS.ANNOUNCEMENTS_MANAGE);
  const input = parseOrThrow(announcementFormSchema, data);

  const announcement = await prisma.announcement.create({
    data: {
      barangayId: ctx.barangayId,
      ...input,
      publicationStatus: PublicationStatus.DRAFT,
    },
  });

  await auditMutation(ctx, {
    action: "CREATE",
    module: "announcements",
    recordId: announcement.id,
  });

  return announcement;
}

export async function updateAnnouncement(id: string, data: unknown) {
  const ctx = await getServiceContext();
  assertPermission(ctx.permissions, PERMISSIONS.ANNOUNCEMENTS_MANAGE);
  const input = parseOrThrow(announcementFormSchema, data);
  const existing = await getAnnouncement(id);

  const announcement = await prisma.announcement.update({
    where: { id: existing.id },
    data: input,
  });

  await auditMutation(ctx, {
    action: "UPDATE",
    module: "announcements",
    recordId: announcement.id,
  });

  return announcement;
}

export async function transitionAnnouncementPublication(
  id: string,
  data: unknown,
) {
  const ctx = await getServiceContext();
  const input = parseOrThrow(announcementTransitionSchema, data);
  const existing = await getAnnouncement(id);
  const caps = getPublicationCapabilities(ctx.permissions);
  const transition = transitionPublicationStatus(
    existing.publicationStatus,
    input.publicationStatus,
    caps,
  );

  const announcement = await prisma.announcement.update({
    where: { id },
    data: {
      publicationStatus: transition.status,
      publishedAt: transition.publishedAt ?? existing.publishedAt,
    },
  });

  await auditMutation(ctx, {
    action: "TRANSITION",
    module: "announcements",
    recordId: announcement.id,
    metadata: { from: existing.publicationStatus, to: transition.status },
  });

  return announcement;
}

export async function getAnnouncementPublicationTransitions(id: string) {
  const ctx = await getServiceContext();
  const announcement = await getAnnouncement(id);
  const caps = getPublicationCapabilities(ctx.permissions);
  return getAvailablePublicationTransitions(
    announcement.publicationStatus,
    caps,
  );
}

export async function listPublishedAnnouncements() {
  const now = new Date();
  return prisma.announcement.findMany({
    where: {
      publicationStatus: PublicationStatus.PUBLISHED,
      OR: [{ expireDate: null }, { expireDate: { gte: now } }],
    },
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
  });
}
