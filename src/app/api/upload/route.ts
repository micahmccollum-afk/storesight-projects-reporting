import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

const BLOB_FILENAME = "projects.csv";

function convertToUtf8Csv(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);

  let text: string;

  // Detect UTF-16 LE BOM (0xFF 0xFE)
  if (bytes.length >= 2 && bytes[0] === 0xff && bytes[1] === 0xfe) {
    const decoder = new TextDecoder("utf-16le");
    text = decoder.decode(bytes);
  }
  // Detect UTF-16 BE BOM (0xFE 0xFF)
  else if (bytes.length >= 2 && bytes[0] === 0xfe && bytes[1] === 0xff) {
    const decoder = new TextDecoder("utf-16be");
    text = decoder.decode(bytes);
  }
  // Detect UTF-8 BOM or plain UTF-8
  else {
    if (
      bytes.length >= 3 &&
      bytes[0] === 0xef &&
      bytes[1] === 0xbb &&
      bytes[2] === 0xbf
    ) {
      text = new TextDecoder("utf-8").decode(bytes.slice(3));
    } else {
      text = new TextDecoder("utf-8").decode(bytes);
    }
  }

  // Remove any BOM character that made it through
  text = text.replace(/^\uFEFF/, "");

  // Detect delimiter: if first line has tabs, it's TSV
  const firstLine = text.split("\n")[0];
  if (firstLine.includes("\t")) {
    const lines = text.split("\n");
    const csvLines = lines.map((line) => {
      const fields = line.split("\t");
      return fields
        .map((field) => {
          const trimmed = field.trim();
          if (
            trimmed.includes(",") ||
            trimmed.includes('"') ||
            trimmed.includes("\n")
          ) {
            return `"${trimmed.replace(/"/g, '""')}"`;
          }
          return trimmed;
        })
        .join(",");
    });
    text = csvLines.join("\n");
  }

  return text;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    if (!file.name.endsWith(".csv")) {
      return NextResponse.json(
        { error: "Please upload a CSV file" },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();
    const text = convertToUtf8Csv(buffer);
    const lines = text.trim().split("\n");

    if (lines.length < 2) {
      return NextResponse.json(
        { error: "CSV file appears to be empty or has no data rows" },
        { status: 400 }
      );
    }

    // Upload to Vercel Blob (overwrites any existing file with the same name)
    const blob = await put(BLOB_FILENAME, text, {
      access: "public",
      addRandomSuffix: false,
      contentType: "text/csv",
    });

    return NextResponse.json({
      success: true,
      filename: file.name,
      rows: lines.length - 1,
      headers: lines[0].split(",").length,
      url: blob.url,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to upload file";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
