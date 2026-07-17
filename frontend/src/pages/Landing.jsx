import { Link } from "react-router-dom";
import {
  Briefcase,
  FileSearch,
  Brain,
  ArrowRight,
  Sparkles,
} from "lucide-react";

import ScoreRing from "../components/ScoreRing";

const FEATURES = [
  {
    icon: Briefcase,
    title: "Smart Job Analysis",
    body: "Hirely reads the job description and extracts the skills, seniority, and context that actually matter for the role.",
    accent: "var(--color-iris-400)",
  },
  {
    icon: FileSearch,
    title: "Semantic Ranking",
    body: "Every resume is scored on meaning, not keywords — then ranked so the strongest fits rise to the top automatically.",
    accent: "var(--color-gold-400)",
  },
  {
    icon: Brain,
    title: "Explainable Insight",
    body: "See exactly why a candidate scored the way they did: matched skills, gaps, strengths, and tailored interview questions.",
    accent: "var(--color-strong)",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-[var(--color-ink-900)] text-[var(--color-cloud)]">

      {/* Nav */}
      <nav className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-b from-[var(--color-iris-500)] to-[var(--color-iris-600)] shadow-lg">
            <Sparkles size={18} className="text-white" />
          </span>
          <span className="text-xl font-bold tracking-tight">Hirely</span>
        </div>

        <Link to="/job" className="btn-primary px-5 py-2.5 text-sm">
          Get Started
          <ArrowRight size={16} />
        </Link>
      </nav>

      {/* Hero */}
      <header className="relative overflow-hidden">
        <div className="aurora" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 pb-24 pt-16 lg:grid-cols-[1.15fr_0.85fr] lg:pt-24">
          <div className="animate-rise">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-hair-strong)] bg-[var(--color-ink-800)]/60 px-3.5 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-strong)]" />
              <span className="eyebrow !text-[var(--color-mist)]">
                AI-Powered Resume Intelligence
              </span>
            </div>

            <h1 className="text-balance text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
              Hire for <span className="grad-text">fit</span>,
              <br />
              not for keywords.
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-relaxed text-[var(--color-mist)]">
              Upload a job description and a stack of resumes. Hirely reads
              them the way a recruiter does — understanding meaning, ranking
              candidates, and explaining every decision.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link to="/job" className="btn-primary px-7 py-4 text-base">
                Start Screening
                <ArrowRight size={18} />
              </Link>
              <span className="text-sm text-[var(--color-haze)]">
                No setup — analyze in seconds
              </span>
            </div>
          </div>

          {/* Hero instrument card */}
          <div className="animate-rise [animation-delay:120ms]">
            <div className="surface relative mx-auto max-w-sm p-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="eyebrow">Top Candidate</p>
                  <p className="mt-1 text-lg font-semibold">Priya Sharma</p>
                  <p className="text-sm text-[var(--color-haze)]">
                    Senior React Developer
                  </p>
                </div>
                <ScoreRing score={92} size={104} stroke={8} />
              </div>

              <div className="mt-6 space-y-3">
                {[
                  ["Semantic Match", 88],
                  ["Skill Coverage", 95],
                  ["Experience", 84],
                ].map(([label, val]) => (
                  <div key={label}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="text-[var(--color-mist)]">{label}</span>
                      <span className="readout text-[var(--color-cloud)]">
                        {val}%
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-[var(--color-ink-700)]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[var(--color-iris-500)] to-[var(--color-iris-400)]"
                        style={{ width: `${val}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {["React", "Node.js", "TypeScript", "GraphQL"].map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-[var(--color-hair-strong)] bg-[var(--color-ink-750)] px-3 py-1 text-xs text-[var(--color-mist)]"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="mb-10">
          <p className="eyebrow">How it works</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">
            Intelligence at every step
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body, accent }) => (
            <div
              key={title}
              className="surface p-7 transition-transform duration-300 hover:-translate-y-1"
            >
              <span
                className="grid h-12 w-12 place-items-center rounded-2xl"
                style={{
                  background: `color-mix(in srgb, ${accent} 16%, transparent)`,
                  border: `1px solid color-mix(in srgb, ${accent} 34%, transparent)`,
                }}
              >
                <Icon size={22} style={{ color: accent }} />
              </span>

              <h3 className="mt-5 text-xl font-semibold">{title}</h3>
              <p className="mt-2.5 leading-relaxed text-[var(--color-mist)]">
                {body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--color-hair)]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm text-[var(--color-haze)] sm:flex-row">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-[var(--color-iris-400)]" />
            <span>Hirely — Smart Hiring, Powered by AI</span>
          </div>
          <span>Built with React · FastAPI · NLP</span>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
