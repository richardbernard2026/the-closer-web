# The Closer — Insights Dashboard

## Stack
- **Next.js 14** (App Router, no `src/` dir, JS not TS)
- **Tailwind CSS** — dark slate-950 theme, no light mode
- **Groq SDK** (`groq-sdk`) — `llama-3.1-8b-instant`

## Key env vars
| Var | Description |
|-----|-------------|
| `GROQ_API_KEY` | From console.groq.com — place in `.env.local` |

## File structure
```
app/
  layout.jsx          Root layout, metadata
  page.jsx            Upload page — reads .txt, POSTs to /api/analyze
  dashboard/page.jsx  Insights view — reads sessionStorage["closerInsights"]
  api/analyze/route.js POST handler, calls analyzeTranscript(), returns JSON

components/
  TranscriptUploader.jsx  Drag-and-drop .txt uploader
  TalkTimeChart.jsx       Horizontal bar chart per speaker
  SpeakerBreakdown.jsx    Table view (talk%, word count, share bar)
  InsightCard.jsx         Color-coded card (green/yellow/red by severity)

lib/
  groq.js              Singleton Groq client
  analyzeTranscript.js Sends transcript to Groq, strips markdown fences, parses JSON
```

## Groq response schema
```json
{
  "speakers": [
    { "id": "string", "label": "string", "talkTimePercent": 42.5, "wordCount": 312 }
  ],
  "insights": [
    { "type": "talkRatio|fillerWords|engagement|pacing", "severity": "high|medium|low", "message": "string" }
  ],
  "score": 78,
  "summary": "Two sentence string."
}
```

## Data flow
1. User drops `.txt` → `TranscriptUploader` reads as text → `page.jsx` POSTs to `/api/analyze`
2. Route calls `analyzeTranscript(text)` → Groq → JSON parsed → returned
3. `page.jsx` writes `sessionStorage["closerInsights"]` → navigates to `/dashboard`
4. Dashboard reads sessionStorage on mount; redirects to `/` if missing

## Transcript format (input)
```
[HH:MM:SS] Speaker Name: utterance text
[00:01:32] Alice: Let's kick off the call.
```

## Freemium
"Live Mode" button is disabled on both pages with tooltip "Connect The Closer desktop app to enable live mode". Not wired to any backend.
