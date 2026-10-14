import { Calendar } from "lucide-react";
import "./DateRangeInput.css";

export default function DateRangeInput({
  value = "13 Oct - 13 Oct 2026",
  onChange,
  placeholder = "Date range…",
  className = "",
  ...props
}) {
  return (
    <div className={`date-range-wrap ${className}`}>
      <input
        type="text"
        className="date-range-input"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        aria-label="Filter by date range"
        {...props}
      />
      <span className="date-range-icon" aria-hidden="true">
        <Calendar size={16} strokeWidth={1.75} />
      </span>
    </div>
  );
}
