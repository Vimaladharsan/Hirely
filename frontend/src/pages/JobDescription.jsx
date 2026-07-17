import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, Sparkles } from "lucide-react";

import { useScreening } from "../context/useScreening";
import Stepper from "../components/Stepper";

function JobDescription() {
  const navigate = useNavigate();
  const { job, setJob, setCandidates } = useScreening();

  const [jobTitle, setJobTitle] = useState(job?.title ?? "");
  const [company, setCompany] = useState(job?.company ?? "");
  const [description, setDescription] = useState(job?.description ?? "");
  const [error, setError] = useState("");

  const handleContinue = () => {
    if (!jobTitle || !company || !description) {
      setError("Please fill in every field before continuing.");
      return;
    }

    setJob({ title: jobTitle, company, description });
    // Starting a new job clears any results from a previous screening.
    setCandidates([]);
    navigate("/upload");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--color-ink-900)] px-6 py-10 text-[var(--color-cloud)]">
      <div className="aurora opacity-60" />

      <div className="relative mx-auto max-w-3xl">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--color-haze)] transition-colors hover:text-[var(--color-cloud)]"
        >
          <ArrowLeft size={16} />
          Back home
        </Link>

        <Stepper current={0} />

        <div className="surface animate-rise p-8 sm:p-10">
          <div className="mb-8 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--color-iris-500)]/15">
              <Sparkles size={18} className="text-[var(--color-iris-400)]" />
            </span>
            <div>
              <p className="eyebrow">Step 1</p>
              <h1 className="text-2xl font-bold tracking-tight">
                Describe the role
              </h1>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="eyebrow mb-2 block">Job Title</label>
                <input
                  type="text"
                  placeholder="Frontend Developer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="field p-3.5"
                />
              </div>

              <div>
                <label className="eyebrow mb-2 block">Company</label>
                <input
                  type="text"
                  placeholder="Acme Corp"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="field p-3.5"
                />
              </div>
            </div>

            <div>
              <label className="eyebrow mb-2 block">Job Description</label>
              <textarea
                rows="10"
                placeholder="Paste the complete job description — the required skills, responsibilities, and experience. The more detail, the sharper the match."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="field resize-y p-3.5 leading-relaxed"
              />
              <p className="mt-2 text-xs text-[var(--color-haze)]">
                Tip: include specific skills and tools — Hirely matches on the
                language your candidates actually use.
              </p>
            </div>

            {error && (
              <div className="rounded-xl border border-[var(--color-weak)]/40 bg-[var(--color-weak)]/10 px-4 py-3 text-sm text-[var(--color-weak)]">
                {error}
              </div>
            )}

            <button
              onClick={handleContinue}
              className="btn-primary w-full py-4 text-base"
            >
              Continue to Resumes
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDescription;
