import { requirePermission } from "@/lib/permissions/server";
import { PERMISSIONS } from "@/lib/permissions";
import { AdminModulePlaceholder } from "@/components/shared/module-placeholder";

export default async function Page() {
  await requirePermission(PERMISSIONS.ATTENDANCE_MANAGE);
  return (
    <AdminModulePlaceholder
      title="Attendance"
      description="Official attendance records and summaries."
    />
  );
}