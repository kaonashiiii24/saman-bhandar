const db = require("../config/db");

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
    return res.json({ success: true, data: { reviews: rows } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
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
    return res.json({ success: true, data: { reviews: rows } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.checkCanReview = async (req, res) => {
  try {
    const [[booking]] = await db.query(
      `SELECT id FROM bookings WHERE id = ? AND seller_id = ? AND status = 'completed'`,
      [req.params.bookingId, req.user.id]
    );
    if (!booking) return res.json({ success: true, data: { can_review: false } });

    const [[existing]] = await db.query(
      `SELECT id FROM reviews WHERE booking_id = ? AND reviewer_id = ?`,
      [req.params.bookingId, req.user.id]
    );
    return res.json({ success: true, data: { can_review: !existing } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.submitReview = async (req, res) => {
  const { booking_id, reviewee_id, rating, comment } = req.body;
  if (!booking_id || !reviewee_id || !rating) {
    return res.status(400).json({ success: false, message: "booking_id, reviewee_id, and rating are required." });
  }
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ success: false, message: "Rating must be between 1 and 5." });
  }
  try {
    const [[booking]] = await db.query(
      `SELECT id FROM bookings WHERE id = ? AND seller_id = ? AND status = 'completed'`,
      [booking_id, req.user.id]
    );
    if (!booking) return res.status(403).json({ success: false, message: "Cannot review this booking." });

    const [[existing]] = await db.query(
      `SELECT id FROM reviews WHERE booking_id = ? AND reviewer_id = ?`,
      [booking_id, req.user.id]
    );
    if (existing) return res.status(409).json({ success: false, message: "You have already reviewed this booking." });

    const [result] = await db.query(
      `INSERT INTO reviews (booking_id, reviewer_id, reviewee_id, rating, comment) VALUES (?, ?, ?, ?, ?)`,
      [booking_id, req.user.id, reviewee_id, rating, comment || null]
    );
    return res.status(201).json({ success: true, data: { id: result.insertId }, message: "Review submitted." });
  } catch (err) {
    console.error("Review submission error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getLatestReviews = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        u.full_name AS customer_name,
        u.role AS position,
        rv.rating,
        rv.comment AS review,
        rv.created_at
      FROM reviews rv
      JOIN users u ON u.id = rv.reviewer_id
      ORDER BY rv.created_at DESC
    `);
    return res.json({ success: true, data: rows });
  } catch (err) {
    console.error('Latest reviews error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getTopTestimonials = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        u.full_name AS customer_name,
        u.role AS position,
        rv.rating,
        rv.comment AS review
      FROM reviews rv
      JOIN bookings b ON rv.booking_id = b.id
      JOIN users u ON u.id = rv.reviewer_id
      WHERE rv.rating = 5
      ORDER BY rv.created_at DESC
      LIMIT 3
    `);
    return res.json({ success: true, data: rows });
  } catch (err) {
    console.error('Top testimonials error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};