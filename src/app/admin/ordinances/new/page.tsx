import Link from "next/link";
import { LegalInstrumentStatus } from "@prisma/client";
import { requirePermission } from "@/lib/permissions/server";
import { PERMISSIONS } from "@/lib/permissions";
import { createOrdinanceAction } from "../actions";
import { PageHeader } from "@/components/admin/page-header";
import { FileUploadField } from "@/components/admin/file-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const dynamic = "force-dynamic";

export default async function NewOrdinancePage() {
  await requirePermission(PERMISSIONS.ORDINANCES_MANAGE);
  return (
    <div className="space-y-6">
      <PageHeader
        backHref="/admin/ordinances"
        backLabel="Back to ordinances"
        title="Add ordinance"
      />
      <form action={createOrdinanceAction} className="max-w-2xl space-y-4 rounded-lg border border-[var(--color-border)] bg-white p-6">
        <div className="space-y-2"><Label htmlFor="referenceNumber">Reference number</Label><Input id="referenceNumber" name="referenceNumber" required /></div>
        <div className="space-y-2"><Label htmlFor="title">Title</Label><Input id="title" name="title" required /></div>
        <div className="space-y-2"><Label htmlFor="description">Description</Label><Textarea id="description" name="description" rows={4} /></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label htmlFor="ordinanceDate">Ordinance date</Label><Input id="ordinanceDate" name="ordinanceDate" type="date" /></div>
          <div className="space-y-2">
            <Label htmlFor="status">Legal status</Label>
            <select id="status" name="status" className="flex h-10 w-full rounded-md border border-[var(--color-border)] bg-white px-3 text-sm" defaultValue={LegalInstrumentStatus.DRAFT}>
              {Object.values(LegalInstrumentStatus).map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <FileUploadField label="PDF document (optional)" />
        <div className="flex gap-2"><Button type="submit">Create</Button><Button type="button" variant="outline" asChild><Link href="/admin/ordinances">Cancel</Link></Button></div>
      </form>
    </div>
  );
}
