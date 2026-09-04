import type { PrismaClient } from "@prisma/client";

export async function seedBlockchain(
  prisma: PrismaClient,
  barangayId: string,
  docCode: string,
  projectCode: string,
) {
  await prisma.blockchainProof.create({
    data: {
      barangayId,
      recordId: docCode,
      recordType: "Document",
      version: "1.0",
      contentHash:
        "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
      network: "mock",
      transactionHash: "0xdemotransactionhash00000000000000000001",
      blockNumber: 12345,
      anchoredAt: new Date(),
      status: "CONFIRMED",
    },
  });

  await prisma.blockchainProof.create({
    data: {
      barangayId,
      recordId: projectCode,
      recordType: "Project",
      version: "1.0",
      contentHash:
        "abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789",
      status: "PENDING",
    },
  });
}
