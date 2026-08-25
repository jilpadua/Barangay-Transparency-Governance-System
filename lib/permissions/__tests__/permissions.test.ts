import { describe, expect, it } from "vitest";
import {
  hasPermission,
  hasAnyPermission,
  PERMISSIONS,
} from "@/lib/permissions";

describe("permissions", () => {
  it("allows SYSTEM_MANAGE to pass any check", () => {
    expect(
      hasPermission([PERMISSIONS.SYSTEM_MANAGE], PERMISSIONS.BUDGETS_MANAGE),
    ).toBe(true);
  });

  it("requires all listed permissions", () => {
    expect(
      hasPermission(
        [PERMISSIONS.BUDGETS_VIEW, PERMISSIONS.EXPENSES_VIEW],
        [PERMISSIONS.BUDGETS_VIEW, PERMISSIONS.EXPENSES_VIEW],
      ),
    ).toBe(true);
    expect(
      hasPermission([PERMISSIONS.BUDGETS_VIEW], [
        PERMISSIONS.BUDGETS_VIEW,
        PERMISSIONS.EXPENSES_VIEW,
      ]),
    ).toBe(false);
  });

  it("hasAnyPermission returns true when one matches", () => {
    expect(
      hasAnyPermission([PERMISSIONS.DOCUMENTS_VIEW], [
        PERMISSIONS.DOCUMENTS_MANAGE,
        PERMISSIONS.DOCUMENTS_VIEW,
      ]),
    ).toBe(true);
  });

  it("returns false for empty permissions", () => {
    expect(hasPermission([], PERMISSIONS.USERS_VIEW)).toBe(false);
    expect(hasPermission(null, PERMISSIONS.USERS_VIEW)).toBe(false);
  });
});
