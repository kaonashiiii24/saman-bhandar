export default function Pagination({ page, totalPages, onPageChange, className = "" }) {
  if (totalPages <= 1) return null;

  function pages() {
    const delta = 1;
    const range = [];
    for (
      let i = Math.max(2, page - delta);
      i <= Math.min(totalPages - 1, page + delta);
      i++
    ) range.push(i);

    const result = [];
    if (page - delta > 2) result.push(1, "...");
    else result.push(1);
    result.push(...range);
    if (page + delta < totalPages - 1) result.push("...", totalPages);
    else result.push(totalPages);
    return result;
  }

  const btnBase =
    "min-w-[36px] h-9 px-2 flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brick/30";

  return (
    <div className={`flex items-center justify-center flex-wrap gap-1.5 ${className}`}>
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className={`${btnBase} border border-border text-muted hover:bg-chalk-dark disabled:opacity-40 disabled:cursor-not-allowed`}
        aria-label="Previous page"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {pages().map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="min-w-[36px] h-9 flex items-center justify-center text-muted text-sm">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`${btnBase} ${
              p === page
                ? "bg-brick text-white border border-brick"
                : "border border-border text-ink hover:bg-chalk-dark"
            }`}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className={`${btnBase} border border-border text-muted hover:bg-chalk-dark disabled:opacity-40 disabled:cursor-not-allowed`}
        aria-label="Next page"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}