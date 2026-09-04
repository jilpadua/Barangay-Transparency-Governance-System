import Link from "next/link";
import { DocumentVisibility } from "@prisma/client";
import { requirePermission } from "@/lib/permissions/server";
import { PERMISSIONS } from "@/lib/permissions";
import { createDocumentAction } from "../actions";
import { PageHeader } from "@/components/admin/page-header";
import { FileUploadField } from "@/components/admin/file-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const dynamic = "force-dynamic";

export default async function NewDocumentPage() {
  await requirePermission(PERMISSIONS.DOCUMENTS_MANAGE);

  return (
    <div className="space-y-6">
      <PageHeader
        backHref="/admin/documents"
        backLabel="Back to documents"
        title="Add document"
        description="Upload a new document with initial version 1.0."
      />
      <form
        action={createDocumentAction}
        className="max-w-2xl space-y-4 rounded-lg border border-[var(--color-border)] bg-white p-6"
      >
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input id="category" name="category" required placeholder="e.g. Budget, Report" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="referenceNumber">Reference number</Label>
          <Input id="referenceNumber" name="referenceNumber" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" rows={3} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="publicationDate">Publication date</Label>
            <Input id="publicationDate" name="publicationDate" type="date" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="visibility">Visibility</Label>
            <select
              id="visibility"
              name="visibility"
              className="flex h-10 w-full rounded-md border border-[var(--color-border)] bg-white px-3 text-sm"
              defaultValue={DocumentVisibility.PUBLIC}
            >
              <option value={DocumentVisibility.PUBLIC}>Public</option>
              <option value={DocumentVisibility.INTERNAL}>Internal</option>
              <option value={DocumentVisibility.RESTRICTED}>Restricted</option>
            </select>
          </div>
        </div>
        <FileUploadField required />
        <div className="flex gap-2">
          <Button type="submit">Create document</Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/documents">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
