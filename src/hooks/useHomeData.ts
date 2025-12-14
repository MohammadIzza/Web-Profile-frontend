import { useState, useEffect } from 'react';
import { profileApi, portfolioApi, blogApi, experienceApi, techStackApi } from '../services/api';
import type { Profile, Portfolio, Blog, Experience, TechStack } from '../types';

export function useHomeData() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [techStacks, setTechStacks] = useState<TechStack[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [profileRes, portfolioRes, blogRes, experienceRes, techStackRes] = await Promise.all([
        profileApi.getAll(),
        portfolioApi.getAll(),
        blogApi.getAll(),
        experienceApi.getAll(),
        techStackApi.getAll(),
      ]);
      
      if (profileRes.data.length > 0) {
        setProfile(profileRes.data[0]);
      }
      setPortfolios(portfolioRes.data.slice(0, 3));
      setBlogs(blogRes.data.filter((b: Blog) => b.published).slice(0, 3));
      setExperiences(experienceRes.data.slice(0, 4));
      setTechStacks(techStackRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    profile,
    portfolios,
    blogs,
    experiences,
    techStacks,
    loading,
  };
}

