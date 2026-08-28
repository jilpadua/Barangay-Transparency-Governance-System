import { ModulePlaceholder } from "@/components/shared/module-placeholder";

export default function VerifyIndexPage() {
  return (
    <ModulePlaceholder
      title="Verify a record"
      description="Enter or open a record ID to check blockchain-backed integrity. Plain-language results: Verified, Mismatch, Pending, Not anchored, or Unavailable."
      phaseHint="Full verification UI and QR support in Phase 5. Schema and provider stubs are ready."
    />
  );
}
