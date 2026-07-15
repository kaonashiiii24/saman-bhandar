const pool = require('../config/db');

const createTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS site_settings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      \`key\` VARCHAR(100) UNIQUE NOT NULL,
      value TEXT,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
};

const findAll = async () => {
  const [rows] = await pool.query('SELECT * FROM site_settings');
  return rows;
};

const findByKey = async (key) => {
  const [rows] = await pool.query('SELECT * FROM site_settings WHERE `key` = ?', [key]);
  return rows[0];
};

const upsert = async (key, value) => {
  await pool.query(
    'INSERT INTO site_settings (`key`, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = ?',
    [key, value, value]
  );
};

const remove = async (key) => {
  await pool.query('DELETE FROM site_settings WHERE `key` = ?', [key]);
};

module.exports = { createTable, findAll, findByKey, upsert, remove };