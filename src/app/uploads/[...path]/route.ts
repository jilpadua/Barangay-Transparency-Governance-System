import { readFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

const ALLOWED_FOLDERS = new Set([
  "documents",
  "announcements",
  "legal",
  "general",
  "demo",
]);

const MIME_BY_EXT: Record<string, string> = {
  ".pdf": "application/pdf",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".doc": "application/msword",
  ".docx":
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".xls": "application/vnd.ms-excel",
  ".xlsx":
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const segments = (await params).path;
  if (!segments?.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const folder = segments[0];
  if (!ALLOWED_FOLDERS.has(folder)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const root = path.resolve(
    process.env.STORAGE_LOCAL_PATH ?? "./uploads",
  );
  const relativePath = segments.join("/");
  const fullPath = path.resolve(root, relativePath);

  if (!fullPath.startsWith(root)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const buffer = await readFile(fullPath);
    const ext = path.extname(fullPath).toLowerCase();
    const contentType = MIME_BY_EXT[ext] ?? "application/octet-stream";
    const fileName = path.basename(fullPath);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${fileName}"`,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
