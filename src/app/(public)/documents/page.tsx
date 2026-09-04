import Link from "next/link";
import { listPublishedDocuments } from "@/services/documents";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils";

export const dynamic = "force-dynamic";

export default async function DocumentsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>;
}) {
  const params = await searchParams;
  const documents = await listPublishedDocuments({
    search: params.search,
    category: params.category,
  });

  const categories = [...new Set(documents.map((d) => d.category))];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-primary)]">
          Documents
        </h1>
        <p className="text-sm text-[var(--color-muted-foreground)]">
          Published public documents and reports.
        </p>
      </div>

      <form className="flex flex-wrap gap-2">
        <input
          name="search"
          type="search"
          placeholder="Search documents…"
          defaultValue={params.search ?? ""}
          className="h-10 rounded-md border border-[var(--color-border)] bg-white px-3 text-sm"
        />
        <select
          name="category"
          defaultValue={params.category ?? ""}
          className="h-10 rounded-md border border-[var(--color-border)] bg-white px-3 text-sm"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="h-10 rounded-md bg-[var(--color-primary)] px-4 text-sm text-white"
        >
          Filter
        </button>
      </form>

      {documents.length === 0 ? (
        <p className="text-sm text-[var(--color-muted-foreground)]">
          No published documents found.
        </p>
      ) : (
        <ul className="space-y-3">
          {documents.map((doc) => {
            const current = doc.versions[0];
            return (
              <li
                key={doc.id}
                className="rounded-lg border border-[var(--color-border)] bg-white p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="mb-1 flex flex-wrap gap-2">
                      {doc.isDemo && <Badge variant="warning">DEMO</Badge>}
                      <Badge variant="primary">{doc.category}</Badge>
                    </div>
                    <Link
                      href={`/documents/${doc.id}`}
                      className="font-semibold text-[var(--color-primary)] hover:underline"
                    >
                      {doc.title}
                    </Link>
                    <p className="text-xs text-[var(--color-muted-foreground)]">
                      {doc.documentCode}
                      {doc.publicationDate &&
                        ` · ${formatDate(doc.publicationDate)}`}
                    </p>
                  </div>
                  {current && (
                    <a
                      href={current.fileUrl}
                      className="text-sm text-[var(--color-accent)] hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download v{current.version}
                    </a>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
