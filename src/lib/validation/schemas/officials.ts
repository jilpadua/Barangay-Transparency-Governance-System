import { z } from "zod";
import { OfficialBody } from "@prisma/client";
import {
  booleanFromForm,
  optionalDate,
  optionalString,
  publicationStatusSchema,
  requiredString,
} from "./common";

export const officialFormSchema = z.object({
  body: z.nativeEnum(OfficialBody),
  committeeId: optionalString,
  firstName: requiredString,
  lastName: requiredString,
  middleName: optionalString,
  position: requiredString,
  photoUrl: optionalString,
  publicBio: optionalString,
  publicEmail: optionalString,
  termStart: optionalDate,
  termEnd: optionalDate,
  isActive: booleanFromForm.optional().default(true),
});

export const committeeFormSchema = z.object({
  name: requiredString,
  body: z.nativeEnum(OfficialBody),
  description: optionalString,
});

export const officialTransitionSchema = z.object({
  id: requiredString,
  publicationStatus: publicationStatusSchema,
});

export type OfficialFormInput = z.infer<typeof officialFormSchema>;
