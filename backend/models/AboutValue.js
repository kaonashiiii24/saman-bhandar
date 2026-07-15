const pool = require('../config/db');

const createTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS about_values (
      id INT AUTO_INCREMENT PRIMARY KEY,
      icon VARCHAR(100),
      label VARCHAR(255) NOT NULL,
      description TEXT,
      display_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
};

const findAll = async () => {
  const [rows] = await pool.query('SELECT * FROM about_values ORDER BY display_order ASC');
  return rows;
};

const findById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM about_values WHERE id = ?', [id]);
  return rows[0];
};

const create = async ({ icon, label, description, display_order }) => {
  const [result] = await pool.query(
    'INSERT INTO about_values (icon, label, description, display_order) VALUES (?, ?, ?, ?)',
    [icon || '', label, description || '', display_order || 0]
  );
  return result.insertId;
};

const update = async (id, fields) => {
  const keys = Object.keys(fields);
  const values = Object.values(fields);
  const setClause = keys.map(k => `${k} = ?`).join(', ');
  await pool.query(`UPDATE about_values SET ${setClause} WHERE id = ?`, [...values, id]);
};

const remove = async (id) => {
  await pool.query('DELETE FROM about_values WHERE id = ?', [id]);
};

module.exports = { createTable, findAll, findById, create, update, remove };