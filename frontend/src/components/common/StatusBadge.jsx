import { getStockStatusLabel } from "../../utils/stockStatus";
import "./StatusBadge.css";

export default function StatusBadge({ status, label, className = "" }) {
  const displayLabel = label || getStockStatusLabel(status);
  const badgeClass = [
    "status-badge",
    `status-badge--${status}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <span className={badgeClass}>{displayLabel}</span>;
}
