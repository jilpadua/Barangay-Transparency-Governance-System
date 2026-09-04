import { describe, expect, it } from "vitest";
import { PublicationStatus } from "@prisma/client";
import { PERMISSIONS } from "@/lib/permissions";
import {
  canTransitionPublication,
  getPublicationCapabilities,
  transitionPublicationStatus,
} from "@/services/publication";

describe("publication workflow", () => {
  const manageOnly = getPublicationCapabilities([PERMISSIONS.OFFICIALS_MANAGE]);
  const approver = getPublicationCapabilities([
    PERMISSIONS.REVIEW_APPROVE,
    PERMISSIONS.OFFICIALS_MANAGE,
  ]);
  const publisher = getPublicationCapabilities([
    PERMISSIONS.PUBLISH,
    PERMISSIONS.REVIEW_APPROVE,
    PERMISSIONS.OFFICIALS_MANAGE,
  ]);

  it("allows draft to for_review with manage permission", () => {
    expect(
      canTransitionPublication(
        PublicationStatus.DRAFT,
        PublicationStatus.FOR_REVIEW,
        manageOnly,
      ),
    ).toBe(true);
  });

  it("blocks publish without publish permission", () => {
    expect(
      canTransitionPublication(
        PublicationStatus.APPROVED,
        PublicationStatus.PUBLISHED,
        approver,
      ),
    ).toBe(false);
  });

  it("sets publishedAt when publishing", () => {
    const result = transitionPublicationStatus(
      PublicationStatus.APPROVED,
      PublicationStatus.PUBLISHED,
      publisher,
    );
    expect(result.status).toBe(PublicationStatus.PUBLISHED);
    expect(result.publishedAt).toBeInstanceOf(Date);
  });

  it("rejects invalid transitions", () => {
    expect(() =>
      transitionPublicationStatus(
        PublicationStatus.DRAFT,
        PublicationStatus.PUBLISHED,
        publisher,
      ),
    ).toThrow();
  });
});
