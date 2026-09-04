import Link from "next/link";
import { OfficialBody } from "@prisma/client";
import { requirePermission } from "@/lib/permissions/server";
import { PERMISSIONS } from "@/lib/permissions";
import { listCommittees } from "@/services/officials";
import { createOfficialAction } from "../actions";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const dynamic = "force-dynamic";

export default async function NewOfficialPage() {
  await requirePermission(PERMISSIONS.OFFICIALS_MANAGE);
  const committees = await listCommittees();

  return (
    <div className="space-y-6">
      <PageHeader
        backHref="/admin/officials"
        backLabel="Back to officials"
        title="Add official"
        description="Create a new barangay or SK official profile."
      />
      <form
        action={createOfficialAction}
        className="max-w-2xl space-y-4 rounded-lg border border-[var(--color-border)] bg-white p-6"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">First name</Label>
            <Input id="firstName" name="firstName" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last name</Label>
            <Input id="lastName" name="lastName" required />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="middleName">Middle name</Label>
          <Input id="middleName" name="middleName" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="position">Position</Label>
          <Input id="position" name="position" required />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="body">Body</Label>
            <select
              id="body"
              name="body"
              className="flex h-10 w-full rounded-md border border-[var(--color-border)] bg-white px-3 text-sm"
              defaultValue={OfficialBody.BARANGAY}
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
          <Input id="photoUrl" name="photoUrl" type="url" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="publicEmail">Public email</Label>
          <Input id="publicEmail" name="publicEmail" type="email" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="publicBio">Public bio</Label>
          <Textarea id="publicBio" name="publicBio" rows={4} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="termStart">Term start</Label>
            <Input id="termStart" name="termStart" type="date" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="termEnd">Term end</Label>
            <Input id="termEnd" name="termEnd" type="date" />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isActive" defaultChecked />
          Active
        </label>
        <div className="flex gap-2">
          <Button type="submit">Create official</Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/officials">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
