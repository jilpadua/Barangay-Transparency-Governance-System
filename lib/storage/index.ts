import { mkdir, writeFile, readFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export type StoredFile = {
  key: string;
  url: string;
  fileName: string;
  size: number;
  mimeType: string;
};

export interface StorageProvider {
  upload(
    file: Buffer,
    options: { fileName: string; mimeType: string; folder?: string },
  ): Promise<StoredFile>;
  get(key: string): Promise<Buffer | null>;
}

export class LocalStorageProvider implements StorageProvider {
  private root: string;

  constructor(root = process.env.STORAGE_LOCAL_PATH ?? "./uploads") {
    this.root = path.resolve(root);
  }

  async upload(
    file: Buffer,
    options: { fileName: string; mimeType: string; folder?: string },
  ): Promise<StoredFile> {
    const folder = options.folder ?? "general";
    const safeName = options.fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const key = path.posix.join(folder, `${randomUUID()}-${safeName}`);
    const fullPath = path.join(this.root, key);
    await mkdir(path.dirname(fullPath), { recursive: true });
    await writeFile(fullPath, file);
    return {
      key,
      url: `/uploads/${key}`,
      fileName: options.fileName,
      size: file.length,
      mimeType: options.mimeType,
    };
  }

  async get(key: string): Promise<Buffer | null> {
    try {
      return await readFile(path.join(this.root, key));
    } catch {
      return null;
    }
  }
}

export function getStorageProvider(): StorageProvider {
  // Phase later: S3-compatible when STORAGE_PROVIDER=s3
  return new LocalStorageProvider();
}
