import { z } from "zod";
import {
  booleanFromForm,
  optionalString,
  publicationStatusSchema,
  requiredDate,
  requiredString,
} from "./common";

export const eventFormSchema = z.object({
  title: requiredString,
  description: optionalString,
  eventDate: requiredDate,
  startTime: optionalString,
  endTime: optionalString,
  location: optionalString,
  organizer: optionalString,
  targetAudience: optionalString,
  registrationInfo: optionalString,
  results: optionalString,
  isSk: booleanFromForm.optional().default(false),
});

export const eventTransitionSchema = z.object({
  id: requiredString,
  publicationStatus: publicationStatusSchema,
});

export type EventFormInput = z.infer<typeof eventFormSchema>;
