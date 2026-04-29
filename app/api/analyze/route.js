import { NextResponse } from "next/server";
import { analyzeTranscript } from "@/lib/analyzeTranscript";

export async function POST(request) {
  try {
    const { transcript } = await request.json();

    if (!transcript || typeof transcript !== "string" || transcript.trim().length === 0) {
      return NextResponse.json({ error: "transcript is required" }, { status: 400 });
    }

    if (transcript.length > 200_000) {
      return NextResponse.json({ error: "transcript too large (max 200k chars)" }, { status: 413 });
    }

    const result = await analyzeTranscript(transcript);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[analyze]", err);

    if (err instanceof SyntaxError) {
      return NextResponse.json({ error: "model returned invalid JSON" }, { status: 502 });
    }

    return NextResponse.json({ error: "analysis failed" }, { status: 500 });
  }
}
