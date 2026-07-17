import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Trophy,
  Users,
  Gauge,
  BadgeCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import StatsCard from "../components/StatsCard";
import ScoreBadge from "../components/ScoreBadge";
import ScoreRing from "../components/ScoreRing";
import { useScreening } from "../context/useScreening";
import { TIER_META, tierOf } from "../utils/tier";

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
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[var(--color-ink-900)] px-6 text-center text-[var(--color-cloud)]">
        <div className="aurora opacity-50" />
        <div className="relative">
          <span className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-[var(--color-iris-500)]/15">
            <Gauge className="text-[var(--color-iris-400)]" size={30} />
          </span>
          <h1 className="text-3xl font-bold tracking-tight">
            No screening results yet
          </h1>
          <p className="mx-auto mt-3 max-w-md text-[var(--color-mist)]">
            Create a job description and upload resumes to see AI-powered
            candidate rankings here.
          </p>
          <button
            onClick={() => navigate("/job")}
            className="btn-primary mx-auto mt-8 px-6 py-3.5"
          >
            Start Screening
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  const ranked = [...candidates].sort(
    (a, b) => b.compatibility_score - a.compatibility_score
  );
  const topCandidate = ranked[0];

  const averageScore = Math.round(
    candidates.reduce((sum, c) => sum + c.compatibility_score, 0) /
      candidates.length
  );

  const shortlisted = candidates.filter(
    (c) => c.compatibility_score >= 58
  ).length;

  return (
    <div className="min-h-screen bg-[var(--color-ink-900)] px-6 py-8 text-[var(--color-cloud)] md:px-10">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-b from-[var(--color-iris-500)] to-[var(--color-iris-600)]"
            >
              <Sparkles size={18} className="text-white" />
            </Link>
            <div>
              <p className="eyebrow">Candidate Dashboard</p>
              <h1 className="text-3xl font-bold tracking-tight">
                {job ? job.title : "Screening results"}
              </h1>
            </div>
          </div>

          <Link to="/job" className="btn-ghost px-4 py-2.5 text-sm">
            New screening
          </Link>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatsCard title="Candidates" value={candidates.length} icon={Users} />
          <StatsCard
            title="Top Score"
            value={`${Math.round(topCandidate.compatibility_score)}%`}
            icon={Trophy}
            accent="gold"
          />
          <StatsCard title="Average" value={`${averageScore}%`} icon={Gauge} />
          <StatsCard
            title="Shortlisted"
            value={shortlisted}
            icon={BadgeCheck}
            accent="gold"
          />
        </div>

        {/* Top candidate spotlight */}
        <div className="surface relative mb-8 overflow-hidden p-7 sm:p-8">
          <div
            className="absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-[0.12] blur-3xl"
            style={{ background: "var(--color-gold-400)" }}
          />
          <div className="relative flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
            <ScoreRing score={topCandidate.compatibility_score} size={128} />

            <div className="flex-1 text-center sm:text-left">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[var(--color-gold-400)]/30 bg-[var(--color-gold-400)]/10 px-3 py-1">
                <Trophy size={13} className="text-[var(--color-gold-400)]" />
                <span className="eyebrow !text-[var(--color-gold-300)]">
                  Top Candidate
                </span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight">
                {topCandidate.candidate_name}
              </h2>
              <p className="mt-1 text-[var(--color-mist)]">
                {topCandidate.matched_skills.slice(0, 6).join(" · ") ||
                  "No matched skills"}
              </p>
            </div>

            <button
              onClick={() => navigate(`/candidate/${topCandidate.id}`)}
              className="btn-primary px-5 py-3 text-sm"
            >
              View profile
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Search + Sort */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-haze)]"
              size={18}
            />
            <input
              type="text"
              placeholder="Search candidates…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="field py-3 pl-11 pr-4"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="field px-4 py-3 sm:w-52"
          >
            <option value="highest">Highest score</option>
            <option value="lowest">Lowest score</option>
            <option value="name">Name (A–Z)</option>
          </select>
        </div>

        {/* Ranked list */}
        <div className="surface overflow-hidden">
          <div className="grid grid-cols-[3rem_1fr_auto] items-center gap-4 border-b border-[var(--color-hair)] px-5 py-3.5 sm:grid-cols-[3rem_1.4fr_1fr_auto_7rem]">
            <span className="eyebrow">#</span>
            <span className="eyebrow">Candidate</span>
            <span className="eyebrow hidden sm:block">Matched skills</span>
            <span className="eyebrow">Score</span>
            <span className="eyebrow hidden text-right sm:block">Action</span>
          </div>

          {filteredCandidates.length === 0 ? (
            <div className="px-5 py-16 text-center text-[var(--color-haze)]">
              No candidates match “{search}”.
            </div>
          ) : (
            filteredCandidates.map((candidate, index) => {
              const meta = TIER_META[tierOf(candidate.compatibility_score)];
              return (
                <button
                  key={candidate.id}
                  onClick={() => navigate(`/candidate/${candidate.id}`)}
                  className="grid w-full grid-cols-[3rem_1fr_auto] items-center gap-4 border-b border-[var(--color-hair)] px-5 py-4 text-left transition-colors last:border-0 hover:bg-[var(--color-ink-750)]/60 sm:grid-cols-[3rem_1.4fr_1fr_auto_7rem]"
                >
                  <span className="readout text-lg font-bold text-[var(--color-haze)]">
                    {index + 1}
                  </span>

                  <div className="min-w-0">
                    <p className="truncate font-semibold">
                      {candidate.candidate_name}
                    </p>
                    <p className="text-xs" style={{ color: meta.color }}>
                      {meta.label}
                    </p>
                  </div>

                  <div className="hidden min-w-0 flex-wrap gap-1.5 sm:flex">
                    {candidate.matched_skills.slice(0, 3).map((s) => (
                      <span
                        key={s}
                        className="truncate rounded-md bg-[var(--color-ink-700)] px-2 py-0.5 text-xs text-[var(--color-mist)]"
                      >
                        {s}
                      </span>
                    ))}
                    {candidate.matched_skills.length === 0 && (
                      <span className="text-xs text-[var(--color-haze)]">—</span>
                    )}
                  </div>

                  <ScoreBadge score={candidate.compatibility_score} />

                  <span className="hidden items-center justify-end gap-1 text-sm font-medium text-[var(--color-iris-400)] sm:flex">
                    View
                    <ArrowRight size={14} />
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
