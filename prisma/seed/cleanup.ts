import type { PrismaClient } from "@prisma/client";

/**
 * Delete all seedable records in dependency order for idempotent re-seed.
 */
export async function resetDatabase(prisma: PrismaClient) {
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
}
