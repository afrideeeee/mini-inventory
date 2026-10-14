import { Pencil, Trash2 } from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import { getStockStatus } from "../../utils/stockStatus";
import { formatCurrency } from "../../utils/format";
import "./ProductRow.css";

export default function ProductRow({
  product,
  isSelected,
  onToggleSelect,
  onEdit,
  onDelete,
}) {
  const { id, name, sku, category, unitCost, onHand, minLevel } = product;
  const status = getStockStatus(onHand, minLevel);

  return (
    <div className="product-row" role="row">
      <div className="product-row__checkbox" role="cell">
        <input
          type="checkbox"
          className="product-row__check"
          checked={isSelected}
          onChange={() => onToggleSelect(id)}
          aria-label={`Select ${name}`}
        />
      </div>

      <div className="product-row__info" role="cell">
        <span className="product-row__name">{name}</span>
        <span className="product-row__sku">{sku}</span>
      </div>

      <div className="product-row__cat" role="cell">
        {category}
      </div>

      <div className="product-row__cost" role="cell">
        {formatCurrency(unitCost || 0)}
      </div>

      <div className="product-row__onhand" role="cell">
        {onHand}
      </div>

      <div className="product-row__status" role="cell">
        <StatusBadge status={status} />
      </div>

      <div className="product-row__actions" role="cell">
        <button
          type="button"
          className="product-row__action-btn"
          onClick={() => onEdit(product)}
          aria-label={`Edit ${name}`}
        >
          <Pencil size={16} strokeWidth={1.75} />
        </button>
        <button
          type="button"
          className="product-row__action-btn"
          onClick={() => onDelete(product)}
          aria-label={`Delete ${name}`}
        >
          <Trash2 size={16} strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
}
