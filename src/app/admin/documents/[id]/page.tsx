import { notFound } from "next/navigation";
import { DocumentVisibility } from "@prisma/client";
import { requirePermission } from "@/lib/permissions/server";
import { PERMISSIONS } from "@/lib/permissions";
import {
  getDocument,
  getDocumentPublicationTransitions,
} from "@/services/documents";
import {
  transitionDocumentAction,
  updateDocumentAction,
  uploadVersionAction,
} from "../actions";
import { PageHeader } from "@/components/admin/page-header";
import { PublicationActions } from "@/components/admin/publication-actions";
import { PublicationStatusBadge } from "@/components/admin/status-badge";
import { DataTable } from "@/components/admin/data-table";
import { FileUploadField } from "@/components/admin/file-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils";

export const dynamic = "force-dynamic";

export default async function DocumentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission(PERMISSIONS.DOCUMENTS_VIEW);
  const { id } = await params;

  let document;
  try {
    document = await getDocument(id);
  } catch {
    notFound();
  }

  const transitions = await getDocumentPublicationTransitions(id);
  const pubDate = document.publicationDate
    ? document.publicationDate.toISOString().slice(0, 10)
    : "";

  return (
    <div className="space-y-6">
      <PageHeader
        backHref="/admin/documents"
        backLabel="Back to documents"
        title={document.title}
        description={`Document code: ${document.documentCode}`}
        actions={
          <div className="flex items-center gap-2">
            {document.isDemo && <Badge variant="warning">DEMO</Badge>}
            <PublicationStatusBadge status={document.publicationStatus} />
          </div>
        }
      />

      <PublicationActions
        recordId={id}
        currentStatus={document.publicationStatus}
        availableTransitions={transitions}
        onTransition={transitionDocumentAction}
      />

      <form
        action={updateDocumentAction.bind(null, id)}
        className="max-w-2xl space-y-4 rounded-lg border border-[var(--color-border)] bg-white p-6"
      >
        <h2 className="font-semibold">Metadata</h2>
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" defaultValue={document.title} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input id="category" name="category" defaultValue={document.category} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="referenceNumber">Reference number</Label>
          <Input
            id="referenceNumber"
            name="referenceNumber"
            defaultValue={document.referenceNumber ?? ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={document.description ?? ""}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="publicationDate">Publication date</Label>
            <Input
              id="publicationDate"
              name="publicationDate"
              type="date"
              defaultValue={pubDate}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="visibility">Visibility</Label>
            <select
              id="visibility"
              name="visibility"
              className="flex h-10 w-full rounded-md border border-[var(--color-border)] bg-white px-3 text-sm"
              defaultValue={document.visibility}
            >
              <option value={DocumentVisibility.PUBLIC}>Public</option>
              <option value={DocumentVisibility.INTERNAL}>Internal</option>
              <option value={DocumentVisibility.RESTRICTED}>Restricted</option>
            </select>
          </div>
        </div>
        <Button type="submit">Save metadata</Button>
      </form>

      <section className="space-y-4">
        <h2 className="font-semibold">Version history</h2>
        <DataTable>
          <thead>
            <tr>
              <th>Version</th>
              <th>File</th>
              <th>Size</th>
              <th>Uploaded</th>
              <th>Current</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {document.versions.map((v) => (
              <tr key={v.id}>
                <td>{v.version}</td>
                <td>{v.fileName}</td>
                <td>
                  {v.fileSize
                    ? `${Math.round(v.fileSize / 1024)} KB`
                    : "—"}
                </td>
                <td>{formatDate(v.createdAt)}</td>
                <td>{v.isCurrent ? "Yes" : "—"}</td>
                <td>
                  <a
                    href={v.fileUrl}
                    className="text-sm text-[var(--color-accent)] hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      </section>

      <form
        action={uploadVersionAction.bind(null, id)}
        className="max-w-2xl space-y-4 rounded-lg border border-[var(--color-border)] bg-white p-6"
      >
        <h2 className="font-semibold">Upload new version</h2>
        <FileUploadField required />
        <div className="space-y-2">
          <Label htmlFor="notes">Version notes</Label>
          <Textarea id="notes" name="notes" rows={2} />
        </div>
        <Button type="submit">Upload version</Button>
      </form>
    </div>
  );
}
