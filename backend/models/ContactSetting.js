const pool = require('../config/db');

const createTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS contact_settings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      heading VARCHAR(255),
      description TEXT,
      address TEXT,
      phone VARCHAR(50),
      email VARCHAR(255),
      map_url TEXT,
      social_media_links JSON,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
};

const find = async () => {
  const [rows] = await pool.query('SELECT * FROM contact_settings LIMIT 1');
  return rows[0];
};

const upsert = async (fields) => {
  const existing = await find();
  if (existing) {
    const keys = Object.keys(fields);
    const values = Object.values(fields);
    const setClause = keys.map(k => `${k} = ?`).join(', ');
    await pool.query(`UPDATE contact_settings SET ${setClause} WHERE id = ?`, [...values, existing.id]);
  } else {
    const columns = Object.keys(fields).join(', ');
    const placeholders = Object.keys(fields).map(() => '?').join(', ');
    const values = Object.values(fields);
    await pool.query(`INSERT INTO contact_settings (${columns}) VALUES (${placeholders})`, values);
  }
};

module.exports = { createTable, find, upsert };