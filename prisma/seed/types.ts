import type {
  Barangay,
  Budget,
  Committee,
  Document,
  Feedback,
  FundSource,
  Meeting,
  Official,
  Project,
  Supplier,
  User,
} from "@prisma/client";

export type SeedContext = {
  barangay: Barangay;
  year: number;
  admin: User;
  committee: Committee;
  captain: Official;
  fund: FundSource;
  budget: Budget;
  supplier: Supplier;
  projects: Project[];
  doc: Document;
  meeting: Meeting;
  feedback: Feedback;
};
