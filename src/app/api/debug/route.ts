import { NextResponse } from "next/server";

export async function GET() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  return NextResponse.json({
    hasBlobToken: !!token,
    tokenPrefix: token ? token.substring(0, 10) + "..." : "not set",
    isVercel: !!process.env.VERCEL,
    nodeEnv: process.env.NODE_ENV,
  });
}
