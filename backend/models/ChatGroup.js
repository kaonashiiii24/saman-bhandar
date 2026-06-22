const pool = require('../config/db');

const createTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS chat_groups (
      id INT AUTO_INCREMENT PRIMARY KEY,
      delivery_request_id INT NOT NULL,
      name VARCHAR(255) NOT NULL,
      is_active TINYINT(1) DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (delivery_request_id) REFERENCES delivery_requests(id) ON DELETE CASCADE
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS group_messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      group_id INT NOT NULL,
      sender_id INT NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (group_id) REFERENCES chat_groups(id) ON DELETE CASCADE,
      FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS chat_group_members (
      id INT AUTO_INCREMENT PRIMARY KEY,
      group_id INT NOT NULL,
      user_id INT NOT NULL,
      UNIQUE KEY unique_member (group_id, user_id),
      FOREIGN KEY (group_id) REFERENCES chat_groups(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
};

const createGroup = async (delivery_request_id, name, memberIds) => {
  const [result] = await pool.query(
    'INSERT INTO chat_groups (delivery_request_id, name) VALUES (?, ?)',
    [delivery_request_id, name]
  );
  const groupId = result.insertId;
  
  for (const userId of memberIds) {
    await pool.query('INSERT INTO chat_group_members (group_id, user_id) VALUES (?, ?)', [groupId, userId]);
  }
  
  return groupId;
};

const findGroupsByUser = async (user_id) => {
  const [rows] = await pool.query(`
    SELECT cg.*, dr.status as delivery_status,
      (SELECT message FROM group_messages WHERE group_id = cg.id ORDER BY created_at DESC LIMIT 1) as last_message,
      (SELECT created_at FROM group_messages WHERE group_id = cg.id ORDER BY created_at DESC LIMIT 1) as last_time
    FROM chat_groups cg
    JOIN chat_group_members cgm ON cg.id = cgm.group_id
    JOIN delivery_requests dr ON cg.delivery_request_id = dr.id
    WHERE cgm.user_id = ?
    ORDER BY cg.is_active DESC, last_time DESC
  `, [user_id]);
  return rows;
};

const findGroupById = async (group_id) => {
  const [rows] = await pool.query('SELECT * FROM chat_groups WHERE id = ?', [group_id]);
  return rows[0];
};

const findGroupMembers = async (group_id) => {
  const [rows] = await pool.query(`
    SELECT u.id, u.full_name, u.role
    FROM chat_group_members cgm
    JOIN users u ON cgm.user_id = u.id
    WHERE cgm.group_id = ?
  `, [group_id]);
  return rows;
};

const findGroupMessages = async (group_id) => {
  const [rows] = await pool.query(`
    SELECT gm.*, u.full_name as sender_name, u.role as sender_role
    FROM group_messages gm
    JOIN users u ON gm.sender_id = u.id
    WHERE gm.group_id = ?
    ORDER BY gm.created_at ASC
  `, [group_id]);
  return rows;
};

const addGroupMessage = async (group_id, sender_id, message) => {
  const [result] = await pool.query(
    'INSERT INTO group_messages (group_id, sender_id, message) VALUES (?, ?, ?)',
    [group_id, sender_id, message]
  );
  const [rows] = await pool.query(`
    SELECT gm.*, u.full_name as sender_name, u.role as sender_role
    FROM group_messages gm
    JOIN users u ON gm.sender_id = u.id
    WHERE gm.id = ?
  `, [result.insertId]);
  return rows[0];
};

const deactivateGroup = async (group_id) => {
  await pool.query('UPDATE chat_groups SET is_active = 0 WHERE id = ?', [group_id]);
};

const isUserInGroup = async (group_id, user_id) => {
  const [rows] = await pool.query(
    'SELECT * FROM chat_group_members WHERE group_id = ? AND user_id = ?',
    [group_id, user_id]
  );
  return rows.length > 0;
};

module.exports = { createTable, createGroup, findGroupsByUser, findGroupById, findGroupMembers, findGroupMessages, addGroupMessage, deactivateGroup, isUserInGroup };