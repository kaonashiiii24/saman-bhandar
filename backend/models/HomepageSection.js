const pool = require('../config/db');

const createTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS homepage_sections (
      id INT AUTO_INCREMENT PRIMARY KEY,
      section_name VARCHAR(50) NOT NULL,
      \`key\` VARCHAR(100) NOT NULL,
      value TEXT,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY unique_section_key (section_name, \`key\`)
    )
  `);
};

const findAllBySection = async (section_name) => {
  const [rows] = await pool.query('SELECT * FROM homepage_sections WHERE section_name = ?', [section_name]);
  return rows;
};

const upsert = async (section_name, key, value) => {
  await pool.query(
    'INSERT INTO homepage_sections (section_name, `key`, value) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE value = ?',
    [section_name, key, value, value]
  );
};

const remove = async (section_name, key) => {
  await pool.query('DELETE FROM homepage_sections WHERE section_name = ? AND `key` = ?', [section_name, key]);
};

module.exports = { createTable, findAllBySection, upsert, remove };