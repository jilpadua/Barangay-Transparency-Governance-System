import { PublicationStatus, type PrismaClient } from "@prisma/client";

export async function seedOfficials(prisma: PrismaClient, barangayId: string) {
  const committee = await prisma.committee.create({
    data: {
      barangayId,
      name: "Committee on Appropriation (DEMO)",
      body: "BARANGAY",
    },
  });

  const captain = await prisma.official.create({
    data: {
      barangayId,
      committeeId: committee.id,
      body: "BARANGAY",
      firstName: "Maria",
      lastName: "Santos",
      position: "Punong Barangay",
      publicBio: "DEMO official profile.",
      termStart: new Date("2023-07-01"),
      termEnd: new Date("2026-06-30"),
      publicationStatus: PublicationStatus.PUBLISHED,
      publishedAt: new Date(),
      isDemo: true,
    },
  });

  await prisma.official.create({
    data: {
      barangayId,
      body: "BARANGAY",
      firstName: "Juan",
      lastName: "Reyes",
      position: "Barangay Secretary",
      publicationStatus: PublicationStatus.PUBLISHED,
      publishedAt: new Date(),
      isDemo: true,
    },
  });

  await prisma.official.create({
    data: {
      barangayId,
      body: "SK",
      firstName: "Ana",
      lastName: "Cruz",
      position: "SK Chairperson",
      publicationStatus: PublicationStatus.PUBLISHED,
      publishedAt: new Date(),
      isDemo: true,
    },
  });

  return { committee, captain };
}
