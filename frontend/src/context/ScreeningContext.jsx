import { useEffect, useState } from "react";

import { ScreeningContext } from "./screeningContextInstance";

const STORAGE_KEY = "hirely_screening_state";

function loadInitialState() {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);

    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Ignore corrupted storage and fall back to defaults.
  }

  return { job: null, candidates: [] };
}

export function ScreeningProvider({ children }) {
  const initial = loadInitialState();

  const [job, setJob] = useState(initial.job);
  const [candidates, setCandidates] = useState(initial.candidates);

  useEffect(() => {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ job, candidates })
    );
  }, [job, candidates]);

  const value = { job, setJob, candidates, setCandidates };

  return (
    <ScreeningContext.Provider value={value}>
      {children}
    </ScreeningContext.Provider>
  );
}
