import {
  ProjectStatus,
  PublicationStatus,
  type PrismaClient,
} from "@prisma/client";

export async function seedProjects(
  prisma: PrismaClient,
  barangayId: string,
  year: number,
  fundId: string,
  captainId: string,
  budgetId: string,
) {
  const supplier = await prisma.supplier.create({
    data: {
      barangayId,
      name: "Demo Builders Corp.",
      isDemo: true,
    },
  });

  const projects = [];
  const projectDefs = [
    {
      code: "PRJ-DEMO-001",
      title: "Barangay Road Rehabilitation (DEMO)",
      status: ProjectStatus.ONGOING,
      progress: 45,
    },
    {
      code: "PRJ-DEMO-002",
      title: "Health Center Upgrade (DEMO)",
      status: ProjectStatus.PROCUREMENT,
      progress: 10,
    },
    {
      code: "PRJ-DEMO-003",
      title: "Daycare Facility Improvement (DEMO)",
      status: ProjectStatus.COMPLETED,
      progress: 100,
    },
    {
      code: "PRJ-DEMO-004",
      title: "Drainage Clearing Program (DEMO)",
      status: ProjectStatus.ONGOING,
      progress: 60,
    },
    {
      code: "PRJ-DEMO-005",
      title: "SK Youth Skills Workshop (DEMO)",
      status: ProjectStatus.APPROVED,
      progress: 5,
      isSk: true,
    },
  ];

  for (const def of projectDefs) {
    const project = await prisma.project.create({
      data: {
        barangayId,
        projectCode: def.code,
        title: def.title,
        description: "DEMO project for transparency portal testing.",
        category: "Infrastructure",
        location: "Barangay San Jose",
        implementingOffice: "Barangay Hall",
        responsibleOfficialId: captainId,
        budgetAmount: 500_000,
        contractAmount: 480_000,
        fundSourceId: fundId,
        supplierId: supplier.id,
        startDate: new Date(`${year}-01-15`),
        targetCompletion: new Date(`${year}-12-15`),
        status: def.status,
        progressPercent: def.progress,
        publicationStatus: PublicationStatus.PUBLISHED,
        publishedAt: new Date(),
        isDemo: true,
        isSk: def.isSk ?? false,
      },
    });
    projects.push(project);
  }

  await prisma.expense.create({
    data: {
      barangayId,
      budgetId,
      fundSourceId: fundId,
      projectId: projects[0].id,
      expenseDate: new Date(`${year}-03-10`),
      referenceNumber: "EXP-DEMO-0001",
      amount: 250_000,
      purpose: "Partial payment — road rehabilitation (DEMO)",
      payee: "Demo Builders Corp.",
      supplierId: supplier.id,
      publicationStatus: PublicationStatus.PUBLISHED,
      publishedAt: new Date(),
      isDemo: true,
    },
  });

  await prisma.expense.create({
    data: {
      barangayId,
      budgetId,
      fundSourceId: fundId,
      expenseDate: new Date(`${year}-04-02`),
      referenceNumber: "EXP-DEMO-0002",
      amount: 75_000,
      purpose: "Office supplies and maintenance (DEMO)",
      payee: "Demo Supplies Co.",
      publicationStatus: PublicationStatus.PUBLISHED,
      publishedAt: new Date(),
      isDemo: true,
    },
  });

  await prisma.procurement.create({
    data: {
      barangayId,
      projectId: projects[0].id,
      supplierId: supplier.id,
      referenceNumber: "PRC-DEMO-0001",
      title: "Road rehabilitation materials (DEMO)",
      method: "Public Bidding",
      approvedBudget: 500_000,
      contractAmount: 480_000,
      procurementDate: new Date(`${year}-01-05`),
      awardDate: new Date(`${year}-01-20`),
      status: "Awarded",
      publicationStatus: PublicationStatus.PUBLISHED,
      publishedAt: new Date(),
      isDemo: true,
    },
  });

  return { supplier, projects };
}
