import { useRef } from "react";
import { Calendar } from "lucide-react";
import { getTodayDateInputValue } from "../../utils/date";
import "./DateFilterInput.css";

export default function DateFilterInput({ value = "", onChange, className = "", ...props }) {
  const inputRef = useRef(null);

  const openDatePicker = () => {
    const input = inputRef.current;
    if (!input) return;
    if (typeof input.showPicker === "function") {
      input.showPicker();
      return;
    }
    input.focus();
    input.click();
  };

  return (
    <div className={`date-filter-wrap ${className}`}>
      <input
        ref={inputRef}
        type="date"
        max={getTodayDateInputValue()}
        className="date-filter-input"
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        aria-label="Filter movements by date"
        title="Filter movements by date"
        {...props}
      />
      <button
        type="button"
        className="date-filter-icon"
        onClick={openDatePicker}
        aria-label="Open date picker"
        title="Open date picker"
      >
        <Calendar size={16} strokeWidth={1.75} />
      </button>
    </div>
  );
}
