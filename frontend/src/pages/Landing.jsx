import { Link } from "react-router-dom";
import { Briefcase, Brain, FileSearch } from "lucide-react";

function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-6">
        <h1 className="text-3xl font-bold text-blue-500">
          Hirely
        </h1>

        <Link
          to="/job"
          className="bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-all px-6 py-3 rounded-lg"
        >
          Get Started
        </Link>
      </nav>

      {/* Hero */}

      <div className="max-w-6xl mx-auto px-8 py-20">

        <h1 className="text-6xl font-bold leading-tight">

          AI Powered

          <br />

          Resume Screening

        </h1>

        <p className="text-gray-400 mt-8 text-xl max-w-2xl">

          Upload a Job Description, analyze hundreds of resumes
          instantly, rank candidates intelligently, and receive
          AI-powered interview recommendations.

        </p>

        <Link
          to="/job"
          className="inline-block mt-10 bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-all px-8 py-4 rounded-xl font-semibold"
        >
          Start Hiring →
        </Link>

      </div>

      {/* Features */}

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-8 pb-24">

        <div className="bg-slate-900 rounded-xl p-8">
          <Briefcase className="text-blue-500 mb-4" size={40} />

          <h2 className="text-2xl font-bold mb-3">
            Smart Job Analysis
          </h2>

          <p className="text-gray-400">
            Extract required skills and qualifications automatically.
          </p>

        </div>

        <div className="bg-slate-900 rounded-xl p-8">

          <FileSearch className="text-green-500 mb-4" size={40} />

          <h2 className="text-2xl font-bold mb-3">
            Resume Ranking
          </h2>

          <p className="text-gray-400">
            AI compares resumes and ranks the best candidates.
          </p>

        </div>

        <div className="bg-slate-900 rounded-xl p-8">

          <Brain className="text-purple-500 mb-4" size={40} />

          <h2 className="text-2xl font-bold mb-3">
            AI Insights
          </h2>

          <p className="text-gray-400">
            Get strengths, weaknesses and interview questions instantly.
          </p>

        </div>

      </div>

      <footer className="border-t border-slate-800 text-center py-6 text-gray-500">
        Built with ❤️ using React + FastAPI + Gemini AI
      </footer>

    </div>
  );
}

export default Landing;