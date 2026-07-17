function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:scale-105 transition duration-300">
      <Icon className="w-10 h-10 text-blue-400 mb-4" />

      <h3 className="text-xl font-semibold mb-2">
        {title}
      </h3>

      <p className="text-gray-300">
        {description}
      </p>
    </div>
  );
}

export default FeatureCard;