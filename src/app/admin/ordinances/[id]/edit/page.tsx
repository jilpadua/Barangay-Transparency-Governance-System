import Link from "next/link";
import { notFound } from "next/navigation";
import { LegalInstrumentStatus } from "@prisma/client";
import { requirePermission } from "@/lib/permissions/server";
import { PERMISSIONS } from "@/lib/permissions";
import { getOrdinance, getOrdinancePublicationTransitions } from "@/services/ordinances";
import { updateOrdinanceAction, transitionOrdinanceAction } from "../../actions";
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

export default async function EditOrdinancePage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission(PERMISSIONS.ORDINANCES_VIEW);
  const { id } = await params;
  let ordinance;
  try { ordinance = await getOrdinance(id); } catch { notFound(); }
  const transitions = await getOrdinancePublicationTransitions(id);

  return (
    <div className="space-y-6">
      <PageHeader title={ordinance.title} description={ordinance.referenceNumber} actions={<div className="flex gap-2">{ordinance.isDemo && <Badge variant="warning">DEMO</Badge>}<PublicationStatusBadge status={ordinance.publicationStatus} /></div>} />
      <PublicationActions recordId={id} currentStatus={ordinance.publicationStatus} availableTransitions={transitions} onTransition={transitionOrdinanceAction} />
      <form action={updateOrdinanceAction.bind(null, id)} encType="multipart/form-data" className="max-w-2xl space-y-4 rounded-lg border border-[var(--color-border)] bg-white p-6">
        <div className="space-y-2"><Label htmlFor="referenceNumber">Reference number</Label><Input id="referenceNumber" name="referenceNumber" defaultValue={ordinance.referenceNumber} required /></div>
        <div className="space-y-2"><Label htmlFor="title">Title</Label><Input id="title" name="title" defaultValue={ordinance.title} required /></div>
        <div className="space-y-2"><Label htmlFor="description">Description</Label><Textarea id="description" name="description" rows={4} defaultValue={ordinance.description ?? ""} /></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label htmlFor="ordinanceDate">Ordinance date</Label><Input id="ordinanceDate" name="ordinanceDate" type="date" defaultValue={ordinance.ordinanceDate?.toISOString().slice(0, 10) ?? ""} /></div>
          <div className="space-y-2">
            <Label htmlFor="status">Legal status</Label>
            <select id="status" name="status" className="flex h-10 w-full rounded-md border border-[var(--color-border)] bg-white px-3 text-sm" defaultValue={ordinance.status}>
              {Object.values(LegalInstrumentStatus).map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        {ordinance.documentUrl && <p className="text-sm">Current file: <a href={ordinance.documentUrl} className="text-[var(--color-accent)] hover:underline" target="_blank" rel="noopener noreferrer">Download</a></p>}
        <FileUploadField label="Replace PDF (optional)" />
        <div className="flex gap-2"><Button type="submit">Save</Button><Button type="button" variant="outline" asChild><Link href="/admin/ordinances">Back</Link></Button></div>
      </form>
    </div>
  );
}
