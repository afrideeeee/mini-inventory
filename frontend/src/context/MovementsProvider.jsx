import { useCallback, useEffect, useMemo, useState } from "react";
import { MovementsContext } from "./MovementsContext";
import { movementService } from "../services/movementService";

export function MovementsProvider({ children }) {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    movementService
      .getAll()
      .then((data) => active && setMovements(data))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const addMovement = useCallback((movement) => {
    setMovements((prev) => [movement, ...prev]);
  }, []);

  const value = useMemo(
    () => ({
      movements,
      loading,
      error,
      addMovement,
    }),
    [movements, loading, error, addMovement]
  );

  return (
    <MovementsContext.Provider value={value}>{children}</MovementsContext.Provider>
  );
}
