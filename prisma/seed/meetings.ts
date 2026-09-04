import { PublicationStatus, type PrismaClient } from "@prisma/client";

export async function seedMeetings(
  prisma: PrismaClient,
  barangayId: string,
  year: number,
  captainId: string,
) {
  const meeting = await prisma.meeting.create({
    data: {
      barangayId,
      meetingType: "Regular Session",
      title: "January Regular Session (DEMO)",
      meetingDate: new Date(`${year}-01-15`),
      startTime: "09:00",
      location: "Barangay Hall Session Hall",
      agenda: "DEMO agenda items.",
      status: "COMPLETED",
      publicationStatus: PublicationStatus.PUBLISHED,
      publishedAt: new Date(),
      isDemo: true,
    },
  });

  await prisma.attendance.create({
    data: {
      meetingId: meeting.id,
      officialId: captainId,
      status: "PRESENT",
    },
  });

  return meeting;
}
