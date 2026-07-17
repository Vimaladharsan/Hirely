import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[var(--color-ink-900)] px-6 text-center text-[var(--color-cloud)]">
      <div className="aurora opacity-50" />
      <div className="relative">
        <span className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-[var(--color-iris-500)]/15">
          <Compass className="text-[var(--color-iris-400)]" size={30} />
        </span>
        <p className="readout text-6xl font-bold tracking-tight text-[var(--color-haze)]">
          404
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">
          Page not found
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-[var(--color-mist)]">
          The page you're looking for doesn't exist or has moved.
        </p>
        <Link to="/" className="btn-primary mx-auto mt-8 inline-flex px-6 py-3">
          Back home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
