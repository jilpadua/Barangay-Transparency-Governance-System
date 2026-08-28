import { PublicationStatus } from "@prisma/client";
import { hasAnyPermission, hasPermission, PERMISSIONS } from "@/lib/permissions";
import type { PermissionCode } from "@/lib/permissions";

const TRANSITIONS: Record<PublicationStatus, PublicationStatus[]> = {
  DRAFT: [PublicationStatus.FOR_REVIEW, PublicationStatus.ARCHIVED],
  FOR_REVIEW: [PublicationStatus.DRAFT, PublicationStatus.APPROVED, PublicationStatus.ARCHIVED],
  APPROVED: [PublicationStatus.FOR_REVIEW, PublicationStatus.PUBLISHED, PublicationStatus.ARCHIVED],
  PUBLISHED: [PublicationStatus.ARCHIVED],
  ARCHIVED: [PublicationStatus.DRAFT],
};

export type PublicationCapabilities = {
  canManage: boolean;
  canApprove: boolean;
  canPublish: boolean;
};

export function getPublicationCapabilities(
  permissions: PermissionCode[],
  publishPermission: PermissionCode = PERMISSIONS.PUBLISH,
): PublicationCapabilities {
  return {
    canManage: hasPermission(permissions, PERMISSIONS.SYSTEM_MANAGE) ||
      hasAnyManagePermission(permissions),
    canApprove: hasAnyPermission(permissions, [
      PERMISSIONS.REVIEW_APPROVE,
      PERMISSIONS.SYSTEM_MANAGE,
    ]),
    canPublish: hasAnyPermission(permissions, [
      publishPermission,
      PERMISSIONS.PUBLISH,
      PERMISSIONS.SYSTEM_MANAGE,
    ]),
  };
}

function hasAnyManagePermission(permissions: PermissionCode[]): boolean {
  const managePerms = Object.values(PERMISSIONS).filter((p) => p.endsWith(":manage"));
  return managePerms.some((p) => permissions.includes(p));
}

export function canTransitionPublication(
  current: PublicationStatus,
  target: PublicationStatus,
  caps: PublicationCapabilities,
): boolean {
  if (current === target) return true;
  if (!TRANSITIONS[current].includes(target)) return false;

  switch (target) {
    case PublicationStatus.DRAFT:
      return caps.canManage || caps.canApprove;
    case PublicationStatus.FOR_REVIEW:
      return caps.canManage;
    case PublicationStatus.APPROVED:
      return caps.canApprove;
    case PublicationStatus.PUBLISHED:
      return caps.canPublish;
    case PublicationStatus.ARCHIVED:
      return caps.canManage || caps.canPublish || caps.canApprove;
    default:
      return false;
  }
}

export function transitionPublicationStatus(
  current: PublicationStatus,
  target: PublicationStatus,
  caps: PublicationCapabilities,
): { status: PublicationStatus; publishedAt: Date | null } {
  if (current === target) {
    return {
      status: current,
      publishedAt: current === PublicationStatus.PUBLISHED ? new Date() : null,
    };
  }

  if (!canTransitionPublication(current, target, caps)) {
    throw new Error(
      `Cannot transition publication status from ${current} to ${target}`,
    );
  }

  return {
    status: target,
    publishedAt: target === PublicationStatus.PUBLISHED ? new Date() : null,
  };
}

export function getAvailablePublicationTransitions(
  current: PublicationStatus,
  caps: PublicationCapabilities,
): PublicationStatus[] {
  return TRANSITIONS[current].filter((target) =>
    canTransitionPublication(current, target, caps),
  );
}
