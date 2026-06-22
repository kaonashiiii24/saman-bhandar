const pool = require('../config/db');

const createTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      sender_id INT NOT NULL,
      receiver_id INT NOT NULL,
      message TEXT NOT NULL,
      is_read TINYINT(1) DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
};

const findConversation = async (user1, user2) => {
  const [rows] = await pool.query(`
    SELECT m.*, u.full_name as sender_name
    FROM messages m
    JOIN users u ON m.sender_id = u.id
    WHERE (m.sender_id = ? AND m.receiver_id = ?)
       OR (m.sender_id = ? AND m.receiver_id = ?)
    ORDER BY m.created_at ASC
  `, [user1, user2, user2, user1]);
  return rows;
};

const findContacts = async (user_id) => {
  const sql =
    "SELECT contact_id, MAX(contact_name) as contact_name, MAX(contact_role) as contact_role, " +
    "MAX(last_message) as last_message, MAX(last_time) as last_time, " +
    "MAX(unread_count) as unread_count, MAX(sort_time) as sort_time " +
    "FROM (" +

    // [1,2,3,4] People you've exchanged messages with
    "SELECT IF(m.sender_id = ?, m.receiver_id, m.sender_id) as contact_id, " +
    "u.full_name as contact_name, u.role as contact_role, " +
    "m.message as last_message, m.created_at as last_time, " +
    "0 as unread_count, m.created_at as sort_time " +
    "FROM messages m JOIN users u ON u.id = IF(m.sender_id = ?, m.receiver_id, m.sender_id) " +
    "WHERE m.sender_id = ? OR m.receiver_id = ? " +

    "UNION ALL " +

    // [5,6] You're the seller → contact is the host
    "SELECT u.id, u.full_name, u.role, NULL, NULL, 0, b.created_at " +
    "FROM bookings b JOIN listings l ON b.listing_id = l.id JOIN users u ON u.id = l.host_id " +
    "WHERE b.seller_id = ? AND u.id != ? " +

    "UNION ALL " +

    // [7,8] You're the host → contact is the seller
    "SELECT u.id, u.full_name, u.role, NULL, NULL, 0, b.created_at " +
    "FROM bookings b JOIN users u ON u.id = b.seller_id " +
    "JOIN listings l ON b.listing_id = l.id " +
    "WHERE l.host_id = ? AND u.id != ? " +

    "UNION ALL " +

    // [9,10] You're the courier → contact is the seller
    "SELECT u.id, u.full_name, u.role, NULL, NULL, 0, b.created_at " +
    "FROM bookings b JOIN users u ON u.id = b.seller_id " +
    "WHERE b.courier_id = ? AND u.id != ? " +

    "UNION ALL " +

    // [11,12] You're the courier → contact is the host
    "SELECT u.id, u.full_name, u.role, NULL, NULL, 0, b.created_at " +
    "FROM bookings b JOIN listings l ON b.listing_id = l.id JOIN users u ON u.id = l.host_id " +
    "WHERE b.courier_id = ? AND u.id != ? " +

    "UNION ALL " +

    // [13,14] You're the courier (via delivery_request) → contact is the seller
    "SELECT u.id, u.full_name, u.role, NULL, NULL, 0, dr.created_at " +
    "FROM delivery_requests dr JOIN users u ON u.id = dr.seller_id " +
    "WHERE dr.courier_id = ? AND u.id != ? " +

    "UNION ALL " +

    // [15,16] You're the courier (via delivery_request) → contact is the host
    "SELECT u.id, u.full_name, u.role, NULL, NULL, 0, dr.created_at " +
    "FROM delivery_requests dr " +
    "JOIN bookings b ON dr.booking_id = b.id " +
    "JOIN listings l ON b.listing_id = l.id " +
    "JOIN users u ON u.id = l.host_id " +
    "WHERE dr.courier_id = ? AND u.id != ? " +

    "UNION ALL " +

    // [17,18,19] You're the seller or host → contact is the courier (via delivery_request)
    "SELECT u.id, u.full_name, u.role, NULL, NULL, 0, dr.created_at " +
    "FROM delivery_requests dr " +
    "JOIN bookings b ON dr.booking_id = b.id " +
    "JOIN listings l ON b.listing_id = l.id " +
    "JOIN users u ON u.id = dr.courier_id " +
    "WHERE (dr.seller_id = ? OR l.host_id = ?) " +
    "AND dr.courier_id IS NOT NULL AND u.id != ? " +

    ") AS raw_contacts " +
    "GROUP BY contact_id ORDER BY sort_time DESC, last_time DESC";

  const params = [
    user_id, user_id, user_id, user_id,  // [1,2,3,4] messages block
    user_id, user_id,                     // [5,6]  seller → host
    user_id, user_id,                     // [7,8]  host → seller
    user_id, user_id,                     // [9,10] courier → seller
    user_id, user_id,                     // [11,12] courier → host
    user_id, user_id,                     // [13,14] DR courier → seller
    user_id, user_id,                     // [15,16] DR courier → host
    user_id, user_id, user_id,            // [17,18,19] DR seller/host → courier
  ];

  const [rows] = await pool.query(sql, params);
  return rows;
};

const create = async ({ sender_id, receiver_id, message }) => {
  const [result] = await pool.query(
    'INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)',
    [sender_id, receiver_id, message]
  );
  return result.insertId;
};

const markRead = async (sender_id, receiver_id) => {
  await pool.query(
    'UPDATE messages SET is_read = 1 WHERE sender_id = ? AND receiver_id = ?',
    [sender_id, receiver_id]
  );
};

const findById = async (id) => {
  const [rows] = await pool.query(
    `SELECT m.*, u.full_name as sender_name 
     FROM messages m 
     JOIN users u ON m.sender_id = u.id 
     WHERE m.id = ?`,
    [id]
  );
  return rows[0];
};

const markAsRead = async (senderId, receiverId) => {
  await pool.query(
    'UPDATE messages SET is_read = true WHERE sender_id = ? AND receiver_id = ? AND is_read = false',
    [senderId, receiverId]
  );
};

module.exports = { createTable, findConversation, findContacts, create, markRead, findById, markAsRead };