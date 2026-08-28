import { PublicationStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { PERMISSIONS } from "@/lib/permissions";
import { assertPermission } from "@/lib/permissions/server";
import { parseOrThrow } from "@/lib/validation";
import {
  eventFormSchema,
  eventTransitionSchema,
} from "@/lib/validation/schemas/events";
import { auditMutation } from "@/services/audit-helper";
import { getServiceContext } from "@/services/context";
import {
  getAvailablePublicationTransitions,
  getPublicationCapabilities,
  transitionPublicationStatus,
} from "@/services/publication";

export async function listEvents() {
  const ctx = await getServiceContext();
  assertPermission(ctx.permissions, PERMISSIONS.EVENTS_VIEW);

  return prisma.event.findMany({
    where: { barangayId: ctx.barangayId },
    orderBy: { eventDate: "desc" },
  });
}

export async function getEvent(id: string) {
  const ctx = await getServiceContext();
  assertPermission(ctx.permissions, PERMISSIONS.EVENTS_VIEW);

  const event = await prisma.event.findFirst({
    where: { id, barangayId: ctx.barangayId },
  });
  if (!event) throw new Error("Event not found");
  return event;
}

export async function createEvent(data: unknown) {
  const ctx = await getServiceContext();
  assertPermission(ctx.permissions, PERMISSIONS.EVENTS_MANAGE);
  const input = parseOrThrow(eventFormSchema, data);

  const event = await prisma.event.create({
    data: {
      barangayId: ctx.barangayId,
      ...input,
      publicationStatus: PublicationStatus.DRAFT,
    },
  });

  await auditMutation(ctx, {
    action: "CREATE",
    module: "events",
    recordId: event.id,
  });

  return event;
}

export async function updateEvent(id: string, data: unknown) {
  const ctx = await getServiceContext();
  assertPermission(ctx.permissions, PERMISSIONS.EVENTS_MANAGE);
  const input = parseOrThrow(eventFormSchema, data);
  const existing = await getEvent(id);

  const event = await prisma.event.update({
    where: { id: existing.id },
    data: input,
  });

  await auditMutation(ctx, {
    action: "UPDATE",
    module: "events",
    recordId: event.id,
  });

  return event;
}

export async function transitionEventPublication(id: string, data: unknown) {
  const ctx = await getServiceContext();
  const input = parseOrThrow(eventTransitionSchema, data);
  const existing = await getEvent(id);
  const caps = getPublicationCapabilities(ctx.permissions);
  const transition = transitionPublicationStatus(
    existing.publicationStatus,
    input.publicationStatus,
    caps,
  );

  const event = await prisma.event.update({
    where: { id },
    data: {
      publicationStatus: transition.status,
      publishedAt: transition.publishedAt ?? existing.publishedAt,
    },
  });

  await auditMutation(ctx, {
    action: "TRANSITION",
    module: "events",
    recordId: event.id,
    metadata: { from: existing.publicationStatus, to: transition.status },
  });

  return event;
}

export async function getEventPublicationTransitions(id: string) {
  const ctx = await getServiceContext();
  const event = await getEvent(id);
  const caps = getPublicationCapabilities(ctx.permissions);
  return getAvailablePublicationTransitions(event.publicationStatus, caps);
}

export async function listPublishedEvents() {
  return prisma.event.findMany({
    where: { publicationStatus: PublicationStatus.PUBLISHED },
    orderBy: { eventDate: "desc" },
  });
}
