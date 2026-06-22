const Message = require('../models/Message');
const { success, error } = require('../utils/apiResponse');

const getContacts = async (req, res) => {
  try {
    const contacts = await Message.findContacts(req.user.id);
    return success(res, { contacts });
  } catch (err) {
    console.error('CONTACTS ERROR:', err.message);  // ADD THIS LINE
    return error(res, err.message);
  }
};

const getConversation = async (req, res) => {
  try {
    await Message.markRead(req.params.userId, req.user.id);
    const messages = await Message.findConversation(req.user.id, req.params.userId);
    return success(res, { messages });
  } catch (err) { return error(res, err.message); }
};

const sendMessage = async (req, res) => {
  try {
    const { receiver_id, message } = req.body;
    if (!receiver_id || !message) return error(res, 'Receiver and message required', 400);
    const id = await Message.create({ sender_id: req.user.id, receiver_id, message });
    return success(res, { id }, 'Message sent', 201);
  } catch (err) { return error(res, err.message); }
};

module.exports = { getContacts, getConversation, sendMessage };