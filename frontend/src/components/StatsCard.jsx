function StatsCard({ title, value }) {
  return (
    <div className="bg-slate-900 rounded-xl p-6 shadow-lg">
      <h3 className="text-gray-400 text-sm">{title}</h3>
      <h1 className="text-3xl font-bold text-white mt-2">
        {value}
      </h1>
    </div>
  );
}

export default StatsCard;