export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export const ROUTES = {
  HOME: '/',
  ADMIN: '/admin',
  LOGIN: '/login',
} as const;

export const API_ENDPOINTS = {
  PROFILE: '/api/profile',
  PORTFOLIO: '/api/portfolio',
  BLOG: '/api/blog',
  EXPERIENCE: '/api/experience',
  TECHSTACK: '/api/techstack',
  UPLOAD: '/api/upload',
  AUTH: {
    LOGIN: '/api/auth/login',
    REFRESH: '/api/auth/refresh',
    ME: '/api/auth/me',
    CHANGE_PASSWORD: '/api/auth/change-password',
  },
} as const;
