import type { PrismaClient } from "@prisma/client";

export async function seedBarangay(prisma: PrismaClient) {
  return prisma.barangay.create({
    data: {
      name: "Barangay San Jose (DEMO)",
      municipality: "Sample City",
      province: "Sample Province",
      address: "123 Rizal Street, Barangay San Jose",
      contactEmail: "info@demo.barangay.gov.ph",
      contactPhone: "+63 912 000 0000",
      officeHours: "Monday–Friday, 8:00 AM – 5:00 PM",
      tagline: "Open records. Clear governance.",
      history:
        "DEMO barangay profile for the Barangay Transparency & Governance System.",
      mission:
        "To provide transparent, accessible public information for residents.",
      vision: "A trusted, digitally enabled barangay administration.",
      generalInfo:
        "This portal publishes budgets, projects, documents, meetings, and related transparency records. All seed content is DEMO only.",
      isDemo: true,
    },
  });
}
