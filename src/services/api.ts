import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Profile API
export const profileApi = {
  getAll: () => api.get(API_ENDPOINTS.PROFILE),
  getOne: (id: number) => api.get(`${API_ENDPOINTS.PROFILE}/${id}`),
  create: (data: any) => api.post(API_ENDPOINTS.PROFILE, data),
  update: (id: number, data: any) => api.put(`${API_ENDPOINTS.PROFILE}/${id}`, data),
  delete: (id: number) => api.delete(`${API_ENDPOINTS.PROFILE}/${id}`),
};

// Portfolio API
export const portfolioApi = {
  getAll: () => api.get(API_ENDPOINTS.PORTFOLIO),
  getOne: (id: number) => api.get(`${API_ENDPOINTS.PORTFOLIO}/${id}`),
  create: (data: any) => api.post(API_ENDPOINTS.PORTFOLIO, data),
  update: (id: number, data: any) => api.put(`${API_ENDPOINTS.PORTFOLIO}/${id}`, data),
  delete: (id: number) => api.delete(`${API_ENDPOINTS.PORTFOLIO}/${id}`),
};

// Blog API
export const blogApi = {
  getAll: () => api.get(API_ENDPOINTS.BLOG),
  getOne: (id: number) => api.get(`${API_ENDPOINTS.BLOG}/${id}`),
  create: (data: any) => api.post(API_ENDPOINTS.BLOG, data),
  update: (id: number, data: any) => api.put(`${API_ENDPOINTS.BLOG}/${id}`, data),
  delete: (id: number) => api.delete(`${API_ENDPOINTS.BLOG}/${id}`),
};

// Experience API
export const experienceApi = {
  getAll: () => api.get(API_ENDPOINTS.EXPERIENCE),
  getOne: (id: number) => api.get(`${API_ENDPOINTS.EXPERIENCE}/${id}`),
  create: (data: any) => api.post(API_ENDPOINTS.EXPERIENCE, data),
  update: (id: number, data: any) => api.put(`${API_ENDPOINTS.EXPERIENCE}/${id}`, data),
  delete: (id: number) => api.delete(`${API_ENDPOINTS.EXPERIENCE}/${id}`),
};

// Tech Stack API
export const techStackApi = {
  getAll: () => api.get(API_ENDPOINTS.TECHSTACK),
  getOne: (id: number) => api.get(`${API_ENDPOINTS.TECHSTACK}/${id}`),
  create: (data: any) => api.post(API_ENDPOINTS.TECHSTACK, data),
  update: (id: number, data: any) => api.put(`${API_ENDPOINTS.TECHSTACK}/${id}`, data),
  delete: (id: number) => api.delete(`${API_ENDPOINTS.TECHSTACK}/${id}`),
};

export default api;