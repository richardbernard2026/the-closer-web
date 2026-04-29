const COLORS = [
  "bg-blue-500",
  "bg-violet-500",
  "bg-emerald-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-cyan-500",
];

export default function TalkTimeChart({ speakers }) {
  if (!speakers?.length) return null;

  return (
    <div className="space-y-3">
      {speakers.map((speaker, i) => {
        const pct = Math.min(100, Math.max(0, speaker.talkTimePercent ?? 0));
        const color = COLORS[i % COLORS.length];

        return (
          <div key={speaker.id ?? i}>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-white truncate max-w-[60%]">
                {speaker.label ?? speaker.id ?? `Speaker ${i + 1}`}
              </span>
              <span className="text-slate-400 tabular-nums">
                {pct.toFixed(1)}% &middot; {(speaker.wordCount ?? 0).toLocaleString()} words
              </span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-slate-700/60 overflow-hidden">
              <div
                className={`h-full rounded-full ${color} transition-all duration-700`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
