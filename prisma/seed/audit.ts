import { ROLE_CODES } from "../../src/lib/permissions";
import type { PrismaClient } from "@prisma/client";

export async function seedAuditLog(
  prisma: PrismaClient,
  barangayId: string,
  adminId: string,
  adminEmail: string,
) {
  await prisma.auditLog.create({
    data: {
      barangayId,
      userId: adminId,
      userEmail: adminEmail,
      userRole: ROLE_CODES.SUPER_ADMIN,
      action: "SEED",
      module: "System",
      recordId: barangayId,
      newValue: "Demo database seeded",
    },
  });
}
