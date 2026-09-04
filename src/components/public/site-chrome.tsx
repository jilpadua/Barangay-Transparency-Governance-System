import Link from "next/link";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/officials", label: "Officials" },
  { href: "/transparency", label: "Transparency" },
  { href: "/projects", label: "Projects" },
  { href: "/documents", label: "Documents" },
  { href: "/meetings", label: "Meetings" },
  { href: "/events", label: "Events" },
  { href: "/feedback", label: "Feedback" },
  { href: "/verify", label: "Verify" },
];

export function PublicHeader({
  barangayName = "Demo Barangay",
}: {
  barangayName?: string;
}) {
  return (
    <header className="border-b border-[var(--color-border)] bg-white">
      <div className="demo-banner">
        DEMO DATA — Records in this system are for demonstration only and are
        not official government publications.
      </div>
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="flex flex-col">
          <span className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted-foreground)]">
            Barangay Transparency & Governance System
          </span>
          <span className="text-lg font-semibold text-[var(--color-primary)]">
            {barangayName}
          </span>
        </Link>
        <Link
          href="/login"
          className="text-sm font-medium text-[var(--color-accent)] hover:underline"
        >
          Staff login
        </Link>
      </div>
      <nav
        aria-label="Primary"
        className="border-t border-[var(--color-border)] bg-[var(--color-primary)]"
      >
        <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-2 py-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded px-3 py-1.5 text-sm text-white/90 hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}

export function PublicFooter({
  barangayName = "Demo Barangay",
}: {
  barangayName?: string;
}) {
  return (
    <footer className="mt-auto border-t border-[var(--color-border)] bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-[var(--color-muted-foreground)] sm:flex-row sm:justify-between">
        <div>
          <p className="font-medium text-[var(--color-foreground)]">
            {barangayName}
          </p>
          <p>Transparency portal for residents and stakeholders.</p>
        </div>
        <div className="flex gap-4">
          <Link href="/verify" className="hover:underline">
            Verify a record
          </Link>
          <Link href="/feedback" className="hover:underline">
            Submit feedback
          </Link>
        </div>
      </div>
    </footer>
  );
}
