const pool = require('../config/db');

const createTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS listings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      host_id INT NOT NULL,
      title VARCHAR(150) NOT NULL,
      description TEXT,
      location VARCHAR(150) NOT NULL,
      size VARCHAR(50),
      price_per_month DECIMAL(10,2) NOT NULL,
      image_url VARCHAR(255),
      is_active TINYINT(1) DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (host_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
};

const findAll = async (filters = {}) => {
  let query = 'SELECT l.*, u.full_name as host_name FROM listings l JOIN users u ON l.host_id = u.id WHERE l.is_active = 1';
  const params = [];
  if (filters.location) { query += ' AND l.location LIKE ?'; params.push(`%${filters.location}%`); }
  query += ' ORDER BY l.created_at DESC';
  const [rows] = await pool.query(query, params);
  return rows;
};

const findAllAvailable = async (filters = {}) => {
  let query = `
    SELECT l.*, u.full_name as host_name,
      COALESCE(r.avg_rating, 0) as avg_rating,
      COALESCE(r.review_count, 0) as review_count
    FROM listings l 
    JOIN users u ON l.host_id = u.id 
    LEFT JOIN (
      SELECT b.listing_id, AVG(rv.rating) as avg_rating, COUNT(rv.id) as review_count
      FROM reviews rv
      JOIN bookings b ON rv.booking_id = b.id
      GROUP BY b.listing_id
    ) r ON l.id = r.listing_id
    WHERE l.is_active = 1 
    AND l.id NOT IN (
      SELECT DISTINCT listing_id FROM bookings 
      WHERE status IN ('approved', 'active', 'picking_up', 'in_transit', 'delivered')
    )
  `;
  const params = [];
  if (filters.location) { query += ' AND l.location LIKE ?'; params.push(`%${filters.location}%`); }
  query += ' ORDER BY l.created_at DESC';
  const [rows] = await pool.query(query, params);
  return rows;
};

const findById = async (id) => {
  const [rows] = await pool.query(`
    SELECT l.*, u.full_name as host_name,
      COALESCE(r.avg_rating, 0) as avg_rating,
      COALESCE(r.review_count, 0) as review_count
    FROM listings l 
    JOIN users u ON l.host_id = u.id 
    LEFT JOIN (
      SELECT b.listing_id, AVG(rv.rating) as avg_rating, COUNT(rv.id) as review_count
      FROM reviews rv
      JOIN bookings b ON rv.booking_id = b.id
      GROUP BY b.listing_id
    ) r ON l.id = r.listing_id
    WHERE l.id = ?
  `, [id]);
  return rows[0];
};

const findByHost = async (host_id) => {
  const [rows] = await pool.query('SELECT * FROM listings WHERE host_id = ? ORDER BY created_at DESC', [host_id]);
  return rows;
};

const create = async ({ host_id, title, description, location, size, price_per_month, image_url }) => {
  const [result] = await pool.query(
    'INSERT INTO listings (host_id, title, description, location, size, price_per_month, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [host_id, title, description, location, size, price_per_month, image_url || null]
  );
  return result.insertId;
};

const update = async (id, fields) => {
  const keys = Object.keys(fields);
  const values = Object.values(fields);
  const setClause = keys.map(k => `${k} = ?`).join(', ');
  await pool.query(`UPDATE listings SET ${setClause} WHERE id = ?`, [...values, id]);
};

const remove = async (id) => {
  await pool.query('DELETE FROM listings WHERE id = ?', [id]);
};

const findItemsByListing = async (listing_id) => {
  const [rows] = await pool.query(`
    SELECT i.*, u.full_name as seller_name, u.email as seller_email
    FROM inventory i
    JOIN bookings b ON i.booking_id = b.id
    JOIN users u ON i.seller_id = u.id
    WHERE b.listing_id = ? AND b.status IN ('approved', 'active', 'picking_up', 'in_transit', 'delivered')
    ORDER BY i.created_at DESC
  `, [listing_id]);
  return rows;
};

const getLocations = async () => {
  const [rows] = await pool.query(`
    SELECT DISTINCT 
      CONCAT(UPPER(SUBSTRING(TRIM(location), 1, 1)), LOWER(SUBSTRING(TRIM(location), 2))) as location, 
      COUNT(*) as count 
    FROM listings 
    WHERE is_active = 1 
    AND id NOT IN (
      SELECT DISTINCT listing_id FROM bookings 
      WHERE status IN ('approved', 'active', 'picking_up', 'in_transit', 'delivered')
    )
    GROUP BY CONCAT(UPPER(SUBSTRING(TRIM(location), 1, 1)), LOWER(SUBSTRING(TRIM(location), 2)))
    ORDER BY count DESC
  `);
  return rows;
};

module.exports = { createTable, findAll, findAllAvailable, findById, findByHost, create, update, remove, findItemsByListing, getLocations };