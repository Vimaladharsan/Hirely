import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Brain,
  Award,
  CircleCheck,
  CircleX,
  MessageSquareQuote,
  FileText,
} from "lucide-react";

import { useScreening } from "../context/useScreening";
import ScoreRing from "../components/ScoreRing";
import { TIER_META, tierOf } from "../utils/tier";

const COMPONENTS = [
  { label: "Semantic Match", field: "semantic_score", max: 50 },
  { label: "Skills", field: "skill_score", max: 20 },
  { label: "Experience", field: "experience_score", max: 15 },
  { label: "Education", field: "education_score", max: 10 },
  { label: "Certifications", field: "certification_score", max: 5 },
];

function CandidateDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { candidates } = useScreening();

  const candidate = candidates.find((c) => String(c.id) === id);

  if (!candidate) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-ink-900)] px-6 text-center text-[var(--color-cloud)]">
        <h1 className="text-3xl font-bold tracking-tight">
          Candidate not found
        </h1>
        <p className="mt-3 text-[var(--color-mist)]">
          This candidate isn't in your current screening results.
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="btn-primary mt-8 px-6 py-3"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const meta = TIER_META[tierOf(candidate.compatibility_score)];

  return (
    <div className="min-h-screen bg-[var(--color-ink-900)] px-6 py-8 text-[var(--color-cloud)] md:px-10">
      <div className="mx-auto max-w-5xl">
        <button
          onClick={() => navigate(-1)}
          className="btn-ghost mb-8 px-4 py-2.5 text-sm"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>

        {/* Header instrument */}
        <div className="surface relative overflow-hidden p-7 sm:p-9">
          <div
            className="absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-[0.10] blur-3xl"
            style={{ background: meta.color }}
          />

          <div className="relative flex flex-col items-center gap-7 sm:flex-row sm:gap-9">
            <ScoreRing score={candidate.compatibility_score} size={148} stroke={11} />

            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {candidate.candidate_name}
              </h1>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[var(--color-mist)] sm:justify-start">
                <span className="inline-flex items-center gap-1.5">
                  <FileText size={14} />
                  {candidate.filename}
                </span>
                {candidate.experience_years ? (
                  <span className="readout">
                    {candidate.experience_years} yrs experience
                  </span>
                ) : null}
              </div>

              <span
                className="mt-4 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-semibold"
                style={{
                  color: meta.color,
                  background: `color-mix(in srgb, ${meta.color} 14%, transparent)`,
                  border: `1px solid color-mix(in srgb, ${meta.color} 34%, transparent)`,
                }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: meta.color }}
                />
                {meta.label}
              </span>
            </div>
          </div>

          {/* Score breakdown meters */}
          <div className="relative mt-8 border-t border-[var(--color-hair)] pt-7">
            <p className="eyebrow mb-4">Score Composition</p>
            <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {COMPONENTS.map(({ label, field, max }) => {
                const value = candidate[field] ?? 0;
                const pct = max ? (value / max) * 100 : 0;
                return (
                  <div key={label}>
                    <div className="mb-1.5 flex items-baseline justify-between">
                      <span className="text-sm text-[var(--color-mist)]">
                        {label}
                      </span>
                      <span className="readout text-sm">
                        <span className="font-semibold text-[var(--color-cloud)]">
                          {value.toFixed(1)}
                        </span>
                        <span className="text-[var(--color-haze)]">/{max}</span>
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[var(--color-ink-700)]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[var(--color-iris-500)] to-[var(--color-iris-400)] transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Skills + Recommendation */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="surface p-6">
            <h2 className="mb-5 flex items-center gap-2.5 text-lg font-bold">
              <Award size={18} className="text-[var(--color-iris-400)]" />
              Matched Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {candidate.matched_skills.length === 0 ? (
                <p className="text-sm text-[var(--color-haze)]">
                  No matched skills found.
                </p>
              ) : (
                candidate.matched_skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-lg border border-[var(--color-iris-500)]/30 bg-[var(--color-iris-500)]/12 px-3 py-1.5 text-sm text-[var(--color-iris-300)]"
                  >
                    {skill}
                  </span>
                ))
              )}
            </div>
          </section>

          <section className="surface p-6">
            <h2 className="mb-4 flex items-center gap-2.5 text-lg font-bold">
              <Brain size={18} className="text-[var(--color-gold-400)]" />
              AI Recommendation
            </h2>
            <p className="leading-relaxed text-[var(--color-mist)]">
              <span className="font-semibold" style={{ color: meta.color }}>
                {candidate.recommendation}.
              </span>{" "}
              This score weighs semantic resume-to-job match, skill overlap,
              experience relevance, education, and certifications.
            </p>
          </section>
        </div>

        {/* Strengths + Missing */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="surface p-6">
            <h2 className="mb-5 flex items-center gap-2.5 text-lg font-bold">
              <CircleCheck size={18} className="text-[var(--color-strong)]" />
              Strengths
            </h2>
            <div className="space-y-2.5">
              {candidate.strengths.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-xl border border-[var(--color-strong)]/25 bg-[var(--color-strong)]/[0.08] p-3.5"
                >
                  <CircleCheck
                    size={17}
                    className="mt-0.5 shrink-0 text-[var(--color-strong)]"
                  />
                  <span className="text-sm text-[var(--color-cloud)]">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="surface p-6">
            <h2 className="mb-5 flex items-center gap-2.5 text-lg font-bold">
              <CircleX size={18} className="text-[var(--color-weak)]" />
              Skill Gaps
            </h2>
            <div className="space-y-2.5">
              {candidate.missing_skills.length === 0 ? (
                <p className="text-sm text-[var(--color-mist)]">
                  No missing skills detected — great coverage of the job
                  requirements.
                </p>
              ) : (
                candidate.missing_skills.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-xl border border-[var(--color-weak)]/25 bg-[var(--color-weak)]/[0.08] p-3.5"
                  >
                    <CircleX
                      size={17}
                      className="mt-0.5 shrink-0 text-[var(--color-weak)]"
                    />
                    <span className="text-sm text-[var(--color-cloud)]">
                      {item}
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* Interview questions */}
        <section className="surface mt-6 p-6 sm:p-7">
          <h2 className="mb-5 flex items-center gap-2.5 text-lg font-bold">
            <MessageSquareQuote size={18} className="text-[var(--color-iris-400)]" />
            Suggested Interview Questions
          </h2>
          <ol className="space-y-3">
            {candidate.interview_questions.map((question, i) => (
              <li key={question} className="flex items-start gap-3.5">
                <span className="readout mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-[var(--color-iris-500)]/15 text-sm font-semibold text-[var(--color-iris-300)]">
                  {i + 1}
                </span>
                <span className="leading-relaxed text-[var(--color-mist)]">
                  {question}
                </span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}

export default CandidateDetails;
