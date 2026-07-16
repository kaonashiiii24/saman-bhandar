const pool = require('../config/db');

const createTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS services_why_stats (
      id INT AUTO_INCREMENT PRIMARY KEY,
      stat_key VARCHAR(50) NOT NULL,
      label VARCHAR(100) NOT NULL,
      sub VARCHAR(100),
      static_value VARCHAR(50),
      display_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
};

const findAll = async () => {
  const [rows] = await pool.query('SELECT * FROM services_why_stats ORDER BY display_order ASC');
  return rows;
};

const findById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM services_why_stats WHERE id = ?', [id]);
  return rows[0];
};

const create = async ({ stat_key, label, sub, static_value, display_order }) => {
  const [result] = await pool.query(
    'INSERT INTO services_why_stats (stat_key, label, sub, static_value, display_order) VALUES (?, ?, ?, ?, ?)',
    [stat_key, label, sub || '', static_value || null, display_order || 0]
  );
  return result.insertId;
};

const update = async (id, fields) => {
  const keys = Object.keys(fields);
  const values = Object.values(fields);
  const setClause = keys.map(k => `${k} = ?`).join(', ');
  await pool.query(`UPDATE services_why_stats SET ${setClause} WHERE id = ?`, [...values, id]);
};

const remove = async (id) => {
  await pool.query('DELETE FROM services_why_stats WHERE id = ?', [id]);
};

module.exports = { createTable, findAll, findById, create, update, remove };