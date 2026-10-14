import { useContext } from "react";
import { MovementsContext } from "../context/MovementsContext";

export function useMovements() {
  const context = useContext(MovementsContext);
  if (!context) {
    throw new Error("useMovements must be used inside <MovementsProvider>.");
  }
  return context;
}
