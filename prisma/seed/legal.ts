import { PublicationStatus, type PrismaClient } from "@prisma/client";

export async function seedLegal(
  prisma: PrismaClient,
  barangayId: string,
  year: number,
) {
  await prisma.resolution.create({
    data: {
      barangayId,
      referenceNumber: "RES-DEMO-001",
      title: "Resolution adopting transparency portal (DEMO)",
      subject: "Governance",
      authoringBody: "Sangguniang Barangay",
      resolutionDate: new Date(`${year}-01-15`),
      description: "DEMO resolution.",
      status: "APPROVED",
      publicationStatus: PublicationStatus.PUBLISHED,
      publishedAt: new Date(),
      isDemo: true,
    },
  });

  await prisma.ordinance.create({
    data: {
      barangayId,
      referenceNumber: "ORD-DEMO-001",
      title: "Ordinance on public document access (DEMO)",
      subject: "Transparency",
      authoringBody: "Sangguniang Barangay",
      ordinanceDate: new Date(`${year}-02-01`),
      description: "DEMO ordinance.",
      status: "ENACTED",
      publicationStatus: PublicationStatus.PUBLISHED,
      publishedAt: new Date(),
      isDemo: true,
    },
  });
}
