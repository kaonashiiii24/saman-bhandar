const db = require("../config/db");
const { success, error } = require("../utils/apiResponse");

exports.getListingReviews = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT r.*, u.full_name AS reviewer_name
       FROM reviews r
       JOIN users u ON u.id = r.reviewer_id
       JOIN bookings b ON b.id = r.booking_id
       WHERE b.listing_id = ?
       ORDER BY r.created_at DESC`,
      [req.params.listingId]
    );
    res.json(success({ reviews: rows }));
  } catch (err) {
    res.status(500).json(error(err.message));
  }
};

exports.getMyReviews = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT r.*, l.title AS listing_title, u.full_name AS reviewee_name
       FROM reviews r
       JOIN bookings b ON b.id = r.booking_id
       JOIN listings l ON l.id = b.listing_id
       JOIN users u ON u.id = r.reviewee_id
       WHERE r.reviewer_id = ?
       ORDER BY r.created_at DESC`,
      [req.user.id]
    );
    res.json(success({ reviews: rows }));
  } catch (err) {
    res.status(500).json(error(err.message));
  }
};

exports.checkCanReview = async (req, res) => {
  try {
    const [[booking]] = await db.query(
      `SELECT id FROM bookings WHERE id = ? AND seller_id = ? AND status = 'completed'`,
      [req.params.bookingId, req.user.id]
    );
    if (!booking) return res.json(success({ can_review: false }));

    const [[existing]] = await db.query(
      `SELECT id FROM reviews WHERE booking_id = ? AND reviewer_id = ?`,
      [req.params.bookingId, req.user.id]
    );
    res.json(success({ can_review: !existing }));
  } catch (err) {
    res.status(500).json(error(err.message));
  }
};

exports.submitReview = async (req, res) => {
  const { booking_id, reviewee_id, rating, comment } = req.body;
  if (!booking_id || !reviewee_id || !rating) {
    return res.status(400).json(error("booking_id, reviewee_id, and rating are required."));
  }
  if (rating < 1 || rating > 5) {
    return res.status(400).json(error("Rating must be between 1 and 5."));
  }
  try {
    const [[booking]] = await db.query(
      `SELECT id FROM bookings WHERE id = ? AND seller_id = ? AND status = 'completed'`,
      [booking_id, req.user.id]
    );
    if (!booking) return res.status(403).json(error("Cannot review this booking."));

    const [[existing]] = await db.query(
      `SELECT id FROM reviews WHERE booking_id = ? AND reviewer_id = ?`,
      [booking_id, req.user.id]
    );
    if (existing) return res.status(409).json(error("You have already reviewed this booking."));

    const [result] = await db.query(
      `INSERT INTO reviews (booking_id, reviewer_id, reviewee_id, rating, comment) VALUES (?, ?, ?, ?, ?)`,
      [booking_id, req.user.id, reviewee_id, rating, comment || null]
    );
    res.status(201).json(success({ id: result.insertId }, "Review submitted."));
  } catch (err) {
    res.status(500).json(error(err.message));
  }
};