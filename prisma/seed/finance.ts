import { PublicationStatus, type PrismaClient } from "@prisma/client";

export async function seedFinance(
  prisma: PrismaClient,
  barangayId: string,
  year: number,
) {
  const fund = await prisma.fundSource.create({
    data: {
      barangayId,
      name: "General Fund (DEMO)",
      code: "GF",
    },
  });

  const budget = await prisma.budget.create({
    data: {
      barangayId,
      fundSourceId: fund.id,
      fiscalYear: year,
      category: "General Appropriations",
      title: `${year} Annual Budget (DEMO)`,
      approvedAmount: 5_000_000,
      publicationStatus: PublicationStatus.PUBLISHED,
      publishedAt: new Date(),
      isDemo: true,
      allocations: {
        create: [
          { lineItem: "Infrastructure", amount: 2_000_000 },
          { lineItem: "Social Services", amount: 1_500_000 },
          { lineItem: "Operations", amount: 1_500_000 },
        ],
      },
    },
  });

  return { fund, budget };
}
