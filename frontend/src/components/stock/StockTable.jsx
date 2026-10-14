import StockRow from "./StockRow";
import TableFooter from "../common/TableFooter";
import { appConfig } from "../../config/appConfig";
import { pluralise } from "../../utils/format";
import "./StockTable.css";

export default function StockTable({
  products = [],
  selectedProductId,
  onSelectProduct,
  pager,
}) {
  const customSummary = `${pager.total} ${pluralise(pager.total, "product")} / ${
    appConfig.warehouse
  }`;

  return (
    <div className="stock-table" role="table" aria-label="Stock levels">
      <div className="stock-table__head" role="row">
        <span role="columnheader">Product / Bin</span>
        <span className="stock-table__th--num" role="columnheader">
          On hand
        </span>
        <span className="stock-table__th--num" role="columnheader">
          Minimum
        </span>
        <span className="stock-table__th--status" role="columnheader">
          Status
        </span>
      </div>

      {products.length === 0 ? (
        <div className="stock-table__empty">No products match your filter criteria.</div>
      ) : (
        products.map((product) => (
          <StockRow
            key={product.id}
            product={product}
            isSelected={product.id === selectedProductId}
            onSelect={onSelectProduct}
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
        customSummary={customSummary}
      />
    </div>
  );
}
