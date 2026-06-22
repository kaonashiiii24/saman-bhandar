const Message = require('../models/Message');

const connectedUsers = new Map();

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('user_connected', (userId) => {
      connectedUsers.set(String(userId), socket.id);
      socket.join(`user_${userId}`);
      io.emit('user_online', { userId: String(userId) });
    });

    socket.on('send_message', async (data) => {
      try {
        const { senderId, receiverId, message } = data;
        
        const messageId = await Message.create({
          sender_id: senderId,
          receiver_id: receiverId,
          message
        });
        
        const savedMessage = await Message.findById(messageId);
        
        const receiverSocketId = connectedUsers.get(String(receiverId));
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('new_message', savedMessage);
        }
        
        socket.emit('message_sent', savedMessage);
      } catch (err) {
        socket.emit('message_error', { error: err.message });
      }
    });

    socket.on('typing', ({ senderId, receiverId }) => {
      const receiverSocketId = connectedUsers.get(String(receiverId));
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('user_typing', { userId: String(senderId) });
      }
    });

    socket.on('stop_typing', ({ senderId, receiverId }) => {
      const receiverSocketId = connectedUsers.get(String(receiverId));
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('user_stop_typing', { userId: String(senderId) });
      }
    });

    socket.on('mark_read', async ({ senderId, receiverId }) => {
      try {
        await Message.markAsRead(senderId, receiverId);
        const senderSocketId = connectedUsers.get(String(senderId));
        if (senderSocketId) {
          io.to(senderSocketId).emit('messages_read', { by: String(receiverId) });
        }
      } catch (err) {
        console.error('Mark read error:', err);
      }
    });

    socket.on('disconnect', () => {
      for (const [userId, socketId] of connectedUsers.entries()) {
        if (socketId === socket.id) {
          connectedUsers.delete(userId);
          io.emit('user_offline', { userId });
          break;
        }
      }
    });
  });
};