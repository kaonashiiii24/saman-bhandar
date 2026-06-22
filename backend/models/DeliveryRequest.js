const pool = require('../config/db');

const createTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS delivery_requests (
      id INT AUTO_INCREMENT PRIMARY KEY,
      booking_id INT NOT NULL,
      seller_id INT NOT NULL,
      courier_id INT DEFAULT NULL,
      pickup_location VARCHAR(255) NOT NULL,
      delivery_location VARCHAR(255) NOT NULL,
      items JSON,
      quantity INT DEFAULT 0,
      instructions TEXT,
      status ENUM('pending','accepted','picked_up','in_transit','delivered','cancelled') DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
      FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (courier_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `);
};

const findAvailable = async () => {
  const [rows] = await pool.query(`
    SELECT dr.*, b.listing_id, l.title as listing_title, l.location as listing_location,
      u.full_name as seller_name
    FROM delivery_requests dr
    JOIN bookings b ON dr.booking_id = b.id
    JOIN listings l ON b.listing_id = l.id
    JOIN users u ON dr.seller_id = u.id
    WHERE dr.status = 'pending' AND dr.courier_id IS NULL
    ORDER BY dr.created_at DESC
  `);
  return rows;
};

const findById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM delivery_requests WHERE id = ?', [id]);
  return rows[0];
};

const findByCourier = async (courierId) => {
  const [rows] = await pool.query(`
    SELECT dr.*, l.title as listing_title, l.location as listing_location,
      u.full_name as seller_name
    FROM delivery_requests dr
    JOIN bookings b ON dr.booking_id = b.id
    JOIN listings l ON b.listing_id = l.id
    JOIN users u ON dr.seller_id = u.id
    WHERE dr.courier_id = ? AND dr.status IN ('accepted', 'picked_up', 'in_transit')
    ORDER BY dr.created_at DESC
  `, [courierId]);
  return rows;
};

const create = async ({ booking_id, seller_id, pickup_location, delivery_location, items, quantity, instructions }) => {
  const [result] = await pool.query(
    'INSERT INTO delivery_requests (booking_id, seller_id, pickup_location, delivery_location, items, quantity, instructions) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [booking_id, seller_id, pickup_location, delivery_location, JSON.stringify(items), quantity, instructions || null]
  );
  return result.insertId;
};

const assignCourier = async (id, courierId) => {
  const [result] = await pool.query(
    'UPDATE delivery_requests SET courier_id = ?, status = ? WHERE id = ? AND courier_id IS NULL',
    [courierId, 'accepted', id]
  );
  return result.affectedRows > 0;
};

const updateStatus = async (id, status) => {
  await pool.query('UPDATE delivery_requests SET status = ? WHERE id = ?', [status, id]);
};

const cancelDelivery = async (id, courierId) => {
  const [result] = await pool.query(
    'UPDATE delivery_requests SET courier_id = NULL, status = ? WHERE id = ? AND courier_id = ?',
    ['pending', id, courierId]
  );
  return result.affectedRows > 0;
};

module.exports = { createTable, findAvailable, findById, findByCourier, create, assignCourier, updateStatus, cancelDelivery };