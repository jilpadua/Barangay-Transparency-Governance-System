import { requirePermission } from "@/lib/permissions/server";
import { PERMISSIONS } from "@/lib/permissions";
import { AdminModulePlaceholder } from "@/components/shared/module-placeholder";

export default async function Page() {
  await requirePermission(PERMISSIONS.DOCUMENTS_VIEW);
  return (
    <AdminModulePlaceholder
      title="Documents"
      description="Document management with versions and publication workflow."
    />
  );
}