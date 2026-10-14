import Pagination from "./Pagination";

// "Showing 1–4 of 4 categories" plus pagination.
export default function TableFooter({
  from,
  to,
  total,
  noun,
  page,
  pageCount,
  onPageChange,
  customSummary,
}) {
  return (
    <div className="table-footer">
      <span>
        {customSummary || `Showing ${from}–${to} of ${total} ${noun}`}
      </span>
      <Pagination page={page} pageCount={pageCount} onPageChange={onPageChange} />
    </div>
  );
}

