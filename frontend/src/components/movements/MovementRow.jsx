import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import "./MovementRow.css";

export default function MovementRow({ movement, onClick }) {
  const {
    id,
    productName,
    sku,
    type,
    quantity,
    balanceBefore = 0,
    balanceAfter = 0,
    reference,
    date,
    time = "12:00",
    by = "Alex Lee",
  } = movement;

  const isIn = type === "in";
  const unitsFormatted = isIn ? `+${quantity}` : `-${quantity}`;
  const MovementIcon = isIn ? ArrowDownLeft : ArrowUpRight;
  const movementLabel = isIn ? "Stock-in" : "Stock-out";

  return (
    <div
      className="movement-row"
      role="row"
      tabIndex={0}
      onClick={() => onClick?.(movement)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.(movement);
        }
      }}
    >
      <div className="movement-row__entry" role="cell">
        {id}
      </div>

      <div className="movement-row__product" role="cell">
        <span className="movement-row__prod-name">{productName}</span>
        <span className="movement-row__prod-sku">{sku}</span>
      </div>

      <div className="movement-row__type" role="cell">
        <span className="movement-row__badge">
          <MovementIcon size={14} strokeWidth={2} aria-hidden="true" />
          <span>{movementLabel}</span>
        </span>
      </div>

      <div className="movement-row__units" role="cell">
        {unitsFormatted}
      </div>

      <div className="movement-row__balance" role="cell">
        {balanceBefore} → {balanceAfter}
      </div>

      <div className="movement-row__ref" role="cell">
        {reference || "—"}
      </div>

      <div className="movement-row__datetime" role="cell">
        <span>{date}</span>
        <span className="movement-row__time">{time}</span>
      </div>

      <div className="movement-row__by" role="cell">
        <span>{by}</span>
        <ArrowUpRight size={15} strokeWidth={1.75} aria-hidden="true" />
      </div>
    </div>
  );
}
