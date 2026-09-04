import Link from "next/link";
import { LegalInstrumentStatus } from "@prisma/client";
import { requirePermission } from "@/lib/permissions/server";
import { PERMISSIONS } from "@/lib/permissions";
import { createResolutionAction } from "../actions";
import { PageHeader } from "@/components/admin/page-header";
import { FileUploadField } from "@/components/admin/file-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const dynamic = "force-dynamic";

export default async function NewResolutionPage() {
  await requirePermission(PERMISSIONS.RESOLUTIONS_MANAGE);
  return (
    <div className="space-y-6">
      <PageHeader
        backHref="/admin/resolutions"
        backLabel="Back to resolutions"
        title="Add resolution"
      />
      <form action={createResolutionAction} className="max-w-2xl space-y-4 rounded-lg border border-[var(--color-border)] bg-white p-6">
        <div className="space-y-2"><Label htmlFor="referenceNumber">Reference number</Label><Input id="referenceNumber" name="referenceNumber" required /></div>
        <div className="space-y-2"><Label htmlFor="title">Title</Label><Input id="title" name="title" required /></div>
        <div className="space-y-2"><Label htmlFor="description">Description</Label><Textarea id="description" name="description" rows={4} /></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label htmlFor="resolutionDate">Resolution date</Label><Input id="resolutionDate" name="resolutionDate" type="date" /></div>
          <div className="space-y-2">
            <Label htmlFor="status">Legal status</Label>
            <select id="status" name="status" className="flex h-10 w-full rounded-md border border-[var(--color-border)] bg-white px-3 text-sm" defaultValue={LegalInstrumentStatus.DRAFT}>
              {Object.values(LegalInstrumentStatus).map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="isSk" /> SK resolution</label>
        <FileUploadField label="PDF document (optional)" />
        <div className="flex gap-2"><Button type="submit">Create</Button><Button type="button" variant="outline" asChild><Link href="/admin/resolutions">Cancel</Link></Button></div>
      </form>
    </div>
  );
}
