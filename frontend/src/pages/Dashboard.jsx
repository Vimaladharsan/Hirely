import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Trophy,
  Users,
  BarChart3,
} from "lucide-react";

import StatsCard from "../components/StatsCard";
import ScoreBadge from "../components/ScoreBadge";

function Dashboard() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("highest");

  const candidates = [
    {
      id: 1,
      name: "Priya Sharma",
      skills: "React, Node.js, MongoDB",
      experience: "3 Years",
      score: 94,
    },
    {
      id: 2,
      name: "Rahul Verma",
      skills: "Python, Django, PostgreSQL",
      experience: "4 Years",
      score: 90,
    },
    {
      id: 3,
      name: "Ananya Iyer",
      skills: "Java, Spring Boot",
      experience: "5 Years",
      score: 86,
    },
    {
      id: 4,
      name: "Arjun Nair",
      skills: "HTML, CSS, JavaScript",
      experience: "2 Years",
      score: 74,
    },
  ];

  const filteredCandidates = useMemo(() => {
    const filtered = candidates.filter((candidate) =>
      candidate.name.toLowerCase().includes(search.toLowerCase())
    );

    switch (sortBy) {
      case "highest":
        return [...filtered].sort((a, b) => b.score - a.score);

      case "lowest":
        return [...filtered].sort((a, b) => a.score - b.score);

      case "name":
        return [...filtered].sort((a, b) =>
          a.name.localeCompare(b.name)
        );

      default:
        return filtered;
    }
  }, [search, sortBy]);

  const topCandidate = [...candidates].sort(
    (a, b) => b.score - a.score
  )[0];

  const averageScore = Math.round(
    candidates.reduce((sum, c) => sum + c.score, 0) /
      candidates.length
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-8">

      {/* Header */}

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-10">

        <div>
          <h1 className="text-4xl font-bold">
            Candidate Dashboard
          </h1>

          <p className="text-slate-400 mt-2">
            AI-powered candidate screening results
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
          value={`${topCandidate.score}%`}
        />

        <StatsCard
          title="Average Score"
          value={`${averageScore}%`}
        />

        <StatsCard
          title="Shortlisted"
          value={3}
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
              {topCandidate.name}
            </p>

            <p className="text-slate-200 mt-1">
              {topCandidate.skills}
            </p>

          </div>

          <div className="md:ml-auto">
            <ScoreBadge score={topCandidate.score} />
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
                        {candidate.name}
                      </td>

                      <td className="p-5">
                        {candidate.experience}
                      </td>

                      <td className="p-5">
                        {candidate.skills}
                      </td>

                      <td className="p-5">
                        <ScoreBadge
                          score={candidate.score}
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