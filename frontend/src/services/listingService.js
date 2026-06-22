import api from './api';

export const getListings = (params) => api.get('/listings', { params });
export const getLocations = () => api.get('/listings/locations');
export const getListing = (id) => api.get(`/listings/${id}`);
export const getMyListings = () => api.get('/listings/host/my');
export const getListingItems = (id) => api.get(`/listings/${id}/items`);
export const createListing = (data) => api.post('/listings', data, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateListing = (id, data) => api.put(`/listings/${id}`, data);
export const deleteListing = (id) => api.delete(`/listings/${id}`);