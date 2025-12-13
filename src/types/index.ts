export interface Profile {
  id: number;
  name: string;
  title: string;
  bio: string;
  email: string;
  phone?: string;
  location?: string;
  avatar?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Portfolio {
  id: number;
  title: string;
  description: string;
  image?: string;
  link?: string;
  github?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Blog {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  image?: string;
  published: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Experience {
  id: number;
  company: string;
  position: string;
  description: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TechStack {
  id: number;
  name: string;
  category: string;
  icon?: string;
  level: string;
  createdAt: string;
  updatedAt: string;
}