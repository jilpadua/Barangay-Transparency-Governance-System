import Link from "next/link";
import { requirePermission } from "@/lib/permissions/server";
import { PERMISSIONS, hasPermission } from "@/lib/permissions";
import { listResolutions } from "@/services/resolutions";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable } from "@/components/admin/data-table";
import { PublicationStatusBadge, LegalStatusBadge } from "@/components/admin/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { formatDate } from "@/utils";

export const dynamic = "force-dynamic";

export default async function ResolutionsAdminPage() {
  await requirePermission(PERMISSIONS.RESOLUTIONS_VIEW);
  const session = await auth();
  const resolutions = await listResolutions();
  const canManage = hasPermission(session?.user?.permissions, PERMISSIONS.RESOLUTIONS_MANAGE);

  return (
    <div className="space-y-6">
      <PageHeader title="Resolutions" actions={canManage ? <Button asChild><Link href="/admin/resolutions/new">Add resolution</Link></Button> : undefined} />
      <DataTable>
        <thead><tr><th>Reference</th><th>Title</th><th>Legal status</th><th>Publication</th><th>Date</th><th /></tr></thead>
        <tbody>
          {resolutions.map((r) => (
            <tr key={r.id}>
              <td><div className="flex flex-wrap gap-2">{r.referenceNumber}{r.isDemo && <Badge variant="warning">DEMO</Badge>}</div></td>
              <td>{r.title}</td>
              <td><LegalStatusBadge status={r.status} /></td>
              <td><PublicationStatusBadge status={r.publicationStatus} /></td>
              <td>{formatDate(r.resolutionDate)}</td>
              <td><Link href={`/admin/resolutions/${r.id}/edit`} className="text-sm text-[var(--color-accent)] hover:underline">Edit</Link></td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </div>
  );
}
