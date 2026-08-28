"use client";

import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function FileUploadField({
  name = "file",
  label = "Upload file",
  accept = ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.webp",
  required,
}: {
  name?: string;
  label?: string;
  accept?: string;
  required?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        ref={inputRef}
        id={name}
        name={name}
        type="file"
        accept={accept}
        required={required}
      />
      <p className="text-xs text-[var(--color-muted-foreground)]">
        Max 10 MB. PDF, Office documents, or images.
      </p>
    </div>
  );
}
