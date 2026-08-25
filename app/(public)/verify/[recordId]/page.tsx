import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function VerifyRecordPage({
  params,
}: {
  params: Promise<{ recordId: string }>;
}) {
  const { recordId } = await params;

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <h1 className="text-2xl font-semibold text-[var(--color-primary)]">
        Record verification
      </h1>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>Verification status</CardTitle>
            <Badge variant="warning">Pending setup</Badge>
          </div>
          <CardDescription>
            Blockchain anchoring is prepared but not fully enabled in Phase 1.
            The CMS continues to operate without the network.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="font-medium">Record ID:</span> {recordId}
          </p>
          <p className="text-[var(--color-muted-foreground)]">
            Status: Not anchored / Unavailable until a proof is published and
            confirmed. We will never show &quot;Verified&quot; when the network
            cannot be checked.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
