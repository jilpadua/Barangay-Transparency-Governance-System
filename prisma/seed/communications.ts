import { PublicationStatus, type PrismaClient } from "@prisma/client";

export async function seedCommunications(
  prisma: PrismaClient,
  barangayId: string,
  year: number,
  projectId: string,
) {
  await prisma.event.create({
    data: {
      barangayId,
      title: "Barangay Assembly (DEMO)",
      description: "DEMO community assembly.",
      eventDate: new Date(`${year}-09-15`),
      startTime: "08:00",
      location: "Covered Court",
      organizer: "Barangay Council",
      publicationStatus: PublicationStatus.PUBLISHED,
      publishedAt: new Date(),
      isDemo: true,
      photoUrls: [],
    },
  });

  await prisma.announcement.create({
    data: {
      barangayId,
      title: "Transparency portal now available (DEMO)",
      content:
        "Residents may browse published budgets, projects, and documents. This announcement is DEMO content.",
      publishDate: new Date(),
      featured: true,
      publicationStatus: PublicationStatus.PUBLISHED,
      publishedAt: new Date(),
      isDemo: true,
      attachmentUrls: [],
    },
  });

  await prisma.accomplishment.create({
    data: {
      barangayId,
      projectId,
      title: "Q1 Accomplishment Report (DEMO)",
      reportType: "Quarterly",
      periodLabel: `Q1 ${year}`,
      description: "DEMO accomplishment summary.",
      publicationStatus: PublicationStatus.PUBLISHED,
      publishedAt: new Date(),
      isDemo: true,
    },
  });
}
