import api from './api';

export const getInventory = () => api.get('/inventory');
export const createItem = (data) => api.post('/inventory', data);
export const updateItem = (id, data) => api.put(`/inventory/${id}`, data);
export const deleteItem = (id) => api.delete(`/inventory/${id}`);
export const createDeliveryRequest = (data) => api.post('/deliveries', data);