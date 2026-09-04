import Link from "next/link";
import { requirePermission } from "@/lib/permissions/server";
import { PERMISSIONS, hasPermission } from "@/lib/permissions";
import { listOrdinances } from "@/services/ordinances";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable } from "@/components/admin/data-table";
import { PublicationStatusBadge, LegalStatusBadge } from "@/components/admin/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { formatDate } from "@/utils";

export const dynamic = "force-dynamic";

export default async function OrdinancesAdminPage() {
  await requirePermission(PERMISSIONS.ORDINANCES_VIEW);
  const session = await auth();
  const ordinances = await listOrdinances();
  const canManage = hasPermission(session?.user?.permissions, PERMISSIONS.ORDINANCES_MANAGE);

  return (
    <div className="space-y-6">
      <PageHeader title="Ordinances" actions={canManage ? <Button asChild><Link href="/admin/ordinances/new">Add ordinance</Link></Button> : undefined} />
      <DataTable>
        <thead><tr><th>Reference</th><th>Title</th><th>Legal status</th><th>Publication</th><th>Date</th><th /></tr></thead>
        <tbody>
          {ordinances.map((o) => (
            <tr key={o.id}>
              <td><div className="flex flex-wrap gap-2">{o.referenceNumber}{o.isDemo && <Badge variant="warning">DEMO</Badge>}</div></td>
              <td>{o.title}</td>
              <td><LegalStatusBadge status={o.status} /></td>
              <td><PublicationStatusBadge status={o.publicationStatus} /></td>
              <td>{formatDate(o.ordinanceDate)}</td>
              <td><Link href={`/admin/ordinances/${o.id}/edit`} className="text-sm text-[var(--color-accent)] hover:underline">Edit</Link></td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </div>
  );
}
