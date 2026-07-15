import api from './api'

export const userProfileService = {
  get: () => api.get('/auth/me'),
  update: (data) => api.put('/auth/me', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  changePassword: (data) => api.post('/auth/change-password', data),
}