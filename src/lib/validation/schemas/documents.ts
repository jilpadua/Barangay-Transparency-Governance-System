import { z } from "zod";
import { DocumentVisibility } from "@prisma/client";
import {
  optionalDate,
  optionalString,
  publicationStatusSchema,
  requiredString,
} from "./common";

export const documentFormSchema = z.object({
  title: requiredString,
  description: optionalString,
  category: requiredString,
  referenceNumber: optionalString,
  publicationDate: optionalDate,
  visibility: z.nativeEnum(DocumentVisibility).default(DocumentVisibility.PUBLIC),
});

export const documentTransitionSchema = z.object({
  id: requiredString,
  publicationStatus: publicationStatusSchema,
});

export type DocumentFormInput = z.infer<typeof documentFormSchema>;
