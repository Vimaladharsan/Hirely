import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Trophy,
  Users,
} from "lucide-react";
import StatsCard from "../components/StatsCard";
import ScoreBadge from "../components/ScoreBadge";

function Dashboard() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

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

  const filtered = candidates.filter((candidate) =>
    candidate.name.toLowerCase().includes(search.toLowerCase())
  );

  const topCandidate = [...candidates].sort((a, b) => b.score - a.score)[0];

  const average = Math.round(
    candidates.reduce((sum, c) => sum + c.score, 0) / candidates.length
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">

      <div className="flex justify-between items-center mb-10">

        <div>

          <h1 className="text-4xl font-bold">
            Dashboard
          </h1>

          <p className="text-gray-400">
            AI Candidate Ranking
          </p>

        </div>

        <Users className="text-blue-500" size={40} />

      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">

        <StatsCard title="Candidates" value={4} />

        <StatsCard title="Top Score" value="94%" />

        <StatsCard title="Average" value={`${average}%`} />

        <StatsCard title="Shortlisted" value="3" />

      </div>

      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 rounded-xl p-8 mb-8">

        <div className="flex items-center">

          <Trophy className="text-yellow-300 mr-5" size={50} />

          <div>

            <h2 className="text-2xl font-bold">
              Top Candidate
            </h2>

            <p className="text-xl mt-2">
              {topCandidate.name}
            </p>

            <p>{topCandidate.skills}</p>

          </div>

          <div className="ml-auto">

            <ScoreBadge score={topCandidate.score} />

          </div>

        </div>

      </div>

      <div className="relative mb-8">

        <Search
          className="absolute left-4 top-4 text-gray-400"
          size={20}
        />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Candidate..."
          className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-12 py-4 outline-none"
        />

      </div>

      <div className="bg-slate-900 rounded-xl overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-800">

            <tr>

              <th className="p-5 text-left">Rank</th>

              <th className="p-5 text-left">Candidate</th>

              <th className="p-5 text-left">Experience</th>

              <th className="p-5 text-left">Skills</th>

              <th className="p-5 text-left">Score</th>

              <th className="p-5 text-left">Action</th>

            </tr>

          </thead>

          <tbody>

            {filtered.map((candidate, index) => (

              <tr
                key={candidate.id}
                className="border-b border-slate-800 hover:bg-slate-800"
              >

                <td className="p-5">#{index + 1}</td>

                <td className="p-5">{candidate.name}</td>

                <td className="p-5">{candidate.experience}</td>

                <td className="p-5">{candidate.skills}</td>

                <td className="p-5">

                  <ScoreBadge score={candidate.score} />

                </td>

                <td className="p-5">

                  <button
                    onClick={() =>
                      navigate(`/candidate/${candidate.id}`)
                    }
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
                  >
                    View
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Dashboard;