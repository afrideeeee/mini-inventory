import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { ROUTES } from "../../config/routes";
import "./RecentMovements.css";

export default function RecentMovements({ movements = [] }) {
  const topMovements = movements.slice(0, 3);

  return (
    <section className="fresh-entries" aria-labelledby="fresh-entries-title">
      <div className="fresh-entries__head">
        <h2 id="fresh-entries-title" className="fresh-entries__title">
          Fresh entries
        </h2>
        <Link to={ROUTES.movements} className="fresh-entries__all-link">
          <span>All movement records</span>
          <ArrowUpRight size={15} strokeWidth={1.75} aria-hidden="true" />
        </Link>
      </div>

      <div className="fresh-entries__table" role="table" aria-label="Recent inventory movements">
        <div className="fresh-entries__tr fresh-entries__th" role="row">
          <span role="columnheader">Product</span>
          <span role="columnheader">Movement</span>
          <span className="fresh-entries__num" role="columnheader">Units</span>
          <span role="columnheader">Recorded</span>
        </div>

        {topMovements.map((m) => {
          const movementLabel = m.type === "in" ? "Stock-in" : "Stock-out";
          const unitsLabel = m.type === "in" ? `+${m.quantity}` : `-${m.quantity}`;
          const recordedLabel = m.time ? `${m.date}, ${m.time}` : m.date;

          return (
            <div className="fresh-entries__tr" role="row" key={m.id}>
              <div className="fresh-entries__product" role="cell">
                <span className="fresh-entries__prod-name">{m.productName}</span>
                <span className="fresh-entries__prod-sku">{m.sku}</span>
              </div>
              <div role="cell">{movementLabel}</div>
              <div className="fresh-entries__num" role="cell">{unitsLabel}</div>
              <div role="cell">{recordedLabel}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
