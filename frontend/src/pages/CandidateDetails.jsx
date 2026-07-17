import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Brain,
  Award,
  CircleCheck,
  CircleX,
} from "lucide-react";

import { useScreening } from "../context/useScreening";

function CandidateDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { candidates } = useScreening();

  const candidate = candidates.find((c) => String(c.id) === id);

  if (!candidate) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-3xl font-bold mb-3">
          Candidate not found
        </h1>

        <p className="text-slate-400 mb-8">
          This candidate isn't in your current screening results.
        </p>

        <button
          onClick={() => navigate("/dashboard")}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const score = Math.round(candidate.compatibility_score);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-8">

      {/* Back Button */}

      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>

      {/* Candidate Header */}

      <div className="bg-slate-900 rounded-2xl p-8 mt-6 shadow-lg">

        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">

          <div>

            <h1 className="text-4xl font-bold">
              {candidate.candidate_name}
            </h1>

            <p className="text-slate-400 mt-2">
              {candidate.filename}
              {candidate.experience_years
                ? ` • ${candidate.experience_years} Years`
                : ""}
            </p>

          </div>

          <div className="bg-green-600 text-white px-8 py-5 rounded-xl text-3xl font-bold shadow-lg">
            {score}%
          </div>

        </div>

        {/* Progress Bar */}

        <div className="mt-8">

          <div className="flex justify-between mb-2">

            <span className="font-semibold">
              Overall Match Score
            </span>

            <span>{score}%</span>

          </div>

          <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden">

            <div
              className="h-full bg-green-500 rounded-full transition-all duration-700"
              style={{ width: `${score}%` }}
            />

          </div>

        </div>

        {/* Score Breakdown */}

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">

          {[
            ["Semantic Match", candidate.semantic_score, 50],
            ["Skills", candidate.skill_score, 20],
            ["Experience", candidate.experience_score, 15],
            ["Education", candidate.education_score, 10],
            ["Certifications", candidate.certification_score, 5],
          ].map(([label, value, max]) => (
            <div key={label} className="bg-slate-800 rounded-xl p-4 text-center">
              <p className="text-slate-400 text-sm">{label}</p>
              <p className="text-xl font-bold mt-1">
                {value.toFixed(1)}
                <span className="text-slate-500 text-sm">/{max}</span>
              </p>
            </div>
          ))}

        </div>

      </div>

      {/* Skills + Recommendation */}

      <div className="grid lg:grid-cols-2 gap-6 mt-8">

        <div className="bg-slate-900 rounded-2xl p-6">

          <h2 className="flex items-center gap-2 text-2xl font-bold mb-5">
            <Award />
            Matched Skills
          </h2>

          <div className="flex flex-wrap gap-3">

            {candidate.matched_skills.length === 0 ? (
              <p className="text-slate-400">No matched skills found.</p>
            ) : (
              candidate.matched_skills.map((skill) => (
                <span
                  key={skill}
                  className="bg-blue-600 hover:bg-blue-500 transition px-4 py-2 rounded-full"
                >
                  {skill}
                </span>
              ))
            )}

          </div>

        </div>

        <div className="bg-slate-900 rounded-2xl p-6">

          <h2 className="flex items-center gap-2 text-2xl font-bold mb-5">
            <Brain />
            AI Recommendation
          </h2>

          <p className="text-slate-300 leading-8">
            {candidate.recommendation}. This score is based on semantic
            resume-to-job match, skill overlap, experience relevance,
            education, and certifications/projects.
          </p>

        </div>

      </div>

      {/* Strengths + Missing Skills */}

      <div className="grid lg:grid-cols-2 gap-6 mt-6">

        <div className="bg-slate-900 rounded-2xl p-6">

          <h2 className="text-2xl font-bold mb-5">
            Strengths
          </h2>

          <div className="space-y-3">

            {candidate.strengths.map((item) => (
              <div
                key={item}
                className="bg-green-900/30 border border-green-600 rounded-lg p-4 flex items-center gap-3"
              >
                <CircleCheck className="text-green-400" />
                {item}
              </div>
            ))}

          </div>

        </div>

        <div className="bg-slate-900 rounded-2xl p-6">

          <h2 className="text-2xl font-bold mb-5">
            Missing Skills
          </h2>

          <div className="space-y-3">

            {candidate.missing_skills.length === 0 ? (
              <p className="text-slate-400">
                No missing skills detected — great coverage of the job requirements.
              </p>
            ) : (
              candidate.missing_skills.map((item) => (
                <div
                  key={item}
                  className="bg-red-900/30 border border-red-600 rounded-lg p-4 flex items-center gap-3"
                >
                  <CircleX className="text-red-400" />
                  {item}
                </div>
              ))
            )}

          </div>

        </div>

      </div>

      {/* Interview Questions */}

      <div className="bg-slate-900 rounded-2xl p-6 mt-6">

        <h2 className="flex items-center gap-2 text-2xl font-bold mb-5">
          <CircleCheck />
          AI Interview Questions
        </h2>

        <ol className="list-decimal ml-6 space-y-4 text-slate-300">

          {candidate.interview_questions.map((question) => (
            <li key={question}>{question}</li>
          ))}

        </ol>

      </div>

    </div>
  );
}

export default CandidateDetails;
