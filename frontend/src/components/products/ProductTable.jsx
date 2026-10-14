import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import ProductRow from "./ProductRow";
import TableFooter from "../common/TableFooter";
import { ROUTES } from "../../config/routes";
import { pluralise } from "../../utils/format";
import "./ProductTable.css";

export default function ProductTable({
  products = [],
  pager,
  totalUnits = 0,
  onEdit,
  onDelete,
}) {
  const [selectedIds, setSelectedIds] = useState(new Set());

  const allSelected =
    products.length > 0 && products.every((p) => selectedIds.has(p.id));

  const handleToggleAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(products.map((p) => p.id)));
    }
  };

  const handleToggleSelect = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  return (
    <div className="product-table-wrap">
      <div className="product-table-meta">
        <span className="product-table-meta__count">
          {pager.total} {pluralise(pager.total, "product")} / {totalUnits} units on hand
        </span>
        <span className="product-table-meta__sort">
          Sort: Date added, oldest first ↓
        </span>
      </div>

      <div className="product-table" role="table" aria-label="Products catalog">
        <div className="product-table__head" role="row">
          <div role="columnheader">
            <input
              type="checkbox"
              className="product-row__check"
              checked={allSelected}
              onChange={handleToggleAll}
              aria-label="Select all products"
            />
          </div>
          <span role="columnheader">Product / SKU</span>
          <span role="columnheader">Category</span>
          <span className="product-table__th--cost" role="columnheader">Unit cost</span>
          <span className="product-table__th--onhand" role="columnheader">On hand</span>
          <span className="product-table__th--status" role="columnheader">Status</span>
          <span className="product-table__th--actions" role="columnheader">Actions</span>
        </div>

        {products.length === 0 ? (
          <div className="product-table__empty">
            No products match your search or filter criteria.
          </div>
        ) : (
          products.map((product) => (
            <ProductRow
              key={product.id}
              product={product}
              isSelected={selectedIds.has(product.id)}
              onToggleSelect={handleToggleSelect}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}

        <TableFooter
          from={pager.from}
          to={pager.to}
          total={pager.total}
          noun="products"
          page={pager.page}
          pageCount={pager.pageCount}
          onPageChange={pager.setPage}
        />
      </div>

      <div className="product-table-bottom-bar">
        <span>Stock quantities are updated through Stock management, not product editing.</span>
        <Link to={ROUTES.stock} className="product-table-bottom-bar__link">
          <span>Manage stock</span>
          <ArrowUpRight size={14} />
        </Link>
      </div>
    </div>
  );
}
