import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedDocument } from "@/services/documents";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils";

export const dynamic = "force-dynamic";

export default async function DocumentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let document;
  try {
    document = await getPublishedDocument(id);
  } catch {
    notFound();
  }

  const current = document.versions[0];

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/documents"
          className="text-sm text-[var(--color-accent)] hover:underline"
        >
          ← Back to documents
        </Link>
        <div className="mt-2 flex flex-wrap gap-2">
          {document.isDemo && <Badge variant="warning">DEMO</Badge>}
          <Badge variant="primary">{document.category}</Badge>
        </div>
        <h1 className="mt-2 text-2xl font-semibold text-[var(--color-primary)]">
          {document.title}
        </h1>
        <p className="text-sm text-[var(--color-muted-foreground)]">
          {document.documentCode}
          {document.referenceNumber && ` · Ref: ${document.referenceNumber}`}
          {document.publicationDate &&
            ` · ${formatDate(document.publicationDate)}`}
        </p>
      </div>

      {document.description && (
        <p className="text-sm text-[var(--color-foreground)]">
          {document.description}
        </p>
      )}

      {current && (
        <div className="rounded-lg border border-[var(--color-border)] bg-white p-4">
          <p className="font-medium">Current version: {current.version}</p>
          <p className="text-sm text-[var(--color-muted-foreground)]">
            {current.fileName}
          </p>
          <a
            href={current.fileUrl}
            className="mt-2 inline-block text-sm text-[var(--color-accent)] hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download file
          </a>
        </div>
      )}
    </div>
  );
}
