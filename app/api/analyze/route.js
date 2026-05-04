import { NextResponse } from "next/server";
import { analyzeTranscript } from "@/lib/analyzeTranscript";
import mammoth from "mammoth";
import pdfParse from "pdf-parse/lib/pdf-parse.js";

async function extractText(file) {
  const ext = file.name.split(".").pop().toLowerCase();
  const buffer = Buffer.from(await file.arrayBuffer());

  if (ext === "txt") return buffer.toString("utf-8");

  if (ext === "vtt" || ext === "srt") {
    return buffer
      .toString("utf-8")
      .split("\n")
      .filter(
        (line) =>
          !/^\d{2}:\d{2}/.test(line) &&
          !/-->/.test(line) &&
          line.trim() !== "" &&
          !/^\d+$/.test(line.trim())
      )
      .join(" ");
  }

  if (ext === "pdf") {
    const data = await pdfParse(buffer);
    return data.text;
  }

  if (ext === "docx") {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  throw new Error(`Unsupported file type: .${ext}`);
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "file is required" }, { status: 400 });
    }

    const transcriptText = await extractText(file);

    if (!transcriptText || transcriptText.trim().length === 0) {
      return NextResponse.json({ error: "transcript is required" }, { status: 400 });
    }

    if (transcriptText.length > 200_000) {
      return NextResponse.json({ error: "transcript too large (max 200k chars)" }, { status: 413 });
    }

    const result = await analyzeTranscript(transcriptText);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[analyze]", err);

    if (err instanceof SyntaxError) {
      return NextResponse.json({ error: "model returned invalid JSON" }, { status: 502 });
    }

    return NextResponse.json({ error: "analysis failed" }, { status: 500 });
  }
}
