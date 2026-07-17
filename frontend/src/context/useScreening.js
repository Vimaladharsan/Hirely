import { useContext } from "react";

import { ScreeningContext } from "./screeningContextInstance";

export function useScreening() {
  const context = useContext(ScreeningContext);

  if (!context) {
    throw new Error("useScreening must be used within a ScreeningProvider");
  }

  return context;
}
