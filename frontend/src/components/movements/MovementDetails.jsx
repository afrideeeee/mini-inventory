import Modal from "../common/Modal";
import Button from "../common/Button";
import "./MovementDetails.css";

export default function MovementDetails({ movement, onClose }) {
  if (!movement) return null;

  const {
    id,
    productName,
    sku,
    type,
    quantity,
    balanceBefore = 0,
    balanceAfter = 0,
    reference,
    reason,
    date,
    time = "—",
    by = "Alex Lee",
  } = movement;

  const typeLabel = type === "in" ? "Stock-in (+)" : "Stock-out (-)";

  return (
    <Modal
      title={`Movement entry / ${id}`}
      onClose={onClose}
      footer={<Button onClick={onClose}>Close entry</Button>}
    >
      <div className="movement-details-grid">
        <div className="movement-details-item">
          <span className="movement-details-label">Product</span>
          <span className="movement-details-value">{productName}</span>
          <span className="movement-details-label" style={{ marginTop: 2 }}>{sku}</span>
        </div>

        <div className="movement-details-item">
          <span className="movement-details-label">Movement type</span>
          <span className="movement-details-value">{typeLabel}</span>
        </div>

        <div className="movement-details-item">
          <span className="movement-details-label">Units changed</span>
          <span className="movement-details-value movement-details-value--highlight">
            {type === "in" ? `+${quantity}` : `-${quantity}`}
          </span>
        </div>

        <div className="movement-details-item">
          <span className="movement-details-label">Balance before → after</span>
          <span className="movement-details-value">
            {balanceBefore} → {balanceAfter}
          </span>
        </div>

        <div className="movement-details-item">
          <span className="movement-details-label">Reason</span>
          <span className="movement-details-value">{reason || "Standard adjustment"}</span>
        </div>

        <div className="movement-details-item">
          <span className="movement-details-label">Reference</span>
          <span className="movement-details-value">{reference || "—"}</span>
        </div>

        <div className="movement-details-item">
          <span className="movement-details-label">Recorded by</span>
          <span className="movement-details-value">{by}</span>
        </div>

        <div className="movement-details-item">
          <span className="movement-details-label">Timestamp</span>
          <span className="movement-details-value">
            {date} at {time}
          </span>
        </div>
      </div>
    </Modal>
  );
}
