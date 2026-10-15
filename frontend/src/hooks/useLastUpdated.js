import { useContext } from "react";
import { LastUpdatedContext } from "../context/LastUpdatedContext";

export function useLastUpdated() {
  const context = useContext(LastUpdatedContext);
  if (!context) throw new Error("useLastUpdated must be used inside <LastUpdatedProvider>.");
  return context;
}
