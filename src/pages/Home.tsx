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
      {/* Header/Navigation */}
      <header className="border-b border-gray-200 sticky top-0 bg-white z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-lg font-semibold text-black">{profile?.name || 'Portfolio'}</h1>
          <nav className="flex gap-6 text-sm">
            <a href="#projects" className="text-gray-700 hover:text-black transition">Projects</a>
            <a href="#blog" className="text-gray-700 hover:text-black transition">Blog</a>
            <a href="#contact" className="text-gray-700 hover:text-black transition">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {profile && (
            <div className="text-center">
              <h2 className="text-3xl font-bold text-black mb-2">{profile.name}</h2>
              <p className="text-base text-gray-600 mb-3">{profile.title}</p>
              <p className="text-sm text-gray-700 max-w-2xl mx-auto mb-4 leading-relaxed">{profile.bio}</p>
              
              <div className="flex items-center justify-center gap-6 mb-4 text-xs text-gray-600">
                {profile.email && (
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{profile.email}</span>
                  </div>
                )}
                {profile.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{profile.location}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-center gap-2">
                {profile.github && (
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0" asChild>
                    <a href={profile.github} target="_blank" rel="noopener noreferrer">
                      <Github className="w-3.5 h-3.5" />
                    </a>
                  </Button>
                )}
                {profile.linkedin && (
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0" asChild>
                    <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="w-3.5 h-3.5" />
                    </a>
                  </Button>
                )}
                {profile.twitter && (
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0" asChild>
                    <a href={profile.twitter} target="_blank" rel="noopener noreferrer">
                      <Twitter className="w-3.5 h-3.5" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="projects" className="py-12 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-xl font-semibold text-black mb-6">Featured Projects</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {portfolios.map((portfolio) => (
              <Card key={portfolio.id} className="bg-white border-gray-200 hover:shadow-md transition">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-black">{portfolio.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-gray-700 mb-3 line-clamp-3">{portfolio.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {portfolio.tags.map((tag, i) => (
                      <Badge key={i} variant="secondary" className="text-xs h-5">{tag}</Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    {portfolio.link && (
                      <Button variant="outline" size="sm" className="h-7 text-xs" asChild>
                        <a href={portfolio.link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          View
                        </a>
                      </Button>
                    )}
                    {portfolio.github && (
                      <Button variant="outline" size="sm" className="h-7 text-xs" asChild>
                        <a href={portfolio.github} target="_blank" rel="noopener noreferrer">
                          <Github className="w-3 h-3 mr-1" />
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
      <section id="blog" className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-xl font-semibold text-black mb-6">Latest Blog Posts</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {blogs.map((blog) => (
              <Card key={blog.id} className="bg-white border-gray-200 hover:shadow-md transition">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-black line-clamp-2">{blog.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-gray-700 mb-3 line-clamp-3">{blog.excerpt}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {blog.tags.map((tag, i) => (
                      <Badge key={i} variant="secondary" className="text-xs h-5">{tag}</Badge>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="h-7 text-xs">Read More</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-gray-200 py-8 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-xs text-gray-600 mb-3">
            © {new Date().getFullYear()} {profile?.name}. All rights reserved.
          </p>
          {profile && (
            <div className="flex justify-center gap-4 mb-3">
              {profile.github && (
                <a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black transition">
                  <Github className="w-4 h-4" />
                </a>
              )}
              {profile.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black transition">
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {profile.twitter && (
                <a href={profile.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black transition">
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {profile.email && (
                <a href={`mailto:${profile.email}`} className="text-gray-600 hover:text-black transition">
                  <Mail className="w-4 h-4" />
                </a>
              )}
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}