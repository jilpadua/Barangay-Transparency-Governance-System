import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export function ModulePlaceholder({
  title,
  description,
  phaseHint,
}: {
  title: string;
  description: string;
  phaseHint?: string;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-semibold text-[var(--color-primary)]">
          {title}
        </h1>
        <Badge variant="info">Foundation ready</Badge>
      </div>
      <p className="max-w-2xl text-[var(--color-muted-foreground)]">
        {description}
      </p>
      {phaseHint && (
        <p className="text-sm text-[var(--color-muted-foreground)]">
          {phaseHint}
        </p>
      )}
      <p className="text-sm">
        <Link href="/" className="text-[var(--color-accent)] hover:underline">
          Back to home
        </Link>
      </p>
    </div>
  );
}

export function AdminModulePlaceholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold text-[var(--color-primary)]">
        {title}
      </h1>
      <p className="text-[var(--color-muted-foreground)]">{description}</p>
      <Badge variant="default">Module shell — CRUD in later phases</Badge>
    </div>
  );
}
