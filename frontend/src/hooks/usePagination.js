import { useMemo, useState } from "react";

// Shared by every table. Pass the (already filtered) items and a page size.
export function usePagination(items, pageSize = 8) {
  const [requestedPage, setPage] = useState(1);

  const total = items.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(requestedPage, pageCount); // clamp after deletes/filters

  const pageItems = useMemo(
    () => items.slice((page - 1) * pageSize, page * pageSize),
    [items, page, pageSize]
  );

  return {
    page,
    pageCount,
    setPage,
    pageItems,
    total,
    from: total === 0 ? 0 : (page - 1) * pageSize + 1,
    to: Math.min(page * pageSize, total),
  };
}
