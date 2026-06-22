import api from './api';

export const getMyPayments = () => api.get('/payments/my');
export const initiatePayment = (data) => api.post('/payments', data);