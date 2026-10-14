import { ChevronDown } from "lucide-react";
import "./SelectInput.css";

export default function SelectInput({
  options = [],
  value,
  onChange,
  invalid = false,
  className = "",
  children,
  ...props
}) {
  const selectClasses = [
    "select-input",
    invalid && "select-input--invalid",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="select-wrap">
      <select
        className={selectClasses}
        value={value}
        onChange={onChange}
        aria-invalid={invalid || undefined}
        {...props}
      >
        {children ||
          options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
      </select>
      <span className="select-arrow" aria-hidden="true">
        <ChevronDown size={16} strokeWidth={2} />
      </span>
    </div>
  );
}
