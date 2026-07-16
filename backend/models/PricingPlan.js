const pool = require('../config/db');

const createTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS pricing_plans (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      price VARCHAR(50) NOT NULL,
      note VARCHAR(255),
      features JSON,
      cta_text VARCHAR(100),
      cta_link VARCHAR(255),
      highlight TINYINT(1) DEFAULT 0,
      display_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
};

const findAll = async () => {
  const [rows] = await pool.query('SELECT * FROM pricing_plans ORDER BY display_order ASC');
  return rows.map(row => ({ ...row, features: typeof row.features === 'string' ? JSON.parse(row.features) : (row.features || []) }));
};

const findById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM pricing_plans WHERE id = ?', [id]);
  if (rows[0]) {
    rows[0].features = typeof rows[0].features === 'string' ? JSON.parse(rows[0].features) : (rows[0].features || []);
  }
  return rows[0];
};

const create = async ({ name, price, note, features, cta_text, cta_link, highlight, display_order }) => {
  const [result] = await pool.query(
    'INSERT INTO pricing_plans (name, price, note, features, cta_text, cta_link, highlight, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [name, price, note || '', JSON.stringify(features || []), cta_text || '', cta_link || '', highlight ? 1 : 0, display_order || 0]
  );
  return result.insertId;
};

const update = async (id, fields) => {
  if (fields.features) fields.features = JSON.stringify(fields.features);
  const keys = Object.keys(fields);
  const values = Object.values(fields);
  const setClause = keys.map(k => `${k} = ?`).join(', ');
  await pool.query(`UPDATE pricing_plans SET ${setClause} WHERE id = ?`, [...values, id]);
};

const remove = async (id) => {
  await pool.query('DELETE FROM pricing_plans WHERE id = ?', [id]);
};

module.exports = { createTable, findAll, findById, create, update, remove };