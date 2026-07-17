import { tierColor } from "../utils/tier";

function ScoreBadge({ score }) {
  const value = Math.round(score);
  const color = tierColor(value);

  return (
    <span
      className="readout inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold"
      style={{
        color,
        background: `color-mix(in srgb, ${color} 14%, transparent)`,
        border: `1px solid color-mix(in srgb, ${color} 34%, transparent)`,
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: color }}
      />
      {value}%
    </span>
  );
}

export default ScoreBadge;
