import {
  LegalInstrumentStatus,
  MeetingStatus,
  PublicationStatus,
} from "@prisma/client";
import { Badge } from "@/components/ui/badge";

const publicationVariants: Record<
  PublicationStatus,
  "default" | "info" | "warning" | "success" | "danger"
> = {
  DRAFT: "default",
  FOR_REVIEW: "info",
  APPROVED: "warning",
  PUBLISHED: "success",
  ARCHIVED: "danger",
};

const meetingVariants: Record<
  MeetingStatus,
  "default" | "info" | "warning" | "success" | "danger"
> = {
  SCHEDULED: "info",
  COMPLETED: "success",
  CANCELLED: "danger",
  POSTPONED: "warning",
};

const legalVariants: Record<
  LegalInstrumentStatus,
  "default" | "info" | "warning" | "success" | "danger"
> = {
  DRAFT: "default",
  PENDING: "info",
  APPROVED: "warning",
  ENACTED: "success",
  REPEALED: "danger",
  ARCHIVED: "danger",
};

export function PublicationStatusBadge({
  status,
}: {
  status: PublicationStatus;
}) {
  return (
    <Badge variant={publicationVariants[status]}>
      {status.replace(/_/g, " ")}
    </Badge>
  );
}

export function MeetingStatusBadge({ status }: { status: MeetingStatus }) {
  return (
    <Badge variant={meetingVariants[status]}>
      {status.replace(/_/g, " ")}
    </Badge>
  );
}

export function LegalStatusBadge({ status }: { status: LegalInstrumentStatus }) {
  return (
    <Badge variant={legalVariants[status]}>
      {status.replace(/_/g, " ")}
    </Badge>
  );
}
