import { useState } from "react";
import StarRating from "./StarRating";
import { submitReview } from "../../services/reviewService";
import AlertMessage from "./AlertMessage";

export default function ReviewForm({ booking, onSuccess, onCancel }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) { setError("Please select a star rating."); return; }
    setLoading(true);
    setError("");
    try {
      await submitReview({
        booking_id: booking.id,
        reviewee_id: booking.host_id,
        rating,
        comment: comment.trim(),
      });
      onSuccess && onSuccess();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to submit review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-border rounded-xl p-5 sm:p-6">
      <h3 className="text-base font-semibold text-ink font-display mb-1">Leave a review</h3>
      <p className="text-sm text-muted mb-4">
        Share your experience for <span className="font-medium text-ink">{booking?.listing_title || "this listing"}</span>
      </p>

      {error && <AlertMessage type="error" message={error} className="mb-4" />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink mb-2">Your rating</label>
          <StarRating value={rating} onChange={setRating} size="lg" />
          {rating > 0 && (
            <p className="mt-1 text-xs text-muted">
              {["", "Poor", "Fair", "Good", "Very good", "Excellent"][rating]}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-1.5">
            Comment <span className="text-muted font-normal">(optional)</span>
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            maxLength={500}
            placeholder="Describe your experience with this storage space..."
            className="w-full border border-border rounded-lg px-3 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brick/30 focus:border-brick resize-none transition"
          />
          <p className="text-xs text-muted text-right mt-1">{comment.length}/500</p>
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-2 pt-1">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="w-full sm:w-auto px-5 py-2.5 border border-border rounded-lg text-sm font-medium text-ink hover:bg-chalk transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto flex-1 sm:flex-none px-5 py-2.5 bg-brick text-white rounded-lg text-sm font-medium hover:bg-brick-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Submit review"}
          </button>
        </div>
      </form>
    </div>
  );
}