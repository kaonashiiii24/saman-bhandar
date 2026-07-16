const pool = require('../config/db');

const createTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS footer_settings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      description TEXT,
      copyright_text VARCHAR(255),
      tagline VARCHAR(255),
      platform_links JSON,
      company_links JSON,
      legal_links JSON,
      quick_links JSON,
      social_links JSON,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
};

const find = async () => {
  const [rows] = await pool.query('SELECT * FROM footer_settings LIMIT 1');
  return rows[0];
};

const upsert = async (fields) => {
  const existing = await find();
  if (existing) {
    const keys = Object.keys(fields);
    const values = Object.values(fields);
    const setClause = keys.map(k => `${k} = ?`).join(', ');
    await pool.query(`UPDATE footer_settings SET ${setClause} WHERE id = ?`, [...values, existing.id]);
  } else {
    const columns = Object.keys(fields).join(', ');
    const placeholders = Object.keys(fields).map(() => '?').join(', ');
    const values = Object.values(fields);
    await pool.query(`INSERT INTO footer_settings (${columns}) VALUES (${placeholders})`, values);
  }
};

module.exports = { createTable, find, upsert };