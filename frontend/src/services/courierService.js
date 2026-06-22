import api from './api';

export const getAvailableJobs = () => api.get('/deliveries/jobs');
export const acceptJob = (id) => api.post(`/deliveries/jobs/${id}/accept`);
export const getActiveDeliveries = () => api.get('/deliveries/deliveries');
export const updateDeliveryStatus = (id, status) => api.put(`/deliveries/deliveries/${id}/status`, { status });
export const cancelDelivery = (id) => api.put(`/deliveries/jobs/${id}/cancel`);
