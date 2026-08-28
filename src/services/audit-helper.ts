import { writeAuditLog } from "@/lib/audit";
import type { Prisma } from "@prisma/client";
import type { ServiceContext } from "@/services/context";

export async function auditMutation(
  ctx: ServiceContext,
  input: {
    action: string;
    module: string;
    recordId?: string;
    metadata?: Prisma.InputJsonValue;
  },
) {
  await writeAuditLog({
    barangayId: ctx.barangayId,
    userId: ctx.userId,
    userEmail: ctx.userEmail,
    userRole: ctx.userRole,
    action: input.action,
    module: input.module,
    recordId: input.recordId,
    metadata: input.metadata,
  });
}
