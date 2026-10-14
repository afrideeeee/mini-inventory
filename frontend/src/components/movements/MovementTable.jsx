import MovementRow from "./MovementRow";
import TableFooter from "../common/TableFooter";
import { pluralise } from "../../utils/format";
import "./MovementTable.css";

export default function MovementTable({
  movements = [],
  pager,
  onSelectMovement,
}) {
  return (
    <div className="movement-table-container">
      <div className="movement-table-meta">
        <span>
          {pager.total} matching {pluralise(pager.total, "entry", "entries")}
        </span>
        <span>Newest entries first ↓</span>
      </div>

      <div className="movement-table" role="table" aria-label="Movement records ledger">
        <div className="movement-table__head" role="row">
          <span role="columnheader">Entry</span>
          <span role="columnheader">Product</span>
          <span role="columnheader">Movement</span>
          <span className="movement-table__th--units" role="columnheader">Units</span>
          <span role="columnheader">Balance</span>
          <span role="columnheader">Reference</span>
          <span role="columnheader">Date / Time</span>
          <span className="movement-table__th--by" role="columnheader">By</span>
        </div>

        {movements.length === 0 ? (
          <div className="movement-table__empty">
            No movement records match your search or filters.
          </div>
        ) : (
          movements.map((movement) => (
            <MovementRow
              key={movement.id}
              movement={movement}
              onClick={onSelectMovement}
            />
          ))
        )}

        <TableFooter
          from={pager.from}
          to={pager.to}
          total={pager.total}
          noun="movement records"
          page={pager.page}
          pageCount={pager.pageCount}
          onPageChange={pager.setPage}
        />
      </div>
    </div>
  );
}
