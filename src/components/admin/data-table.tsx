import type { ReactNode } from "react";
import { cn } from "@/utils";

export function DataTable({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "table-wrap rounded-lg border border-[var(--color-border)] bg-white",
        className,
      )}
    >
      <table className="data-table">{children}</table>
    </div>
  );
}
