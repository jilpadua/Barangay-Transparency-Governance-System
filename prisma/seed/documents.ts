import { PublicationStatus, type PrismaClient } from "@prisma/client";

export async function seedDocuments(
  prisma: PrismaClient,
  barangayId: string,
  year: number,
) {
  return prisma.document.create({
    data: {
      barangayId,
      documentCode: "DOC-DEMO-0001",
      title: `${year} Annual Budget Document (DEMO)`,
      description: "DEMO budget PDF placeholder metadata.",
      category: "Budget",
      referenceNumber: "BUD-DEMO-001",
      publicationDate: new Date(`${year}-01-10`),
      visibility: "PUBLIC",
      publicationStatus: PublicationStatus.PUBLISHED,
      publishedAt: new Date(),
      isDemo: true,
      versions: {
        create: {
          version: "1.0",
          fileUrl: "/uploads/demo/annual-budget.pdf",
          fileName: "annual-budget-demo.pdf",
          mimeType: "application/pdf",
          isCurrent: true,
        },
      },
    },
  });
}
