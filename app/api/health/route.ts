import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "BTGS",
    timestamp: new Date().toISOString(),
  });
}
