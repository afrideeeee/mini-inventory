import "./SummaryCard.css";

export default function SummaryCard({ label, value, subtext }) {
  return (
    <div className="summary-card">
      <span className="summary-card__label">{label}</span>
      <span className="summary-card__value">{value}</span>
      <span className="summary-card__sub">{subtext}</span>
    </div>
  );
}
