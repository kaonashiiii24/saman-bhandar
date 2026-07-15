const pool = require('../config/db');

const createTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS media_library (
      id INT AUTO_INCREMENT PRIMARY KEY,
      filename VARCHAR(255) NOT NULL,
      filepath VARCHAR(255) NOT NULL,
      original_name VARCHAR(255),
      mime_type VARCHAR(100),
      size INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

const findAll = async () => {
  const [rows] = await pool.query('SELECT * FROM media_library ORDER BY created_at DESC');
  return rows;
};

const findById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM media_library WHERE id = ?', [id]);
  return rows[0];
};

const create = async ({ filename, filepath, original_name, mime_type, size }) => {
  const [result] = await pool.query(
    'INSERT INTO media_library (filename, filepath, original_name, mime_type, size) VALUES (?, ?, ?, ?, ?)',
    [filename, filepath, original_name, mime_type, size]
  );
  return result.insertId;
};

const remove = async (id) => {
  await pool.query('DELETE FROM media_library WHERE id = ?', [id]);
};

module.exports = { createTable, findAll, findById, create, remove };