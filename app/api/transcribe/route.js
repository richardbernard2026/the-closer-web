import { NextResponse } from "next/server";
import { getGroqClient } from "@/lib/groq";

const SUPPORTED = ["mp3", "mp4", "wav", "m4a", "ogg", "webm"];

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "file is required" }, { status: 400 });
    }

    const ext = file.name.split(".").pop().toLowerCase();
    if (!SUPPORTED.includes(ext)) {
      return NextResponse.json(
        { error: `Unsupported format. Use: ${SUPPORTED.join(", ")}` },
        { status: 400 }
      );
    }

    if (file.size > 25 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Max 25MB for free tier." },
        { status: 413 }
      );
    }

    const client = getGroqClient();

    const transcription = await client.audio.transcriptions.create({
      file: file,
      model: "whisper-large-v3",
      response_format: "text",
    });

    return NextResponse.json({ transcript: transcription });
  } catch (err) {
    console.error("[transcribe]", err);
    return NextResponse.json({ error: "transcription failed" }, { status: 500 });
  }
}
