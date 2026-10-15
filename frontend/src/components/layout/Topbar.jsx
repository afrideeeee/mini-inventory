import { ChevronDown, LogOut } from "lucide-react";
import { appConfig } from "../../config/appConfig";
import { formatDateLong } from "../../utils/format";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../config/routes";

export default function Topbar() {
  const { companyName, warehouse, user } = appConfig;
  const auth = useAuth();
  const navigate = useNavigate();
  const currentUser = auth.user || user;
  const initials = currentUser.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase();

  return (
    <header className="topbar">
      <button type="button" className="topbar__workspace" aria-label="Switch warehouse">
        <span className="topbar__company">{companyName}</span>
        <span>/ {warehouse}</span>
        <ChevronDown size={16} aria-hidden="true" />
      </button>

      <div className="topbar__user">
        <span className="topbar__date">{formatDateLong(new Date())}</span>
        <span className="topbar__avatar" aria-hidden="true">
          {initials}
        </span>
        <span>{currentUser.name}</span>
        <button type="button" className="icon-button" aria-label="Sign out" title="Sign out" onClick={() => { auth.logout(); navigate(ROUTES.login, { replace: true }); }}>
          <LogOut size={16} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
