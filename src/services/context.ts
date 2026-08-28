import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { PermissionCode } from "@/lib/permissions";
import { PermissionError } from "@/lib/permissions/server";

export type ServiceContext = {
  userId: string;
  userEmail: string;
  userRole: string;
  barangayId: string;
  permissions: PermissionCode[];
};

let cachedDefaultBarangayId: string | null = null;

export async function resolveDefaultBarangayId(): Promise<string> {
  if (process.env.DEFAULT_BARANGAY_ID) {
    return process.env.DEFAULT_BARANGAY_ID;
  }
  if (cachedDefaultBarangayId) return cachedDefaultBarangayId;
  const barangay = await prisma.barangay.findFirst({ orderBy: { createdAt: "asc" } });
  if (!barangay) {
    throw new Error("No barangay configured. Run database seed.");
  }
  cachedDefaultBarangayId = barangay.id;
  return barangay.id;
}

export async function getServiceContext(): Promise<ServiceContext> {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    throw new PermissionError("Not authenticated");
  }
  const barangayId =
    session.user.barangayId ?? (await resolveDefaultBarangayId());
  return {
    userId: session.user.id,
    userEmail: session.user.email,
    userRole: session.user.roles?.[0] ?? "UNKNOWN",
    barangayId,
    permissions: session.user.permissions ?? [],
  };
}
