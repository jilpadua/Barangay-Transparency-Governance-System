import Link from "next/link";
import { requirePermission } from "@/lib/permissions/server";
import { PERMISSIONS, hasPermission } from "@/lib/permissions";
import { listDocuments } from "@/services/documents";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable } from "@/components/admin/data-table";
import { PublicationStatusBadge } from "@/components/admin/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function DocumentsAdminPage() {
  await requirePermission(PERMISSIONS.DOCUMENTS_VIEW);
  const session = await auth();
  const documents = await listDocuments();
  const canManage = hasPermission(
    session?.user?.permissions,
    PERMISSIONS.DOCUMENTS_MANAGE,
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Documents"
        description="Manage public documents with version history."
        actions={
          canManage ? (
            <Button asChild>
              <Link href="/admin/documents/new">Add document</Link>
            </Button>
          ) : undefined
        }
      />
      <DataTable>
        <thead>
          <tr>
            <th>Code</th>
            <th>Title</th>
            <th>Category</th>
            <th>Visibility</th>
            <th>Status</th>
            <th>Version</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => {
            const current = doc.versions[0];
            return (
              <tr key={doc.id}>
                <td>
                  <div className="flex flex-wrap items-center gap-2">
                    {doc.documentCode}
                    {doc.isDemo && <Badge variant="warning">DEMO</Badge>}
                  </div>
                </td>
                <td>{doc.title}</td>
                <td>{doc.category}</td>
                <td>{doc.visibility}</td>
                <td>
                  <PublicationStatusBadge status={doc.publicationStatus} />
                </td>
                <td>{current?.version ?? "—"}</td>
                <td>
                  <Link
                    href={`/admin/documents/${doc.id}`}
                    className="text-sm text-[var(--color-accent)] hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </DataTable>
    </div>
  );
}
