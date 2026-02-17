import { NextResponse } from "next/server";
import { list } from "@vercel/blob";
import { parseCSV } from "@/lib/csv-parser";
import { processDashboardData } from "@/lib/data-processing";

const BLOB_FILENAME = "projects.csv";

export async function GET() {
  try {
    // Find the blob by prefix
    const { blobs } = await list({ prefix: BLOB_FILENAME, limit: 1 });

    if (blobs.length === 0) {
      return NextResponse.json({ noData: true });
    }

    // Fetch the CSV content from the blob URL
    const response = await fetch(blobs[0].url);
    if (!response.ok) {
      return NextResponse.json({ noData: true });
    }

    const csvText = await response.text();
    const rawRows = parseCSV(csvText);
    const data = processDashboardData(rawRows);

    return NextResponse.json(data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to process data";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
