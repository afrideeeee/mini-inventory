import { ChevronDown } from "lucide-react";
import { appConfig } from "../../config/appConfig";
import { formatDateLong } from "../../utils/format";

export default function Topbar() {
  const { companyName, warehouse, user } = appConfig;

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
          {user.initials}
        </span>
        <span>{user.name}</span>
      </div>
    </header>
  );
}
