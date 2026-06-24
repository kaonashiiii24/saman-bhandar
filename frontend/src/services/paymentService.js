import api from './api';

export const getMyPayments = () => api.get('/payments/my');