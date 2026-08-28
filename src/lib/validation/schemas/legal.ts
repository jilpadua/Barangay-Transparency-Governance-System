import { z } from "zod";
import { LegalInstrumentStatus } from "@prisma/client";
import {
  booleanFromForm,
  optionalDate,
  optionalString,
  publicationStatusSchema,
  requiredString,
} from "./common";

export const resolutionFormSchema = z.object({
  referenceNumber: requiredString,
  title: requiredString,
  type: optionalString,
  subject: optionalString,
  authoringBody: optionalString,
  resolutionDate: optionalDate,
  description: optionalString,
  documentUrl: optionalString,
  version: optionalString.default("1.0"),
  status: z.nativeEnum(LegalInstrumentStatus).default(LegalInstrumentStatus.DRAFT),
  isSk: booleanFromForm.optional().default(false),
});

export const resolutionTransitionSchema = z.object({
  id: requiredString,
  publicationStatus: publicationStatusSchema,
});

export const ordinanceFormSchema = z.object({
  referenceNumber: requiredString,
  title: requiredString,
  type: optionalString,
  subject: optionalString,
  authoringBody: optionalString,
  ordinanceDate: optionalDate,
  description: optionalString,
  documentUrl: optionalString,
  version: optionalString.default("1.0"),
  status: z.nativeEnum(LegalInstrumentStatus).default(LegalInstrumentStatus.DRAFT),
});

export const ordinanceTransitionSchema = z.object({
  id: requiredString,
  publicationStatus: publicationStatusSchema,
});

export type ResolutionFormInput = z.infer<typeof resolutionFormSchema>;
export type OrdinanceFormInput = z.infer<typeof ordinanceFormSchema>;
