const pool = require('../config/db');

const createTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      seller_id INT NOT NULL,
      listing_id INT NOT NULL,
      courier_id INT,
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      total_amount DECIMAL(10,2) NOT NULL,
      commission_rate DECIMAL(5,2) DEFAULT 10.00,
      commission_amount DECIMAL(10,2) DEFAULT 0,
      status ENUM('pending','approved','active','picking_up','in_transit','delivered','completed','cancelled') DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE,
      FOREIGN KEY (courier_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `);
};
const findBySeller = async (seller_id) => {
  const [rows] = await pool.query(`
    SELECT b.*, l.title as listing_title, l.location as listing_location, u.full_name as host_name, l.host_id
    FROM bookings b
    JOIN listings l ON b.listing_id = l.id
    JOIN users u ON l.host_id = u.id
    WHERE b.seller_id = ?
    ORDER BY b.created_at DESC
  `, [seller_id]);
  return rows;
};

const findByListing = async (listing_id) => {
  const [rows] = await pool.query(`
    SELECT b.*, u.full_name as seller_name, u.email as seller_email
    FROM bookings b
    JOIN users u ON b.seller_id = u.id
    WHERE b.listing_id = ?
    ORDER BY b.created_at DESC
  `, [listing_id]);
  return rows;
};

const findByHost = async (host_id) => {
  const [rows] = await pool.query(`
    SELECT b.*, l.title as listing_title, u.full_name as seller_name
    FROM bookings b
    JOIN listings l ON b.listing_id = l.id
    JOIN users u ON b.seller_id = u.id
    WHERE l.host_id = ?
    ORDER BY b.created_at DESC
  `, [host_id]);
  return rows;
};

const findById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM bookings WHERE id = ?', [id]);
  return rows[0];
};

const findAll = async () => {
  const [rows] = await pool.query(`
    SELECT b.*, l.title as listing_title, u.full_name as seller_name
    FROM bookings b
    JOIN listings l ON b.listing_id = l.id
    JOIN users u ON b.seller_id = u.id
    ORDER BY b.created_at DESC
  `);
  return rows;
};

const create = async ({ seller_id, listing_id, start_date, end_date, total_amount, commission_rate, commission_amount }) => {
  const [result] = await pool.query(
    'INSERT INTO bookings (seller_id, listing_id, start_date, end_date, total_amount, commission_rate, commission_amount) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [seller_id, listing_id, start_date, end_date, total_amount, commission_rate || 10.00, commission_amount || 0]
  );
  return result.insertId;
};

const updateStatus = async (id, status) => {
  await pool.query('UPDATE bookings SET status = ? WHERE id = ?', [status, id]);
};

const findAvailableForCourier = async () => {
  const [rows] = await pool.query(`
    SELECT b.*, l.title as listing_title, l.location as listing_location, u.full_name as seller_name
    FROM bookings b
    JOIN listings l ON b.listing_id = l.id
    JOIN users u ON b.seller_id = u.id
    WHERE b.status IN ('approved', 'active') AND b.courier_id IS NULL
    ORDER BY b.created_at ASC
  `);
  return rows;
};

const assignCourier = async (bookingId, courierId) => {
  const [result] = await pool.query(
    'UPDATE bookings SET courier_id = ? WHERE id = ?',
    [courierId, bookingId]
  );
  return result.affectedRows > 0;
};

const findByCourier = async (courierId) => {
  const [rows] = await pool.query(`
    SELECT b.*, l.title as listing_title, l.location as listing_location, u.full_name as seller_name
    FROM bookings b
    JOIN listings l ON b.listing_id = l.id
    JOIN users u ON b.seller_id = u.id
    WHERE b.courier_id = ? AND b.status IN ('picking_up', 'in_transit')
    ORDER BY b.created_at DESC
  `, [courierId]);
  return rows;
};

const checkDateConflict = async (listing_id, start_date, end_date, excludeBookingId = null) => {
  let query = `
    SELECT COUNT(*) as count FROM bookings 
    WHERE listing_id = ? 
    AND status NOT IN ('cancelled', 'completed', 'delivered')
    AND ((start_date <= ? AND end_date >= ?) OR (start_date <= ? AND end_date >= ?) OR (start_date >= ? AND end_date <= ?))
  `;
  const params = [listing_id, end_date, start_date, start_date, end_date, start_date, end_date];
  
  if (excludeBookingId) {
    query += ' AND id != ?';
    params.push(excludeBookingId);
  }
  
  const [rows] = await pool.query(query, params);
  return rows[0].count > 0;
};

const getCommissionStats = async () => {
  const [rows] = await pool.query(`
    SELECT 
      COUNT(*) as total_bookings,
      COALESCE(SUM(total_amount), 0) as total_revenue,
      COALESCE(SUM(commission_amount), 0) as total_commission,
      COALESCE(AVG(commission_rate), 10) as avg_rate
    FROM bookings 
    WHERE status IN ('active', 'completed', 'delivered')
  `);
  return rows[0];
};

module.exports = { createTable, findBySeller, findByListing, findByHost, findById, findAll, create, updateStatus, findAvailableForCourier, assignCourier, findByCourier, checkDateConflict, getCommissionStats };