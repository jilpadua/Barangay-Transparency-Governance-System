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

export default async function AboutPage() {
  const barangay = await prisma.barangay.findFirst({
    orderBy: { createdAt: "asc" },
  });

  if (!barangay) {
    return <p>Barangay profile not found. Run database seed.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-semibold text-[var(--color-primary)]">
          About {barangay.name}
        </h1>
        {barangay.isDemo && <Badge variant="warning">DEMO</Badge>}
      </div>
      <p className="text-[var(--color-muted-foreground)]">
        {barangay.municipality}, {barangay.province}
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contact & office</CardTitle>
            <CardDescription>Public contact information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Address:</span>{" "}
              {barangay.address ?? "—"}
            </p>
            <p>
              <span className="font-medium">Email:</span>{" "}
              {barangay.contactEmail ?? "—"}
            </p>
            <p>
              <span className="font-medium">Phone:</span>{" "}
              {barangay.contactPhone ?? "—"}
            </p>
            <p>
              <span className="font-medium">Office hours:</span>{" "}
              {barangay.officeHours ?? "—"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Mission</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            {barangay.mission ?? "—"}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Vision</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            {barangay.vision ?? "—"}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>History</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            {barangay.history ?? "—"}
          </CardContent>
        </Card>
      </div>

      {barangay.generalInfo && (
        <Card>
          <CardHeader>
            <CardTitle>General information</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">{barangay.generalInfo}</CardContent>
        </Card>
      )}
    </div>
  );
}
