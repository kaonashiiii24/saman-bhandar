const pool = require('../config/db');

const createTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INT AUTO_INCREMENT PRIMARY KEY,
      booking_id INT NOT NULL,
      reviewer_id INT NOT NULL,
      reviewee_id INT NOT NULL,
      rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
      comment TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
      FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (reviewee_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
};

const findByListing = async (listing_id) => {
  const [rows] = await pool.query(`
    SELECT r.*, u.full_name as reviewer_name
    FROM reviews r
    JOIN bookings b ON r.booking_id = b.id
    JOIN users u ON r.reviewer_id = u.id
    WHERE b.listing_id = ?
    ORDER BY r.created_at DESC
  `, [listing_id]);
  return rows;
};

const getAverageRating = async (listing_id) => {
  const [rows] = await pool.query(`
    SELECT AVG(r.rating) as avg_rating, COUNT(*) as review_count
    FROM reviews r
    JOIN bookings b ON r.booking_id = b.id
    WHERE b.listing_id = ?
  `, [listing_id]);
  return rows[0];
};

module.exports = { createTable, findByListing, getAverageRating };