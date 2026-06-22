import api from './api';

export const getContacts = () => api.get('/chat/contacts');
export const getConversation = (userId) => api.get(`/chat/${userId}`);
export const sendMessage = (data) => api.post('/chat', data);