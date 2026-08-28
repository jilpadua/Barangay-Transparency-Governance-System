import { requirePermission } from "@/lib/permissions/server";
import { PERMISSIONS } from "@/lib/permissions";
import { AdminModulePlaceholder } from "@/components/shared/module-placeholder";

export default async function Page() {
  await requirePermission(PERMISSIONS.OFFICIALS_VIEW);
  return (
    <AdminModulePlaceholder
      title="Officials"
      description="Manage barangay and SK officials. CRUD arrives in Phase 2."
    />
  );
}