import api from './api';

export const getPublicCms = () => api.get('/cms/public');

export const getHero = () => api.get('/admin/cms/hero');
export const updateHero = (data) => api.put('/admin/cms/hero', data);

export const getAbout = () => api.get('/admin/cms/about');
export const updateAbout = (data) => api.put('/admin/cms/about', data);

export const getServices = () => api.get('/admin/cms/services');
export const createService = (data) => api.post('/admin/cms/services', data);
export const updateService = (id, data) => api.put(`/admin/cms/services/${id}`, data);
export const deleteService = (id) => api.delete(`/admin/cms/services/${id}`);

export const getHowItWorks = () => api.get('/admin/cms/how-it-works');
export const createHowItWorks = (data) => api.post('/admin/cms/how-it-works', data);
export const updateHowItWorks = (id, data) => api.put(`/admin/cms/how-it-works/${id}`, data);
export const deleteHowItWorks = (id) => api.delete(`/admin/cms/how-it-works/${id}`);

export const getFeatures = () => api.get('/admin/cms/features');
export const createFeature = (data) => api.post('/admin/cms/features', data);
export const updateFeature = (id, data) => api.put(`/admin/cms/features/${id}`, data);
export const deleteFeature = (id) => api.delete(`/admin/cms/features/${id}`);

export const getTestimonials = () => api.get('/admin/cms/testimonials');
export const createTestimonial = (data) => api.post('/admin/cms/testimonials', data);
export const updateTestimonial = (id, data) => api.put(`/admin/cms/testimonials/${id}`, data);
export const deleteTestimonial = (id) => api.delete(`/admin/cms/testimonials/${id}`);

export const getFaqs = () => api.get('/admin/cms/faqs');
export const createFaq = (data) => api.post('/admin/cms/faqs', data);
export const updateFaq = (id, data) => api.put(`/admin/cms/faqs/${id}`, data);
export const deleteFaq = (id) => api.delete(`/admin/cms/faqs/${id}`);

export const getContact = () => api.get('/admin/cms/contact');
export const updateContact = (data) => api.put('/admin/cms/contact', data);

export const getFooter = () => api.get('/admin/cms/footer');
export const updateFooter = (data) => api.put('/admin/cms/footer', data);

export const getSeo = () => api.get('/admin/cms/seo');
export const updateSeo = (data) => api.put('/admin/cms/seo', data);

export const getTheme = () => api.get('/admin/cms/theme');
export const updateTheme = (data) => api.put('/admin/cms/theme', data);

export const getMedia = () => api.get('/admin/cms/media');
export const uploadMedia = (data) => api.post('/admin/cms/media/upload', data);
export const deleteMedia = (id) => api.delete(`/admin/cms/media/${id}`);

export const getAboutValues = () => api.get('/admin/cms/about-values');
export const createAboutValue = (data) => api.post('/admin/cms/about-values', data);
export const updateAboutValue = (id, data) => api.put(`/admin/cms/about-values/${id}`, data);
export const deleteAboutValue = (id) => api.delete(`/admin/cms/about-values/${id}`);