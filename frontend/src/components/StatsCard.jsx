function StatsCard({ title, value, icon: Icon, accent = "iris" }) {
  const accentColor =
    accent === "gold" ? "var(--color-gold-400)" : "var(--color-iris-400)";

  return (
    <div className="surface relative overflow-hidden p-6">
      <div
        className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-[0.09] blur-2xl"
        style={{ background: accentColor }}
      />

      <div className="relative flex items-start justify-between">
        <p className="eyebrow">{title}</p>
        {Icon && (
          <Icon size={18} style={{ color: accentColor }} className="opacity-80" />
        )}
      </div>

      <p className="readout relative mt-3 text-4xl font-bold text-[var(--color-cloud)]">
        {value}
      </p>
    </div>
  );
}

export default StatsCard;
