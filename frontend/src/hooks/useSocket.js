import { useCallback } from 'react';
import { useSocketContext } from '../context/SocketContext';

export const useSocket = () => {
  const { socket, onlineUsers } = useSocketContext();

  const sendMessage = useCallback((senderId, receiverId, message) => {
    if (socket) {
      socket.emit('send_message', { senderId, receiverId, message });
    }
  }, [socket]);

  const emitTyping = useCallback((senderId, receiverId) => {
    if (socket) {
      socket.emit('typing', { senderId, receiverId });
      setTimeout(() => {
        socket.emit('stop_typing', { senderId, receiverId });
      }, 2000);
    }
  }, [socket]);

  const markAsRead = useCallback((senderId, receiverId) => {
    if (socket) {
      socket.emit('mark_read', { senderId, receiverId });
    }
  }, [socket]);

  const onNewMessage = useCallback((callback) => {
    if (socket) {
      socket.on('new_message', callback);
      return () => socket.off('new_message', callback);
    }
  }, [socket]);

  const onMessageSent = useCallback((callback) => {
    if (socket) {
      socket.on('message_sent', callback);
      return () => socket.off('message_sent', callback);
    }
  }, [socket]);

  const onTyping = useCallback((callback) => {
    if (socket) {
      socket.on('user_typing', callback);
      socket.on('user_stop_typing', callback);
      return () => {
        socket.off('user_typing', callback);
        socket.off('user_stop_typing', callback);
      };
    }
  }, [socket]);

  const onMessageRead = useCallback((callback) => {
    if (socket) {
      socket.on('messages_read', callback);
      return () => socket.off('messages_read', callback);
    }
  }, [socket]);

  const isUserOnline = useCallback((userId) => {
    return onlineUsers.has(String(userId));
  }, [onlineUsers]);

  return {
    socket,
    sendMessage,
    emitTyping,
    markAsRead,
    onNewMessage,
    onMessageSent,
    onTyping,
    onMessageRead,
    isUserOnline
  };
};