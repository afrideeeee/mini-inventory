import { useCallback, useEffect, useMemo, useState } from "react";
import { authService } from "../services/authService";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    authService.me().then((nextUser) => {
      if (active) { setUser(nextUser); setLoading(false); }
    });
    return () => { active = false; };
  }, []);

  const login = useCallback(async (email, password, remember) => {
    const nextUser = await authService.login(email, password, remember);
    setUser(nextUser);
    return nextUser;
  }, []);
  const logout = useCallback(() => { authService.logout(); setUser(null); }, []);
  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
