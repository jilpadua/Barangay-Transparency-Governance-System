import Link from "next/link";
import { requirePermission } from "@/lib/permissions/server";
import { PERMISSIONS, hasPermission } from "@/lib/permissions";
import { listOfficials } from "@/services/officials";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable } from "@/components/admin/data-table";
import { PublicationStatusBadge } from "@/components/admin/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function OfficialsAdminPage() {
  await requirePermission(PERMISSIONS.OFFICIALS_VIEW);
  const session = await auth();
  const officials = await listOfficials();
  const canManage = hasPermission(
    session?.user?.permissions,
    PERMISSIONS.OFFICIALS_MANAGE,
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Officials"
        description="Manage barangay and SK officials."
        actions={
          canManage ? (
            <Button asChild>
              <Link href="/admin/officials/new">Add official</Link>
            </Button>
          ) : undefined
        }
      />
      <DataTable>
        <thead>
          <tr>
            <th>Name</th>
            <th>Position</th>
            <th>Body</th>
            <th>Status</th>
            <th>Active</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {officials.map((o) => (
            <tr key={o.id}>
              <td>
                <div className="flex flex-wrap items-center gap-2">
                  {o.firstName} {o.lastName}
                  {o.isDemo && <Badge variant="warning">DEMO</Badge>}
                </div>
              </td>
              <td>{o.position}</td>
              <td>{o.body}</td>
              <td>
                <PublicationStatusBadge status={o.publicationStatus} />
              </td>
              <td>
                <Badge variant={o.isActive ? "success" : "danger"}>
                  {o.isActive ? "Yes" : "No"}
                </Badge>
              </td>
              <td>
                <Link
                  href={`/admin/officials/${o.id}/edit`}
                  className="text-sm text-[var(--color-accent)] hover:underline"
                >
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </div>
  );
}
