import api from "./api";

export const getListingReviews = (listingId) =>
  api.get(`/reviews/listing/${listingId}`);

export const getMyReviews = () => api.get("/reviews/my");

export const submitReview = (data) => api.post("/reviews", data);

export const checkCanReview = (bookingId) =>
  api.get(`/reviews/can-review/${bookingId}`);