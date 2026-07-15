const pool = require('../config/db');

const createTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS services_content (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      icon VARCHAR(100),
      display_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
};

const findAll = async () => {
  const [rows] = await pool.query('SELECT * FROM services_content ORDER BY display_order ASC');
  return rows;
};

const findById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM services_content WHERE id = ?', [id]);
  return rows[0];
};

const create = async ({ title, description, icon, display_order }) => {
  const [result] = await pool.query(
    'INSERT INTO services_content (title, description, icon, display_order) VALUES (?, ?, ?, ?)',
    [title, description, icon, display_order || 0]
  );
  return result.insertId;
};

const update = async (id, fields) => {
  const keys = Object.keys(fields);
  const values = Object.values(fields);
  const setClause = keys.map(k => `${k} = ?`).join(', ');
  await pool.query(`UPDATE services_content SET ${setClause} WHERE id = ?`, [...values, id]);
};

const remove = async (id) => {
  await pool.query('DELETE FROM services_content WHERE id = ?', [id]);
};

module.exports = { createTable, findAll, findById, create, update, remove };