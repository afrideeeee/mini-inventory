import { BookOpen } from "lucide-react";
import { formatCurrency } from "../../utils/format";
import "./ProductSnapshot.css";

export default function ProductSnapshot({ product }) {
  if (!product) return null;

  const {
    name,
    sku,
    onHand = 0,
    unitCost = 0,
    createdAt = "02 Oct 2026",
    createdBy = "Alex Lee",
  } = product;

  const inventoryValue = onHand * unitCost;

  return (
    <div className="product-snapshot">
      <div className="product-snapshot__head">
        <h2 className="product-snapshot__title">On the books</h2>
        <span className="product-snapshot__sku">{sku || "NEW"}</span>
      </div>

      <div className="product-snapshot__body">
        <div className="product-snapshot__icon-box">
          <BookOpen size={48} strokeWidth={1.25} aria-hidden="true" />
        </div>

        <div className="product-snapshot__name">{name || "Untitled product"}</div>

        <div className="product-snapshot__divider" />

        <div className="product-snapshot__units-row">
          <span className="product-snapshot__units">{onHand}</span>
          <span className="product-snapshot__units-label">units on hand</span>
        </div>

        <div className="product-snapshot__metric-row">
          <span>Inventory value</span>
          <span className="product-snapshot__metric-val">
            {formatCurrency(inventoryValue)}
          </span>
        </div>

        <div className="product-snapshot__meta">
          Created {createdAt} · {createdBy}
        </div>
      </div>
    </div>
  );
}
