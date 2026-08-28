import { requirePermission } from "@/lib/permissions/server";
import { PERMISSIONS } from "@/lib/permissions";
import { AdminModulePlaceholder } from "@/components/shared/module-placeholder";

export default async function Page() {
  await requirePermission(PERMISSIONS.EXPENSES_VIEW);
  return (
    <AdminModulePlaceholder
      title="Expenses"
      description="Expenditure records and supporting documents."
    />
  );
}