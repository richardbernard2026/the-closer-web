const SEVERITY_STYLES = {
  high: "border-red-500 bg-red-950/40 text-red-300",
  medium: "border-yellow-500 bg-yellow-950/40 text-yellow-300",
  low: "border-green-500 bg-green-950/40 text-green-300",
};

const SEVERITY_DOT = {
  high: "bg-red-500",
  medium: "bg-yellow-400",
  low: "bg-green-500",
};

const TYPE_LABELS = {
  talkRatio: "Talk Ratio",
  fillerWords: "Filler Words",
  engagement: "Engagement",
  pacing: "Pacing",
};

export default function InsightCard({ insight }) {
  const { type, severity, message } = insight;
  const sev = severity?.toLowerCase() ?? "low";
  const style = SEVERITY_STYLES[sev] ?? SEVERITY_STYLES.low;
  const dot = SEVERITY_DOT[sev] ?? SEVERITY_DOT.low;

  return (
    <div className={`rounded-lg border px-4 py-3 flex gap-3 items-start ${style}`}>
      <span className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${dot}`} />
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide opacity-70 mb-0.5">
          {TYPE_LABELS[type] ?? type}
        </p>
        <p className="text-sm leading-relaxed">{message}</p>
      </div>
    </div>
  );
}
