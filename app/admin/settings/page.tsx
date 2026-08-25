import { requirePermission } from "@/lib/permissions/server";
import { PERMISSIONS } from "@/lib/permissions";
import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  await requirePermission(PERMISSIONS.SETTINGS_MANAGE);

  const barangay = await prisma.barangay.findFirst({
    orderBy: { createdAt: "asc" },
  });

  if (!barangay) {
    return <p>No barangay profile found. Run the database seed.</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-primary)]">
          Barangay settings
        </h1>
        <p className="text-sm text-[var(--color-muted-foreground)]">
          Profile used on the public site. Edit forms arrive in Phase 2.
        </p>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>{barangay.name}</CardTitle>
            {barangay.isDemo && <Badge variant="warning">DEMO</Badge>}
          </div>
          <CardDescription>
            {barangay.municipality}, {barangay.province}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="font-medium">Tagline:</span>{" "}
            {barangay.tagline ?? "—"}
          </p>
          <p>
            <span className="font-medium">Address:</span>{" "}
            {barangay.address ?? "—"}
          </p>
          <p>
            <span className="font-medium">Office hours:</span>{" "}
            {barangay.officeHours ?? "—"}
          </p>
          <p>
            <span className="font-medium">Contact:</span>{" "}
            {barangay.contactEmail ?? "—"} / {barangay.contactPhone ?? "—"}
          </p>
          <p>
            <span className="font-medium">Mission:</span>{" "}
            {barangay.mission ?? "—"}
          </p>
          <p>
            <span className="font-medium">Vision:</span> {barangay.vision ?? "—"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
