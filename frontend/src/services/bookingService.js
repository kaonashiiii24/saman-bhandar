import api from './api';

export const getMyBookings = () => api.get('/bookings/my');
export const getHostBookings = () => api.get('/bookings/host');
export const createBooking = (data) => api.post('/bookings', data);
export const updateBookingStatus = (id, status) => api.put(`/bookings/${id}/status`, { status });
export const cancelBooking = (id) => api.put(`/bookings/${id}/cancel`);
export const getMyPayments = () => api.get('/payments/my');