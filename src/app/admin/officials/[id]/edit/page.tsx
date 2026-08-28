import Link from "next/link";
import { notFound } from "next/navigation";
import { OfficialBody } from "@prisma/client";
import { requirePermission } from "@/lib/permissions/server";
import { PERMISSIONS } from "@/lib/permissions";
import {
  getOfficial,
  getOfficialPublicationTransitions,
  listCommittees,
} from "@/services/officials";
import { updateOfficialAction, transitionOfficialAction } from "../../actions";
import { PageHeader } from "@/components/admin/page-header";
import { PublicationActions } from "@/components/admin/publication-actions";
import { PublicationStatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function EditOfficialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission(PERMISSIONS.OFFICIALS_VIEW);
  const { id } = await params;

  let official;
  try {
    official = await getOfficial(id);
  } catch {
    notFound();
  }

  const committees = await listCommittees();
  const transitions = await getOfficialPublicationTransitions(id);

  const termStart = official.termStart
    ? official.termStart.toISOString().slice(0, 10)
    : "";
  const termEnd = official.termEnd
    ? official.termEnd.toISOString().slice(0, 10)
    : "";

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Edit: ${official.firstName} ${official.lastName}`}
        description="Update official profile and publication status."
        actions={
          <div className="flex items-center gap-2">
            {official.isDemo && <Badge variant="warning">DEMO</Badge>}
            <PublicationStatusBadge status={official.publicationStatus} />
          </div>
        }
      />

      <PublicationActions
        recordId={id}
        currentStatus={official.publicationStatus}
        availableTransitions={transitions}
        onTransition={transitionOfficialAction}
      />

      <form
        action={updateOfficialAction.bind(null, id)}
        className="max-w-2xl space-y-4 rounded-lg border border-[var(--color-border)] bg-white p-6"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">First name</Label>
            <Input
              id="firstName"
              name="firstName"
              defaultValue={official.firstName}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last name</Label>
            <Input
              id="lastName"
              name="lastName"
              defaultValue={official.lastName}
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="middleName">Middle name</Label>
          <Input
            id="middleName"
            name="middleName"
            defaultValue={official.middleName ?? ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="position">Position</Label>
          <Input
            id="position"
            name="position"
            defaultValue={official.position}
            required
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="body">Body</Label>
            <select
              id="body"
              name="body"
              className="flex h-10 w-full rounded-md border border-[var(--color-border)] bg-white px-3 text-sm"
              defaultValue={official.body}
            >
              <option value={OfficialBody.BARANGAY}>Barangay</option>
              <option value={OfficialBody.SK}>SK</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="committeeId">Committee</Label>
            <select
              id="committeeId"
              name="committeeId"
              className="flex h-10 w-full rounded-md border border-[var(--color-border)] bg-white px-3 text-sm"
              defaultValue={official.committeeId ?? ""}
            >
              <option value="">None</option>
              {committees.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="photoUrl">Photo URL</Label>
          <Input
            id="photoUrl"
            name="photoUrl"
            type="url"
            defaultValue={official.photoUrl ?? ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="publicEmail">Public email</Label>
          <Input
            id="publicEmail"
            name="publicEmail"
            type="email"
            defaultValue={official.publicEmail ?? ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="publicBio">Public bio</Label>
          <Textarea
            id="publicBio"
            name="publicBio"
            rows={4}
            defaultValue={official.publicBio ?? ""}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="termStart">Term start</Label>
            <Input
              id="termStart"
              name="termStart"
              type="date"
              defaultValue={termStart}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="termEnd">Term end</Label>
            <Input
              id="termEnd"
              name="termEnd"
              type="date"
              defaultValue={termEnd}
            />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={official.isActive}
          />
          Active
        </label>
        <div className="flex gap-2">
          <Button type="submit">Save changes</Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/officials">Back to list</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
