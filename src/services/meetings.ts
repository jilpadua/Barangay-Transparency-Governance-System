import { AttendanceStatus, PublicationStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { PERMISSIONS } from "@/lib/permissions";
import { assertPermission } from "@/lib/permissions/server";
import { parseOrThrow } from "@/lib/validation";
import {
  attendanceBulkSchema,
  meetingFormSchema,
  meetingTransitionSchema,
} from "@/lib/validation/schemas/meetings";
import { auditMutation } from "@/services/audit-helper";
import { getServiceContext } from "@/services/context";
import {
  getAvailablePublicationTransitions,
  getPublicationCapabilities,
  transitionPublicationStatus,
} from "@/services/publication";

export async function listMeetings() {
  const ctx = await getServiceContext();
  assertPermission(ctx.permissions, PERMISSIONS.MEETINGS_VIEW);

  return prisma.meeting.findMany({
    where: { barangayId: ctx.barangayId },
    orderBy: { meetingDate: "desc" },
  });
}

export async function getMeeting(id: string) {
  const ctx = await getServiceContext();
  assertPermission(ctx.permissions, PERMISSIONS.MEETINGS_VIEW);

  const meeting = await prisma.meeting.findFirst({
    where: { id, barangayId: ctx.barangayId },
    include: {
      attendances: {
        include: { official: true },
      },
    },
  });
  if (!meeting) throw new Error("Meeting not found");
  return meeting;
}

export async function createMeeting(data: unknown) {
  const ctx = await getServiceContext();
  assertPermission(ctx.permissions, PERMISSIONS.MEETINGS_MANAGE);
  const input = parseOrThrow(meetingFormSchema, data);

  const meeting = await prisma.meeting.create({
    data: {
      barangayId: ctx.barangayId,
      ...input,
      publicationStatus: PublicationStatus.DRAFT,
    },
  });

  await auditMutation(ctx, {
    action: "CREATE",
    module: "meetings",
    recordId: meeting.id,
  });

  return meeting;
}

export async function updateMeeting(id: string, data: unknown) {
  const ctx = await getServiceContext();
  assertPermission(ctx.permissions, PERMISSIONS.MEETINGS_MANAGE);
  const input = parseOrThrow(meetingFormSchema, data);
  const existing = await getMeeting(id);

  const meeting = await prisma.meeting.update({
    where: { id: existing.id },
    data: input,
  });

  await auditMutation(ctx, {
    action: "UPDATE",
    module: "meetings",
    recordId: meeting.id,
  });

  return meeting;
}

export async function transitionMeetingPublication(id: string, data: unknown) {
  const ctx = await getServiceContext();
  const input = parseOrThrow(meetingTransitionSchema, data);
  const existing = await getMeeting(id);
  const caps = getPublicationCapabilities(ctx.permissions);
  const transition = transitionPublicationStatus(
    existing.publicationStatus,
    input.publicationStatus,
    caps,
  );

  const meeting = await prisma.meeting.update({
    where: { id },
    data: {
      publicationStatus: transition.status,
      publishedAt: transition.publishedAt ?? existing.publishedAt,
    },
  });

  await auditMutation(ctx, {
    action: "TRANSITION",
    module: "meetings",
    recordId: meeting.id,
    metadata: { from: existing.publicationStatus, to: transition.status },
  });

  return meeting;
}

export async function getMeetingPublicationTransitions(id: string) {
  const ctx = await getServiceContext();
  const meeting = await getMeeting(id);
  const caps = getPublicationCapabilities(ctx.permissions);
  return getAvailablePublicationTransitions(meeting.publicationStatus, caps);
}

export async function saveAttendance(data: unknown) {
  const ctx = await getServiceContext();
  assertPermission(ctx.permissions, PERMISSIONS.ATTENDANCE_MANAGE);
  const input = parseOrThrow(attendanceBulkSchema, data);
  await getMeeting(input.meetingId);

  await prisma.$transaction(
    input.entries.map((entry: { officialId: string; status: AttendanceStatus; remarks?: string }) =>
      prisma.attendance.upsert({
        where: {
          meetingId_officialId: {
            meetingId: input.meetingId,
            officialId: entry.officialId,
          },
        },
        create: {
          meetingId: input.meetingId,
          officialId: entry.officialId,
          status: entry.status,
          remarks: entry.remarks,
        },
        update: {
          status: entry.status,
          remarks: entry.remarks,
        },
      }),
    ),
  );

  await auditMutation(ctx, {
    action: "SAVE_ATTENDANCE",
    module: "meetings",
    recordId: input.meetingId,
    metadata: { count: input.entries.length },
  });
}

export async function listActiveOfficialsForAttendance() {
  const ctx = await getServiceContext();
  return prisma.official.findMany({
    where: {
      barangayId: ctx.barangayId,
      isActive: true,
    },
    orderBy: [{ body: "asc" }, { lastName: "asc" }],
  });
}

export async function listPublishedMeetings() {
  return prisma.meeting.findMany({
    where: { publicationStatus: PublicationStatus.PUBLISHED },
    orderBy: { meetingDate: "desc" },
  });
}

export async function getPublishedMeeting(id: string) {
  const meeting = await prisma.meeting.findFirst({
    where: {
      id,
      publicationStatus: PublicationStatus.PUBLISHED,
    },
    include: {
      attendances: {
        include: { official: true },
      },
    },
  });
  if (!meeting) throw new Error("Meeting not found");
  return meeting;
}
