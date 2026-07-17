function ScoreBadge({ score }) {
  let color = "bg-red-500";

  if (score >= 85) color = "bg-green-500";
  else if (score >= 70) color = "bg-yellow-500";

  return (
    <span className={`${color} px-3 py-1 rounded-full text-white font-semibold`}>
      {Math.round(score)}%
    </span>
  );
}

export default ScoreBadge;