import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Brain,
  Award,
  CircleCheck,
  CircleX,
} from "lucide-react";

function CandidateDetails() {
  const navigate = useNavigate();

  const candidate = {
    name: "Priya Sharma",
    role: "React Developer",
    experience: "3 Years",
    score: 94,
    summary:
      "Excellent candidate with strong frontend expertise in React and Node.js. Demonstrates clean project architecture, REST API integration, problem-solving skills, and effective team collaboration. Recommended for the technical interview round.",

    skills: [
      "React",
      "Node.js",
      "MongoDB",
      "JavaScript",
      "Git",
      "REST API",
    ],

    strengths: [
      "Strong React Expertise",
      "Excellent Problem Solving",
      "REST API Development",
      "Team Collaboration",
      "Clean Code Practices",
    ],

    missingSkills: [
      "Docker",
      "AWS",
      "Kubernetes",
    ],

    questions: [
      "Explain React Hooks and their advantages.",
      "How would you optimize a React application?",
      "Difference between SQL and NoSQL?",
      "Explain JWT Authentication.",
      "Describe your most challenging project.",
    ],
  };

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
              {candidate.name}
            </h1>

            <p className="text-slate-400 mt-2">
              {candidate.role} • {candidate.experience}
            </p>

          </div>

          <div className="bg-green-600 text-white px-8 py-5 rounded-xl text-3xl font-bold shadow-lg">
            {candidate.score}%
          </div>

        </div>

        {/* Progress Bar */}

        <div className="mt-8">

          <div className="flex justify-between mb-2">

            <span className="font-semibold">
              Overall Match Score
            </span>

            <span>{candidate.score}%</span>

          </div>

          <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden">

            <div
              className="h-full bg-green-500 rounded-full transition-all duration-700"
              style={{ width: `${candidate.score}%` }}
            />

          </div>

        </div>

      </div>

      {/* Skills + Summary */}

      <div className="grid lg:grid-cols-2 gap-6 mt-8">

        <div className="bg-slate-900 rounded-2xl p-6">

          <h2 className="flex items-center gap-2 text-2xl font-bold mb-5">
            <Award />
            Skills
          </h2>

          <div className="flex flex-wrap gap-3">

            {candidate.skills.map((skill) => (
              <span
                key={skill}
                className="bg-blue-600 hover:bg-blue-500 transition px-4 py-2 rounded-full"
              >
                {skill}
              </span>
            ))}

          </div>

        </div>

        <div className="bg-slate-900 rounded-2xl p-6">

          <h2 className="flex items-center gap-2 text-2xl font-bold mb-5">
            <Brain />
            AI Summary
          </h2>

          <p className="text-slate-300 leading-8">
            {candidate.summary}
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

            {candidate.missingSkills.map((item) => (
              <div
                key={item}
                className="bg-red-900/30 border border-red-600 rounded-lg p-4 flex items-center gap-3"
              >
                <CircleX className="text-red-400" />
                {item}
              </div>
            ))}

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

          {candidate.questions.map((question) => (
            <li key={question}>{question}</li>
          ))}

        </ol>

      </div>

      {/* Recommendation */}

      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 mt-6 shadow-lg">

        <h2 className="text-2xl font-bold mb-3">
          AI Recommendation
        </h2>

        <p className="leading-8">
          Based on resume analysis, skill matching, and experience,
          this candidate is highly recommended for the next round of
          technical interviews. The overall profile aligns well with
          the job requirements and demonstrates strong technical
          competency.
        </p>

      </div>

    </div>
  );
}

export default CandidateDetails;