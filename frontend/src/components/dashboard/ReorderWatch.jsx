import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { ROUTES } from "../../config/routes";
import { padCount } from "../../utils/format";
import "./ReorderWatch.css";

export default function ReorderWatch({ items = [] }) {
  return (
    <div className="reorder-watch" role="region" aria-label="Reorder watch">
      <div className="reorder-watch__head">
        <h2 className="reorder-watch__title">Reorder watch</h2>
        <span className="reorder-watch__count">{padCount(items.length)} Items</span>
      </div>

      <div className="reorder-watch__list">
        {items.map((item) => (
          <div className="reorder-watch__item" key={item.id}>
            <div className="reorder-watch__info">
              <span className="reorder-watch__name">{item.name}</span>
              <span className="reorder-watch__meta">
                Min. {item.minLevel} · {item.sku}
              </span>
            </div>
            <span className="reorder-watch__qty">{padCount(item.onHand)}</span>
          </div>
        ))}
      </div>

      <Link to={ROUTES.stock} className="reorder-watch__foot">
        <span>Review stock levels</span>
        <ArrowUpRight size={17} strokeWidth={1.75} aria-hidden="true" />
      </Link>
    </div>
  );
}
