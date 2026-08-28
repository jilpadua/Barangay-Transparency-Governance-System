import { z } from "zod";
import { AttendanceStatus, MeetingStatus } from "@prisma/client";
import {
  optionalString,
  publicationStatusSchema,
  requiredDate,
  requiredString,
} from "./common";

export const meetingFormSchema = z.object({
  meetingType: requiredString,
  title: requiredString,
  meetingDate: requiredDate,
  startTime: optionalString,
  endTime: optionalString,
  location: optionalString,
  agenda: optionalString,
  minutes: optionalString,
  status: z.nativeEnum(MeetingStatus).default(MeetingStatus.SCHEDULED),
});

export const meetingTransitionSchema = z.object({
  id: requiredString,
  publicationStatus: publicationStatusSchema,
});

export const attendanceEntrySchema = z.object({
  officialId: requiredString,
  status: z.nativeEnum(AttendanceStatus),
  remarks: optionalString,
});

export const attendanceBulkSchema = z.object({
  meetingId: requiredString,
  entries: z.array(attendanceEntrySchema),
});

export type MeetingFormInput = z.infer<typeof meetingFormSchema>;
