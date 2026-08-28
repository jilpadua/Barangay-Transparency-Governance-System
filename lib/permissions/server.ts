import { auth } from "@/lib/auth";
import {
  hasPermission,
  type PermissionCode,
} from "@/lib/permissions";
import { redirect } from "next/navigation";

export class PermissionError extends Error {
  constructor(message = "Insufficient permissions") {
    super(message);
    this.name = "PermissionError";
  }
}

export async function getSessionOrNull() {
  return auth();
}

export async function requireSession() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return session;
}

export async function requirePermission(
  permission: PermissionCode | PermissionCode[],
) {
  const session = await requireSession();
  const perms = session.user.permissions ?? [];
  if (!hasPermission(perms, permission)) {
    redirect("/admin/unauthorized");
  }
  return session;
}

export function assertPermission(
  userPermissions: string[] | undefined,
  permission: PermissionCode | PermissionCode[],
) {
  if (!hasPermission(userPermissions, permission)) {
    throw new PermissionError();
  }
}
