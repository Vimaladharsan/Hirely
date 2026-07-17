// Score tiers mirror the backend recommendation thresholds
// (STRONG_MATCH / AVERAGE_MATCH in backend/app/utils/constants.py),
// collapsed to 3 buckets for the UI's simpler tier badges.
export function tierOf(score) {
  if (score >= 58) return "strong";
  if (score >= 38) return "good";
  return "weak";
}

export const TIER_META = {
  strong: { label: "Strong Match", color: "var(--color-strong)" },
  good: { label: "Good Match", color: "var(--color-good)" },
  weak: { label: "Weak Match", color: "var(--color-weak)" },
};

export function tierColor(score) {
  return TIER_META[tierOf(score)].color;
}
