import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ROUTES } from "../../config/routes";
import { useAuth } from "../../hooks/useAuth";

export default function RequireAuth() {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="auth-loading" role="status">Opening your ledger…</div>;
  return user ? <Outlet /> : <Navigate to={ROUTES.login} replace state={{ from: location }} />;
}
