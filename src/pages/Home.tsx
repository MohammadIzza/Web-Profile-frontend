import { useEffect, useState } from 'react';
import { profileApi, portfolioApi, blogApi } from '../services/api';
import type { Profile, Portfolio, Blog } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Github, Linkedin, Twitter, Mail, MapPin, ExternalLink } from 'lucide-react';

export default function Home() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [profileRes, portfolioRes, blogRes] = await Promise.all([
        profileApi.getAll(),
        portfolioApi.getAll(),
        blogApi.getAll(),
      ]);
      
      if (profileRes.data.length > 0) {
        setProfile(profileRes.data[0]);
      }
      setPortfolios(portfolioRes.data.slice(0, 3));
      setBlogs(blogRes.data.filter((b: Blog) => b.published).slice(0, 3));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="border-b py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {profile && (
            <div className="text-center">
              <h1 className="text-5xl font-bold text-black mb-4">{profile.name}</h1>
              <p className="text-2xl text-gray-600 mb-4">{profile.title}</p>
              <p className="text-gray-700 max-w-2xl mx-auto mb-6">{profile.bio}</p>
              
              <div className="flex items-center justify-center gap-4 mb-6 text-gray-600">
                {profile.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{profile.email}</span>
                  </div>
                )}
                {profile.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{profile.location}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-center gap-4">
                {profile.github && (
                  <Button variant="outline" size="icon" asChild>
                    <a href={profile.github} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4" />
                    </a>
                  </Button>
                )}
                {profile.linkedin && (
                  <Button variant="outline" size="icon" asChild>
                    <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="w-4 h-4" />
                    </a>
                  </Button>
                )}
                {profile.twitter && (
                  <Button variant="outline" size="icon" asChild>
                    <a href={profile.twitter} target="_blank" rel="noopener noreferrer">
                      <Twitter className="w-4 h-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-black mb-8">Featured Projects</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {portfolios.map((portfolio) => (
              <Card key={portfolio.id} className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-black">{portfolio.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{portfolio.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {portfolio.tags.map((tag, i) => (
                      <Badge key={i} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    {portfolio.link && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={portfolio.link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View
                        </a>
                      </Button>
                    )}
                    {portfolio.github && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={portfolio.github} target="_blank" rel="noopener noreferrer">
                          <Github className="w-4 h-4 mr-2" />
                          Code
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-black mb-8">Latest Blog Posts</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <Card key={blog.id} className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-black">{blog.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{blog.excerpt}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {blog.tags.map((tag, i) => (
                      <Badge key={i} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                  <Button variant="outline" size="sm">Read More</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}