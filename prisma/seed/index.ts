/**
 * DEMO SEED DATA
 * All records created here are marked isDemo=true where applicable.
 * Do not treat as official government publications.
 */
import { PrismaClient } from "@prisma/client";
import { seedAuditLog } from "./audit";
import { seedAuth } from "./auth";
import { seedBarangay } from "./barangay";
import { seedBlockchain } from "./blockchain";
import { resetDatabase } from "./cleanup";
import { seedCommunications } from "./communications";
import { seedDocuments } from "./documents";
import { seedFeedback } from "./feedback";
import { seedFinance } from "./finance";
import { seedLegal } from "./legal";
import { seedMeetings } from "./meetings";
import { seedOfficials } from "./officials";
import { seedProjects } from "./projects";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding BTGS demo data…");

  await resetDatabase(prisma);

  const barangay = await seedBarangay(prisma);
  const year = new Date().getFullYear();

  const { admin } = await seedAuth(prisma, barangay.id);
  const { captain } = await seedOfficials(prisma, barangay.id);
  const { fund, budget } = await seedFinance(prisma, barangay.id, year);
  const { projects } = await seedProjects(
    prisma,
    barangay.id,
    year,
    fund.id,
    captain.id,
    budget.id,
  );
  const doc = await seedDocuments(prisma, barangay.id, year);
  await seedMeetings(prisma, barangay.id, year, captain.id);
  await seedLegal(prisma, barangay.id, year);
  await seedCommunications(prisma, barangay.id, year, projects[2].id);
  const feedback = await seedFeedback(prisma, barangay.id, year);
  await seedBlockchain(
    prisma,
    barangay.id,
    doc.documentCode,
    projects[0].projectCode,
  );
  await seedAuditLog(prisma, barangay.id, admin.id, admin.email);

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
