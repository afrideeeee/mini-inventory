import { NavLink } from "react-router-dom";
import { BookOpen, CircleHelp } from "lucide-react";
import { appConfig } from "../../config/appConfig";
import { navigationItems } from "../../config/navigation";
import { ROUTES } from "../../config/routes";
import { useCategories } from "../../hooks/useCategories";
import { pluralise } from "../../utils/format";

export default function Sidebar() {
  const { stats } = useCategories();

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <BookOpen size={26} strokeWidth={1.75} aria-hidden="true" />
        <span>{appConfig.appName}</span>
      </div>

      <div className="sidebar__body">
        <p className="eyebrow sidebar__tagline">{appConfig.tagline}</p>

        <nav className="sidebar__nav" aria-label="Main">
          {navigationItems.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === ROUTES.dashboard}
              className="nav-link"
            >
              <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__foot">
          <p className="eyebrow">{appConfig.motto}</p>
          <div className="sidebar__foot-stats">
            <span>
              {stats.assignedProducts} {pluralise(stats.assignedProducts, "product")} ·{" "}
              {stats.categoryCount} {pluralise(stats.categoryCount, "category", "categories")}
            </span>
            <span>
              {appConfig.warehouse} / {appConfig.currency}
            </span>
          </div>
          <a href="#guide" className="sidebar__guide">
            <CircleHelp size={18} strokeWidth={1.75} aria-hidden="true" />
            Ledger guide
          </a>
          <span className="sidebar__edition">{appConfig.edition}</span>
        </div>
      </div>
    </aside>
  );
}
