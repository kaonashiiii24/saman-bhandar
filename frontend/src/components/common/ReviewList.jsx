import { useEffect, useState } from "react";
import StarRating from "./StarRating";
import { getListingReviews } from "../../services/reviewService";
import Skeleton from "./Skeleton";

function formatDate(str) {
  return new Date(str).toLocaleDateString("en-NP", {
    year: "numeric", month: "short", day: "numeric",
  });
}

function RatingBar({ label, count, total }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-6 text-muted text-right shrink-0">{label}</span>
      <div className="flex-1 bg-chalk-dark rounded-full h-2 overflow-hidden">
        <div className="h-full bg-mustard rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-7 text-muted shrink-0">{count}</span>
    </div>
  );
}

export default function ReviewList({ listingId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!listingId) return;
    getListingReviews(listingId)
      .then((r) => setReviews(r.data?.reviews || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [listingId]);

  if (loading) return (
    <div className="space-y-4 mt-4">
      {[1,2,3].map(i => <Skeleton key={i} className="h-24 rounded-xl" />)}
    </div>
  );

  if (!reviews.length) return (
    <p className="text-muted text-sm mt-4 py-6 text-center border border-dashed border-border rounded-xl">
      No reviews yet for this listing.
    </p>
  );

  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <div className="mt-4">
      <div className="flex flex-col sm:flex-row gap-6 bg-chalk rounded-xl p-4 sm:p-5 mb-5">
        <div className="flex flex-col items-center justify-center sm:border-r border-border sm:pr-6 shrink-0">
          <span className="text-5xl font-bold text-ink leading-none">{avg.toFixed(1)}</span>
          <StarRating value={Math.round(avg)} size="sm" />
          <span className="text-xs text-muted mt-1">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</span>
        </div>
        <div className="flex-1 space-y-1.5">
          {dist.map(({ star, count }) => (
            <RatingBar key={star} label={star} count={count} total={reviews.length} />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((r) => (
          <div key={r.id} className="border border-border rounded-xl p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
              <div>
                <p className="text-sm font-medium text-ink">{r.reviewer_name}</p>
                <p className="text-xs text-muted">{formatDate(r.created_at)}</p>
              </div>
              <StarRating value={r.rating} size="sm" showEmpty={false} />
            </div>
            {r.comment && (
              <p className="text-sm text-ink leading-relaxed mt-2">{r.comment}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}