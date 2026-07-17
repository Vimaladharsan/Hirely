import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Brain,
  Award,
  CircleCheck,
} from "lucide-react";

function CandidateDetails() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">

      <button
        onClick={() => navigate(-1)}
        className="mb-8 flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-lg"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="bg-slate-900 rounded-xl p-8">

        <div className="flex justify-between">

          <div>

            <h1 className="text-4xl font-bold">
              Priya Sharma
            </h1>

            <p className="text-gray-400 mt-2">
              React Developer • 3 Years Experience
            </p>

          </div>

          <div className="bg-green-600 px-6 py-4 rounded-xl text-3xl font-bold">

            94%

          </div>

        </div>

      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-8">

        <div className="bg-slate-900 rounded-xl p-6">

          <h2 className="flex items-center gap-2 text-2xl font-bold mb-4">

            <Award />

            Skills

          </h2>

          <div className="flex flex-wrap gap-3">

            {[
              "React",
              "Node.js",
              "MongoDB",
              "Git",
              "REST API",
            ].map((skill) => (
              <span
                key={skill}
                className="bg-blue-600 px-3 py-2 rounded-full"
              >
                {skill}
              </span>
            ))}

          </div>

        </div>

        <div className="bg-slate-900 rounded-xl p-6">

          <h2 className="flex items-center gap-2 text-2xl font-bold mb-4">

            <Brain />

            AI Summary

          </h2>

          <p className="text-gray-300 leading-7">

            Excellent candidate with strong frontend expertise,
            clean project experience and excellent communication.
            Recommended for technical interview.

          </p>

        </div>

      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-6">

        <div className="bg-slate-900 rounded-xl p-6">

          <h2 className="text-2xl font-bold mb-4">

            Strengths

          </h2>

          <ul className="space-y-3">

            <li>✅ React Expert</li>

            <li>✅ Problem Solving</li>

            <li>✅ Team Collaboration</li>

          </ul>

        </div>

        <div className="bg-slate-900 rounded-xl p-6">

          <h2 className="text-2xl font-bold mb-4">

            Missing Skills

          </h2>

          <ul className="space-y-3">

            <li>❌ Docker</li>

            <li>❌ AWS</li>

            <li>❌ Kubernetes</li>

          </ul>

        </div>

      </div>

      <div className="bg-slate-900 rounded-xl p-6 mt-6">

        <h2 className="flex items-center gap-2 text-2xl font-bold mb-4">

          <CircleCheck />

          AI Interview Questions

        </h2>

        <ol className="list-decimal ml-6 space-y-3">

          <li>Explain React Hooks.</li>

          <li>How would you optimize a React application?</li>

          <li>Difference between SQL and NoSQL?</li>

          <li>Describe your most challenging project.</li>

        </ol>

      </div>

    </div>
  );
}

export default CandidateDetails;