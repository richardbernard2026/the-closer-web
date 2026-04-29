"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TranscriptUploader from "@/components/TranscriptUploader";

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleUpload(transcriptText) {
    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append(
        "file",
        new Blob([transcriptText], { type: "text/plain" }),
        "transcript.txt"
      );

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Server error ${res.status}`);
      }

      const data = await res.json();
      sessionStorage.setItem("closerInsights", JSON.stringify({ data, transcript: transcriptText }));
      router.push("/dashboard");
    } catch (err) {
      setError(err.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="text-2xl">📊</span>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              The Closer <span className="text-blue-400">Insights</span>
            </h1>
          </div>
          <p className="text-slate-400 text-base">
            Upload a meeting transcript and get AI-powered analytics in seconds.
          </p>
        </div>

        {/* Uploader card */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl">
          {loading ? (
            <div className="flex flex-col items-center gap-4 py-10">
              <div className="h-10 w-10 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
              <p className="text-slate-400 text-sm">Analyzing with Groq&hellip;</p>
            </div>
          ) : (
            <TranscriptUploader onUpload={handleUpload} />
          )}

          {error && (
            <div className="mt-4 rounded-lg bg-red-950/50 border border-red-800 px-4 py-3 text-red-300 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Freemium placeholder */}
        <div className="mt-6 flex justify-center">
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

        <p className="mt-8 text-center text-xs text-slate-600">
          Powered by Groq &middot; llama-3.1-8b-instant
        </p>
      </div>
    </main>
  );
}
