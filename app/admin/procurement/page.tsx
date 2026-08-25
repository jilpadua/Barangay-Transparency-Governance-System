import { requirePermission } from "@/lib/permissions/server";
import { PERMISSIONS } from "@/lib/permissions";
import { AdminModulePlaceholder } from "@/components/shared/module-placeholder";

export default async function Page() {
  await requirePermission(PERMISSIONS.PROCUREMENT_VIEW);
  return (
    <AdminModulePlaceholder
      title="Procurement"
      description="Procurement records."
    />
  );
}