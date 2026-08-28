import { z } from "zod";
import {
  booleanFromForm,
  optionalDate,
  requiredString,
  publicationStatusSchema,
} from "./common";

export const announcementFormSchema = z.object({
  title: requiredString,
  content: requiredString,
  publishDate: optionalDate,
  expireDate: optionalDate,
  featured: booleanFromForm.optional().default(false),
});

export const announcementTransitionSchema = z.object({
  id: requiredString,
  publicationStatus: publicationStatusSchema,
});

export type AnnouncementFormInput = z.infer<typeof announcementFormSchema>;
