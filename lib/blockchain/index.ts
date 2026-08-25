export type AnchorProofInput = {
  recordId: string;
  recordType: string;
  version: string;
  contentHash: string;
};

export type AnchorProofResult = {
  success: boolean;
  transactionHash?: string;
  blockNumber?: number;
  network?: string;
  errorMessage?: string;
};

export type BlockchainProof = {
  reference: string;
  contentHash: string;
  transactionHash?: string;
  blockNumber?: number;
  network?: string;
  anchoredAt?: Date;
};

export type VerificationResult = {
  state: "verified" | "mismatch" | "pending" | "not_anchored" | "unavailable";
  expectedHash?: string;
  onChainHash?: string;
  transactionHash?: string;
  message: string;
};

export interface BlockchainProvider {
  anchorProof(input: AnchorProofInput): Promise<AnchorProofResult>;
  getProof(reference: string): Promise<BlockchainProof | null>;
  verifyProof(
    expectedHash: string,
    reference: string,
  ): Promise<VerificationResult>;
  getStatus(): Promise<{ available: boolean; network: string; message: string }>;
}

/**
 * Null provider — CMS continues when blockchain is disabled or down.
 */
export class NullBlockchainProvider implements BlockchainProvider {
  async anchorProof(): Promise<AnchorProofResult> {
    return {
      success: false,
      errorMessage: "Blockchain anchoring is disabled",
    };
  }

  async getProof(): Promise<BlockchainProof | null> {
    return null;
  }

  async verifyProof(): Promise<VerificationResult> {
    return {
      state: "unavailable",
      message:
        "Blockchain verification is not configured. The record may still be valid in the official registry.",
    };
  }

  async getStatus() {
    return {
      available: false,
      network: process.env.BLOCKCHAIN_NETWORK ?? "none",
      message: "Blockchain provider disabled (BLOCKCHAIN_ENABLED=false)",
    };
  }
}

/**
 * In-memory mock for local development and tests (Phase 5 will add EVM).
 */
export class MockBlockchainProvider implements BlockchainProvider {
  private proofs = new Map<string, BlockchainProof>();

  async anchorProof(input: AnchorProofInput): Promise<AnchorProofResult> {
    const tx = `0xmock${shaLike(input.contentHash)}`;
    const proof: BlockchainProof = {
      reference: input.recordId,
      contentHash: input.contentHash,
      transactionHash: tx,
      blockNumber: Math.floor(Date.now() / 1000) % 1_000_000,
      network: "mock",
      anchoredAt: new Date(),
    };
    this.proofs.set(input.recordId, proof);
    return {
      success: true,
      transactionHash: tx,
      blockNumber: proof.blockNumber,
      network: "mock",
    };
  }

  async getProof(reference: string): Promise<BlockchainProof | null> {
    return this.proofs.get(reference) ?? null;
  }

  async verifyProof(
    expectedHash: string,
    reference: string,
  ): Promise<VerificationResult> {
    const proof = this.proofs.get(reference);
    if (!proof) {
      return {
        state: "not_anchored",
        expectedHash,
        message: "No blockchain proof found for this record.",
      };
    }
    if (proof.contentHash === expectedHash) {
      return {
        state: "verified",
        expectedHash,
        onChainHash: proof.contentHash,
        transactionHash: proof.transactionHash,
        message: "This record matches the published verification proof.",
      };
    }
    return {
      state: "mismatch",
      expectedHash,
      onChainHash: proof.contentHash,
      transactionHash: proof.transactionHash,
      message:
        "Warning: the current record does not match the blockchain proof.",
    };
  }

  async getStatus() {
    return {
      available: true,
      network: "mock",
      message: "Mock blockchain provider is active",
    };
  }
}

function shaLike(hash: string) {
  return hash.slice(0, 40);
}

export function getBlockchainProvider(): BlockchainProvider {
  if (process.env.BLOCKCHAIN_ENABLED === "true") {
    // Phase 5: return EvmBlockchainProvider
    return new MockBlockchainProvider();
  }
  return new NullBlockchainProvider();
}
