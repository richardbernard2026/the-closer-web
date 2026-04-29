"use client";

import { useRef, useState } from "react";

export default function TranscriptUploader({ onUpload }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [error, setError] = useState(null);

  function handleFile(file) {
    setError(null);
    if (!file) return;

    if (!file.name.endsWith(".txt")) {
      setError("Only .txt files are supported.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File too large (max 5 MB).");
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => onUpload(e.target.result);
    reader.readAsText(file);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  }

  return (
    <div
      className={`relative rounded-xl border-2 border-dashed p-10 text-center cursor-pointer transition-colors ${
        dragging
          ? "border-blue-400 bg-blue-900/20"
          : "border-slate-600 hover:border-slate-400 bg-slate-800/40"
      }`}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".txt"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      <div className="flex flex-col items-center gap-3 pointer-events-none">
        <svg
          className="h-10 w-10 text-slate-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
          />
        </svg>

        {fileName ? (
          <p className="text-sm text-blue-300 font-medium">{fileName}</p>
        ) : (
          <>
            <p className="text-slate-300 font-medium">Drop your transcript here</p>
            <p className="text-slate-500 text-sm">or click to browse &mdash; .txt files only</p>
          </>
        )}

        <p className="text-slate-600 text-xs mt-1">
          Format: <code className="font-mono">[HH:MM:SS] Speaker: text</code> per line
        </p>
      </div>

      {error && (
        <p className="mt-3 text-red-400 text-sm pointer-events-none">{error}</p>
      )}
    </div>
  );
}
