import type { PrismaClient } from "@prisma/client";

export async function seedFeedback(
  prisma: PrismaClient,
  barangayId: string,
  year: number,
) {
  return prisma.feedback.create({
    data: {
      barangayId,
      trackingNumber: `BRGY-${year}-00001`,
      type: "SUGGESTION",
      subject: "Street lighting suggestion (DEMO)",
      message: "DEMO feedback message — personal details are internal only.",
      contactName: "Resident Demo",
      contactEmail: "resident@example.com",
      status: "RECEIVED",
      isDemo: true,
      statusHistory: {
        create: {
          status: "RECEIVED",
          publicNote: "Your feedback was received.",
        },
      },
    },
  });
}
