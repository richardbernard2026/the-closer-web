import { getGroqClient } from "./groq";

const SYSTEM_PROMPT = `You are a meeting analytics engine. Analyze this transcript and return ONLY a JSON object with these fields:
- speakers: array of {id, label, talkTimePercent, wordCount}
- insights: array of {type, severity, message} where type is one of: talkRatio, fillerWords, engagement, pacing
- score: overall meeting effectiveness 0-100
- summary: 2 sentence meeting summary
No explanation. No preamble. Valid JSON only.`;

export async function analyzeTranscript(transcriptText) {
  const client = getGroqClient();

  const completion = await client.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: transcriptText },
    ],
    temperature: 0.2,
    max_tokens: 2048,
  });

  const raw = completion.choices[0]?.message?.content ?? "";

  // Strip markdown code fences if the model wraps the JSON
  const jsonText = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();

  return JSON.parse(jsonText);
}
