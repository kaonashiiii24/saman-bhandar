const pool = require('../config/db');

const createTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS testimonials (
      id INT AUTO_INCREMENT PRIMARY KEY,
      customer_name VARCHAR(255) NOT NULL,
      position VARCHAR(255),
      rating INT DEFAULT 5,
      review TEXT,
      profile_image VARCHAR(255),
      display_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
};

const findAll = async () => {
  const [rows] = await pool.query('SELECT * FROM testimonials ORDER BY display_order ASC');
  return rows;
};

const findById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM testimonials WHERE id = ?', [id]);
  return rows[0];
};

const create = async ({ customer_name, position, rating, review, profile_image, display_order }) => {
  const [result] = await pool.query(
    'INSERT INTO testimonials (customer_name, position, rating, review, profile_image, display_order) VALUES (?, ?, ?, ?, ?, ?)',
    [customer_name, position, rating || 5, review, profile_image || null, display_order || 0]
  );
  return result.insertId;
};

const update = async (id, fields) => {
  const keys = Object.keys(fields);
  const values = Object.values(fields);
  const setClause = keys.map(k => `${k} = ?`).join(', ');
  await pool.query(`UPDATE testimonials SET ${setClause} WHERE id = ?`, [...values, id]);
};

const remove = async (id) => {
  await pool.query('DELETE FROM testimonials WHERE id = ?', [id]);
};

module.exports = { createTable, findAll, findById, create, update, remove };