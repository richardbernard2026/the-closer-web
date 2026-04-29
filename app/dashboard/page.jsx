"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import InsightCard from "@/components/InsightCard";
import TalkTimeChart from "@/components/TalkTimeChart";
import SpeakerBreakdown from "@/components/SpeakerBreakdown";

function ScoreRing({ score }) {
  const clamped = Math.min(100, Math.max(0, score ?? 0));
  const color =
    clamped >= 75 ? "text-emerald-400" : clamped >= 50 ? "text-yellow-400" : "text-red-400";
  const ringColor =
    clamped >= 75 ? "stroke-emerald-400" : clamped >= 50 ? "stroke-yellow-400" : "stroke-red-400";

  const radius = 54;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (clamped / 100) * circ;

  return (
    <div className="relative flex items-center justify-center h-36 w-36">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} strokeWidth="8" className="stroke-slate-700" fill="none" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          strokeWidth="8"
          fill="none"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`${ringColor} transition-all duration-1000`}
        />
      </svg>
      <div className="relative text-center">
        <span className={`text-4xl font-bold tabular-nums ${color}`}>{clamped}</span>
        <span className="block text-xs text-slate-500 mt-0.5">/ 100</span>
      </div>
    </div>
  );
}

function TranscriptViewer({ transcript }) {
  const lines = transcript?.split("\n").filter(Boolean) ?? [];

  return (
    <div className="max-h-80 overflow-y-auto rounded-lg bg-slate-900 border border-slate-800 p-4 space-y-1 font-mono text-xs">
      {lines.map((line, i) => {
        const tsMatch = line.match(/^\[(\d{2}:\d{2}:\d{2})\]/);
        const rest = tsMatch ? line.slice(tsMatch[0].length).trim() : line;

        return (
          <div key={i} className="flex gap-3">
            {tsMatch && (
              <span className="flex-shrink-0 text-slate-600 w-16 tabular-nums">{tsMatch[1]}</span>
            )}
            <span className="text-slate-300 leading-relaxed">{rest}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [transcript, setTranscript] = useState(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("closerInsights");
      if (!stored) { router.replace("/"); return; }
      const parsed = JSON.parse(stored);
      setData(parsed.data);
      setTranscript(parsed.transcript);
    } catch {
      router.replace("/");
    }
  }, [router]);

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white px-4 py-10">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Top bar */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              The Closer <span className="text-blue-400">Insights</span>
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">Meeting analysis report</p>
          </div>
          <button
            onClick={() => router.push("/")}
            className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
          >
            ← New analysis
          </button>
        </div>

        {/* Score + Summary */}
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col items-center justify-center gap-2 min-w-[180px]">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">
              Effectiveness Score
            </p>
            <ScoreRing score={data.score} />
          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-center">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-3">
              Meeting Summary
            </p>
            <p className="text-slate-200 leading-relaxed">{data.summary}</p>
          </div>
        </div>

        {/* Talk time */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-5">
            Talk Time Distribution
          </h2>
          <TalkTimeChart speakers={data.speakers} />
        </div>

        {/* Speaker breakdown table */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-5">
            Speaker Breakdown
          </h2>
          <SpeakerBreakdown speakers={data.speakers} />
        </div>

        {/* Insights */}
        {data.insights?.length > 0 && (
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-5">
              Insights
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.insights.map((insight, i) => (
                <InsightCard key={i} insight={insight} />
              ))}
            </div>
          </div>
        )}

        {/* Transcript */}
        {transcript && (
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-5">
              Full Transcript
            </h2>
            <TranscriptViewer transcript={transcript} />
          </div>
        )}

        {/* Freemium */}
        <div className="flex justify-center pb-4">
          <div className="relative group">
            <button
              disabled
              className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed select-none"
            >
              <span className="h-2 w-2 rounded-full bg-slate-600" />
              Live Mode
              <span className="ml-1 rounded bg-slate-800 px-1.5 py-0.5 text-xs text-slate-600 font-medium">
                PRO
              </span>
            </button>
            <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-52 rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-center text-xs text-slate-300 shadow-lg">
              Connect The Closer desktop app to enable live mode
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
