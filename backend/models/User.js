const pool = require('../config/db');

const createTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      full_name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      phone VARCHAR(20),
      role ENUM('seller', 'host', 'courier', 'admin') DEFAULT 'seller',
      status ENUM('active', 'pending', 'suspended') DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

const findByEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

const findById = async (id) => {
  const [rows] = await pool.query('SELECT id, full_name, email, phone, role, status, approved_at, created_at FROM users WHERE id = ?', [id]);
  return rows[0];
};

const create = async ({ full_name, email, password, phone, role, status }) => {
  const [result] = await pool.query(
    'INSERT INTO users (full_name, email, password, phone, role, status) VALUES (?, ?, ?, ?, ?, ?)',
    [full_name, email, password, phone, role, status || 'active']
  );
  return result.insertId;
};

const update = async (id, fields) => {
  const keys = Object.keys(fields);
  const values = Object.values(fields);
  const setClause = keys.map(k => `${k} = ?`).join(', ');
  await pool.query(`UPDATE users SET ${setClause} WHERE id = ?`, [...values, id]);
};

const updatePassword = async (id, hashedPassword) => {
  const [result] = await pool.query(
    'UPDATE users SET password = ? WHERE id = ?',
    [hashedPassword, id]
  );
  return result.affectedRows > 0;
};

module.exports = { createTable, findByEmail, findById, create, update, updatePassword };