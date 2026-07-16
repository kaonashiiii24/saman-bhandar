const pool = require('../config/db');

const createTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS role_steps (
      id INT AUTO_INCREMENT PRIMARY KEY,
      role VARCHAR(50) NOT NULL,
      badge_bg VARCHAR(50),
      badge_text VARCHAR(50),
      border_color VARCHAR(50),
      steps JSON,
      display_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
};

const findAll = async () => {
  const [rows] = await pool.query('SELECT * FROM role_steps ORDER BY display_order ASC');
  return rows.map(row => ({
    ...row,
    steps: typeof row.steps === 'string' ? JSON.parse(row.steps) : (row.steps || [])
  }));
};

const findById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM role_steps WHERE id = ?', [id]);
  if (rows[0]) {
    rows[0].steps = typeof rows[0].steps === 'string' ? JSON.parse(rows[0].steps) : (rows[0].steps || []);
  }
  return rows[0];
};

const create = async ({ role, badge_bg, badge_text, border_color, steps, display_order }) => {
  const [result] = await pool.query(
    'INSERT INTO role_steps (role, badge_bg, badge_text, border_color, steps, display_order) VALUES (?, ?, ?, ?, ?, ?)',
    [role, badge_bg || '', badge_text || '', border_color || '', JSON.stringify(steps || []), display_order || 0]
  );
  return result.insertId;
};

const update = async (id, fields) => {
  if (fields.steps) fields.steps = JSON.stringify(fields.steps);
  const keys = Object.keys(fields);
  const values = Object.values(fields);
  const setClause = keys.map(k => `${k} = ?`).join(', ');
  await pool.query(`UPDATE role_steps SET ${setClause} WHERE id = ?`, [...values, id]);
};

const remove = async (id) => {
  await pool.query('DELETE FROM role_steps WHERE id = ?', [id]);
};

module.exports = { createTable, findAll, findById, create, update, remove };