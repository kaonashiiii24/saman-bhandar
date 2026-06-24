const pool = require('../config/db');

const createTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS payments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      booking_id INT NOT NULL,
      seller_id INT NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      method ENUM('esewa','khalti','cash') DEFAULT 'esewa',
      status ENUM('pending','completed','refunded') DEFAULT 'pending',
      transaction_id VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
      FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
};

const findBySeller = async (seller_id) => {
  const [rows] = await pool.query(`
    SELECT p.*, l.title as listing_title
    FROM payments p
    JOIN bookings b ON p.booking_id = b.id
    JOIN listings l ON b.listing_id = l.id
    WHERE p.seller_id = ?
    ORDER BY p.created_at DESC
  `, [seller_id]);
  return rows;
};

const findByBooking = async (booking_id) => {
  const [rows] = await pool.query('SELECT * FROM payments WHERE booking_id = ?', [booking_id]);
  return rows[0];
};

const findAll = async () => {
  const [rows] = await pool.query(`
    SELECT p.*, u.full_name as seller_name, l.title as listing_title
    FROM payments p
    JOIN users u ON p.seller_id = u.id
    JOIN bookings b ON p.booking_id = b.id
    JOIN listings l ON b.listing_id = l.id
    ORDER BY p.created_at DESC
  `);
  return rows;
};

const create = async ({ booking_id, seller_id, amount, method, transaction_id }) => {
  const [result] = await pool.query(
    'INSERT INTO payments (booking_id, seller_id, amount, method, transaction_id) VALUES (?, ?, ?, ?, ?)',
    [booking_id, seller_id, amount, method, transaction_id || null]
  );
  return result.insertId;
};

const updateStatus = async (transactionId, status) => {
  await pool.query('UPDATE payments SET status = ? WHERE transaction_id = ?', [status, transactionId]);
};

module.exports = { createTable, findBySeller, findByBooking, findAll, create, updateStatus };