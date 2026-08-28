export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export const ALLOWED_DOCUMENT_MIMES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
] as const;

export function validateUpload(
  file: { size: number; type: string },
  allowedMimes: readonly string[] = ALLOWED_DOCUMENT_MIMES,
) {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("File exceeds 10 MB limit");
  }
  if (!allowedMimes.includes(file.type)) {
    throw new Error(`File type not allowed: ${file.type || "unknown"}`);
  }
}

export function fileToBuffer(file: File): Promise<Buffer> {
  return file.arrayBuffer().then((buf) => Buffer.from(buf));
}
