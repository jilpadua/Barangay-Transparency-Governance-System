import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";

export type AuditInput = {
  barangayId?: string | null;
  userId?: string | null;
  userEmail?: string | null;
  userRole?: string | null;
  action: string;
  module: string;
  recordId?: string | null;
  fieldName?: string | null;
  oldValue?: string | null;
  newValue?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  metadata?: Prisma.InputJsonValue;
};

/**
 * Append-only audit trail. Do not expose delete/update in admin UI.
 */
export async function writeAuditLog(input: AuditInput) {
  return prisma.auditLog.create({
    data: {
      barangayId: input.barangayId ?? undefined,
      userId: input.userId ?? undefined,
      userEmail: input.userEmail ?? undefined,
      userRole: input.userRole ?? undefined,
      action: input.action,
      module: input.module,
      recordId: input.recordId ?? undefined,
      fieldName: input.fieldName ?? undefined,
      oldValue: input.oldValue ?? undefined,
      newValue: input.newValue ?? undefined,
      ipAddress: input.ipAddress ?? undefined,
      userAgent: input.userAgent ?? undefined,
      metadata: input.metadata,
    },
  });
}
