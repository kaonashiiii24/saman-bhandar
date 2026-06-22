import api from './api';

export const getGroups = () => api.get('/group-chat');
export const getGroupMessages = (groupId) => api.get(`/group-chat/${groupId}`);
export const sendGroupMessage = (data) => api.post('/group-chat/send', data);