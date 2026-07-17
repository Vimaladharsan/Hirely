import { useEffect, useRef, useState } from "react";

import { tierColor } from "../utils/tier";

/**
 * Circular score gauge — the recurring "how well does this person fit"
 * motif. Draws its arc and counts up on mount.
 */
function ScoreRing({ score, size = 132, stroke = 10, showLabel = true }) {
  const clamped = Math.max(0, Math.min(100, score));
  const color = tierColor(clamped);

  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const [progress, setProgress] = useState(prefersReduced ? clamped : 0);
  const raf = useRef(null);

  useEffect(() => {
    if (prefersReduced) return;

    const start = performance.now();
    const duration = 900;

    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(clamped * eased);

      if (t < 1) raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [clamped, prefersReduced]);

  const dash = (progress / 100) * circumference;

  return (
    <div
      className="relative inline-grid place-items-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-ink-700)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          style={{ filter: `drop-shadow(0 0 6px ${color}66)` }}
        />
      </svg>

      {showLabel && (
        <div className="absolute inset-0 grid place-items-center text-center">
          <div>
            <div
              className="readout font-bold leading-none"
              style={{ fontSize: size * 0.28, color }}
            >
              {Math.round(progress)}
            </div>
            <div
              className="eyebrow mt-1"
              style={{ fontSize: size * 0.075 }}
            >
              Score
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ScoreRing;
