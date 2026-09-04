import { z } from "zod";
import { PublicationStatus } from "@prisma/client";

export const optionalString = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
  .transform((v) => (v === "" ? undefined : v));

export const requiredString = z.string().trim().min(1);

export const optionalDate = z
  .string()
  .optional()
  .or(z.literal(""))
  .transform((v) => (v && v.length > 0 ? new Date(v) : undefined));

export const requiredDate = z.string().min(1).transform((v) => new Date(v));

export const publicationStatusSchema = z.nativeEnum(PublicationStatus);

export const booleanFromForm = z
  .union([z.boolean(), z.literal("on"), z.literal("true"), z.literal("false")])
  .transform((v) => v === true || v === "on" || v === "true");
