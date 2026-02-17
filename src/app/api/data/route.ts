import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { parseCSV } from "@/lib/csv-parser";
import { processDashboardData } from "@/lib/data-processing";

const BLOB_FILENAME = "projects.csv";
const CSV_PATH = path.join(process.cwd(), "data", "projects.csv");

function hasBlobToken(): boolean {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

export async function GET() {
  try {
    let csvText: string;

    if (hasBlobToken()) {
      const { list } = await import("@vercel/blob");
      const { blobs } = await list({ prefix: BLOB_FILENAME, limit: 1 });

      if (blobs.length === 0) {
        return NextResponse.json({ noData: true });
      }

      const response = await fetch(blobs[0].url);
      if (!response.ok) {
        return NextResponse.json({ noData: true });
      }

      csvText = await response.text();
    } else {
      if (!existsSync(CSV_PATH)) {
        return NextResponse.json({ noData: true });
      }

      csvText = await readFile(CSV_PATH, "utf-8");
    }

    const rawRows = parseCSV(csvText);
    const data = processDashboardData(rawRows);

    return NextResponse.json(data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to process data";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
