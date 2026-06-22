const pool = require('../config/db');

const createTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS inventory (
      id INT AUTO_INCREMENT PRIMARY KEY,
      seller_id INT NOT NULL,
      booking_id INT,
      name VARCHAR(150) NOT NULL,
      category VARCHAR(100),
      quantity INT DEFAULT 0,
      location VARCHAR(150),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL
    )
  `);
};

const findBySeller = async (seller_id) => {
  const [rows] = await pool.query('SELECT * FROM inventory WHERE seller_id = ? ORDER BY created_at DESC', [seller_id]);
  return rows;
};

const findById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM inventory WHERE id = ?', [id]);
  return rows[0];
};

const create = async ({ seller_id, booking_id, name, category, quantity, location }) => {
  const [result] = await pool.query(
    'INSERT INTO inventory (seller_id, booking_id, name, category, quantity, location) VALUES (?, ?, ?, ?, ?, ?)',
    [seller_id, booking_id || null, name, category, quantity, location]
  );
  return result.insertId;
};

const update = async (id, fields) => {
  const keys = Object.keys(fields);
  const values = Object.values(fields);
  const setClause = keys.map(k => `${k} = ?`).join(', ');
  await pool.query(`UPDATE inventory SET ${setClause} WHERE id = ?`, [...values, id]);
};

const remove = async (id) => {
  await pool.query('DELETE FROM inventory WHERE id = ?', [id]);
};

module.exports = { createTable, findBySeller, findById, create, update, remove };