import "./Tabs.css";

export default function Tabs({ tabs, activeTab, onChange, className = "" }) {
  return (
    <div className={`tabs ${className}`} role="tablist">
      {tabs.map(({ id, label, icon: Icon }) => {
        const isActive = activeTab === id;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`tab-btn ${isActive ? "tab-btn--active" : ""}`}
            onClick={() => onChange(id)}
          >
            {Icon && <Icon size={16} strokeWidth={2} aria-hidden="true" />}
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
