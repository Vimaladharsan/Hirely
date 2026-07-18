import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, UserPlus, Sparkles } from "lucide-react";

import { useAuth } from "../context/useAuth";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setIsSubmitting(true);

    try {
      await register({ email, password, name });
      navigate("/job");
    } catch (err) {
      setError(
        err.response?.data?.detail || "Something went wrong while creating your account."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--color-ink-900)] px-6 text-[var(--color-cloud)]">
      <div className="aurora opacity-60" />

      <div className="surface relative w-full max-w-md animate-rise p-8 sm:p-10">
        <div className="mb-8 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-b from-[var(--color-iris-500)] to-[var(--color-iris-600)]">
            <Sparkles size={18} className="text-white" />
          </span>
          <div>
            <p className="eyebrow">Get started</p>
            <h1 className="text-2xl font-bold tracking-tight">
              Create your account
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="eyebrow mb-2 block">Name</label>
            <input
              type="text"
              placeholder="Jane Recruiter"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="field p-3.5"
            />
          </div>

          <div>
            <label className="eyebrow mb-2 block">Email</label>
            <input
              type="email"
              required
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field p-3.5"
            />
          </div>

          <div>
            <label className="eyebrow mb-2 block">Password</label>
            <input
              type="password"
              required
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="field p-3.5"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-[var(--color-weak)]/40 bg-[var(--color-weak)]/10 px-4 py-3 text-sm text-[var(--color-weak)]">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full py-3.5 text-base"
          >
            {isSubmitting ? "Creating account…" : "Create Account"}
            {!isSubmitting && <UserPlus size={18} />}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--color-mist)]">
          Already have an account?{" "}
          <Link
            to="/login"
            className="inline-flex items-center gap-1 font-semibold text-[var(--color-iris-400)] hover:text-[var(--color-iris-300)]"
          >
            Sign in
            <ArrowRight size={14} />
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
