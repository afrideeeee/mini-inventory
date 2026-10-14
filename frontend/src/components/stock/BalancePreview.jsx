import "./BalancePreview.css";

export default function BalancePreview({
  currentStock = 0,
  quantity = 0,
  type = "in",
}) {
  const numQty = Number(quantity) || 0;
  const projectedStock = type === "in" ? currentStock + numQty : currentStock - numQty;
  const isInvalid = type === "out" && projectedStock < 0;

  return (
    <div className="balance-preview">
      <div className="balance-preview__title">
        Balance preview / not yet recorded
      </div>
      <div className="balance-preview__flow">
        <span className="balance-preview__num">{currentStock}</span>
        <span className="balance-preview__op">
          {type === "in" ? `+ ${numQty}` : `- ${numQty}`}
        </span>
        <span className="balance-preview__arrow" aria-hidden="true">
          →
        </span>
        <span
          className={`balance-preview__num--projected ${
            isInvalid ? "balance-preview__num--invalid" : ""
          }`}
        >
          {projectedStock}
        </span>
      </div>
      <div className="balance-preview__caption">
        Current stock → projected stock
      </div>
    </div>
  );
}
