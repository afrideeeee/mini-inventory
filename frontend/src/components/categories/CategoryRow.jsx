import { Pencil, Trash2 } from "lucide-react";
import { formatNumber } from "../../utils/format";

export default function CategoryRow({ category, editing, onEdit, onDelete }) {
  const { code, name, description, productCount = 0, units = 0 } = category;
  const skus = category.skus || [];

  return (
    <div className={`table__row${editing ? " category-row--editing" : ""}`} role="row">
      <div role="cell">
        <h3 className="category-row__name">{name}</h3>
        {description && <p className="category-row__desc">{description}</p>}
        <p className="category-row__codes">
          {[code, skus.join(" · ")].filter(Boolean).join(" / ")}
        </p>
      </div>
      <div className="table__cell--num" role="cell">
        {productCount}
      </div>
      <div className="table__cell--num" role="cell">
        {formatNumber(units)}
      </div>
      <div className="table__cell--actions" role="cell">
        <button
          type="button"
          className="icon-button"
          onClick={() => onEdit(category)}
          aria-label={`Edit ${name}`}
        >
          <Pencil size={17} strokeWidth={1.75} />
        </button>
        <button
          type="button"
          className="icon-button"
          onClick={() => onDelete(category)}
          aria-label={`Delete ${name}`}
        >
          <Trash2 size={17} strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
}
