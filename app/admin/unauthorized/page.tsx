export default function UnauthorizedPage() {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold text-[var(--color-primary)]">
        Access denied
      </h1>
      <p className="text-[var(--color-muted-foreground)]">
        You do not have permission to view that page. Contact a Super Admin if
        you need access.
      </p>
    </div>
  );
}
