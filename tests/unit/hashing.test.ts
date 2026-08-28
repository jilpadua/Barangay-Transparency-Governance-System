import { describe, expect, it } from "vitest";
import {
  canonicalize,
  hashCanonicalRecord,
  sha256,
} from "@/lib/hashing";

describe("hashing", () => {
  it("canonicalizes objects with sorted keys", () => {
    const a = canonicalize({ b: 1, a: 2 });
    const b = canonicalize({ a: 2, b: 1 });
    expect(a).toBe(b);
    expect(a).toBe('{"a":2,"b":1}');
  });

  it("produces stable SHA-256 hashes", () => {
    const record = {
      recordId: "DOC-2026-001",
      recordType: "Document",
      version: "1.0",
      title: "Annual Budget",
      publishedAt: "2026-08-25",
    };
    const h1 = hashCanonicalRecord(record);
    const h2 = hashCanonicalRecord({
      publishedAt: "2026-08-25",
      title: "Annual Budget",
      version: "1.0",
      recordType: "Document",
      recordId: "DOC-2026-001",
    });
    expect(h1).toBe(h2);
    expect(h1).toHaveLength(64);
    expect(sha256("test")).toBe(
      "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
    );
  });

  it("changes hash when content changes", () => {
    const a = hashCanonicalRecord({ title: "A" });
    const b = hashCanonicalRecord({ title: "B" });
    expect(a).not.toBe(b);
  });
});
