import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Trophy,
  BarChart3,
} from "lucide-react";

import StatsCard from "../components/StatsCard";
import ScoreBadge from "../components/ScoreBadge";
import { useScreening } from "../context/useScreening";

function Dashboard() {
  const navigate = useNavigate();
  const { job, candidates } = useScreening();

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("highest");

  const filteredCandidates = useMemo(() => {
    const filtered = candidates.filter((candidate) =>
      candidate.candidate_name.toLowerCase().includes(search.toLowerCase())
    );

    switch (sortBy) {
      case "highest":
        return [...filtered].sort(
          (a, b) => b.compatibility_score - a.compatibility_score
        );

      case "lowest":
        return [...filtered].sort(
          (a, b) => a.compatibility_score - b.compatibility_score
        );

      case "name":
        return [...filtered].sort((a, b) =>
          a.candidate_name.localeCompare(b.candidate_name)
        );

      default:
        return filtered;
    }
  }, [search, sortBy, candidates]);

  if (candidates.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center px-6 text-center">
        <BarChart3 className="text-blue-500 mb-6" size={48} />

        <h1 className="text-3xl font-bold mb-3">
          No screening results yet
        </h1>

        <p className="text-slate-400 max-w-md mb-8">
          Create a job description and upload resumes to see AI-powered
          candidate rankings here.
        </p>

        <button
          onClick={() => navigate("/job")}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition"
        >
          Start Screening →
        </button>
      </div>
    );
  }

  const topCandidate = [...candidates].sort(
    (a, b) => b.compatibility_score - a.compatibility_score
  )[0];

  const averageScore = Math.round(
    candidates.reduce((sum, c) => sum + c.compatibility_score, 0) /
      candidates.length
  );

  const shortlisted = candidates.filter(
    (c) => c.compatibility_score >= 80
  ).length;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-8">

      {/* Header */}

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-10">

        <div>
          <h1 className="text-4xl font-bold">
            Candidate Dashboard
          </h1>

          <p className="text-slate-400 mt-2">
            AI-powered screening results{job ? ` for ${job.title}` : ""}
          </p>
        </div>

        <BarChart3 className="text-blue-500" size={40} />

      </div>

      {/* Stats */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

        <StatsCard
          title="Candidates"
          value={candidates.length}
        />

        <StatsCard
          title="Top Score"
          value={`${Math.round(topCandidate.compatibility_score)}%`}
        />

        <StatsCard
          title="Average Score"
          value={`${averageScore}%`}
        />

        <StatsCard
          title="Shortlisted"
          value={shortlisted}
        />

      </div>

      {/* Top Candidate */}

      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 mb-10">

        <div className="flex flex-col md:flex-row md:items-center gap-6">

          <Trophy
            size={60}
            className="text-yellow-300"
          />

          <div>

            <h2 className="text-2xl font-bold">
              Top Candidate
            </h2>

            <p className="text-xl mt-2">
              {topCandidate.candidate_name}
            </p>

            <p className="text-slate-200 mt-1">
              {topCandidate.matched_skills.slice(0, 5).join(", ") || "No matched skills"}
            </p>

          </div>

          <div className="md:ml-auto">
            <ScoreBadge score={topCandidate.compatibility_score} />
          </div>

        </div>

      </div>

      {/* Search + Sort */}

      <div className="flex flex-col md:flex-row gap-4 mb-8">

        <div className="relative flex-1">

          <Search
            className="absolute left-4 top-4 text-slate-400"
            size={20}
          />

          <input
            type="text"
            placeholder="Search candidates..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-12 py-4 outline-none focus:border-blue-500"
          />

        </div>

        <select
          value={sortBy}
          onChange={(e) =>
            setSortBy(e.target.value)
          }
          className="bg-slate-900 border border-slate-700 rounded-xl px-5 py-4"
        >
          <option value="highest">
            Highest Score
          </option>

          <option value="lowest">
            Lowest Score
          </option>

          <option value="name">
            Name (A-Z)
          </option>

        </select>

      </div>

      {/* Table */}

      <div className="bg-slate-900 rounded-2xl overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-slate-800">

              <tr>

                <th className="p-5 text-left">
                  Rank
                </th>

                <th className="p-5 text-left">
                  Candidate
                </th>

                <th className="p-5 text-left">
                  Experience
                </th>

                <th className="p-5 text-left">
                  Skills
                </th>

                <th className="p-5 text-left">
                  Score
                </th>

                <th className="p-5 text-left">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredCandidates.length === 0 ? (

                <tr>

                  <td
                    colSpan="6"
                    className="text-center py-12 text-slate-400"
                  >
                    No candidates found.
                  </td>

                </tr>

              ) : (

                filteredCandidates.map(
                  (candidate, index) => (

                    <tr
                      key={candidate.id}
                      className="border-b border-slate-800 hover:bg-slate-800 transition"
                    >

                      <td className="p-5">
                        #{index + 1}
                      </td>

                      <td className="p-5 font-medium">
                        {candidate.candidate_name}
                      </td>

                      <td className="p-5">
                        {candidate.experience_years
                          ? `${candidate.experience_years} Years`
                          : "N/A"}
                      </td>

                      <td className="p-5">
                        {candidate.matched_skills.slice(0, 3).join(", ") || "—"}
                      </td>

                      <td className="p-5">
                        <ScoreBadge
                          score={candidate.compatibility_score}
                        />
                      </td>

                      <td className="p-5">

                        <button
                          onClick={() =>
                            navigate(
                              `/candidate/${candidate.id}`
                            )
                          }
                          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition"
                        >
                          View
                        </button>

                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;
