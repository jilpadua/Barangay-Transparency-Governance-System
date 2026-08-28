import { createHash } from "crypto";

/**
 * Deterministic canonical JSON: sorted object keys, stable arrays.
 * Used before SHA-256 hashing for blockchain proofs.
 */
export function canonicalize(value: unknown): string {
  return JSON.stringify(sortValue(value));
}

function sortValue(value: unknown): unknown {
  if (value === null || typeof value !== "object") {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(sortValue);
  }
  const obj = value as Record<string, unknown>;
  const sorted: Record<string, unknown> = {};
  for (const key of Object.keys(obj).sort()) {
    sorted[key] = sortValue(obj[key]);
  }
  return sorted;
}

export function sha256(input: string): string {
  return createHash("sha256").update(input, "utf8").digest("hex");
}

export function hashCanonicalRecord(record: Record<string, unknown>): string {
  return sha256(canonicalize(record));
}
