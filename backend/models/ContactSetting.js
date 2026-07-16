const pool = require('../config/db');

const createTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS contact_settings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      hero_badge VARCHAR(255),
      hero_title VARCHAR(255),
      hero_title_line2 VARCHAR(255),
      hero_description TEXT,
      heading VARCHAR(255),
      description TEXT,
      office_heading VARCHAR(255),
      office_address VARCHAR(255),
      email VARCHAR(255),
      email_sub VARCHAR(100),
      phone VARCHAR(50),
      phone_sub VARCHAR(100),
      address TEXT,
      address_sub VARCHAR(100),
      map_url TEXT,
      hours VARCHAR(50),
      hours_sub VARCHAR(50),
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