import { notFound } from "next/navigation";
import { LegalInstrumentStatus } from "@prisma/client";
import { requirePermission } from "@/lib/permissions/server";
import { PERMISSIONS } from "@/lib/permissions";
import { getResolution, getResolutionPublicationTransitions } from "@/services/resolutions";
import { updateResolutionAction, transitionResolutionAction } from "../../actions";
import { PageHeader } from "@/components/admin/page-header";
import { PublicationActions } from "@/components/admin/publication-actions";
import { PublicationStatusBadge } from "@/components/admin/status-badge";
import { FileUploadField } from "@/components/admin/file-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function EditResolutionPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission(PERMISSIONS.RESOLUTIONS_VIEW);
  const { id } = await params;
  let resolution;
  try { resolution = await getResolution(id); } catch { notFound(); }
  const transitions = await getResolutionPublicationTransitions(id);

  return (
    <div className="space-y-6">
      <PageHeader
        backHref="/admin/resolutions"
        backLabel="Back to resolutions"
        title={resolution.title}
        description={resolution.referenceNumber}
        actions={<div className="flex gap-2">{resolution.isDemo && <Badge variant="warning">DEMO</Badge>}<PublicationStatusBadge status={resolution.publicationStatus} /></div>}
      />
      <PublicationActions recordId={id} currentStatus={resolution.publicationStatus} availableTransitions={transitions} onTransition={transitionResolutionAction} />
      <form action={updateResolutionAction.bind(null, id)} className="max-w-2xl space-y-4 rounded-lg border border-[var(--color-border)] bg-white p-6">
        <div className="space-y-2"><Label htmlFor="referenceNumber">Reference number</Label><Input id="referenceNumber" name="referenceNumber" defaultValue={resolution.referenceNumber} required /></div>
        <div className="space-y-2"><Label htmlFor="title">Title</Label><Input id="title" name="title" defaultValue={resolution.title} required /></div>
        <div className="space-y-2"><Label htmlFor="description">Description</Label><Textarea id="description" name="description" rows={4} defaultValue={resolution.description ?? ""} /></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label htmlFor="resolutionDate">Resolution date</Label><Input id="resolutionDate" name="resolutionDate" type="date" defaultValue={resolution.resolutionDate?.toISOString().slice(0, 10) ?? ""} /></div>
          <div className="space-y-2">
            <Label htmlFor="status">Legal status</Label>
            <select id="status" name="status" className="flex h-10 w-full rounded-md border border-[var(--color-border)] bg-white px-3 text-sm" defaultValue={resolution.status}>
              {Object.values(LegalInstrumentStatus).map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="isSk" defaultChecked={resolution.isSk} /> SK resolution</label>
        {resolution.documentUrl && <p className="text-sm">Current file: <a href={resolution.documentUrl} className="text-[var(--color-accent)] hover:underline" target="_blank" rel="noopener noreferrer">Download</a></p>}
        <FileUploadField label="Replace PDF (optional)" />
        <div className="flex gap-2"><Button type="submit">Save</Button></div>
      </form>
    </div>
  );
}
