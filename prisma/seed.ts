/**
 * DEMO SEED DATA
 * All records created here are marked isDemo=true where applicable.
 * Do not treat as official government publications.
 */
import { PrismaClient, PublicationStatus, ProjectStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  PERMISSIONS,
  ROLE_CODES,
  ROLE_PERMISSION_MAP,
} from "../src/lib/permissions";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding BTGS demo data…");

  // Clean in dependency order for idempotent re-seed in development
  await prisma.blockchainMilestone.deleteMany();
  await prisma.blockchainProof.deleteMany();
  await prisma.feedbackStatusHistory.deleteMany();
  await prisma.feedback.deleteMany();
  await prisma.accomplishment.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.event.deleteMany();
  await prisma.ordinance.deleteMany();
  await prisma.resolution.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.meeting.deleteMany();
  await prisma.documentVersion.deleteMany();
  await prisma.document.deleteMany();
  await prisma.procurement.deleteMany();
  await prisma.projectMedia.deleteMany();
  await prisma.projectUpdate.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.budgetAllocation.deleteMany();
  await prisma.budget.deleteMany();
  await prisma.project.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.fundSource.deleteMany();
  await prisma.official.deleteMany();
  await prisma.committee.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.userRole.deleteMany();
  await prisma.rolePermission.deleteMany();
  await prisma.user.deleteMany();
  await prisma.permission.deleteMany();
  await prisma.role.deleteMany();
  await prisma.barangay.deleteMany();

  const barangay = await prisma.barangay.create({
    data: {
      name: "Barangay San Jose (DEMO)",
      municipality: "Sample City",
      province: "Sample Province",
      address: "123 Rizal Street, Barangay San Jose",
      contactEmail: "info@demo.barangay.gov.ph",
      contactPhone: "+63 912 000 0000",
      officeHours: "Monday–Friday, 8:00 AM – 5:00 PM",
      tagline: "Open records. Clear governance.",
      history:
        "DEMO barangay profile for the Barangay Transparency & Governance System.",
      mission:
        "To provide transparent, accessible public information for residents.",
      vision: "A trusted, digitally enabled barangay administration.",
      generalInfo:
        "This portal publishes budgets, projects, documents, meetings, and related transparency records. All seed content is DEMO only.",
      isDemo: true,
    },
  });

  // Permissions
  const permissionRecords = await Promise.all(
    Object.values(PERMISSIONS).map((code) => {
      const [module] = code.split(":");
      return prisma.permission.create({
        data: {
          code,
          name: code,
          module,
          description: `Permission ${code}`,
        },
      });
    }),
  );
  const permByCode = Object.fromEntries(
    permissionRecords.map((p) => [p.code, p.id]),
  );

  // Roles
  const roleRecords: Record<string, string> = {};
  for (const [code, perms] of Object.entries(ROLE_PERMISSION_MAP)) {
    const role = await prisma.role.create({
      data: {
        code,
        name: code
          .split("_")
          .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
          .join(" "),
        description: `Role ${code}`,
        rolePermissions: {
          create: perms.map((p) => ({
            permissionId: permByCode[p],
          })),
        },
      },
    });
    roleRecords[code] = role.id;
  }

  const passwordHash = await bcrypt.hash("DemoAdmin123!", 12);

  const admin = await prisma.user.create({
    data: {
      email: "admin@demo.barangay.gov.ph",
      username: "superadmin",
      name: "Demo Super Admin",
      passwordHash,
      barangayId: barangay.id,
      mfaEnabled: false,
      userRoles: {
        create: [{ roleId: roleRecords[ROLE_CODES.SUPER_ADMIN] }],
      },
    },
  });

  await prisma.user.create({
    data: {
      email: "treasurer@demo.barangay.gov.ph",
      name: "Demo Treasurer",
      passwordHash,
      barangayId: barangay.id,
      userRoles: {
        create: [{ roleId: roleRecords[ROLE_CODES.TREASURER] }],
      },
    },
  });

  await prisma.user.create({
    data: {
      email: "secretary@demo.barangay.gov.ph",
      name: "Demo Secretary",
      passwordHash,
      barangayId: barangay.id,
      userRoles: {
        create: [{ roleId: roleRecords[ROLE_CODES.SECRETARY] }],
      },
    },
  });

  const committee = await prisma.committee.create({
    data: {
      barangayId: barangay.id,
      name: "Committee on Appropriation (DEMO)",
      body: "BARANGAY",
    },
  });

  const captain = await prisma.official.create({
    data: {
      barangayId: barangay.id,
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
      barangayId: barangay.id,
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
      barangayId: barangay.id,
      body: "SK",
      firstName: "Ana",
      lastName: "Cruz",
      position: "SK Chairperson",
      publicationStatus: PublicationStatus.PUBLISHED,
      publishedAt: new Date(),
      isDemo: true,
    },
  });

  const fund = await prisma.fundSource.create({
    data: {
      barangayId: barangay.id,
      name: "General Fund (DEMO)",
      code: "GF",
    },
  });

  const year = new Date().getFullYear();
  const budget = await prisma.budget.create({
    data: {
      barangayId: barangay.id,
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

  const supplier = await prisma.supplier.create({
    data: {
      barangayId: barangay.id,
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
        barangayId: barangay.id,
        projectCode: def.code,
        title: def.title,
        description: "DEMO project for transparency portal testing.",
        category: "Infrastructure",
        location: "Barangay San Jose",
        implementingOffice: "Barangay Hall",
        responsibleOfficialId: captain.id,
        budgetAmount: 500_000,
        contractAmount: 480_000,
        fundSourceId: fund.id,
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
      barangayId: barangay.id,
      budgetId: budget.id,
      fundSourceId: fund.id,
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
      barangayId: barangay.id,
      budgetId: budget.id,
      fundSourceId: fund.id,
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
      barangayId: barangay.id,
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

  const doc = await prisma.document.create({
    data: {
      barangayId: barangay.id,
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

  const meeting = await prisma.meeting.create({
    data: {
      barangayId: barangay.id,
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
      officialId: captain.id,
      status: "PRESENT",
    },
  });

  await prisma.resolution.create({
    data: {
      barangayId: barangay.id,
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
      barangayId: barangay.id,
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

  await prisma.event.create({
    data: {
      barangayId: barangay.id,
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
      barangayId: barangay.id,
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
      barangayId: barangay.id,
      projectId: projects[2].id,
      title: "Q1 Accomplishment Report (DEMO)",
      reportType: "Quarterly",
      periodLabel: `Q1 ${year}`,
      description: "DEMO accomplishment summary.",
      publicationStatus: PublicationStatus.PUBLISHED,
      publishedAt: new Date(),
      isDemo: true,
    },
  });

  const feedback = await prisma.feedback.create({
    data: {
      barangayId: barangay.id,
      trackingNumber: `BRGY-${year}-00001`,
      type: "SUGGESTION",
      subject: "Street lighting suggestion (DEMO)",
      message: "DEMO feedback message — personal details are internal only.",
      contactName: "Resident Demo",
      contactEmail: "resident@example.com",
      status: "RECEIVED",
      isDemo: true,
      statusHistory: {
        create: {
          status: "RECEIVED",
          publicNote: "Your feedback was received.",
        },
      },
    },
  });

  await prisma.blockchainProof.create({
    data: {
      barangayId: barangay.id,
      recordId: doc.documentCode,
      recordType: "Document",
      version: "1.0",
      contentHash:
        "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
      network: "mock",
      transactionHash: "0xdemotransactionhash00000000000000000001",
      blockNumber: 12345,
      anchoredAt: new Date(),
      status: "CONFIRMED",
    },
  });

  await prisma.blockchainProof.create({
    data: {
      barangayId: barangay.id,
      recordId: projects[0].projectCode,
      recordType: "Project",
      version: "1.0",
      contentHash:
        "abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789",
      status: "PENDING",
    },
  });

  await prisma.auditLog.create({
    data: {
      barangayId: barangay.id,
      userId: admin.id,
      userEmail: admin.email,
      userRole: ROLE_CODES.SUPER_ADMIN,
      action: "SEED",
      module: "System",
      recordId: barangay.id,
      newValue: "Demo database seeded",
    },
  });

  console.log("Seed complete.");
  console.log("  Barangay:", barangay.name);
  console.log("  Admin: admin@demo.barangay.gov.ph / DemoAdmin123!");
  console.log("  Feedback sample:", feedback.trackingNumber);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
