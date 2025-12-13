import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Profile API
export const profileApi = {
  getAll: () => api.get('/profile'),
  getOne: (id: number) => api.get(`/profile/${id}`),
  create: (data: any) => api.post('/profile', data),
  update: (id: number, data: any) => api.put(`/profile/${id}`, data),
  delete: (id: number) => api.delete(`/profile/${id}`),
};

// Portfolio API
export const portfolioApi = {
  getAll: () => api.get('/portfolio'),
  getOne: (id: number) => api.get(`/portfolio/${id}`),
  create: (data: any) => api.post('/portfolio', data),
  update: (id: number, data: any) => api.put(`/portfolio/${id}`, data),
  delete: (id: number) => api.delete(`/portfolio/${id}`),
};

// Blog API
export const blogApi = {
  getAll: () => api.get('/blog'),
  getOne: (id: number) => api.get(`/blog/${id}`),
  create: (data: any) => api.post('/blog', data),
  update: (id: number, data: any) => api.put(`/blog/${id}`, data),
  delete: (id: number) => api.delete(`/blog/${id}`),
};

// Experience API
export const experienceApi = {
  getAll: () => api.get('/experience'),
  getOne: (id: number) => api.get(`/experience/${id}`),
  create: (data: any) => api.post('/experience', data),
  update: (id: number, data: any) => api.put(`/experience/${id}`, data),
  delete: (id: number) => api.delete(`/experience/${id}`),
};

// Tech Stack API
export const techStackApi = {
  getAll: () => api.get('/techstack'),
  getOne: (id: number) => api.get(`/techstack/${id}`),
  create: (data: any) => api.post('/techstack', data),
  update: (id: number, data: any) => api.put(`/techstack/${id}`, data),
  delete: (id: number) => api.delete(`/techstack/${id}`),
};

export default api;