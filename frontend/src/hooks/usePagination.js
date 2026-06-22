import { useState, useMemo } from "react";

export default function usePagination(items = [], pageSize = 10) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  function goTo(p) {
    setPage(Math.min(Math.max(1, p), totalPages));
  }

  function reset() { setPage(1); }

  return { page, totalPages, paged, goTo, reset };
}