import { Check } from "lucide-react";

const STEPS = ["Job", "Resumes", "Results"];

function Stepper({ current }) {
  return (
    <div className="mx-auto mb-10 flex max-w-md items-center">
      {STEPS.map((label, i) => {
        const done = i < current;
        const active = i === current;

        return (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-2">
              <span
                className={`grid h-9 w-9 place-items-center rounded-full border text-sm font-semibold transition-colors ${
                  done
                    ? "border-transparent bg-[var(--color-iris-500)] text-white"
                    : active
                      ? "border-[var(--color-iris-500)] bg-[var(--color-iris-500)]/15 text-[var(--color-iris-300)]"
                      : "border-[var(--color-hair-strong)] text-[var(--color-haze)]"
                }`}
              >
                {done ? <Check size={16} /> : i + 1}
              </span>
              <span
                className={`text-xs font-medium ${
                  active
                    ? "text-[var(--color-cloud)]"
                    : "text-[var(--color-haze)]"
                }`}
              >
                {label}
              </span>
            </div>

            {i < STEPS.length - 1 && (
              <span
                className={`mx-2 mb-6 h-px flex-1 ${
                  done
                    ? "bg-[var(--color-iris-500)]"
                    : "bg-[var(--color-hair-strong)]"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Stepper;
