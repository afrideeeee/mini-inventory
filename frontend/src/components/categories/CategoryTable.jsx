import CategoryRow from "./CategoryRow";
import TableFooter from "../common/TableFooter";

// `pager` is the object returned by usePagination.
export default function CategoryTable({ rows, pager, editingId, onEdit, onDelete }) {
  return (
    <div className="table" role="table" aria-label="Categories">
      <div className="table__head" role="row">
        <span role="columnheader">Category</span>
        <span className="table__cell--num" role="columnheader">
          Products
        </span>
        <span className="table__cell--num" role="columnheader">
          Units
        </span>
        <span className="table__cell--actions" role="columnheader">
          Actions
        </span>
      </div>

      {rows.length === 0 ? (
        <p className="table__empty">No categories match your search.</p>
      ) : (
        rows.map((category) => (
          <CategoryRow
            key={category.id}
            category={category}
            editing={category.id === editingId}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      )}

      <TableFooter
        from={pager.from}
        to={pager.to}
        total={pager.total}
        noun="categories"
        page={pager.page}
        pageCount={pager.pageCount}
        onPageChange={pager.setPage}
      />
    </div>
  );
}
