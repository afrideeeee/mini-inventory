import StatusBadge from "../common/StatusBadge";
import { getStockStatus } from "../../utils/stockStatus";
import "./StockRow.css";

export default function StockRow({ product, isSelected, onSelect }) {
  const { id, name, sku, bin, onHand, minLevel } = product;
  const status = getStockStatus(onHand, minLevel);

  return (
    <div
      className={`stock-row ${isSelected ? "stock-row--selected" : ""}`}
      role="row"
      tabIndex={0}
      onClick={() => onSelect?.(id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect?.(id);
        }
      }}
      aria-selected={isSelected}
    >
      <div className="stock-row__product" role="cell">
        <span className="stock-row__name">{name}</span>
        <span className="stock-row__bin">
          {[sku, bin].filter(Boolean).join(" / ")}
        </span>
      </div>
      <div className="stock-row__num" role="cell">
        {onHand}
      </div>
      <div className="stock-row__num" role="cell">
        {minLevel}
      </div>
      <div className="stock-row__status" role="cell">
        <StatusBadge status={status} />
      </div>
    </div>
  );
}
