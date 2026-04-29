const COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f97316", "#ec4899", "#06b6d4"];

export default function SpeakerBreakdown({ speakers }) {
  if (!speakers?.length) return null;

  const total = speakers.reduce((s, sp) => s + (sp.wordCount ?? 0), 0);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-slate-400 text-xs uppercase tracking-wide border-b border-slate-700">
            <th className="text-left py-2 pr-4 font-medium">Speaker</th>
            <th className="text-right py-2 px-4 font-medium">Talk Time</th>
            <th className="text-right py-2 px-4 font-medium">Words</th>
            <th className="text-right py-2 pl-4 font-medium">Share</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {speakers.map((speaker, i) => {
            const pct = speaker.talkTimePercent ?? 0;
            const words = speaker.wordCount ?? 0;
            const color = COLORS[i % COLORS.length];

            return (
              <tr key={speaker.id ?? i} className="text-slate-200">
                <td className="py-2.5 pr-4 font-medium flex items-center gap-2">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  {speaker.label ?? speaker.id ?? `Speaker ${i + 1}`}
                </td>
                <td className="py-2.5 px-4 text-right tabular-nums">{pct.toFixed(1)}%</td>
                <td className="py-2.5 px-4 text-right tabular-nums">{words.toLocaleString()}</td>
                <td className="py-2.5 pl-4 text-right">
                  <div className="inline-flex items-center justify-end gap-1.5">
                    <div className="h-1.5 w-24 rounded-full bg-slate-700">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${total > 0 ? (words / total) * 100 : 0}%`,
                          backgroundColor: color,
                        }}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
