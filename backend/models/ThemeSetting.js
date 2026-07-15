const pool = require('../config/db');

const createTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS theme_settings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      primary_color VARCHAR(7) DEFAULT '#3B82F6',
      secondary_color VARCHAR(7) DEFAULT '#10B981',
      accent_color VARCHAR(7) DEFAULT '#F59E0B',
      background_color VARCHAR(7) DEFAULT '#FFFFFF',
      text_color VARCHAR(7) DEFAULT '#1F2937',
      button_primary_bg VARCHAR(7),
      button_primary_text VARCHAR(7),
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
};

const find = async () => {
  const [rows] = await pool.query('SELECT * FROM theme_settings LIMIT 1');
  return rows[0];
};

const upsert = async (fields) => {
  const existing = await find();
  if (existing) {
    const keys = Object.keys(fields);
    const values = Object.values(fields);
    const setClause = keys.map(k => `${k} = ?`).join(', ');
    await pool.query(`UPDATE theme_settings SET ${setClause} WHERE id = ?`, [...values, existing.id]);
  } else {
    const columns = Object.keys(fields).join(', ');
    const placeholders = Object.keys(fields).map(() => '?').join(', ');
    const values = Object.values(fields);
    await pool.query(`INSERT INTO theme_settings (${columns}) VALUES (${placeholders})`, values);
  }
};

module.exports = { createTable, find, upsert };