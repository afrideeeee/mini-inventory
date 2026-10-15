import { useCallback, useMemo, useState } from "react";
import { LastUpdatedContext } from "./LastUpdatedContext";

export function LastUpdatedProvider({ children }) {
  const [lastUpdatedAt, setLastUpdatedAt] = useState(() => new Date());
  const markUpdated = useCallback(() => setLastUpdatedAt(new Date()), []);
  const value = useMemo(() => ({ lastUpdatedAt, markUpdated }), [lastUpdatedAt, markUpdated]);

  return (
    <LastUpdatedContext.Provider value={value}>
      {children}
    </LastUpdatedContext.Provider>
  );
}
