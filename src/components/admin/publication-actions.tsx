"use client";

import { useState, useTransition } from "react";
import { PublicationStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type TransitionAction = (
  id: string,
  status: PublicationStatus,
) => Promise<{ error?: string }>;

const LABELS: Record<PublicationStatus, string> = {
  DRAFT: "Return to draft",
  FOR_REVIEW: "Submit for review",
  APPROVED: "Approve",
  PUBLISHED: "Publish",
  ARCHIVED: "Archive",
};

export function PublicationActions({
  recordId,
  currentStatus,
  availableTransitions,
  onTransition,
}: {
  recordId: string;
  currentStatus: PublicationStatus;
  availableTransitions: PublicationStatus[];
  onTransition: TransitionAction;
}) {
  const [pending, startTransition] = useTransition();
  const [confirmTarget, setConfirmTarget] = useState<PublicationStatus | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  function handleConfirm() {
    if (!confirmTarget) return;
    setError(null);
    startTransition(async () => {
      const result = await onTransition(recordId, confirmTarget);
      if (result.error) {
        setError(result.error);
      } else {
        setConfirmTarget(null);
      }
    });
  }

  if (availableTransitions.length === 0) return null;

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {availableTransitions.map((status) => (
          <Button
            key={status}
            type="button"
            size="sm"
            variant={status === PublicationStatus.ARCHIVED ? "outline" : "secondary"}
            disabled={pending}
            onClick={() => setConfirmTarget(status)}
          >
            {LABELS[status]}
          </Button>
        ))}
      </div>
      <Dialog
        open={confirmTarget !== null}
        onOpenChange={(open) => !open && setConfirmTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm status change</DialogTitle>
            <DialogDescription>
              Change publication status from {currentStatus.replace(/_/g, " ")}{" "}
              to {confirmTarget?.replace(/_/g, " ")}?
            </DialogDescription>
          </DialogHeader>
          {error && (
            <p className="text-sm text-[var(--color-danger)]">{error}</p>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmTarget(null)}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleConfirm} disabled={pending}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
