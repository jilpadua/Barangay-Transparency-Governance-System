import { requirePermission } from "@/lib/permissions/server";
import { PERMISSIONS } from "@/lib/permissions";
import { AdminModulePlaceholder } from "@/components/shared/module-placeholder";

export default async function Page() {
  await requirePermission(PERMISSIONS.BLOCKCHAIN_VIEW);
  return (
    <AdminModulePlaceholder
      title="Blockchain dashboard"
      description="Pending, confirmed, and failed verification proofs. Retry tools in Phase 5."
    />
  );
}